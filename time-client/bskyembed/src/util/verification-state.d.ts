import * as bsky from '../types/bsky';
export type VerificationState = {
    role: 'default' | 'verifier';
    isVerified: boolean;
};
export declare function getVerificationState({ profile, }: {
    profile?: bsky.profile.AnyProfileView;
}): VerificationState;
//# sourceMappingURL=verification-state.d.ts.map