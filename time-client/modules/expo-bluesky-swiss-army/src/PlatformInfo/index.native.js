import { Platform } from 'react-native';
import { requireNativeModule } from 'expo-modules-core';
import { AudioCategory } from './types';
const NativeModule = requireNativeModule('ExpoPlatformInfo');
export function getIsReducedMotionEnabled() {
    return NativeModule.getIsReducedMotionEnabled();
}
export function setAudioActive(active) {
    if (Platform.OS !== 'ios')
        return;
    NativeModule.setAudioActive(active);
}
export function setAudioCategory(audioCategory) {
    if (Platform.OS !== 'ios')
        return;
    NativeModule.setAudioCategory(audioCategory);
}
//# sourceMappingURL=index.native.js.map