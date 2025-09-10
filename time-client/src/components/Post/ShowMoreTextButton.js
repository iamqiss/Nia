import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useMemo } from 'react';
import { LayoutAnimation } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { HITSLOP_10 } from '#/lib/constants';
import { atoms as a, flatten, useTheme } from '#/alf';
import { Button } from '#/components/Button';
import { Text } from '#/components/Typography';
export function ShowMoreTextButton({ onPress: onPressProp, style, }) {
    const t = useTheme();
    const { _ } = useLingui();
    const onPress = useCallback(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        onPressProp();
    }, [onPressProp]);
    const textStyle = useMemo(() => {
        return flatten([a.leading_snug, a.text_sm, style]);
    }, [style]);
    return (_jsx(Button, { label: _(msg `Expand post text`), onPress: onPress, style: [
            a.self_start,
            {
                paddingBottom: textStyle.fontSize / 3,
            },
        ], hitSlop: HITSLOP_10, children: ({ pressed, hovered }) => (_jsx(Text, { style: [
                textStyle,
                {
                    color: t.palette.primary_500,
                    opacity: pressed ? 0.6 : 1,
                    textDecorationLine: hovered ? 'underline' : undefined,
                },
            ], children: _jsx(Trans, { children: "Show More" }) })) }));
}
//# sourceMappingURL=ShowMoreTextButton.js.map