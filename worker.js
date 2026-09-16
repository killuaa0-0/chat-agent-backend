import 'dotenv/config';
import { Worker } from 'bullmq';
import { OpenAIEmbeddings } from '@langchain/openai';
import { QdrantVectorStore } from '@langchain/qdrant';
import { Document } from '@langchain/core/documents';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { CharacterTextSplitter } from '@langchain/textsplitters';

const worker = new Worker(
  'file-upload-queue',
  async (job) => {
    console.log(`Job:`, job.data);
    const data = JSON.parse(job.data);

    // Load the PDF -> LangChain gives back one Document per page
    const loader = new PDFLoader(data.path);
    const docs = await loader.load();

    // FIX: actually use the splitter that was imported but never called.
    // Without this, whole pages went into the vector store as single
    // chunks -- too large, diluted embeddings, bad retrieval precision.
    const splitter = new CharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const splitDocs = await splitter.splitDocuments(docs);

    // FIX: stamp every chunk with the uploader's userId so /chat can
    // filter retrieval down to just this user's own documents.
    const docsWithOwner = splitDocs.map(
      (doc) =>
        new Document({
          pageContent: doc.pageContent,
          metadata: { ...doc.metadata, userId: data.userId },
        })
    );

    // FIX: was apiKey: '' (hardcoded empty).
    const embeddings = new OpenAIEmbeddings({
      model: 'text-embedding-3-small',
      apiKey: process.env.OPENAI_API_KEY,
    });

    // FIX: fromExistingCollection() throws if the collection doesn't
    // exist yet (e.g. the very first PDF anyone ever uploads). Fall
    // back to creating it from these docs instead of crashing the worker.
    let vectorStore;
    try {
      vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings,
        {
          url: 'http://localhost:6333',
          collectionName: 'langchainjs-testing',
        }
      );
      await vectorStore.addDocuments(docsWithOwner);
    } catch (err) {
      console.log('Collection not found, creating a new one from these docs');
      vectorStore = await QdrantVectorStore.fromDocuments(
        docsWithOwner,
        embeddings,
        {
          url: 'http://localhost:6333',
          collectionName: 'langchainjs-testing',
        }
      );
    }

    console.log(`All docs are added to vector store`);
  },
  {
    concurrency: 100,
    connection: {
      host: 'localhost',
      port: 6379,
    },
  }
);
