import { type Schema } from '#/state/persisted/schema';
export type { PersistedAccount, Schema } from '#/state/persisted/schema';
export { defaults } from '#/state/persisted/schema';
export declare function init(): Promise<void>;
export declare function get<K extends keyof Schema>(key: K): Schema[K];
export declare function write<K extends keyof Schema>(key: K, value: Schema[K]): Promise<void>;
export declare function onUpdate<K extends keyof Schema>(_key: K, _cb: (v: Schema[K]) => void): () => void;
export declare function clearStorage(): Promise<void>;
//# sourceMappingURL=index.d.ts.map