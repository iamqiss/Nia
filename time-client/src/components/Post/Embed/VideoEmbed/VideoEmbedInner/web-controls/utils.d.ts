import { type RefObject } from 'react';
export declare function useVideoElement(ref: RefObject<HTMLVideoElement | null>): {
    play: any;
    pause: any;
    togglePlayPause: any;
    duration: any;
    currentTime: any;
    playing: any;
    muted: any;
    changeMuted: any;
    buffering: any;
    error: any;
    canPlay: any;
};
export declare function formatTime(time: number): string;
//# sourceMappingURL=utils.d.ts.map