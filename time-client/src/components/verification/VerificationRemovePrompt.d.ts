import { type AppBskyActorDefs } from '@atproto/api';
import { type DialogControlProps } from '#/components/Dialog';
import type * as bsky from '#/types/bsky';
export { useDialogControl as usePromptControl } from '#/components/Dialog';
export declare function VerificationRemovePrompt({ control, profile, verifications, onConfirm: onConfirmInner, }: {
    control: DialogControlProps;
    profile: bsky.profile.AnyProfileView;
    verifications: AppBskyActorDefs.VerificationView[];
    onConfirm?: () => void;
}): any;
//# sourceMappingURL=VerificationRemovePrompt.d.ts.map