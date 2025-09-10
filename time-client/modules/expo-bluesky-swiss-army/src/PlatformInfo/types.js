/**
 * Sets the audio session category on iOS. In general, we should only need to use this for the `playback` and `ambient`
 * categories. This enum however includes other categories that are available in the native API for clarity and
 * potential future use.
 * @see https://developer.apple.com/documentation/avfoundation/avaudiosession/category
 * @platform ios
 */
export var AudioCategory;
(function (AudioCategory) {
    AudioCategory["Ambient"] = "AVAudioSessionCategoryAmbient";
    AudioCategory["Playback"] = "AVAudioSessionCategoryPlayback";
    AudioCategory["_SoloAmbient"] = "AVAudioSessionCategorySoloAmbient";
    AudioCategory["_Record"] = "AVAudioSessionCategoryRecord";
    AudioCategory["_PlayAndRecord"] = "AVAudioSessionCategoryPlayAndRecord";
    AudioCategory["_MultiRoute"] = "AVAudioSessionCategoryMultiRoute";
})(AudioCategory || (AudioCategory = {}));
//# sourceMappingURL=types.js.map