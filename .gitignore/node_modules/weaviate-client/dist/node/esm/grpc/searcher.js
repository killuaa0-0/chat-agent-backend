import { SearchRequest, } from '../proto/v1/search_get.js';
import { WeaviateQueryError } from '../errors.js';
import Base from './base.js';
import { retryOptions } from './retry.js';
export default class Searcher extends Base {
    static use(connection, collection, metadata, timeout, consistencyLevel, tenant, abortSignal) {
        return new Searcher(connection, collection, metadata, timeout, consistencyLevel, tenant, abortSignal);
    }
    withFetch = (args) => this.call(SearchRequest.fromPartial(args));
    withBm25 = (args) => this.call(SearchRequest.fromPartial(args));
    withHybrid = (args) => this.call(SearchRequest.fromPartial(args));
    withNearAudio = (args) => this.call(SearchRequest.fromPartial(args));
    withNearDepth = (args) => this.call(SearchRequest.fromPartial(args));
    withNearImage = (args) => this.call(SearchRequest.fromPartial(args));
    withNearIMU = (args) => this.call(SearchRequest.fromPartial(args));
    withNearObject = (args) => this.call(SearchRequest.fromPartial(args));
    withNearText = (args) => this.call(SearchRequest.fromPartial(args));
    withNearThermal = (args) => this.call(SearchRequest.fromPartial(args));
    withNearVector = (args) => this.call(SearchRequest.fromPartial(args));
    withNearVideo = (args) => this.call(SearchRequest.fromPartial(args));
    call = (message) => this.sendWithTimeout((signal) => this.connection.search({
        ...message,
        collection: this.collection,
        consistencyLevel: this.consistencyLevel,
        tenant: this.tenant,
        uses123Api: true,
        uses125Api: true,
        uses127Api: true,
    }, {
        metadata: this.metadata,
        signal,
        ...retryOptions,
    }), (err) => new WeaviateQueryError(err.message, 'gRPC'));
}
