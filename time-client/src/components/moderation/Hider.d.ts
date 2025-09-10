import React from 'react';
import { type ModerationUI } from '@atproto/api';
export declare const useHider: () => any;
export declare function Outer({ modui, isContentVisibleInitialState, allowOverride, children, }: React.PropsWithChildren<{
    isContentVisibleInitialState?: boolean;
    allowOverride?: boolean;
    modui: ModerationUI | undefined;
}>): any;
export declare function Content({ children }: {
    children: React.ReactNode;
}): any;
export declare function Mask({ children }: {
    children: React.ReactNode;
}): any;
//# sourceMappingURL=Hider.d.ts.map