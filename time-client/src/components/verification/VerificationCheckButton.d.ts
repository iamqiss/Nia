import { type Shadow } from '#/state/cache/types';
import { type FullVerificationState } from '#/components/verification';
import type * as bsky from '#/types/bsky';
export declare function shouldShowVerificationCheckButton(state: FullVerificationState): boolean;
export declare function VerificationCheckButton({ profile, size, }: {
    profile: Shadow<bsky.profile.AnyProfileView>;
    size: 'lg' | 'md' | 'sm';
}): any;
export declare function Badge({ profile, verificationState: state, size, }: {
    profile: Shadow<bsky.profile.AnyProfileView>;
    verificationState: FullVerificationState;
    size: 'lg' | 'md' | 'sm';
}): any;
//# sourceMappingURL=VerificationCheckButton.d.ts.map