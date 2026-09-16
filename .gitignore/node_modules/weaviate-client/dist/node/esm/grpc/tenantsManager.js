import { WeaviateTenantsGetError } from '../errors.js';
import { TenantsGetRequest } from '../proto/v1/tenants.js';
import Base from './base.js';
import { retryOptions } from './retry.js';
export default class TenantsManager extends Base {
    static use(connection, collection, metadata, timeout) {
        return new TenantsManager(connection, collection, metadata, timeout);
    }
    withGet = (args) => this.call(TenantsGetRequest.fromPartial({ names: args.names ? { values: args.names } : undefined }));
    call(message) {
        return this.sendWithTimeout((signal) => this.connection.tenantsGet({
            ...message,
            collection: this.collection,
        }, {
            metadata: this.metadata,
            signal,
            ...retryOptions,
        }), (err) => new WeaviateTenantsGetError(err.message));
    }
}
