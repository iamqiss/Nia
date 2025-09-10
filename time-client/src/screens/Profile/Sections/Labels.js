import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useImperativeHandle, useMemo } from 'react';
import { findNodeHandle, View } from 'react-native';
import { interpretLabelValueDefinitions, } from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { isLabelerSubscribed, lookupLabelValueDefinition } from '#/lib/moderation';
import { isIOS, isNative } from '#/platform/detection';
import { List } from '#/view/com/util/List';
import { atoms as a, ios, tokens, useTheme } from '#/alf';
import { Divider } from '#/components/Divider';
import { CircleInfo_Stroke2_Corner0_Rounded as CircleInfo } from '#/components/icons/CircleInfo';
import { ListFooter } from '#/components/Lists';
import { Loader } from '#/components/Loader';
import { LabelerLabelPreference } from '#/components/moderation/LabelPreference';
import { Text } from '#/components/Typography';
import { ErrorState } from '../ErrorState';
import {} from './types';
export function ProfileLabelsSection({ ref, isLabelerLoading, labelerInfo, labelerError, moderationOpts, scrollElRef, headerHeight, isFocused, setScrollViewTag, }) {
    const t = useTheme();
    const onScrollToTop = useCallback(() => {
        // @ts-expect-error TODO fix this
        scrollElRef.current?.scrollTo({
            animated: isNative,
            x: 0,
            y: -headerHeight,
        });
    }, [scrollElRef, headerHeight]);
    useImperativeHandle(ref, () => ({
        scrollToTop: onScrollToTop,
    }));
    useEffect(() => {
        if (isIOS && isFocused && scrollElRef.current) {
            const nativeTag = findNodeHandle(scrollElRef.current);
            setScrollViewTag(nativeTag);
        }
    }, [isFocused, scrollElRef, setScrollViewTag]);
    const isSubscribed = labelerInfo
        ? !!isLabelerSubscribed(labelerInfo, moderationOpts)
        : false;
    const labelValues = useMemo(() => {
        if (isLabelerLoading || !labelerInfo || labelerError)
            return [];
        const customDefs = interpretLabelValueDefinitions(labelerInfo);
        return labelerInfo.policies.labelValues
            .filter((val, i, arr) => arr.indexOf(val) === i) // dedupe
            .map(val => lookupLabelValueDefinition(val, customDefs))
            .filter(def => def && def?.configurable);
    }, [labelerInfo, labelerError, isLabelerLoading]);
    const numItems = labelValues.length;
    const renderItem = useCallback(({ item, index }) => {
        if (!labelerInfo)
            return null;
        return (_jsxs(View, { style: [
                t.atoms.bg_contrast_25,
                index === 0 && [
                    a.overflow_hidden,
                    {
                        borderTopLeftRadius: tokens.borderRadius.md,
                        borderTopRightRadius: tokens.borderRadius.md,
                    },
                ],
                index === numItems - 1 && [
                    a.overflow_hidden,
                    {
                        borderBottomLeftRadius: tokens.borderRadius.md,
                        borderBottomRightRadius: tokens.borderRadius.md,
                    },
                ],
            ], children: [index !== 0 && _jsx(Divider, {}), _jsx(LabelerLabelPreference, { disabled: isSubscribed ? undefined : true, labelDefinition: item, labelerDid: labelerInfo.creator.did })] }));
    }, [labelerInfo, isSubscribed, numItems, t]);
    return (_jsx(View, { children: _jsx(List, { ref: scrollElRef, data: labelValues, renderItem: renderItem, keyExtractor: keyExtractor, contentContainerStyle: a.px_xl, headerOffset: headerHeight, progressViewOffset: ios(0), ListHeaderComponent: _jsx(LabelerListHeader, { isLabelerLoading: isLabelerLoading, labelerInfo: labelerInfo, labelerError: labelerError, hasValues: labelValues.length !== 0, isSubscribed: isSubscribed }), ListFooterComponent: _jsx(ListFooter, { height: headerHeight + 180, style: a.border_transparent }) }) }));
}
function keyExtractor(item) {
    return item.identifier;
}
export function LabelerListHeader({ isLabelerLoading, labelerError, labelerInfo, hasValues, isSubscribed, }) {
    const t = useTheme();
    const { _ } = useLingui();
    if (isLabelerLoading) {
        return (_jsx(View, { style: [a.w_full, a.align_center, a.py_4xl], children: _jsx(Loader, { size: "xl" }) }));
    }
    if (labelerError || !labelerInfo) {
        return (_jsx(View, { style: [a.w_full, a.align_center, a.py_4xl], children: _jsx(ErrorState, { error: labelerError?.toString() ||
                    _(msg `Something went wrong, please try again.`) }) }));
    }
    return (_jsxs(View, { style: [a.py_xl], children: [_jsx(Text, { style: [t.atoms.text_contrast_high, a.leading_snug, a.text_sm], children: _jsx(Trans, { children: "Labels are annotations on users and content. They can be used to hide, warn, and categorize the network." }) }), labelerInfo?.creator.viewer?.blocking ? (_jsxs(View, { style: [a.flex_row, a.gap_sm, a.align_center, a.mt_md], children: [_jsx(CircleInfo, { size: "sm", fill: t.atoms.text_contrast_medium.color }), _jsx(Text, { style: [t.atoms.text_contrast_high, a.leading_snug, a.text_sm], children: _jsx(Trans, { children: "Blocking does not prevent this labeler from placing labels on your account." }) })] })) : null, !hasValues ? (_jsx(Text, { style: [
                    a.pt_xl,
                    t.atoms.text_contrast_high,
                    a.leading_snug,
                    a.text_sm,
                ], children: _jsx(Trans, { children: "This labeler hasn't declared what labels it publishes, and may not be active." }) })) : !isSubscribed ? (_jsx(Text, { style: [
                    a.pt_xl,
                    t.atoms.text_contrast_high,
                    a.leading_snug,
                    a.text_sm,
                ], children: _jsxs(Trans, { children: ["Subscribe to @", labelerInfo.creator.handle, " to use these labels:"] }) })) : null] }));
}
//# sourceMappingURL=Labels.js.map