import type * as bsky from '#/types/bsky';
export type FullVerificationState = {
    profile: {
        role: 'default' | 'verifier';
        isVerified: boolean;
        wasVerified: boolean;
        isViewer: boolean;
        showBadge: boolean;
    };
    viewer: {
        role: 'default';
        isVerified: boolean;
    } | {
        role: 'verifier';
        isVerified: boolean;
        hasIssuedVerification: boolean;
    };
};
export declare function useFullVerificationState({ profile, }: {
    profile: bsky.profile.AnyProfileView;
}): FullVerificationState;
export type SimpleVerificationState = {
    role: 'default' | 'verifier';
    isVerified: boolean;
    showBadge: boolean;
};
export declare function useSimpleVerificationState({ profile, }: {
    profile?: bsky.profile.AnyProfileView;
}): SimpleVerificationState;
//# sourceMappingURL=index.d.ts.map