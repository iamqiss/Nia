import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View } from 'react-native';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useAgeAssurance } from '#/state/ageAssurance/useAgeAssurance';
import { logger } from '#/state/ageAssurance/util';
import { Nux, useNux, useSaveNux } from '#/state/queries/nuxs';
import { atoms as a } from '#/alf';
import { AgeAssuranceAdmonition } from '#/components/ageAssurance/AgeAssuranceAdmonition';
import { useAgeAssuranceCopy } from '#/components/ageAssurance/useAgeAssuranceCopy';
import { Button, ButtonIcon } from '#/components/Button';
import { TimesLarge_Stroke2_Corner0_Rounded as X } from '#/components/icons/Times';
export function AgeAssuranceDismissibleNotice({ style }) {
    const { _ } = useLingui();
    const { isReady, isDeclaredUnderage, isAgeRestricted, lastInitiatedAt } = useAgeAssurance();
    const { nux } = useNux(Nux.AgeAssuranceDismissibleNotice);
    const copy = useAgeAssuranceCopy();
    const { mutate: save, variables } = useSaveNux();
    const hidden = !!variables;
    if (!isReady)
        return null;
    if (isDeclaredUnderage)
        return null;
    if (!isAgeRestricted)
        return null;
    if (lastInitiatedAt)
        return null;
    if (hidden)
        return null;
    if (nux && nux.completed)
        return null;
    return (_jsx(View, { style: style, children: _jsxs(View, { children: [_jsx(AgeAssuranceAdmonition, { children: copy.notice }), _jsx(Button, { label: _(msg `Don't show again`), size: "tiny", variant: "solid", color: "secondary_inverted", shape: "round", onPress: () => {
                        save({
                            id: Nux.AgeAssuranceDismissibleNotice,
                            completed: true,
                            data: undefined,
                        });
                        logger.metric('ageAssurance:dismissSettingsNotice', {});
                    }, style: [
                        a.absolute,
                        {
                            top: 12,
                            right: 12,
                        },
                    ], children: _jsx(ButtonIcon, { icon: X }) })] }) }));
}
//# sourceMappingURL=AgeAssuranceDismissibleNotice.js.map