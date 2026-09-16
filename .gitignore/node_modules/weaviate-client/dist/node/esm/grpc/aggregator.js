import { AggregateRequest, } from '../proto/v1/aggregate.js';
import { WeaviateQueryError } from '../errors.js';
import Base from './base.js';
import { retryOptions } from './retry.js';
export default class Aggregator extends Base {
    static use(connection, collection, metadata, timeout, consistencyLevel, tenant) {
        return new Aggregator(connection, collection, metadata, timeout, consistencyLevel, tenant);
    }
    withFetch = (args) => this.call(AggregateRequest.fromPartial(args));
    withHybrid = (args) => this.call(AggregateRequest.fromPartial(args));
    withNearAudio = (args) => this.call(AggregateRequest.fromPartial(args));
    withNearDepth = (args) => this.call(AggregateRequest.fromPartial(args));
    withNearImage = (args) => this.call(AggregateRequest.fromPartial(args));
    withNearIMU = (args) => this.call(AggregateRequest.fromPartial(args));
    withNearObject = (args) => this.call(AggregateRequest.fromPartial(args));
    withNearText = (args) => this.call(AggregateRequest.fromPartial(args));
    withNearThermal = (args) => this.call(AggregateRequest.fromPartial(args));
    withNearVector = (args) => this.call(AggregateRequest.fromPartial(args));
    withNearVideo = (args) => this.call(AggregateRequest.fromPartial(args));
    call = (message) => this.sendWithTimeout((signal) => this.connection.aggregate({
        ...message,
        collection: this.collection,
        tenant: this.tenant,
        objectsCount: true,
    }, {
        metadata: this.metadata,
        signal,
        ...retryOptions,
    }), (err) => new WeaviateQueryError(err.message, 'gRPC'));
}
