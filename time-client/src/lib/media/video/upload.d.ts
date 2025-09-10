import { type BskyAgent } from '@atproto/api';
import { type I18n } from '@lingui/core';
import { type CompressedVideo } from '#/lib/media/video/types';
export declare function uploadVideo({ video, agent, did, setProgress, signal, _, }: {
    video: CompressedVideo;
    agent: BskyAgent;
    did: string;
    setProgress: (progress: number) => void;
    signal: AbortSignal;
    _: I18n['_'];
}): Promise<AppBskyVideoDefs.JobStatus>;
//# sourceMappingURL=upload.d.ts.map