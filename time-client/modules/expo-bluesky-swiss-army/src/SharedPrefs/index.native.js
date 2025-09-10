import { requireNativeModule } from 'expo-modules-core';
const NativeModule = requireNativeModule('ExpoBlueskySharedPrefs');
export function setValue(key, value) {
    // A bug on Android causes `JavaScripValue.isString()` to cause a crash on some occasions, seemingly because of a
    // memory violation. Instead, we will use a specific function to set strings on this platform.
    if (typeof value === 'string') {
        return NativeModule.setString(key, value);
    }
    return NativeModule.setValue(key, value);
}
export function removeValue(key) {
    return NativeModule.removeValue(key);
}
export function getString(key) {
    return nullToUndefined(NativeModule.getString(key));
}
export function getNumber(key) {
    return nullToUndefined(NativeModule.getNumber(key));
}
export function getBool(key) {
    return nullToUndefined(NativeModule.getBool(key));
}
export function addToSet(key, value) {
    return NativeModule.addToSet(key, value);
}
export function removeFromSet(key, value) {
    return NativeModule.removeFromSet(key, value);
}
export function setContains(key, value) {
    return NativeModule.setContains(key, value);
}
// iOS returns `null` if a value does not exist, and Android returns `undefined. Normalize these here for JS types
function nullToUndefined(value) {
    if (value == null) {
        return undefined;
    }
    return value;
}
//# sourceMappingURL=index.native.js.map