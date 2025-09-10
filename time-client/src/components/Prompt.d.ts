import React from 'react';
import { type GestureResponderEvent } from 'react-native';
import { type ViewStyleProp } from '#/alf';
import { type ButtonColor } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import { type BottomSheetViewProps } from '../../modules/bottom-sheet';
export { type DialogControlProps as PromptControlProps, useDialogControl as usePromptControl, } from '#/components/Dialog';
export declare function Outer({ children, control, testID, nativeOptions, }: React.PropsWithChildren<{
    control: Dialog.DialogControlProps;
    testID?: string;
    nativeOptions?: Omit<BottomSheetViewProps, 'children'>;
}>): any;
export declare function TitleText({ children, style, }: React.PropsWithChildren<ViewStyleProp>): any;
export declare function DescriptionText({ children, selectable, }: React.PropsWithChildren<{
    selectable?: boolean;
}>): any;
export declare function Actions({ children }: React.PropsWithChildren<{}>): any;
export declare function Cancel({ cta, }: {
    /**
     * Optional i18n string. If undefined, it will default to "Cancel".
     */
    cta?: string;
}): any;
export declare function Action({ onPress, color, cta, testID, }: {
    /**
     * Callback to run when the action is pressed. The method is called _after_
     * the dialog closes.
     *
     * Note: The dialog will close automatically when the action is pressed, you
     * should NOT close the dialog as a side effect of this method.
     */
    onPress: (e: GestureResponderEvent) => void;
    color?: ButtonColor;
    /**
     * Optional i18n string. If undefined, it will default to "Confirm".
     */
    cta?: string;
    testID?: string;
}): any;
export declare function Basic({ control, title, description, cancelButtonCta, confirmButtonCta, onConfirm, confirmButtonColor, showCancel, }: React.PropsWithChildren<{
    control: Dialog.DialogOuterProps['control'];
    title: string;
    description?: string;
    cancelButtonCta?: string;
    confirmButtonCta?: string;
    /**
     * Callback to run when the Confirm button is pressed. The method is called
     * _after_ the dialog closes.
     *
     * Note: The dialog will close automatically when the action is pressed, you
     * should NOT close the dialog as a side effect of this method.
     */
    onConfirm: (e: GestureResponderEvent) => void;
    confirmButtonColor?: ButtonColor;
    showCancel?: boolean;
}>): any;
//# sourceMappingURL=Prompt.d.ts.map