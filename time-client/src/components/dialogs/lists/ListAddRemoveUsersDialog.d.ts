import { type AppBskyGraphDefs } from '@atproto/api';
import * as Dialog from '#/components/Dialog';
import type * as bsky from '#/types/bsky';
export declare function ListAddRemoveUsersDialog({ control, list, onChange, }: {
    control: Dialog.DialogControlProps;
    list: AppBskyGraphDefs.ListView;
    onChange?: (type: 'add' | 'remove', profile: bsky.profile.AnyProfileView) => void | undefined;
}): any;
//# sourceMappingURL=ListAddRemoveUsersDialog.d.ts.map