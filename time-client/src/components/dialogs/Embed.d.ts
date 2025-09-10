import { type AppBskyActorDefs, type AppBskyFeedPost } from '@atproto/api';
import * as Dialog from '#/components/Dialog';
export type ColorModeValues = 'system' | 'light' | 'dark';
type EmbedDialogProps = {
    control: Dialog.DialogControlProps;
    postAuthor: AppBskyActorDefs.ProfileViewBasic;
    postCid: string;
    postUri: string;
    record: AppBskyFeedPost.Record;
    timestamp: string;
};
declare let EmbedDialog: ({ control, ...rest }: EmbedDialogProps) => React.ReactNode;
export { EmbedDialog };
//# sourceMappingURL=Embed.d.ts.map