import { type AppBskyFeedDefs, type AppBskyFeedPostgate } from '@atproto/api';
import { type ThreadgateAllowUISetting } from '#/state/queries/threadgate';
import * as Dialog from '#/components/Dialog';
export type PostInteractionSettingsFormProps = {
    canSave?: boolean;
    onSave: () => void;
    isSaving?: boolean;
    postgate: AppBskyFeedPostgate.Record;
    onChangePostgate: (v: AppBskyFeedPostgate.Record) => void;
    threadgateAllowUISettings: ThreadgateAllowUISetting[];
    onChangeThreadgateAllowUISettings: (v: ThreadgateAllowUISetting[]) => void;
    replySettingsDisabled?: boolean;
};
export declare function PostInteractionSettingsControlledDialog({ control, ...rest }: PostInteractionSettingsFormProps & {
    control: Dialog.DialogControlProps;
}): any;
export declare function Header(): any;
export type PostInteractionSettingsDialogProps = {
    control: Dialog.DialogControlProps;
    /**
     * URI of the post to edit the interaction settings for. Could be a root post
     * or could be a reply.
     */
    postUri: string;
    /**
     * The URI of the root post in the thread. Used to determine if the viewer
     * owns the threadgate record and can therefore edit it.
     */
    rootPostUri: string;
    /**
     * Optional initial {@link AppBskyFeedDefs.ThreadgateView} to use if we
     * happen to have one before opening the settings dialog.
     */
    initialThreadgateView?: AppBskyFeedDefs.ThreadgateView;
};
export declare function PostInteractionSettingsDialog(props: PostInteractionSettingsDialogProps): any;
export declare function PostInteractionSettingsDialogControlledInner(props: PostInteractionSettingsDialogProps): any;
export declare function PostInteractionSettingsForm({ canSave, onSave, isSaving, postgate, onChangePostgate, threadgateAllowUISettings, onChangeThreadgateAllowUISettings, replySettingsDisabled, }: PostInteractionSettingsFormProps): any;
export declare function usePrefetchPostInteractionSettings({ postUri, rootPostUri, }: {
    postUri: string;
    rootPostUri: string;
}): any;
//# sourceMappingURL=PostInteractionSettingsDialog.d.ts.map