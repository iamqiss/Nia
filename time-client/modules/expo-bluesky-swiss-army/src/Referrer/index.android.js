import { requireNativeModule } from 'expo';
import { GooglePlayReferrerInfo, ReferrerInfo } from './types';
export const NativeModule = requireNativeModule('ExpoBlueskyReferrer');
export function getGooglePlayReferrerInfoAsync() {
    return NativeModule.getGooglePlayReferrerInfoAsync();
}
export function getReferrerInfo() {
    return NativeModule.getReferrerInfo();
}
//# sourceMappingURL=index.android.js.map