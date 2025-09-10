import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { StyleSheet } from 'react-native';
// @ts-expect-error untyped
import { unstable_createElement } from 'react-native-web';
import {} from '#/components/forms/DateField/types';
import { toSimpleDateString } from '#/components/forms/DateField/utils';
import * as TextField from '#/components/forms/TextField';
import { CalendarDays_Stroke2_Corner0_Rounded as CalendarDays } from '#/components/icons/CalendarDays';
export * as utils from '#/components/forms/DateField/utils';
export const LabelText = TextField.LabelText;
const InputBase = React.forwardRef(({ style, ...props }, ref) => {
    return unstable_createElement('input', {
        ...props,
        ref,
        type: 'date',
        style: [
            StyleSheet.flatten(style),
            {
                background: 'transparent',
                border: 0,
            },
        ],
    });
});
InputBase.displayName = 'InputBase';
const Input = TextField.createInput(InputBase);
export function DateField({ value, inputRef, onChangeDate, label, isInvalid, testID, accessibilityHint, maximumDate, }) {
    const handleOnChange = React.useCallback((e) => {
        const date = e.target.valueAsDate || e.target.value;
        if (date) {
            const formatted = toSimpleDateString(date);
            onChangeDate(formatted);
        }
    }, [onChangeDate]);
    return (_jsxs(TextField.Root, { isInvalid: isInvalid, children: [_jsx(TextField.Icon, { icon: CalendarDays }), _jsx(Input, { value: toSimpleDateString(value), inputRef: inputRef, label: label, onChange: handleOnChange, testID: testID, accessibilityHint: accessibilityHint, 
                // @ts-expect-error not typed as <input type="date"> even though it is one
                max: maximumDate ? toSimpleDateString(maximumDate) : undefined })] }));
}
//# sourceMappingURL=index.web.js.map