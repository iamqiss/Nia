import React from 'react';
export declare enum ProgressGuideAction {
    Like = "like",
    Follow = "follow"
}
type ProgressGuideName = 'like-10-and-follow-7' | 'follow-10';
/**
 * Progress Guides that extend this interface must specify their name in the `guide` field, so it can be used as a discriminated union
 */
interface BaseProgressGuide {
    guide: ProgressGuideName;
    isComplete: boolean;
    [key: string]: any;
}
export interface Like10AndFollow7ProgressGuide extends BaseProgressGuide {
    guide: 'like-10-and-follow-7';
    numLikes: number;
    numFollows: number;
}
export interface Follow10ProgressGuide extends BaseProgressGuide {
    guide: 'follow-10';
    numFollows: number;
}
export type ProgressGuide = Like10AndFollow7ProgressGuide | Follow10ProgressGuide | undefined;
export declare function useProgressGuide(guide: ProgressGuideName): any;
export declare function useProgressGuideControls(): any;
export declare function Provider({ children }: React.PropsWithChildren<{}>): any;
export {};
//# sourceMappingURL=progress-guide.d.ts.map