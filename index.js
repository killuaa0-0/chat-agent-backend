import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { Queue } from 'bullmq';
import { OpenAIEmbeddings } from '@langchain/openai';
import { QdrantVectorStore } from '@langchain/qdrant';
import OpenAI from 'openai';
import { clerkMiddleware, requireAuth, getAuth } from '@clerk/express';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const queue = new Queue('file-upload-queue', {
  connection: {
    host: 'localhost',
    port: 6379,
  },
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

const app = express();
app.use(cors());

// FIX: attach Clerk to every request. This populates req.auth on
// requests that carry a valid session token, WITHOUT blocking requests
// that don't have one. requireAuth() below is what actually blocks.
app.use(clerkMiddleware());

app.get('/', (req, res) => {
  return res.json({ status: 'All Good!' });
});

// FIX: requireAuth() rejects unauthenticated requests with 401 before
// your handler even runs -- this is the piece that was completely
// missing before (anyone could hit this route with no login at all).
app.post('/upload/pdf', requireAuth(), upload.single('pdf'), async (req, res) => {
  const { userId } = getAuth(req);

  await queue.add(
    'file-ready',
    JSON.stringify({
      filename: req.file.originalname,
      destination: req.file.destination,
      path: req.file.path,
      userId, // FIX: tag the job with who uploaded it, so worker.js
              // can stamp ownership onto every chunk it creates.
    })
  );
  return res.json({ message: 'uploaded' });
});

app.get('/chat', requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  const userQuery = req.query.message;

  // FIX: was apiKey: '' (hardcoded empty). Now reads from env correctly.
  const embeddings = new OpenAIEmbeddings({
    model: 'text-embedding-3-small',
    apiKey: process.env.OPENAI_API_KEY,
  });

  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      url: 'http://localhost:6333',
      collectionName: 'langchainjs-testing',
    }
  );

  // FIX: filter retrieval to ONLY this user's own chunks. Without this,
  // every user's chat query searched every uploaded PDF, from every user.
  const ret = vectorStore.asRetriever({
    k: 2,
    filter: {
      must: [
        {
          key: 'metadata.userId',
          match: { value: userId },
        },
      ],
    },
  });

  const result = await ret.invoke(userQuery);

  const SYSTEM_PROMPT = `
  You are a helpful AI Assistant who answers the user query based on the available context from PDF File(s).
  If the context doesn't contain the answer, say so honestly instead of guessing.
  Context:
  ${JSON.stringify(result)}
  `;

  const chatResult = await client.chat.completions.create({
    model: 'gpt-4.1',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userQuery },
    ],
  });

  return res.json({
    message: chatResult.choices[0].message.content,
    docs: result,
  });
});

app.listen(8000, () => console.log(`Server started on PORT:${8000}`));
