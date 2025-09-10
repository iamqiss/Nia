import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Fragment, useCallback } from 'react';
import { Linking, View } from 'react-native';
import { LABELS } from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useFocusEffect } from '@react-navigation/native';
import { getLabelingServiceTitle } from '#/lib/moderation';
import {} from '#/lib/routes/types';
import { logger } from '#/logger';
import { isIOS } from '#/platform/detection';
import { useAgeAssurance } from '#/state/ageAssurance/useAgeAssurance';
import { useMyLabelersQuery, usePreferencesQuery, usePreferencesSetAdultContentMutation, } from '#/state/queries/preferences';
import { isNonConfigurableModerationAuthority } from '#/state/session/additional-moderation-authorities';
import { useSetMinimalShellMode } from '#/state/shell';
import { atoms as a, useBreakpoints, useTheme } from '#/alf';
import { Admonition } from '#/components/Admonition';
import { AgeAssuranceAdmonition } from '#/components/ageAssurance/AgeAssuranceAdmonition';
import { Button, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import { BirthDateSettingsDialog } from '#/components/dialogs/BirthDateSettings';
import { useGlobalDialogsControlContext } from '#/components/dialogs/Context';
import { Divider } from '#/components/Divider';
import * as Toggle from '#/components/forms/Toggle';
import { ChevronRight_Stroke2_Corner0_Rounded as ChevronRight } from '#/components/icons/Chevron';
import { CircleBanSign_Stroke2_Corner0_Rounded as CircleBanSign } from '#/components/icons/CircleBanSign';
import { CircleCheck_Stroke2_Corner0_Rounded as CircleCheck } from '#/components/icons/CircleCheck';
import {} from '#/components/icons/common';
import { EditBig_Stroke2_Corner0_Rounded as EditBig } from '#/components/icons/EditBig';
import { Filter_Stroke2_Corner0_Rounded as Filter } from '#/components/icons/Filter';
import { Group3_Stroke2_Corner0_Rounded as Group } from '#/components/icons/Group';
import { Person_Stroke2_Corner0_Rounded as Person } from '#/components/icons/Person';
import * as LabelingService from '#/components/LabelingServiceCard';
import * as Layout from '#/components/Layout';
import { InlineLinkText, Link } from '#/components/Link';
import { ListMaybePlaceholder } from '#/components/Lists';
import { Loader } from '#/components/Loader';
import { GlobalLabelPreference } from '#/components/moderation/LabelPreference';
import { Text } from '#/components/Typography';
function ErrorState({ error }) {
    const t = useTheme();
    return (_jsxs(View, { style: [a.p_xl], children: [_jsx(Text, { style: [
                    a.text_md,
                    a.leading_normal,
                    a.pb_md,
                    t.atoms.text_contrast_medium,
                ], children: _jsx(Trans, { children: "Hmmmm, it seems we're having trouble loading this data. See below for more details. If this issue persists, please contact us." }) }), _jsx(View, { style: [
                    a.relative,
                    a.py_md,
                    a.px_lg,
                    a.rounded_md,
                    a.mb_2xl,
                    t.atoms.bg_contrast_25,
                ], children: _jsx(Text, { style: [a.text_md, a.leading_normal], children: error }) })] }));
}
export function ModerationScreen(_props) {
    const { _ } = useLingui();
    const { isLoading: isPreferencesLoading, error: preferencesError, data: preferences, } = usePreferencesQuery();
    const { isReady: isAgeInfoReady } = useAgeAssurance();
    const isLoading = isPreferencesLoading || !isAgeInfoReady;
    const error = preferencesError;
    return (_jsxs(Layout.Screen, { testID: "moderationScreen", children: [_jsxs(Layout.Header.Outer, { children: [_jsx(Layout.Header.BackButton, {}), _jsx(Layout.Header.Content, { children: _jsx(Layout.Header.TitleText, { children: _jsx(Trans, { children: "Moderation" }) }) }), _jsx(Layout.Header.Slot, {})] }), _jsx(Layout.Content, { children: isLoading ? (_jsx(ListMaybePlaceholder, { isLoading: true, sideBorders: false })) : error || !preferences ? (_jsx(ErrorState, { error: preferencesError?.toString() ||
                        _(msg `Something went wrong, please try again.`) })) : (_jsx(ModerationScreenInner, { preferences: preferences })) })] }));
}
function SubItem({ title, icon: Icon, style, }) {
    const t = useTheme();
    return (_jsxs(View, { style: [
            a.w_full,
            a.flex_row,
            a.align_center,
            a.justify_between,
            a.p_lg,
            a.gap_sm,
            style,
        ], children: [_jsxs(View, { style: [a.flex_row, a.align_center, a.gap_md], children: [_jsx(Icon, { size: "md", style: [t.atoms.text_contrast_medium] }), _jsx(Text, { style: [a.text_sm, a.font_bold], children: title })] }), _jsx(ChevronRight, { size: "sm", style: [t.atoms.text_contrast_low, a.self_end, { paddingBottom: 2 }] })] }));
}
export function ModerationScreenInner({ preferences, }) {
    const { _ } = useLingui();
    const t = useTheme();
    const setMinimalShellMode = useSetMinimalShellMode();
    const { gtMobile } = useBreakpoints();
    const { mutedWordsDialogControl } = useGlobalDialogsControlContext();
    const birthdateDialogControl = Dialog.useDialogControl();
    const { isLoading: isLabelersLoading, data: labelers, error: labelersError, } = useMyLabelersQuery();
    const { declaredAge, isDeclaredUnderage, isAgeRestricted } = useAgeAssurance();
    useFocusEffect(useCallback(() => {
        setMinimalShellMode(false);
    }, [setMinimalShellMode]));
    const { mutateAsync: setAdultContentPref, variables: optimisticAdultContent } = usePreferencesSetAdultContentMutation();
    const adultContentEnabled = !!((optimisticAdultContent && optimisticAdultContent.enabled) ||
        (!optimisticAdultContent && preferences.moderationPrefs.adultContentEnabled));
    const onToggleAdultContentEnabled = useCallback(async (selected) => {
        try {
            await setAdultContentPref({
                enabled: selected,
            });
        }
        catch (e) {
            logger.error(`Failed to set adult content pref`, {
                message: e.message,
            });
        }
    }, [setAdultContentPref]);
    const disabledOnIOS = isIOS && !adultContentEnabled;
    return (_jsxs(View, { style: [a.pt_2xl, a.px_lg, gtMobile && a.px_2xl], children: [isDeclaredUnderage && (_jsx(View, { style: [a.pb_2xl], children: _jsx(Admonition, { type: "tip", style: [a.pb_md], children: _jsxs(Trans, { children: ["Your declared age is under 18. Some settings below may be disabled. If this was a mistake, you may edit your birthdate in your", ' ', _jsx(InlineLinkText, { to: "/settings/account", label: _(msg `Go to account settings`), children: "account settings" }), "."] }) }) })), _jsx(Text, { style: [a.text_md, a.font_bold, a.pb_md, t.atoms.text_contrast_high], children: _jsx(Trans, { children: "Moderation tools" }) }), _jsxs(View, { style: [
                    a.w_full,
                    a.rounded_md,
                    a.overflow_hidden,
                    t.atoms.bg_contrast_25,
                ], children: [_jsx(Link, { label: _(msg `View your default post interaction settings`), testID: "interactionSettingsBtn", to: "/moderation/interaction-settings", children: state => (_jsx(SubItem, { title: _(msg `Interaction settings`), icon: EditBig, style: [
                                (state.hovered || state.pressed) && [t.atoms.bg_contrast_50],
                            ] })) }), _jsx(Divider, {}), _jsx(Button, { testID: "mutedWordsBtn", label: _(msg `Open muted words and tags settings`), onPress: () => mutedWordsDialogControl.open(), children: state => (_jsx(SubItem, { title: _(msg `Muted words & tags`), icon: Filter, style: [
                                (state.hovered || state.pressed) && [t.atoms.bg_contrast_50],
                            ] })) }), _jsx(Divider, {}), _jsx(Link, { label: _(msg `View your moderation lists`), testID: "moderationlistsBtn", to: "/moderation/modlists", children: state => (_jsx(SubItem, { title: _(msg `Moderation lists`), icon: Group, style: [
                                (state.hovered || state.pressed) && [t.atoms.bg_contrast_50],
                            ] })) }), _jsx(Divider, {}), _jsx(Link, { label: _(msg `View your muted accounts`), testID: "mutedAccountsBtn", to: "/moderation/muted-accounts", children: state => (_jsx(SubItem, { title: _(msg `Muted accounts`), icon: Person, style: [
                                (state.hovered || state.pressed) && [t.atoms.bg_contrast_50],
                            ] })) }), _jsx(Divider, {}), _jsx(Link, { label: _(msg `View your blocked accounts`), testID: "blockedAccountsBtn", to: "/moderation/blocked-accounts", children: state => (_jsx(SubItem, { title: _(msg `Blocked accounts`), icon: CircleBanSign, style: [
                                (state.hovered || state.pressed) && [t.atoms.bg_contrast_50],
                            ] })) }), _jsx(Divider, {}), _jsx(Link, { label: _(msg `Manage verification settings`), testID: "verificationSettingsBtn", to: "/moderation/verification-settings", children: state => (_jsx(SubItem, { title: _(msg `Verification settings`), icon: CircleCheck, style: [
                                (state.hovered || state.pressed) && [t.atoms.bg_contrast_50],
                            ] })) })] }), declaredAge === undefined && (_jsxs(_Fragment, { children: [_jsx(Text, { style: [
                            a.pt_2xl,
                            a.pb_md,
                            a.text_md,
                            a.font_bold,
                            t.atoms.text_contrast_high,
                        ], children: _jsx(Trans, { children: "Content filters" }) }), _jsxs(Button, { label: _(msg `Confirm your birthdate`), size: "small", variant: "solid", color: "secondary", onPress: () => {
                            birthdateDialogControl.open();
                        }, style: [a.justify_between, a.rounded_md, a.px_lg, a.py_lg], children: [_jsx(ButtonText, { children: _jsx(Trans, { children: "Confirm your age:" }) }), _jsx(ButtonText, { children: _jsx(Trans, { children: "Set birthdate" }) })] }), _jsx(BirthDateSettingsDialog, { control: birthdateDialogControl })] })), !isDeclaredUnderage && (_jsxs(_Fragment, { children: [_jsx(Text, { style: [
                            a.pt_2xl,
                            a.pb_md,
                            a.text_md,
                            a.font_bold,
                            t.atoms.text_contrast_high,
                        ], children: _jsx(Trans, { children: "Content filters" }) }), _jsx(AgeAssuranceAdmonition, { style: [a.pb_md], children: _jsx(Trans, { children: "You must complete age assurance in order to access the settings below." }) }), _jsx(View, { style: [a.gap_md], children: _jsx(View, { style: [
                                a.w_full,
                                a.rounded_md,
                                a.overflow_hidden,
                                t.atoms.bg_contrast_25,
                            ], children: !isDeclaredUnderage && (_jsxs(_Fragment, { children: [_jsxs(View, { style: [
                                            a.py_lg,
                                            a.px_lg,
                                            a.flex_row,
                                            a.align_center,
                                            a.justify_between,
                                            disabledOnIOS && { opacity: 0.5 },
                                        ], children: [_jsx(Text, { style: [a.font_bold, t.atoms.text_contrast_high], children: _jsx(Trans, { children: "Enable adult content" }) }), _jsx(Toggle.Item, { label: _(msg `Toggle to enable or disable adult content`), disabled: disabledOnIOS || isAgeRestricted, name: "adultContent", value: adultContentEnabled, onChange: onToggleAdultContentEnabled, children: _jsxs(View, { style: [a.flex_row, a.align_center, a.gap_sm], children: [_jsx(Text, { style: [t.atoms.text_contrast_medium], children: adultContentEnabled ? (_jsx(Trans, { children: "Enabled" })) : (_jsx(Trans, { children: "Disabled" })) }), _jsx(Toggle.Switch, {})] }) })] }), disabledOnIOS && (_jsx(View, { style: [a.pb_lg, a.px_lg], children: _jsx(Text, { children: _jsxs(Trans, { children: ["Adult content can only be enabled via the Web at", ' ', _jsx(InlineLinkText, { label: _(msg `The Bluesky web application`), to: "", onPress: evt => {
                                                            evt.preventDefault();
                                                            Linking.openURL('https://bsky.app/');
                                                            return false;
                                                        }, children: "bsky.app" }), "."] }) }) })), adultContentEnabled && (_jsxs(_Fragment, { children: [_jsx(Divider, {}), _jsx(GlobalLabelPreference, { labelDefinition: LABELS.porn }), _jsx(Divider, {}), _jsx(GlobalLabelPreference, { labelDefinition: LABELS.sexual }), _jsx(Divider, {}), _jsx(GlobalLabelPreference, { labelDefinition: LABELS['graphic-media'] }), _jsx(Divider, {}), _jsx(GlobalLabelPreference, { disabled: isDeclaredUnderage || isAgeRestricted, labelDefinition: LABELS.nudity })] }))] })) }) })] })), _jsx(Text, { style: [
                    a.text_md,
                    a.font_bold,
                    a.pt_2xl,
                    a.pb_md,
                    t.atoms.text_contrast_high,
                ], children: _jsx(Trans, { children: "Advanced" }) }), isLabelersLoading ? (_jsx(View, { style: [a.w_full, a.align_center, a.p_lg], children: _jsx(Loader, { size: "xl" }) })) : labelersError || !labelers ? (_jsx(View, { style: [a.p_lg, a.rounded_sm, t.atoms.bg_contrast_25], children: _jsx(Text, { children: _jsx(Trans, { children: "We were unable to load your configured labelers at this time." }) }) })) : (_jsx(View, { style: [a.rounded_sm, t.atoms.bg_contrast_25], children: labelers.map((labeler, i) => {
                    return (_jsxs(Fragment, { children: [i !== 0 && _jsx(Divider, {}), _jsx(LabelingService.Link, { labeler: labeler, children: state => (_jsxs(LabelingService.Outer, { style: [
                                        i === 0 && {
                                            borderTopLeftRadius: a.rounded_sm.borderRadius,
                                            borderTopRightRadius: a.rounded_sm.borderRadius,
                                        },
                                        i === labelers.length - 1 && {
                                            borderBottomLeftRadius: a.rounded_sm.borderRadius,
                                            borderBottomRightRadius: a.rounded_sm.borderRadius,
                                        },
                                        (state.hovered || state.pressed) && [
                                            t.atoms.bg_contrast_50,
                                        ],
                                    ], children: [_jsx(LabelingService.Avatar, { avatar: labeler.creator.avatar }), _jsxs(LabelingService.Content, { children: [_jsx(LabelingService.Title, { value: getLabelingServiceTitle({
                                                        displayName: labeler.creator.displayName,
                                                        handle: labeler.creator.handle,
                                                    }) }), _jsx(LabelingService.Description, { value: labeler.creator.description, handle: labeler.creator.handle }), isNonConfigurableModerationAuthority(labeler.creator.did) && _jsx(LabelingService.RegionalNotice, {})] })] })) })] }, labeler.creator.did));
                }) })), _jsx(View, { style: { height: 150 } })] }));
}
//# sourceMappingURL=index.js.map