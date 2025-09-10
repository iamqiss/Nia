import { useCallback, useEffect, useState } from 'react';
import { MMKV } from 'react-native-mmkv';
import {} from '#/storage/schema';
export * from '#/storage/schema';
/**
 * Generic storage class. DO NOT use this directly. Instead, use the exported
 * storage instances below.
 */
export class Storage {
    sep = ':';
    store;
    constructor({ id }) {
        this.store = new MMKV({ id });
    }
    /**
     * Store a value in storage based on scopes and/or keys
     *
     *   `set([key], value)`
     *   `set([scope, key], value)`
     */
    set(scopes, data) {
        // stored as `{ data: <value> }` structure to ease stringification
        this.store.set(scopes.join(this.sep), JSON.stringify({ data }));
    }
    /**
     * Get a value from storage based on scopes and/or keys
     *
     *   `get([key])`
     *   `get([scope, key])`
     */
    get(scopes) {
        const res = this.store.getString(scopes.join(this.sep));
        if (!res)
            return undefined;
        // parsed from storage structure `{ data: <value> }`
        return JSON.parse(res).data;
    }
    /**
     * Remove a value from storage based on scopes and/or keys
     *
     *   `remove([key])`
     *   `remove([scope, key])`
     */
    remove(scopes) {
        this.store.delete(scopes.join(this.sep));
    }
    /**
     * Remove many values from the same storage scope by keys
     *
     *   `removeMany([], [key])`
     *   `removeMany([scope], [key])`
     */
    removeMany(scopes, keys) {
        keys.forEach(key => this.remove([...scopes, key]));
    }
    /**
     * For debugging purposes
     */
    removeAll() {
        this.store.clearAll();
    }
    /**
     * Fires a callback when the storage associated with a given key changes
     *
     * @returns Listener - call `remove()` to stop listening
     */
    addOnValueChangedListener(scopes, callback) {
        return this.store.addOnValueChangedListener(key => {
            if (key === scopes.join(this.sep)) {
                callback();
            }
        });
    }
}
/**
 * Hook to use a storage instance. Acts like a useState hook, but persists the
 * value in storage.
 */
export function useStorage(storage, scopes) {
    const [value, setValue] = useState(() => storage.get(scopes));
    useEffect(() => {
        const sub = storage.addOnValueChangedListener(scopes, () => {
            setValue(storage.get(scopes));
        });
        return () => sub.remove();
    }, [storage, scopes]);
    const setter = useCallback((data) => {
        setValue(data);
        storage.set(scopes, data);
    }, [storage, scopes]);
    return [value, setter];
}
/**
 * Device data that's specific to the device and does not vary based on account
 *
 *   `device.set([key], true)`
 */
export const device = new Storage({ id: 'bsky_device' });
/**
 * Account data that's specific to the account on this device
 */
export const account = new Storage({ id: 'bsky_account' });
if (__DEV__ && typeof window !== 'undefined') {
    // @ts-expect-error - dev global
    window.bsky_storage = {
        device,
        account,
    };
}
//# sourceMappingURL=index.js.map