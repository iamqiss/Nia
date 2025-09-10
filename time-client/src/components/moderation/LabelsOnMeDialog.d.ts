import { type ComAtprotoLabelDefs } from '@atproto/api';
import * as Dialog from '#/components/Dialog';
export { useDialogControl as useLabelsOnMeDialogControl } from '#/components/Dialog';
export interface LabelsOnMeDialogProps {
    control: Dialog.DialogOuterProps['control'];
    labels: ComAtprotoLabelDefs.Label[];
    type: 'account' | 'content';
}
export declare function LabelsOnMeDialog(props: LabelsOnMeDialogProps): any;
//# sourceMappingURL=LabelsOnMeDialog.d.ts.map