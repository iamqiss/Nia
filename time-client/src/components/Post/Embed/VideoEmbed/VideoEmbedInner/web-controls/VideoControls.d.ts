import type Hls from 'hls.js';
export declare function Controls({ videoRef, hlsRef, active, setActive, focused, setFocused, onScreen, fullscreenRef, hlsLoading, hasSubtitleTrack, }: {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    hlsRef: React.RefObject<Hls | undefined | null>;
    active: boolean;
    setActive: () => void;
    focused: boolean;
    setFocused: (focused: boolean) => void;
    onScreen: boolean;
    fullscreenRef: React.RefObject<HTMLDivElement | null>;
    hlsLoading: boolean;
    hasSubtitleTrack: boolean;
}): any;
//# sourceMappingURL=VideoControls.d.ts.map