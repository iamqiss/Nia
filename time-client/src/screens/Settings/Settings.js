import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Alert, LayoutAnimation, Pressable, View } from 'react-native';
import { Linking } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { moderateProfile } from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useNavigation } from '@react-navigation/native';
import {} from '@react-navigation/native-stack';
import { useActorStatus } from '#/lib/actor-status';
import { HELP_DESK_URL } from '#/lib/constants';
import { useAccountSwitcher } from '#/lib/hooks/useAccountSwitcher';
import { useApplyPullRequestOTAUpdate } from '#/lib/hooks/useOTAUpdates';
import {} from '#/lib/routes/types';
import { sanitizeDisplayName } from '#/lib/strings/display-names';
import { sanitizeHandle } from '#/lib/strings/handles';
import { isIOS, isNative } from '#/platform/detection';
import { useProfileShadow } from '#/state/cache/profile-shadow';
import * as persisted from '#/state/persisted';
import { clearStorage } from '#/state/persisted';
import { useModerationOpts } from '#/state/preferences/moderation-opts';
import { useDeleteActorDeclaration } from '#/state/queries/messages/actor-declaration';
import { useProfileQuery, useProfilesQuery } from '#/state/queries/profile';
import { useAgent } from '#/state/session';
import { useSession, useSessionApi } from '#/state/session';
import { useOnboardingDispatch } from '#/state/shell';
import { useLoggedOutViewControls } from '#/state/shell/logged-out';
import { useCloseAllActiveElements } from '#/state/util';
import * as Toast from '#/view/com/util/Toast';
import { UserAvatar } from '#/view/com/util/UserAvatar';
import * as SettingsList from '#/screens/Settings/components/SettingsList';
import { atoms as a, platform, tokens, useBreakpoints, useTheme } from '#/alf';
import { AgeAssuranceDismissibleNotice } from '#/components/ageAssurance/AgeAssuranceDismissibleNotice';
import { AvatarStackWithFetch } from '#/components/AvatarStack';
import { Button, ButtonText } from '#/components/Button';
import { useDialogControl } from '#/components/Dialog';
import { SwitchAccountDialog } from '#/components/dialogs/SwitchAccount';
import { Accessibility_Stroke2_Corner2_Rounded as AccessibilityIcon } from '#/components/icons/Accessibility';
import { Bell_Stroke2_Corner0_Rounded as NotificationIcon } from '#/components/icons/Bell';
import { BubbleInfo_Stroke2_Corner2_Rounded as BubbleInfoIcon } from '#/components/icons/BubbleInfo';
import { ChevronTop_Stroke2_Corner0_Rounded as ChevronUpIcon } from '#/components/icons/Chevron';
import { CircleQuestion_Stroke2_Corner2_Rounded as CircleQuestionIcon } from '#/components/icons/CircleQuestion';
import { CodeBrackets_Stroke2_Corner2_Rounded as CodeBracketsIcon } from '#/components/icons/CodeBrackets';
import { DotGrid_Stroke2_Corner0_Rounded as DotsHorizontal } from '#/components/icons/DotGrid';
import { Earth_Stroke2_Corner2_Rounded as EarthIcon } from '#/components/icons/Globe';
import { Lock_Stroke2_Corner2_Rounded as LockIcon } from '#/components/icons/Lock';
import { PaintRoller_Stroke2_Corner2_Rounded as PaintRollerIcon } from '#/components/icons/PaintRoller';
import { Person_Stroke2_Corner2_Rounded as PersonIcon, PersonGroup_Stroke2_Corner2_Rounded as PersonGroupIcon, PersonPlus_Stroke2_Corner2_Rounded as PersonPlusIcon, PersonX_Stroke2_Corner0_Rounded as PersonXIcon, } from '#/components/icons/Person';
import { RaisingHand4Finger_Stroke2_Corner2_Rounded as HandIcon } from '#/components/icons/RaisingHand';
import { Window_Stroke2_Corner2_Rounded as WindowIcon } from '#/components/icons/Window';
import * as Layout from '#/components/Layout';
import { Loader } from '#/components/Loader';
import * as Menu from '#/components/Menu';
import { ID as PolicyUpdate202508 } from '#/components/PolicyUpdateOverlay/updates/202508/config';
import * as Prompt from '#/components/Prompt';
import { Text } from '#/components/Typography';
import { useFullVerificationState } from '#/components/verification';
import { shouldShowVerificationCheckButton, VerificationCheckButton, } from '#/components/verification/VerificationCheckButton';
import { IS_INTERNAL } from '#/env';
import { device, useStorage } from '#/storage';
import { useActivitySubscriptionsNudged } from '#/storage/hooks/activity-subscriptions-nudged';
export function SettingsScreen({}) {
    const { _ } = useLingui();
    const reducedMotion = useReducedMotion();
    const { logoutEveryAccount } = useSessionApi();
    const { accounts, currentAccount } = useSession();
    const switchAccountControl = useDialogControl();
    const signOutPromptControl = Prompt.usePromptControl();
    const { data: profile } = useProfileQuery({ did: currentAccount?.did });
    const { data: otherProfiles } = useProfilesQuery({
        handles: accounts
            .filter(acc => acc.did !== currentAccount?.did)
            .map(acc => acc.handle),
    });
    const { pendingDid, onPressSwitchAccount } = useAccountSwitcher();
    const [showAccounts, setShowAccounts] = useState(false);
    const [showDevOptions, setShowDevOptions] = useState(false);
    return (_jsxs(Layout.Screen, { children: [_jsxs(Layout.Header.Outer, { children: [_jsx(Layout.Header.BackButton, {}), _jsx(Layout.Header.Content, { children: _jsx(Layout.Header.TitleText, { children: _jsx(Trans, { children: "Settings" }) }) }), _jsx(Layout.Header.Slot, {})] }), _jsx(Layout.Content, { children: _jsxs(SettingsList.Container, { children: [_jsx(AgeAssuranceDismissibleNotice, { style: [a.px_lg, a.pt_xs, a.pb_xl] }), _jsx(View, { style: [
                                a.px_xl,
                                a.pt_md,
                                a.pb_md,
                                a.w_full,
                                a.gap_2xs,
                                a.align_center,
                                { minHeight: 160 },
                            ], children: profile && _jsx(ProfilePreview, { profile: profile }) }), accounts.length > 1 ? (_jsxs(_Fragment, { children: [_jsxs(SettingsList.PressableItem, { label: _(msg `Switch account`), accessibilityHint: _(msg `Shows other accounts you can switch to`), onPress: () => {
                                        if (!reducedMotion) {
                                            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                        }
                                        setShowAccounts(s => !s);
                                    }, children: [_jsx(SettingsList.ItemIcon, { icon: PersonGroupIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Switch account" }) }), showAccounts ? (_jsx(SettingsList.ItemIcon, { icon: ChevronUpIcon, size: "md" })) : (_jsx(AvatarStackWithFetch, { profiles: accounts
                                                .map(acc => acc.did)
                                                .filter(did => did !== currentAccount?.did)
                                                .slice(0, 5) }))] }), showAccounts && (_jsxs(_Fragment, { children: [_jsx(SettingsList.Divider, {}), accounts
                                            .filter(acc => acc.did !== currentAccount?.did)
                                            .map(account => (_jsx(AccountRow, { account: account, profile: otherProfiles?.profiles?.find(p => p.did === account.did), pendingDid: pendingDid, onPressSwitchAccount: onPressSwitchAccount }, account.did))), _jsx(AddAccountRow, {})] }))] })) : (_jsx(AddAccountRow, {})), _jsx(SettingsList.Divider, {}), _jsxs(SettingsList.LinkItem, { to: "/settings/account", label: _(msg `Account`), children: [_jsx(SettingsList.ItemIcon, { icon: PersonIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Account" }) })] }), _jsxs(SettingsList.LinkItem, { to: "/settings/privacy-and-security", label: _(msg `Privacy and security`), children: [_jsx(SettingsList.ItemIcon, { icon: LockIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Privacy and security" }) })] }), _jsxs(SettingsList.LinkItem, { to: "/moderation", label: _(msg `Moderation`), children: [_jsx(SettingsList.ItemIcon, { icon: HandIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Moderation" }) })] }), _jsxs(SettingsList.LinkItem, { to: "/settings/notifications", label: _(msg `Notifications`), children: [_jsx(SettingsList.ItemIcon, { icon: NotificationIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Notifications" }) })] }), _jsxs(SettingsList.LinkItem, { to: "/settings/content-and-media", label: _(msg `Content and media`), children: [_jsx(SettingsList.ItemIcon, { icon: WindowIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Content and media" }) })] }), _jsxs(SettingsList.LinkItem, { to: "/settings/appearance", label: _(msg `Appearance`), children: [_jsx(SettingsList.ItemIcon, { icon: PaintRollerIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Appearance" }) })] }), _jsxs(SettingsList.LinkItem, { to: "/settings/accessibility", label: _(msg `Accessibility`), children: [_jsx(SettingsList.ItemIcon, { icon: AccessibilityIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Accessibility" }) })] }), _jsxs(SettingsList.LinkItem, { to: "/settings/language", label: _(msg `Languages`), children: [_jsx(SettingsList.ItemIcon, { icon: EarthIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Languages" }) })] }), _jsxs(SettingsList.PressableItem, { onPress: () => Linking.openURL(HELP_DESK_URL), label: _(msg `Help`), accessibilityHint: _(msg `Opens helpdesk in browser`), children: [_jsx(SettingsList.ItemIcon, { icon: CircleQuestionIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Help" }) }), _jsx(SettingsList.Chevron, {})] }), _jsxs(SettingsList.LinkItem, { to: "/settings/about", label: _(msg `About`), children: [_jsx(SettingsList.ItemIcon, { icon: BubbleInfoIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "About" }) })] }), _jsx(SettingsList.Divider, {}), _jsx(SettingsList.PressableItem, { destructive: true, onPress: () => signOutPromptControl.open(), label: _(msg `Sign out`), children: _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Sign out" }) }) }), IS_INTERNAL && (_jsxs(_Fragment, { children: [_jsx(SettingsList.Divider, {}), _jsxs(SettingsList.PressableItem, { onPress: () => {
                                        if (!reducedMotion) {
                                            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                        }
                                        setShowDevOptions(d => !d);
                                    }, label: _(msg `Developer options`), children: [_jsx(SettingsList.ItemIcon, { icon: CodeBracketsIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Developer options" }) })] }), showDevOptions && _jsx(DevOptions, {})] }))] }) }), _jsx(Prompt.Basic, { control: signOutPromptControl, title: _(msg `Sign out?`), description: _(msg `You will be signed out of all your accounts.`), onConfirm: () => logoutEveryAccount('Settings'), confirmButtonCta: _(msg `Sign out`), cancelButtonCta: _(msg `Cancel`), confirmButtonColor: "negative" }), _jsx(SwitchAccountDialog, { control: switchAccountControl })] }));
}
function ProfilePreview({ profile, }) {
    const t = useTheme();
    const { gtMobile } = useBreakpoints();
    const shadow = useProfileShadow(profile);
    const moderationOpts = useModerationOpts();
    const verificationState = useFullVerificationState({
        profile: shadow,
    });
    const { isActive: live } = useActorStatus(profile);
    if (!moderationOpts)
        return null;
    const moderation = moderateProfile(profile, moderationOpts);
    const displayName = sanitizeDisplayName(profile.displayName || sanitizeHandle(profile.handle), moderation.ui('displayName'));
    return (_jsxs(_Fragment, { children: [_jsx(UserAvatar, { size: 80, avatar: shadow.avatar, moderation: moderation.ui('avatar'), type: shadow.associated?.labeler ? 'labeler' : 'user', live: live }), _jsxs(View, { style: [
                    a.flex_row,
                    a.gap_xs,
                    a.align_center,
                    a.justify_center,
                    a.w_full,
                ], children: [_jsx(Text, { emoji: true, testID: "profileHeaderDisplayName", numberOfLines: 1, style: [
                            a.pt_sm,
                            t.atoms.text,
                            gtMobile ? a.text_4xl : a.text_3xl,
                            a.font_heavy,
                        ], children: displayName }), shouldShowVerificationCheckButton(verificationState) && (_jsx(View, { style: [
                            {
                                marginTop: platform({ web: 8, ios: 8, android: 10 }),
                            },
                        ], children: _jsx(VerificationCheckButton, { profile: shadow, size: "lg" }) }))] }), _jsx(Text, { style: [a.text_md, a.leading_snug, t.atoms.text_contrast_medium], children: sanitizeHandle(profile.handle, '@') })] }));
}
function DevOptions() {
    const { _ } = useLingui();
    const agent = useAgent();
    const [override, setOverride] = useStorage(device, [
        'policyUpdateDebugOverride',
    ]);
    const onboardingDispatch = useOnboardingDispatch();
    const navigation = useNavigation();
    const { mutate: deleteChatDeclarationRecord } = useDeleteActorDeclaration();
    const { tryApplyUpdate, revertToEmbedded, isCurrentlyRunningPullRequestDeployment, currentChannel, } = useApplyPullRequestOTAUpdate();
    const [actyNotifNudged, setActyNotifNudged] = useActivitySubscriptionsNudged();
    const resetOnboarding = async () => {
        navigation.navigate('Home');
        onboardingDispatch({ type: 'start' });
        Toast.show(_(msg `Onboarding reset`));
    };
    const clearAllStorage = async () => {
        await clearStorage();
        Toast.show(_(msg `Storage cleared, you need to restart the app now.`));
    };
    const onPressUnsnoozeReminder = () => {
        const lastEmailConfirm = new Date();
        // wind back 3 days
        lastEmailConfirm.setDate(lastEmailConfirm.getDate() - 3);
        persisted.write('reminders', {
            ...persisted.get('reminders'),
            lastEmailConfirm: lastEmailConfirm.toISOString(),
        });
        Toast.show(_(msg `You probably want to restart the app now.`));
    };
    const onPressActySubsUnNudge = () => {
        setActyNotifNudged(false);
    };
    const onPressApplyOta = () => {
        Alert.prompt('Apply OTA', 'Enter the channel for the OTA you wish to apply.', [
            {
                style: 'cancel',
                text: 'Cancel',
            },
            {
                style: 'default',
                text: 'Apply',
                onPress: channel => {
                    tryApplyUpdate(channel ?? '');
                },
            },
        ], 'plain-text', isCurrentlyRunningPullRequestDeployment
            ? currentChannel
            : 'pull-request-');
    };
    return (_jsxs(_Fragment, { children: [_jsx(SettingsList.PressableItem, { onPress: () => navigation.navigate('Log'), label: _(msg `Open system log`), children: _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "System log" }) }) }), _jsx(SettingsList.PressableItem, { onPress: () => navigation.navigate('Debug'), label: _(msg `Open storybook page`), children: _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Storybook" }) }) }), _jsx(SettingsList.PressableItem, { onPress: () => navigation.navigate('DebugMod'), label: _(msg `Open moderation debug page`), children: _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Debug Moderation" }) }) }), _jsx(SettingsList.PressableItem, { onPress: () => deleteChatDeclarationRecord(), label: _(msg `Open storybook page`), children: _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Delete chat declaration record" }) }) }), _jsx(SettingsList.PressableItem, { onPress: () => resetOnboarding(), label: _(msg `Reset onboarding state`), children: _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Reset onboarding state" }) }) }), _jsx(SettingsList.PressableItem, { onPress: onPressUnsnoozeReminder, label: _(msg `Unsnooze email reminder`), children: _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Unsnooze email reminder" }) }) }), actyNotifNudged && (_jsx(SettingsList.PressableItem, { onPress: onPressActySubsUnNudge, label: _(msg `Reset activity subscription nudge`), children: _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Reset activity subscription nudge" }) }) })), _jsx(SettingsList.PressableItem, { onPress: () => clearAllStorage(), label: _(msg `Clear all storage data`), children: _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Clear all storage data (restart after this)" }) }) }), isIOS ? (_jsx(SettingsList.PressableItem, { onPress: onPressApplyOta, label: _(msg `Apply Pull Request`), children: _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Apply Pull Request" }) }) })) : null, isNative && isCurrentlyRunningPullRequestDeployment ? (_jsx(SettingsList.PressableItem, { onPress: revertToEmbedded, label: _(msg `Unapply Pull Request`), children: _jsx(SettingsList.ItemText, { children: _jsxs(Trans, { children: ["Unapply Pull Request ", currentChannel] }) }) })) : null, _jsx(SettingsList.Divider, {}), _jsxs(View, { style: [a.p_xl, a.gap_md], children: [_jsx(Text, { style: [a.text_lg, a.font_bold], children: "PolicyUpdate202508 Debug" }), _jsxs(View, { style: [a.flex_row, a.align_center, a.justify_between, a.gap_md], children: [_jsx(Button, { onPress: () => {
                                    setOverride(!override);
                                }, label: "Toggle", color: override ? 'primary' : 'secondary', size: "small", style: [a.flex_1], children: _jsx(ButtonText, { children: override ? 'Disable debug mode' : 'Enable debug mode' }) }), _jsx(Button, { onPress: () => {
                                    device.set([PolicyUpdate202508], false);
                                    agent.bskyAppRemoveNuxs([PolicyUpdate202508]);
                                    Toast.show(`Done`, 'info');
                                }, label: "Reset policy update nux", color: "secondary", size: "small", disabled: !override, children: _jsx(ButtonText, { children: "Reset state" }) })] })] }), _jsx(SettingsList.Divider, {})] }));
}
function AddAccountRow() {
    const { _ } = useLingui();
    const { setShowLoggedOut } = useLoggedOutViewControls();
    const closeEverything = useCloseAllActiveElements();
    const onAddAnotherAccount = () => {
        setShowLoggedOut(true);
        closeEverything();
    };
    return (_jsxs(SettingsList.PressableItem, { onPress: onAddAnotherAccount, label: _(msg `Add another account`), children: [_jsx(SettingsList.ItemIcon, { icon: PersonPlusIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Add another account" }) })] }));
}
function AccountRow({ profile, account, pendingDid, onPressSwitchAccount, }) {
    const { _ } = useLingui();
    const t = useTheme();
    const moderationOpts = useModerationOpts();
    const removePromptControl = Prompt.usePromptControl();
    const { removeAccount } = useSessionApi();
    const { isActive: live } = useActorStatus(profile);
    const onSwitchAccount = () => {
        if (pendingDid)
            return;
        onPressSwitchAccount(account, 'Settings');
    };
    return (_jsxs(View, { style: [a.relative], children: [_jsxs(SettingsList.PressableItem, { onPress: onSwitchAccount, label: _(msg `Switch account`), children: [moderationOpts && profile ? (_jsx(UserAvatar, { size: 28, avatar: profile.avatar, moderation: moderateProfile(profile, moderationOpts).ui('avatar'), type: profile.associated?.labeler ? 'labeler' : 'user', live: live, hideLiveBadge: true })) : (_jsx(View, { style: [{ width: 28 }] })), _jsx(SettingsList.ItemText, { children: sanitizeHandle(account.handle, '@') }), pendingDid === account.did && _jsx(SettingsList.ItemIcon, { icon: Loader })] }), !pendingDid && (_jsxs(Menu.Root, { children: [_jsx(Menu.Trigger, { label: _(msg `Account options`), children: ({ props, state }) => (_jsx(Pressable, { ...props, style: [
                                a.absolute,
                                { top: 10, right: tokens.space.lg },
                                a.p_xs,
                                a.rounded_full,
                                (state.hovered || state.pressed) && t.atoms.bg_contrast_25,
                            ], children: _jsx(DotsHorizontal, { size: "md", style: t.atoms.text }) })) }), _jsx(Menu.Outer, { showCancel: true, children: _jsxs(Menu.Item, { label: _(msg `Remove account`), onPress: () => removePromptControl.open(), children: [_jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Remove account" }) }), _jsx(Menu.ItemIcon, { icon: PersonXIcon })] }) })] })), _jsx(Prompt.Basic, { control: removePromptControl, title: _(msg `Remove from quick access?`), description: _(msg `This will remove @${account.handle} from the quick access list.`), onConfirm: () => {
                    removeAccount(account);
                    Toast.show(_(msg `Account removed from quick access`));
                }, confirmButtonCta: _(msg `Remove`), confirmButtonColor: "negative" })] }));
}
//# sourceMappingURL=Settings.js.map