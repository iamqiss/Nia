import { type AppBskyActorDefs, type AppBskyEmbedExternal } from '@atproto/api';
import * as Dialog from '#/components/Dialog';
import type * as bsky from '#/types/bsky';
export declare function LiveStatusDialog({ control, profile, embed, }: {
    control: Dialog.DialogControlProps;
    profile: bsky.profile.AnyProfileView;
    status: AppBskyActorDefs.StatusView;
    embed: AppBskyEmbedExternal.View;
}): any;
export declare function LiveStatus({ profile, embed, padding, onPressOpenProfile, }: {
    profile: bsky.profile.AnyProfileView;
    embed: AppBskyEmbedExternal.View;
    padding?: 'lg' | 'xl';
    onPressOpenProfile: () => void;
}): any;
//# sourceMappingURL=LiveStatusDialog.d.ts.map