import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { View } from 'react-native';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useAgeAssurance } from '#/state/ageAssurance/useAgeAssurance';
import { logger } from '#/state/ageAssurance/util';
import { Nux, useNux, useSaveNux } from '#/state/queries/nuxs';
import { atoms as a, select, useTheme } from '#/alf';
import { useAgeAssuranceCopy } from '#/components/ageAssurance/useAgeAssuranceCopy';
import { Button } from '#/components/Button';
import { ShieldCheck_Stroke2_Corner0_Rounded as Shield } from '#/components/icons/Shield';
import { TimesLarge_Stroke2_Corner0_Rounded as X } from '#/components/icons/Times';
import { Link } from '#/components/Link';
import { Text } from '#/components/Typography';
export function useInternalState() {
    const { isReady, isDeclaredUnderage, isAgeRestricted, lastInitiatedAt } = useAgeAssurance();
    const { nux } = useNux(Nux.AgeAssuranceDismissibleFeedBanner);
    const { mutate: save, variables } = useSaveNux();
    const hidden = !!variables;
    const visible = useMemo(() => {
        if (!isReady)
            return false;
        if (isDeclaredUnderage)
            return false;
        if (!isAgeRestricted)
            return false;
        if (lastInitiatedAt)
            return false;
        if (hidden)
            return false;
        if (nux && nux.completed)
            return false;
        return true;
    }, [
        isReady,
        isDeclaredUnderage,
        isAgeRestricted,
        lastInitiatedAt,
        hidden,
        nux,
    ]);
    const close = () => {
        save({
            id: Nux.AgeAssuranceDismissibleFeedBanner,
            completed: true,
            data: undefined,
        });
    };
    return { visible, close };
}
export function AgeAssuranceDismissibleFeedBanner() {
    const t = useTheme();
    const { _ } = useLingui();
    const { visible, close } = useInternalState();
    const copy = useAgeAssuranceCopy();
    if (!visible)
        return null;
    return (_jsxs(View, { style: [
            a.px_lg,
            {
                paddingVertical: 10,
                backgroundColor: select(t.name, {
                    light: t.palette.primary_25,
                    dark: t.palette.primary_25,
                    dim: t.palette.primary_25,
                }),
            },
        ], children: [_jsxs(Link, { label: _(msg `Learn more about age assurance`), to: "/settings/account", onPress: () => {
                    close();
                    logger.metric('ageAssurance:navigateToSettings', {});
                }, style: [a.w_full, a.justify_between, a.align_center, a.gap_md], children: [_jsx(View, { style: [
                            a.align_center,
                            a.justify_center,
                            a.rounded_full,
                            {
                                width: 42,
                                height: 42,
                                backgroundColor: select(t.name, {
                                    light: t.palette.primary_100,
                                    dark: t.palette.primary_100,
                                    dim: t.palette.primary_100,
                                }),
                            },
                        ], children: _jsx(Shield, { size: "lg" }) }), _jsx(View, { style: [
                            a.flex_1,
                            {
                                paddingRight: 40,
                            },
                        ], children: _jsx(View, { style: { maxWidth: 400 }, children: _jsx(Text, { style: [a.leading_snug], children: copy.banner }) }) })] }), _jsx(Button, { label: _(msg `Don't show again`), size: "small", onPress: () => {
                    close();
                    logger.metric('ageAssurance:dismissFeedBanner', {});
                }, style: [
                    a.absolute,
                    a.justify_center,
                    a.align_center,
                    {
                        top: 0,
                        bottom: 0,
                        right: 0,
                        paddingRight: a.px_md.paddingLeft,
                    },
                ], children: _jsx(X, { width: 20, fill: select(t.name, {
                        light: t.palette.primary_600,
                        dark: t.palette.primary_600,
                        dim: t.palette.primary_600,
                    }) }) })] }));
}
//# sourceMappingURL=AgeAssuranceDismissibleFeedBanner.js.map