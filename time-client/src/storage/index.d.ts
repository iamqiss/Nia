import { MMKV } from 'react-native-mmkv';
export * from '#/storage/schema';
/**
 * Generic storage class. DO NOT use this directly. Instead, use the exported
 * storage instances below.
 */
export declare class Storage<Scopes extends unknown[], Schema> {
    protected sep: string;
    protected store: MMKV;
    constructor({ id }: {
        id: string;
    });
    /**
     * Store a value in storage based on scopes and/or keys
     *
     *   `set([key], value)`
     *   `set([scope, key], value)`
     */
    set<Key extends keyof Schema>(scopes: [...Scopes, Key], data: Schema[Key]): void;
    /**
     * Get a value from storage based on scopes and/or keys
     *
     *   `get([key])`
     *   `get([scope, key])`
     */
    get<Key extends keyof Schema>(scopes: [...Scopes, Key]): Schema[Key] | undefined;
    /**
     * Remove a value from storage based on scopes and/or keys
     *
     *   `remove([key])`
     *   `remove([scope, key])`
     */
    remove<Key extends keyof Schema>(scopes: [...Scopes, Key]): void;
    /**
     * Remove many values from the same storage scope by keys
     *
     *   `removeMany([], [key])`
     *   `removeMany([scope], [key])`
     */
    removeMany<Key extends keyof Schema>(scopes: [...Scopes], keys: Key[]): void;
    /**
     * For debugging purposes
     */
    removeAll(): void;
    /**
     * Fires a callback when the storage associated with a given key changes
     *
     * @returns Listener - call `remove()` to stop listening
     */
    addOnValueChangedListener<Key extends keyof Schema>(scopes: [...Scopes, Key], callback: () => void): any;
}
type StorageSchema<T extends Storage<any, any>> = T extends Storage<any, infer U> ? U : never;
type StorageScopes<T extends Storage<any, any>> = T extends Storage<infer S, any> ? S : never;
/**
 * Hook to use a storage instance. Acts like a useState hook, but persists the
 * value in storage.
 */
export declare function useStorage<Store extends Storage<any, any>, Key extends keyof StorageSchema<Store>>(storage: Store, scopes: [...StorageScopes<Store>, Key]): [
    StorageSchema<Store>[Key] | undefined,
    (data: StorageSchema<Store>[Key]) => void
];
/**
 * Device data that's specific to the device and does not vary based on account
 *
 *   `device.set([key], true)`
 */
export declare const device: Storage<[], Device>;
/**
 * Account data that's specific to the account on this device
 */
export declare const account: Storage<[string], Account>;
//# sourceMappingURL=index.d.ts.map