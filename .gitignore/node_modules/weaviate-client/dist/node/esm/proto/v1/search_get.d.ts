import _m0 from "protobufjs/minimal.js";
import { ConsistencyLevel, Filters, Vectors } from "./base.js";
import { BM25, Hybrid, NearAudioSearch, NearDepthSearch, NearImageSearch, NearIMUSearch, NearObject, NearTextSearch, NearThermalSearch, NearVector, NearVideoSearch } from "./base_search.js";
import { GenerativeReply, GenerativeResult, GenerativeSearch } from "./generative.js";
import { Properties } from "./properties.js";
export declare const protobufPackage = "weaviate.v1";
export interface SearchRequest {
    /** required */
    collection: string;
    /** parameters */
    tenant: string;
    consistencyLevel?: ConsistencyLevel | undefined;
    /** what is returned */
    properties?: PropertiesRequest | undefined;
    metadata?: MetadataRequest | undefined;
    groupBy?: GroupBy | undefined;
    /** affects order and length of results. 0/empty (default value) means disabled */
    limit: number;
    offset: number;
    autocut: number;
    after: string;
    /** protolint:disable:next REPEATED_FIELD_NAMES_PLURALIZED */
    sortBy: SortBy[];
    /** matches/searches for objects */
    filters?: Filters | undefined;
    hybridSearch?: Hybrid | undefined;
    bm25Search?: BM25 | undefined;
    nearVector?: NearVector | undefined;
    nearObject?: NearObject | undefined;
    nearText?: NearTextSearch | undefined;
    nearImage?: NearImageSearch | undefined;
    nearAudio?: NearAudioSearch | undefined;
    nearVideo?: NearVideoSearch | undefined;
    nearDepth?: NearDepthSearch | undefined;
    nearThermal?: NearThermalSearch | undefined;
    nearImu?: NearIMUSearch | undefined;
    generative?: GenerativeSearch | undefined;
    rerank?: Rerank | undefined;
    boost?: Boost | undefined;
    /** @deprecated */
    uses123Api: boolean;
    /** @deprecated */
    uses125Api: boolean;
    uses127Api: boolean;
}
export interface GroupBy {
    /**
     * currently only supports one entry (eg just properties, no refs). But might
     * be extended in the future.
     * protolint:disable:next REPEATED_FIELD_NAMES_PLURALIZED
     */
    path: string[];
    numberOfGroups: number;
    objectsPerGroup: number;
}
export interface SortBy {
    ascending: boolean;
    /**
     * currently only supports one entry (eg just properties, no refs). But the
     * weaviate datastructure already has paths in it and this makes it easily
     * extendable in the future
     * protolint:disable:next REPEATED_FIELD_NAMES_PLURALIZED
     */
    path: string[];
}
export interface MetadataRequest {
    uuid: boolean;
    vector: boolean;
    creationTimeUnix: boolean;
    lastUpdateTimeUnix: boolean;
    distance: boolean;
    certainty: boolean;
    score: boolean;
    explainScore: boolean;
    isConsistent: boolean;
    vectors: string[];
    /**
     * query_profile enables per-shard query profiling. When true, the response includes
     * timing breakdowns for each shard and search type.
     */
    queryProfile: boolean;
}
export interface PropertiesRequest {
    nonRefProperties: string[];
    refProperties: RefPropertiesRequest[];
    objectProperties: ObjectPropertiesRequest[];
    returnAllNonrefProperties: boolean;
}
export interface ObjectPropertiesRequest {
    propName: string;
    primitiveProperties: string[];
    objectProperties: ObjectPropertiesRequest[];
}
export interface RefPropertiesRequest {
    referenceProperty: string;
    properties: PropertiesRequest | undefined;
    metadata: MetadataRequest | undefined;
    targetCollection: string;
}
export interface Rerank {
    property: string;
    query?: string | undefined;
}
export interface SearchReply {
    took: number;
    results: SearchResult[];
    /** @deprecated */
    generativeGroupedResult?: string | undefined;
    groupByResults: GroupByResult[];
    generativeGroupedResults?: GenerativeResult | undefined;
    queryProfile?: QueryProfile | undefined;
}
/**
 * QueryProfile contains per-shard profiling data for a search query.
 * Only populated when MetadataRequest.profile is true.
 */
export interface QueryProfile {
    shards: QueryProfile_ShardProfile[];
}
/** SearchProfile holds the profiling details for a single search type within a shard. */
export interface QueryProfile_SearchProfile {
    /** details contains human-readable profiling metrics keyed by metric name. */
    details: {
        [key: string]: string;
    };
}
export interface QueryProfile_SearchProfile_DetailsEntry {
    key: string;
    value: string;
}
/** ShardProfile holds profiling data for a single shard's contribution to a search query. */
export interface QueryProfile_ShardProfile {
    /** name is the identifier of the shard that was searched. */
    name: string;
    /** node is the name of the cluster node that executed this shard search. */
    node: string;
    /** searches maps search type (e.g., "vector", "keyword") to its profiling details. */
    searches: {
        [key: string]: QueryProfile_SearchProfile;
    };
}
export interface QueryProfile_ShardProfile_SearchesEntry {
    key: string;
    value: QueryProfile_SearchProfile | undefined;
}
export interface RerankReply {
    score: number;
}
export interface GroupByResult {
    name: string;
    minDistance: number;
    maxDistance: number;
    numberOfObjects: number;
    objects: SearchResult[];
    rerank?: RerankReply | undefined;
    /** @deprecated */
    generative?: GenerativeReply | undefined;
    generativeResult?: GenerativeResult | undefined;
}
export interface SearchResult {
    properties: PropertiesResult | undefined;
    metadata: MetadataResult | undefined;
    generative?: GenerativeResult | undefined;
}
export interface MetadataResult {
    id: string;
    /**
     * protolint:disable:next REPEATED_FIELD_NAMES_PLURALIZED
     *
     * @deprecated
     */
    vector: number[];
    creationTimeUnix: number;
    creationTimeUnixPresent: boolean;
    lastUpdateTimeUnix: number;
    lastUpdateTimeUnixPresent: boolean;
    distance: number;
    distancePresent: boolean;
    certainty: number;
    certaintyPresent: boolean;
    score: number;
    scorePresent: boolean;
    explainScore: string;
    explainScorePresent: boolean;
    isConsistent?: boolean | undefined;
    /** @deprecated */
    generative: string;
    /** @deprecated */
    generativePresent: boolean;
    isConsistentPresent: boolean;
    vectorBytes: Uint8Array;
    idAsBytes: Uint8Array;
    rerankScore: number;
    rerankScorePresent: boolean;
    vectors: Vectors[];
}
export interface PropertiesResult {
    refProps: RefPropertiesResult[];
    targetCollection: string;
    metadata: MetadataResult | undefined;
    nonRefProps: Properties | undefined;
    refPropsRequested: boolean;
}
export interface RefPropertiesResult {
    properties: PropertiesResult[];
    propName: string;
}
export interface Boost {
    conditions: Boost_Condition[];
    weight?: number | undefined;
    depth?: number | undefined;
}
export declare enum Boost_PropertyValueModifier {
    PROPERTY_VALUE_MODIFIER_UNSPECIFIED = 0,
    PROPERTY_VALUE_MODIFIER_LOG1P = 1,
    PROPERTY_VALUE_MODIFIER_SQRT = 2,
    UNRECOGNIZED = -1
}
export declare function boost_PropertyValueModifierFromJSON(object: any): Boost_PropertyValueModifier;
export declare function boost_PropertyValueModifierToJSON(object: Boost_PropertyValueModifier): string;
export declare enum Boost_DecayCurve {
    DECAY_CURVE_UNSPECIFIED = 0,
    DECAY_CURVE_GAUSS = 1,
    DECAY_CURVE_LINEAR = 2,
    DECAY_CURVE_EXPONENTIAL = 3,
    UNRECOGNIZED = -1
}
export declare function boost_DecayCurveFromJSON(object: any): Boost_DecayCurve;
export declare function boost_DecayCurveToJSON(object: Boost_DecayCurve): string;
export interface Boost_PropertyValueFunction {
    property: string;
    modifier?: Boost_PropertyValueModifier | undefined;
}
export interface Boost_TimeDecayFunction {
    property: string;
    origin: string;
    scale: string;
    offset?: string | undefined;
    curve?: Boost_DecayCurve | undefined;
    decayValue?: number | undefined;
}
export interface Boost_NumericDecayFunction {
    property: string;
    origin: number;
    scale: number;
    offset?: number | undefined;
    curve?: Boost_DecayCurve | undefined;
    decayValue?: number | undefined;
}
export interface Boost_Condition {
    filter?: Filters | undefined;
    timeDecay?: Boost_TimeDecayFunction | undefined;
    propertyValue?: Boost_PropertyValueFunction | undefined;
    numericDecay?: Boost_NumericDecayFunction | undefined;
    weight?: number | undefined;
}
export declare const SearchRequest: {
    encode(message: SearchRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): SearchRequest;
    fromJSON(object: any): SearchRequest;
    toJSON(message: SearchRequest): unknown;
    create(base?: DeepPartial<SearchRequest>): SearchRequest;
    fromPartial(object: DeepPartial<SearchRequest>): SearchRequest;
};
export declare const GroupBy: {
    encode(message: GroupBy, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GroupBy;
    fromJSON(object: any): GroupBy;
    toJSON(message: GroupBy): unknown;
    create(base?: DeepPartial<GroupBy>): GroupBy;
    fromPartial(object: DeepPartial<GroupBy>): GroupBy;
};
export declare const SortBy: {
    encode(message: SortBy, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): SortBy;
    fromJSON(object: any): SortBy;
    toJSON(message: SortBy): unknown;
    create(base?: DeepPartial<SortBy>): SortBy;
    fromPartial(object: DeepPartial<SortBy>): SortBy;
};
export declare const MetadataRequest: {
    encode(message: MetadataRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MetadataRequest;
    fromJSON(object: any): MetadataRequest;
    toJSON(message: MetadataRequest): unknown;
    create(base?: DeepPartial<MetadataRequest>): MetadataRequest;
    fromPartial(object: DeepPartial<MetadataRequest>): MetadataRequest;
};
export declare const PropertiesRequest: {
    encode(message: PropertiesRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): PropertiesRequest;
    fromJSON(object: any): PropertiesRequest;
    toJSON(message: PropertiesRequest): unknown;
    create(base?: DeepPartial<PropertiesRequest>): PropertiesRequest;
    fromPartial(object: DeepPartial<PropertiesRequest>): PropertiesRequest;
};
export declare const ObjectPropertiesRequest: {
    encode(message: ObjectPropertiesRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ObjectPropertiesRequest;
    fromJSON(object: any): ObjectPropertiesRequest;
    toJSON(message: ObjectPropertiesRequest): unknown;
    create(base?: DeepPartial<ObjectPropertiesRequest>): ObjectPropertiesRequest;
    fromPartial(object: DeepPartial<ObjectPropertiesRequest>): ObjectPropertiesRequest;
};
export declare const RefPropertiesRequest: {
    encode(message: RefPropertiesRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): RefPropertiesRequest;
    fromJSON(object: any): RefPropertiesRequest;
    toJSON(message: RefPropertiesRequest): unknown;
    create(base?: DeepPartial<RefPropertiesRequest>): RefPropertiesRequest;
    fromPartial(object: DeepPartial<RefPropertiesRequest>): RefPropertiesRequest;
};
export declare const Rerank: {
    encode(message: Rerank, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Rerank;
    fromJSON(object: any): Rerank;
    toJSON(message: Rerank): unknown;
    create(base?: DeepPartial<Rerank>): Rerank;
    fromPartial(object: DeepPartial<Rerank>): Rerank;
};
export declare const SearchReply: {
    encode(message: SearchReply, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): SearchReply;
    fromJSON(object: any): SearchReply;
    toJSON(message: SearchReply): unknown;
    create(base?: DeepPartial<SearchReply>): SearchReply;
    fromPartial(object: DeepPartial<SearchReply>): SearchReply;
};
export declare const QueryProfile: {
    encode(message: QueryProfile, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryProfile;
    fromJSON(object: any): QueryProfile;
    toJSON(message: QueryProfile): unknown;
    create(base?: DeepPartial<QueryProfile>): QueryProfile;
    fromPartial(object: DeepPartial<QueryProfile>): QueryProfile;
};
export declare const QueryProfile_SearchProfile: {
    encode(message: QueryProfile_SearchProfile, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryProfile_SearchProfile;
    fromJSON(object: any): QueryProfile_SearchProfile;
    toJSON(message: QueryProfile_SearchProfile): unknown;
    create(base?: DeepPartial<QueryProfile_SearchProfile>): QueryProfile_SearchProfile;
    fromPartial(object: DeepPartial<QueryProfile_SearchProfile>): QueryProfile_SearchProfile;
};
export declare const QueryProfile_SearchProfile_DetailsEntry: {
    encode(message: QueryProfile_SearchProfile_DetailsEntry, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryProfile_SearchProfile_DetailsEntry;
    fromJSON(object: any): QueryProfile_SearchProfile_DetailsEntry;
    toJSON(message: QueryProfile_SearchProfile_DetailsEntry): unknown;
    create(base?: DeepPartial<QueryProfile_SearchProfile_DetailsEntry>): QueryProfile_SearchProfile_DetailsEntry;
    fromPartial(object: DeepPartial<QueryProfile_SearchProfile_DetailsEntry>): QueryProfile_SearchProfile_DetailsEntry;
};
export declare const QueryProfile_ShardProfile: {
    encode(message: QueryProfile_ShardProfile, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryProfile_ShardProfile;
    fromJSON(object: any): QueryProfile_ShardProfile;
    toJSON(message: QueryProfile_ShardProfile): unknown;
    create(base?: DeepPartial<QueryProfile_ShardProfile>): QueryProfile_ShardProfile;
    fromPartial(object: DeepPartial<QueryProfile_ShardProfile>): QueryProfile_ShardProfile;
};
export declare const QueryProfile_ShardProfile_SearchesEntry: {
    encode(message: QueryProfile_ShardProfile_SearchesEntry, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): QueryProfile_ShardProfile_SearchesEntry;
    fromJSON(object: any): QueryProfile_ShardProfile_SearchesEntry;
    toJSON(message: QueryProfile_ShardProfile_SearchesEntry): unknown;
    create(base?: DeepPartial<QueryProfile_ShardProfile_SearchesEntry>): QueryProfile_ShardProfile_SearchesEntry;
    fromPartial(object: DeepPartial<QueryProfile_ShardProfile_SearchesEntry>): QueryProfile_ShardProfile_SearchesEntry;
};
export declare const RerankReply: {
    encode(message: RerankReply, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): RerankReply;
    fromJSON(object: any): RerankReply;
    toJSON(message: RerankReply): unknown;
    create(base?: DeepPartial<RerankReply>): RerankReply;
    fromPartial(object: DeepPartial<RerankReply>): RerankReply;
};
export declare const GroupByResult: {
    encode(message: GroupByResult, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GroupByResult;
    fromJSON(object: any): GroupByResult;
    toJSON(message: GroupByResult): unknown;
    create(base?: DeepPartial<GroupByResult>): GroupByResult;
    fromPartial(object: DeepPartial<GroupByResult>): GroupByResult;
};
export declare const SearchResult: {
    encode(message: SearchResult, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): SearchResult;
    fromJSON(object: any): SearchResult;
    toJSON(message: SearchResult): unknown;
    create(base?: DeepPartial<SearchResult>): SearchResult;
    fromPartial(object: DeepPartial<SearchResult>): SearchResult;
};
export declare const MetadataResult: {
    encode(message: MetadataResult, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MetadataResult;
    fromJSON(object: any): MetadataResult;
    toJSON(message: MetadataResult): unknown;
    create(base?: DeepPartial<MetadataResult>): MetadataResult;
    fromPartial(object: DeepPartial<MetadataResult>): MetadataResult;
};
export declare const PropertiesResult: {
    encode(message: PropertiesResult, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): PropertiesResult;
    fromJSON(object: any): PropertiesResult;
    toJSON(message: PropertiesResult): unknown;
    create(base?: DeepPartial<PropertiesResult>): PropertiesResult;
    fromPartial(object: DeepPartial<PropertiesResult>): PropertiesResult;
};
export declare const RefPropertiesResult: {
    encode(message: RefPropertiesResult, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): RefPropertiesResult;
    fromJSON(object: any): RefPropertiesResult;
    toJSON(message: RefPropertiesResult): unknown;
    create(base?: DeepPartial<RefPropertiesResult>): RefPropertiesResult;
    fromPartial(object: DeepPartial<RefPropertiesResult>): RefPropertiesResult;
};
export declare const Boost: {
    encode(message: Boost, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Boost;
    fromJSON(object: any): Boost;
    toJSON(message: Boost): unknown;
    create(base?: DeepPartial<Boost>): Boost;
    fromPartial(object: DeepPartial<Boost>): Boost;
};
export declare const Boost_PropertyValueFunction: {
    encode(message: Boost_PropertyValueFunction, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Boost_PropertyValueFunction;
    fromJSON(object: any): Boost_PropertyValueFunction;
    toJSON(message: Boost_PropertyValueFunction): unknown;
    create(base?: DeepPartial<Boost_PropertyValueFunction>): Boost_PropertyValueFunction;
    fromPartial(object: DeepPartial<Boost_PropertyValueFunction>): Boost_PropertyValueFunction;
};
export declare const Boost_TimeDecayFunction: {
    encode(message: Boost_TimeDecayFunction, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Boost_TimeDecayFunction;
    fromJSON(object: any): Boost_TimeDecayFunction;
    toJSON(message: Boost_TimeDecayFunction): unknown;
    create(base?: DeepPartial<Boost_TimeDecayFunction>): Boost_TimeDecayFunction;
    fromPartial(object: DeepPartial<Boost_TimeDecayFunction>): Boost_TimeDecayFunction;
};
export declare const Boost_NumericDecayFunction: {
    encode(message: Boost_NumericDecayFunction, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Boost_NumericDecayFunction;
    fromJSON(object: any): Boost_NumericDecayFunction;
    toJSON(message: Boost_NumericDecayFunction): unknown;
    create(base?: DeepPartial<Boost_NumericDecayFunction>): Boost_NumericDecayFunction;
    fromPartial(object: DeepPartial<Boost_NumericDecayFunction>): Boost_NumericDecayFunction;
};
export declare const Boost_Condition: {
    encode(message: Boost_Condition, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Boost_Condition;
    fromJSON(object: any): Boost_Condition;
    toJSON(message: Boost_Condition): unknown;
    create(base?: DeepPartial<Boost_Condition>): Boost_Condition;
    fromPartial(object: DeepPartial<Boost_Condition>): Boost_Condition;
};
type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
