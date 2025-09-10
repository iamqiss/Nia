import { type ModerationCause } from '@atproto/api';
import * as Dialog from '#/components/Dialog';
import { type AppModerationCause } from '#/components/Pills';
export { useDialogControl as useModerationDetailsDialogControl } from '#/components/Dialog';
export interface ModerationDetailsDialogProps {
    control: Dialog.DialogOuterProps['control'];
    modcause?: ModerationCause | AppModerationCause;
}
export declare function ModerationDetailsDialog(props: ModerationDetailsDialogProps): any;
//# sourceMappingURL=ModerationDetailsDialog.d.ts.map