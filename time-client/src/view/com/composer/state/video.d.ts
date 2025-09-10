import { type ImagePickerAsset } from 'expo-image-picker';
import { type AppBskyVideoDefs, type BlobRef, type BskyAgent } from '@atproto/api';
import { type I18n } from '@lingui/core';
import { type CompressedVideo } from '#/lib/media/video/types';
type CaptionsTrack = {
    lang: string;
    file: File;
};
export type VideoAction = {
    type: 'compressing_to_uploading';
    video: CompressedVideo;
    signal: AbortSignal;
} | {
    type: 'uploading_to_processing';
    jobId: string;
    signal: AbortSignal;
} | {
    type: 'to_error';
    error: string;
    signal: AbortSignal;
} | {
    type: 'to_done';
    blobRef: BlobRef;
    signal: AbortSignal;
} | {
    type: 'update_progress';
    progress: number;
    signal: AbortSignal;
} | {
    type: 'update_alt_text';
    altText: string;
    signal: AbortSignal;
} | {
    type: 'update_captions';
    updater: (prev: CaptionsTrack[]) => CaptionsTrack[];
    signal: AbortSignal;
} | {
    type: 'update_job_status';
    jobStatus: AppBskyVideoDefs.JobStatus;
    signal: AbortSignal;
};
export declare const NO_VIDEO: Readonly<{
    status: "idle";
    progress: 0;
    abortController: AbortController;
    asset: undefined;
    video: undefined;
    jobId: undefined;
    pendingPublish: undefined;
    altText: "";
    captions: never[];
}>;
export type NoVideoState = typeof NO_VIDEO;
type ErrorState = {
    status: 'error';
    progress: 100;
    abortController: AbortController;
    asset: ImagePickerAsset | null;
    video: CompressedVideo | null;
    jobId: string | null;
    error: string;
    pendingPublish?: undefined;
    altText: string;
    captions: CaptionsTrack[];
};
type CompressingState = {
    status: 'compressing';
    progress: number;
    abortController: AbortController;
    asset: ImagePickerAsset;
    video?: undefined;
    jobId?: undefined;
    pendingPublish?: undefined;
    altText: string;
    captions: CaptionsTrack[];
};
type UploadingState = {
    status: 'uploading';
    progress: number;
    abortController: AbortController;
    asset: ImagePickerAsset;
    video: CompressedVideo;
    jobId?: undefined;
    pendingPublish?: undefined;
    altText: string;
    captions: CaptionsTrack[];
};
type ProcessingState = {
    status: 'processing';
    progress: number;
    abortController: AbortController;
    asset: ImagePickerAsset;
    video: CompressedVideo;
    jobId: string;
    jobStatus: AppBskyVideoDefs.JobStatus | null;
    pendingPublish?: undefined;
    altText: string;
    captions: CaptionsTrack[];
};
type DoneState = {
    status: 'done';
    progress: 100;
    abortController: AbortController;
    asset: ImagePickerAsset;
    video: CompressedVideo;
    jobId?: undefined;
    pendingPublish: {
        blobRef: BlobRef;
    };
    altText: string;
    captions: CaptionsTrack[];
};
export type VideoState = ErrorState | CompressingState | UploadingState | ProcessingState | DoneState;
export declare function createVideoState(asset: ImagePickerAsset, abortController: AbortController): CompressingState;
export declare function videoReducer(state: VideoState, action: VideoAction): VideoState;
export declare function processVideo(asset: ImagePickerAsset, dispatch: (action: VideoAction) => void, agent: BskyAgent, did: string, signal: AbortSignal, _: I18n['_']): Promise<void>;
export {};
//# sourceMappingURL=video.d.ts.map