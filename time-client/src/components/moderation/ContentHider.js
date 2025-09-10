import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import {} from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { ADULT_CONTENT_LABELS, isJustAMute } from '#/lib/moderation';
import { useGlobalLabelStrings } from '#/lib/moderation/useGlobalLabelStrings';
import { getDefinition, getLabelStrings } from '#/lib/moderation/useLabelInfo';
import { useModerationCauseDescription } from '#/lib/moderation/useModerationCauseDescription';
import { sanitizeDisplayName } from '#/lib/strings/display-names';
import { useLabelDefinitions } from '#/state/preferences';
import { atoms as a, useBreakpoints, useTheme, web } from '#/alf';
import { Button } from '#/components/Button';
import { ModerationDetailsDialog, useModerationDetailsDialogControl, } from '#/components/moderation/ModerationDetailsDialog';
import { Text } from '#/components/Typography';
export function ContentHider({ testID, modui, ignoreMute, style, activeStyle, childContainerStyle, children, }) {
    const blur = modui?.blurs[0];
    if (!blur || (ignoreMute && isJustAMute(modui))) {
        return (_jsx(View, { testID: testID, style: style, children: typeof children === 'function' ? children({ active: false }) : children }));
    }
    return (_jsx(ContentHiderActive, { testID: testID, modui: modui, style: [style, activeStyle], childContainerStyle: childContainerStyle, children: typeof children === 'function' ? children({ active: true }) : children }));
}
function ContentHiderActive({ testID, modui, style, childContainerStyle, children, }) {
    const t = useTheme();
    const { _ } = useLingui();
    const { gtMobile } = useBreakpoints();
    const [override, setOverride] = React.useState(false);
    const control = useModerationDetailsDialogControl();
    const { labelDefs } = useLabelDefinitions();
    const globalLabelStrings = useGlobalLabelStrings();
    const { i18n } = useLingui();
    const blur = modui?.blurs[0];
    const desc = useModerationCauseDescription(blur);
    const labelName = React.useMemo(() => {
        if (!modui?.blurs || !blur) {
            return undefined;
        }
        if (blur.type !== 'label' ||
            (blur.type === 'label' && blur.source.type !== 'user')) {
            return desc.name;
        }
        let hasAdultContentLabel = false;
        const selfBlurNames = modui.blurs
            .filter(cause => {
            if (cause.type !== 'label') {
                return false;
            }
            if (cause.source.type !== 'user') {
                return false;
            }
            if (ADULT_CONTENT_LABELS.includes(cause.label.val)) {
                if (hasAdultContentLabel) {
                    return false;
                }
                hasAdultContentLabel = true;
            }
            return true;
        })
            .slice(0, 2)
            .map(cause => {
            if (cause.type !== 'label') {
                return;
            }
            const def = cause.labelDef || getDefinition(labelDefs, cause.label);
            if (def.identifier === 'porn' || def.identifier === 'sexual') {
                return _(msg `Adult Content`);
            }
            return getLabelStrings(i18n.locale, globalLabelStrings, def).name;
        });
        if (selfBlurNames.length === 0) {
            return desc.name;
        }
        return [...new Set(selfBlurNames)].join(', ');
    }, [
        _,
        modui?.blurs,
        blur,
        desc.name,
        labelDefs,
        i18n.locale,
        globalLabelStrings,
    ]);
    return (_jsxs(View, { testID: testID, style: [a.overflow_hidden, style], children: [_jsx(ModerationDetailsDialog, { control: control, modcause: blur }), _jsx(Button, { onPress: e => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!modui.noOverride) {
                        setOverride(v => !v);
                    }
                    else {
                        control.open();
                    }
                }, label: desc.name, accessibilityHint: modui.noOverride
                    ? _(msg `Learn more about the moderation applied to this content`)
                    : override
                        ? _(msg `Hides the content`)
                        : _(msg `Shows the content`), children: state => (_jsxs(View, { style: [
                        a.flex_row,
                        a.w_full,
                        a.justify_start,
                        a.align_center,
                        a.py_md,
                        a.px_lg,
                        a.gap_xs,
                        a.rounded_sm,
                        t.atoms.bg_contrast_25,
                        gtMobile && [a.gap_sm, a.py_lg, a.mt_xs, a.px_xl],
                        (state.hovered || state.pressed) && t.atoms.bg_contrast_50,
                    ], children: [_jsx(desc.icon, { size: "md", fill: t.atoms.text_contrast_medium.color, style: { marginLeft: -2 } }), _jsx(Text, { style: [
                                a.flex_1,
                                a.text_left,
                                a.font_bold,
                                a.leading_snug,
                                gtMobile && [a.font_bold],
                                t.atoms.text_contrast_medium,
                                web({
                                    marginBottom: 1,
                                }),
                            ], numberOfLines: 2, children: labelName }), !modui.noOverride && (_jsx(Text, { style: [
                                a.font_bold,
                                a.leading_snug,
                                gtMobile && [a.font_bold],
                                t.atoms.text_contrast_high,
                                web({
                                    marginBottom: 1,
                                }),
                            ], children: override ? _jsx(Trans, { children: "Hide" }) : _jsx(Trans, { children: "Show" }) }))] })) }), desc.source && blur.type === 'label' && !override && (_jsx(Button, { onPress: e => {
                    e.preventDefault();
                    e.stopPropagation();
                    control.open();
                }, label: _(msg `Learn more about the moderation applied to this content`), style: [a.pt_sm], children: state => (_jsxs(Text, { style: [
                        a.flex_1,
                        a.text_sm,
                        a.font_normal,
                        a.leading_snug,
                        t.atoms.text_contrast_medium,
                        a.text_left,
                    ], children: [desc.sourceType === 'user' ? (_jsx(Trans, { children: "Labeled by the author." })) : (_jsxs(Trans, { children: ["Labeled by ", sanitizeDisplayName(desc.source), "."] })), ' ', _jsx(Text, { style: [
                                { color: t.palette.primary_500 },
                                a.text_sm,
                                state.hovered && [web({ textDecoration: 'underline' })],
                            ], children: _jsx(Trans, { children: "Learn more." }) })] })) })), override && _jsx(View, { style: childContainerStyle, children: children })] }));
}
//# sourceMappingURL=ContentHider.js.map