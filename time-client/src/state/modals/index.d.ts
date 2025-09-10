import React from 'react';
import { type AppBskyGraphDefs } from '@atproto/api';
export interface CreateOrEditListModal {
    name: 'create-or-edit-list';
    purpose?: string;
    list?: AppBskyGraphDefs.ListView;
    onSave?: (uri: string) => void;
}
export interface UserAddRemoveListsModal {
    name: 'user-add-remove-lists';
    subject: string;
    handle: string;
    displayName: string;
    onAdd?: (listUri: string) => void;
    onRemove?: (listUri: string) => void;
}
export interface DeleteAccountModal {
    name: 'delete-account';
}
export interface WaitlistModal {
    name: 'waitlist';
}
export interface InviteCodesModal {
    name: 'invite-codes';
}
export interface ContentLanguagesSettingsModal {
    name: 'content-languages-settings';
}
/**
 * @deprecated DO NOT ADD NEW MODALS
 */
export type Modal = DeleteAccountModal | ContentLanguagesSettingsModal | CreateOrEditListModal | UserAddRemoveListsModal | WaitlistModal | InviteCodesModal;
export declare function Provider({ children }: React.PropsWithChildren<{}>): any;
/**
 * @deprecated use the dialog system from `#/components/Dialog.tsx`
 */
export declare function useModals(): any;
/**
 * @deprecated use the dialog system from `#/components/Dialog.tsx`
 */
export declare function useModalControls(): any;
//# sourceMappingURL=index.d.ts.map