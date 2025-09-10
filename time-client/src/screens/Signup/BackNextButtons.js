import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { atoms as a } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import { Loader } from '#/components/Loader';
export function BackNextButtons({ hideNext, showRetry, isLoading, isNextDisabled, onBackPress, onNextPress, onRetryPress, overrideNextText, }) {
    const { _ } = useLingui();
    return (_jsxs(View, { style: [a.flex_row, a.justify_between, a.pb_lg, a.pt_3xl], children: [_jsx(Button, { label: _(msg `Go back to previous step`), variant: "solid", color: "secondary", size: "large", onPress: onBackPress, children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Back" }) }) }), !hideNext &&
                (showRetry ? (_jsxs(Button, { label: _(msg `Press to retry`), variant: "solid", color: "primary", size: "large", onPress: onRetryPress, children: [_jsx(ButtonText, { children: _jsx(Trans, { children: "Retry" }) }), isLoading && _jsx(ButtonIcon, { icon: Loader })] })) : (_jsxs(Button, { testID: "nextBtn", label: _(msg `Continue to next step`), variant: "solid", color: "primary", size: "large", disabled: isLoading || isNextDisabled, onPress: onNextPress, children: [_jsx(ButtonText, { children: overrideNextText ? overrideNextText : _jsx(Trans, { children: "Next" }) }), isLoading && _jsx(ButtonIcon, { icon: Loader })] })))] }));
}
//# sourceMappingURL=BackNextButtons.js.map