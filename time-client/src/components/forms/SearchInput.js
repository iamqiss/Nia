import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { HITSLOP_10 } from '#/lib/constants';
import { isNative } from '#/platform/detection';
import { atoms as a, useTheme } from '#/alf';
import { Button, ButtonIcon } from '#/components/Button';
import * as TextField from '#/components/forms/TextField';
import { MagnifyingGlass2_Stroke2_Corner0_Rounded as MagnifyingGlassIcon } from '#/components/icons/MagnifyingGlass2';
import { TimesLarge_Stroke2_Corner0_Rounded as X } from '#/components/icons/Times';
export const SearchInput = React.forwardRef(function SearchInput({ value, label, onClearText, ...rest }, ref) {
    const t = useTheme();
    const { _ } = useLingui();
    const showClear = value && value.length > 0;
    return (_jsxs(View, { style: [a.w_full, a.relative], children: [_jsxs(TextField.Root, { children: [_jsx(TextField.Icon, { icon: MagnifyingGlassIcon }), _jsx(TextField.Input, { inputRef: ref, label: label || _(msg `Search`), value: value, placeholder: _(msg `Search`), returnKeyType: "search", keyboardAppearance: t.scheme, selectTextOnFocus: isNative, autoFocus: false, accessibilityRole: "search", autoCorrect: false, autoComplete: "off", autoCapitalize: "none", style: [
                            showClear
                                ? {
                                    paddingRight: 24,
                                }
                                : {},
                        ], ...rest })] }), showClear && (_jsx(View, { style: [
                    a.absolute,
                    a.z_20,
                    a.my_auto,
                    a.inset_0,
                    a.justify_center,
                    a.pr_sm,
                    { left: 'auto' },
                ], children: _jsx(Button, { testID: "searchTextInputClearBtn", onPress: onClearText, label: _(msg `Clear search query`), hitSlop: HITSLOP_10, size: "tiny", shape: "round", variant: "ghost", color: "secondary", children: _jsx(ButtonIcon, { icon: X, size: "xs" }) }) }))] }));
});
//# sourceMappingURL=SearchInput.js.map