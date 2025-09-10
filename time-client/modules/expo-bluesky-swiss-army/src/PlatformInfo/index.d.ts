import { AudioCategory } from './types';
export declare function getIsReducedMotionEnabled(): boolean;
/**
 * Set whether the app's audio should mix with other apps' audio. Will also resume background music playback when `false`
 * if it was previously playing.
 * @param mixWithOthers
 * @see https://developer.apple.com/documentation/avfaudio/avaudiosession/setactiveoptions/1616603-notifyothersondeactivation
 */
export declare function setAudioActive(active: boolean): void;
/**
 * Set the audio category for the app.
 * @param audioCategory
 * @platform ios
 */
export declare function setAudioCategory(audioCategory: AudioCategory): void;
//# sourceMappingURL=index.d.ts.map