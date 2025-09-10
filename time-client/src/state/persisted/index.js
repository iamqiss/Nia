import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '#/logger';
import { defaults, tryParse, tryStringify, } from '#/state/persisted/schema';
import { device } from '#/storage';
import {} from './types';
import { normalizeData } from './util';
export { defaults } from '#/state/persisted/schema';
const BSKY_STORAGE = 'BSKY_STORAGE';
let _state = defaults;
export async function init() {
    const stored = await readFromStorage();
    if (stored) {
        _state = stored;
    }
}
init;
export function get(key) {
    return _state[key];
}
get;
export async function write(key, value) {
    _state = normalizeData({
        ..._state,
        [key]: value,
    });
    await writeToStorage(_state);
}
write;
export function onUpdate(_key, _cb) {
    return () => { };
}
onUpdate;
export async function clearStorage() {
    try {
        await AsyncStorage.removeItem(BSKY_STORAGE);
        device.removeAll();
    }
    catch (e) {
        logger.error(`persisted store: failed to clear`, { message: e.toString() });
    }
}
clearStorage;
async function writeToStorage(value) {
    const rawData = tryStringify(value);
    if (rawData) {
        try {
            await AsyncStorage.setItem(BSKY_STORAGE, rawData);
        }
        catch (e) {
            logger.error(`persisted state: failed writing root state to storage`, {
                message: e,
            });
        }
    }
}
async function readFromStorage() {
    let rawData = null;
    try {
        rawData = await AsyncStorage.getItem(BSKY_STORAGE);
    }
    catch (e) {
        logger.error(`persisted state: failed reading root state from storage`, {
            message: e,
        });
    }
    if (rawData) {
        const parsed = tryParse(rawData);
        if (parsed) {
            return normalizeData(parsed);
        }
    }
}
//# sourceMappingURL=index.js.map