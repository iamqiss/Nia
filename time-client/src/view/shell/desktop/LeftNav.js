import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {} from '@atproto/api';
import { msg, plural, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { useActorStatus } from '#/lib/actor-status';
import { useAccountSwitcher } from '#/lib/hooks/useAccountSwitcher';
import { useOpenComposer } from '#/lib/hooks/useOpenComposer';
import { usePalette } from '#/lib/hooks/usePalette';
import { useWebMediaQueries } from '#/lib/hooks/useWebMediaQueries';
import { getCurrentRoute, isTab } from '#/lib/routes/helpers';
import { makeProfileLink } from '#/lib/routes/links';
import {} from '#/lib/routes/types';
import { useGate } from '#/lib/statsig/statsig';
import { sanitizeDisplayName } from '#/lib/strings/display-names';
import { isInvalidHandle, sanitizeHandle } from '#/lib/strings/handles';
import { emitSoftReset } from '#/state/events';
import { useHomeBadge } from '#/state/home-badge';
import { useFetchHandle } from '#/state/queries/handle';
import { useUnreadMessageCount } from '#/state/queries/messages/list-conversations';
import { useUnreadNotifications } from '#/state/queries/notifications/unread';
import { useProfilesQuery } from '#/state/queries/profile';
import { useSession, useSessionApi } from '#/state/session';
import { useLoggedOutViewControls } from '#/state/shell/logged-out';
import { useCloseAllActiveElements } from '#/state/util';
import { LoadingPlaceholder } from '#/view/com/util/LoadingPlaceholder';
import { PressableWithHover } from '#/view/com/util/PressableWithHover';
import { UserAvatar } from '#/view/com/util/UserAvatar';
import { NavSignupCard } from '#/view/shell/NavSignupCard';
import { atoms as a, tokens, useLayoutBreakpoints, useTheme, web } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import {} from '#/components/Dialog';
import { ArrowBoxLeft_Stroke2_Corner0_Rounded as LeaveIcon } from '#/components/icons/ArrowBoxLeft';
import { Bell_Filled_Corner0_Rounded as BellFilled, Bell_Stroke2_Corner0_Rounded as Bell, } from '#/components/icons/Bell';
import { Bookmark, BookmarkFilled } from '#/components/icons/Bookmark';
import { BulletList_Filled_Corner0_Rounded as ListFilled, BulletList_Stroke2_Corner0_Rounded as List, } from '#/components/icons/BulletList';
import { DotGrid_Stroke2_Corner0_Rounded as EllipsisIcon } from '#/components/icons/DotGrid';
import { EditBig_Stroke2_Corner0_Rounded as EditBig } from '#/components/icons/EditBig';
import { Hashtag_Filled_Corner0_Rounded as HashtagFilled, Hashtag_Stroke2_Corner0_Rounded as Hashtag, } from '#/components/icons/Hashtag';
import { HomeOpen_Filled_Corner0_Rounded as HomeFilled, HomeOpen_Stoke2_Corner0_Rounded as Home, } from '#/components/icons/HomeOpen';
import { MagnifyingGlass_Filled_Stroke2_Corner0_Rounded as MagnifyingGlassFilled } from '#/components/icons/MagnifyingGlass';
import { MagnifyingGlass2_Stroke2_Corner0_Rounded as MagnifyingGlass } from '#/components/icons/MagnifyingGlass2';
import { Message_Stroke2_Corner0_Rounded as Message, Message_Stroke2_Corner0_Rounded_Filled as MessageFilled, } from '#/components/icons/Message';
import { PlusLarge_Stroke2_Corner0_Rounded as PlusIcon } from '#/components/icons/Plus';
import { SettingsGear2_Filled_Corner0_Rounded as SettingsFilled, SettingsGear2_Stroke2_Corner0_Rounded as Settings, } from '#/components/icons/SettingsGear2';
import { UserCircle_Filled_Corner0_Rounded as UserCircleFilled, UserCircle_Stroke2_Corner0_Rounded as UserCircle, } from '#/components/icons/UserCircle';
import { CENTER_COLUMN_OFFSET } from '#/components/Layout';
import * as Menu from '#/components/Menu';
import * as Prompt from '#/components/Prompt';
import { Text } from '#/components/Typography';
import { PlatformInfo } from '../../../../modules/expo-bluesky-swiss-army';
import { router } from '../../../routes';
const NAV_ICON_WIDTH = 28;
function ProfileCard() {
    const { currentAccount, accounts } = useSession();
    const { logoutEveryAccount } = useSessionApi();
    const { isLoading, data } = useProfilesQuery({
        handles: accounts.map(acc => acc.did),
    });
    const profiles = data?.profiles;
    const signOutPromptControl = Prompt.usePromptControl();
    const { leftNavMinimal } = useLayoutBreakpoints();
    const { _ } = useLingui();
    const t = useTheme();
    const size = 48;
    const profile = profiles?.find(p => p.did === currentAccount.did);
    const otherAccounts = accounts
        .filter(acc => acc.did !== currentAccount.did)
        .map(account => ({
        account,
        profile: profiles?.find(p => p.did === account.did),
    }));
    const { isActive: live } = useActorStatus(profile);
    return (_jsxs(View, { style: [a.my_md, !leftNavMinimal && [a.w_full, a.align_start]], children: [!isLoading && profile ? (_jsxs(Menu.Root, { children: [_jsx(Menu.Trigger, { label: _(msg `Switch accounts`), children: ({ props, state, control }) => {
                            const active = state.hovered || state.focused || control.isOpen;
                            return (_jsxs(Button, { label: props.accessibilityLabel, ...props, style: [
                                    a.w_full,
                                    a.transition_color,
                                    active ? t.atoms.bg_contrast_25 : a.transition_delay_50ms,
                                    a.rounded_full,
                                    a.justify_between,
                                    a.align_center,
                                    a.flex_row,
                                    { gap: 6 },
                                    !leftNavMinimal && [a.pl_lg, a.pr_md],
                                ], children: [_jsx(View, { style: [
                                            !PlatformInfo.getIsReducedMotionEnabled() && [
                                                a.transition_transform,
                                                { transitionDuration: '250ms' },
                                                !active && a.transition_delay_50ms,
                                            ],
                                            a.relative,
                                            a.z_10,
                                            active && {
                                                transform: [
                                                    { scale: !leftNavMinimal ? 2 / 3 : 0.8 },
                                                    { translateX: !leftNavMinimal ? -22 : 0 },
                                                ],
                                            },
                                        ], children: _jsx(UserAvatar, { avatar: profile.avatar, size: size, type: profile?.associated?.labeler ? 'labeler' : 'user', live: live }) }), !leftNavMinimal && (_jsxs(_Fragment, { children: [_jsxs(View, { style: [
                                                    a.flex_1,
                                                    a.transition_opacity,
                                                    !active && a.transition_delay_50ms,
                                                    {
                                                        marginLeft: tokens.space.xl * -1,
                                                        opacity: active ? 1 : 0,
                                                    },
                                                ], children: [_jsx(Text, { style: [a.font_heavy, a.text_sm, a.leading_snug], numberOfLines: 1, children: sanitizeDisplayName(profile.displayName || profile.handle) }), _jsx(Text, { style: [
                                                            a.text_xs,
                                                            a.leading_snug,
                                                            t.atoms.text_contrast_medium,
                                                        ], numberOfLines: 1, children: sanitizeHandle(profile.handle, '@') })] }), _jsx(EllipsisIcon, { "aria-hidden": true, style: [
                                                    t.atoms.text_contrast_medium,
                                                    a.transition_opacity,
                                                    { opacity: active ? 1 : 0 },
                                                ], size: "sm" })] }))] }));
                        } }), _jsx(SwitchMenuItems, { accounts: otherAccounts, signOutPromptControl: signOutPromptControl })] })) : (_jsx(LoadingPlaceholder, { width: size, height: size, style: [{ borderRadius: size }, !leftNavMinimal && a.ml_lg] })), _jsx(Prompt.Basic, { control: signOutPromptControl, title: _(msg `Sign out?`), description: _(msg `You will be signed out of all your accounts.`), onConfirm: () => logoutEveryAccount('Settings'), confirmButtonCta: _(msg `Sign out`), cancelButtonCta: _(msg `Cancel`), confirmButtonColor: "negative" })] }));
}
function SwitchMenuItems({ accounts, signOutPromptControl, }) {
    const { _ } = useLingui();
    const { setShowLoggedOut } = useLoggedOutViewControls();
    const closeEverything = useCloseAllActiveElements();
    const onAddAnotherAccount = () => {
        setShowLoggedOut(true);
        closeEverything();
    };
    return (_jsxs(Menu.Outer, { children: [accounts && accounts.length > 0 && (_jsxs(_Fragment, { children: [_jsxs(Menu.Group, { children: [_jsx(Menu.LabelText, { children: _jsx(Trans, { children: "Switch account" }) }), accounts.map(other => (_jsx(SwitchMenuItem, { account: other.account, profile: other.profile }, other.account.did)))] }), _jsx(Menu.Divider, {})] })), _jsx(SwitcherMenuProfileLink, {}), _jsxs(Menu.Item, { label: _(msg `Add another account`), onPress: onAddAnotherAccount, children: [_jsx(Menu.ItemIcon, { icon: PlusIcon }), _jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Add another account" }) })] }), _jsxs(Menu.Item, { label: _(msg `Sign out`), onPress: signOutPromptControl.open, children: [_jsx(Menu.ItemIcon, { icon: LeaveIcon }), _jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Sign out" }) })] })] }));
}
function SwitcherMenuProfileLink() {
    const { _ } = useLingui();
    const { currentAccount } = useSession();
    const navigation = useNavigation();
    const context = Menu.useMenuContext();
    const profileLink = currentAccount ? makeProfileLink(currentAccount) : '/';
    const [pathName] = useMemo(() => router.matchPath(profileLink), [profileLink]);
    const currentRouteInfo = useNavigationState(state => {
        if (!state) {
            return { name: 'Home' };
        }
        return getCurrentRoute(state);
    });
    let isCurrent = currentRouteInfo.name === 'Profile'
        ? isTab(currentRouteInfo.name, pathName) &&
            currentRouteInfo.params.name ===
                currentAccount?.handle
        : isTab(currentRouteInfo.name, pathName);
    const onProfilePress = useCallback((e) => {
        if (e.ctrlKey || e.metaKey || e.altKey) {
            return;
        }
        e.preventDefault();
        context.control.close();
        if (isCurrent) {
            emitSoftReset();
        }
        else {
            const [screen, params] = router.matchPath(profileLink);
            // @ts-expect-error TODO: type matchPath well enough that it can be plugged into navigation.navigate directly
            navigation.navigate(screen, params, { pop: true });
        }
    }, [navigation, profileLink, isCurrent, context]);
    return (_jsxs(Menu.Item, { label: _(msg `Go to profile`), 
        // @ts-expect-error The function signature differs on web -inb
        onPress: onProfilePress, href: profileLink, children: [_jsx(Menu.ItemIcon, { icon: UserCircle }), _jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Go to profile" }) })] }));
}
function SwitchMenuItem({ account, profile, }) {
    const { _ } = useLingui();
    const { onPressSwitchAccount, pendingDid } = useAccountSwitcher();
    const { isActive: live } = useActorStatus(profile);
    return (_jsxs(Menu.Item, { disabled: !!pendingDid, style: [a.gap_sm, { minWidth: 150 }], label: _(msg `Switch to ${sanitizeHandle(profile?.handle ?? account.handle, '@')}`), onPress: () => onPressSwitchAccount(account, 'SwitchAccount'), children: [_jsx(View, { children: _jsx(UserAvatar, { avatar: profile?.avatar, size: 20, type: profile?.associated?.labeler ? 'labeler' : 'user', live: live, hideLiveBadge: true }) }), _jsx(Menu.ItemText, { children: sanitizeHandle(profile?.handle ?? account.handle, '@') })] }, account.did));
}
function NavItem({ count, hasNew, href, icon, iconFilled, label }) {
    const t = useTheme();
    const { _ } = useLingui();
    const { currentAccount } = useSession();
    const { leftNavMinimal } = useLayoutBreakpoints();
    const [pathName] = useMemo(() => router.matchPath(href), [href]);
    const currentRouteInfo = useNavigationState(state => {
        if (!state) {
            return { name: 'Home' };
        }
        return getCurrentRoute(state);
    });
    let isCurrent = currentRouteInfo.name === 'Profile'
        ? isTab(currentRouteInfo.name, pathName) &&
            currentRouteInfo.params.name ===
                currentAccount?.handle
        : isTab(currentRouteInfo.name, pathName);
    const navigation = useNavigation();
    const onPressWrapped = useCallback((e) => {
        if (e.ctrlKey || e.metaKey || e.altKey) {
            return;
        }
        e.preventDefault();
        if (isCurrent) {
            emitSoftReset();
        }
        else {
            const [screen, params] = router.matchPath(href);
            // @ts-expect-error TODO: type matchPath well enough that it can be plugged into navigation.navigate directly
            navigation.navigate(screen, params, { pop: true });
        }
    }, [navigation, href, isCurrent]);
    return (_jsxs(PressableWithHover, { style: [
            a.flex_row,
            a.align_center,
            a.p_md,
            a.rounded_sm,
            a.gap_sm,
            a.outline_inset_1,
            a.transition_color,
        ], hoverStyle: t.atoms.bg_contrast_25, 
        // @ts-expect-error the function signature differs on web -prf
        onPress: onPressWrapped, href: href, dataSet: { noUnderline: 1 }, role: "link", accessibilityLabel: label, accessibilityHint: "", children: [_jsxs(View, { style: [
                    a.align_center,
                    a.justify_center,
                    a.z_10,
                    {
                        width: 24,
                        height: 24,
                    },
                    leftNavMinimal && {
                        width: 40,
                        height: 40,
                    },
                ], children: [isCurrent ? iconFilled : icon, typeof count === 'string' && count ? (_jsx(View, { style: [
                            a.absolute,
                            a.inset_0,
                            { right: -20 }, // more breathing room
                        ], children: _jsx(Text, { accessibilityLabel: _(msg `${plural(count, {
                                one: '# unread item',
                                other: '# unread items',
                            })}`), accessibilityHint: "", accessible: true, numberOfLines: 1, style: [
                                a.absolute,
                                a.text_xs,
                                a.font_bold,
                                a.rounded_full,
                                a.text_center,
                                a.leading_tight,
                                {
                                    top: '-10%',
                                    left: count.length === 1 ? 12 : 8,
                                    backgroundColor: t.palette.primary_500,
                                    color: t.palette.white,
                                    lineHeight: a.text_sm.fontSize,
                                    paddingHorizontal: 4,
                                    paddingVertical: 1,
                                    minWidth: 16,
                                },
                                leftNavMinimal && [
                                    {
                                        top: '10%',
                                        left: count.length === 1 ? 20 : 16,
                                    },
                                ],
                            ], children: count }) })) : hasNew ? (_jsx(View, { style: [
                            a.absolute,
                            a.rounded_full,
                            {
                                backgroundColor: t.palette.primary_500,
                                width: 8,
                                height: 8,
                                right: -2,
                                top: -4,
                            },
                            leftNavMinimal && {
                                right: 4,
                                top: 2,
                            },
                        ] })) : null] }), !leftNavMinimal && (_jsx(Text, { style: [a.text_xl, isCurrent ? a.font_heavy : a.font_normal], children: label }))] }));
}
function ComposeBtn() {
    const { currentAccount } = useSession();
    const { getState } = useNavigation();
    const { openComposer } = useOpenComposer();
    const { _ } = useLingui();
    const { leftNavMinimal } = useLayoutBreakpoints();
    const [isFetchingHandle, setIsFetchingHandle] = useState(false);
    const fetchHandle = useFetchHandle();
    const getProfileHandle = async () => {
        const routes = getState()?.routes;
        const currentRoute = routes?.[routes?.length - 1];
        if (currentRoute?.name === 'Profile') {
            let handle = currentRoute.params.name;
            if (handle.startsWith('did:')) {
                try {
                    setIsFetchingHandle(true);
                    handle = await fetchHandle(handle);
                }
                catch (e) {
                    handle = undefined;
                }
                finally {
                    setIsFetchingHandle(false);
                }
            }
            if (!handle ||
                handle === currentAccount?.handle ||
                isInvalidHandle(handle))
                return undefined;
            return handle;
        }
        return undefined;
    };
    const onPressCompose = async () => openComposer({ mention: await getProfileHandle() });
    if (leftNavMinimal) {
        return null;
    }
    return (_jsx(View, { style: [a.flex_row, a.pl_md, a.pt_xl], children: _jsxs(Button, { disabled: isFetchingHandle, label: _(msg `Compose new post`), onPress: onPressCompose, size: "large", variant: "solid", color: "primary", style: [a.rounded_full], children: [_jsx(ButtonIcon, { icon: EditBig, position: "left" }), _jsx(ButtonText, { children: _jsx(Trans, { context: "action", children: "New Post" }) })] }) }));
}
function ChatNavItem() {
    const pal = usePalette('default');
    const { _ } = useLingui();
    const numUnreadMessages = useUnreadMessageCount();
    return (_jsx(NavItem, { href: "/messages", count: numUnreadMessages.numUnread, hasNew: numUnreadMessages.hasNew, icon: _jsx(Message, { style: pal.text, "aria-hidden": true, width: NAV_ICON_WIDTH }), iconFilled: _jsx(MessageFilled, { style: pal.text, "aria-hidden": true, width: NAV_ICON_WIDTH }), label: _(msg `Chat`) }));
}
export function DesktopLeftNav() {
    const { hasSession, currentAccount } = useSession();
    const pal = usePalette('default');
    const { _ } = useLingui();
    const { isDesktop } = useWebMediaQueries();
    const { leftNavMinimal, centerColumnOffset } = useLayoutBreakpoints();
    const numUnreadNotifications = useUnreadNotifications();
    const hasHomeBadge = useHomeBadge();
    const gate = useGate();
    if (!hasSession && !isDesktop) {
        return null;
    }
    return (_jsxs(View, { role: "navigation", style: [
            a.px_xl,
            styles.leftNav,
            leftNavMinimal && styles.leftNavMinimal,
            {
                transform: [
                    {
                        translateX: -300 + (centerColumnOffset ? CENTER_COLUMN_OFFSET : 0),
                    },
                    { translateX: '-100%' },
                    ...a.scrollbar_offset.transform,
                ],
            },
        ], children: [hasSession ? (_jsx(ProfileCard, {})) : !leftNavMinimal ? (_jsx(View, { style: [a.pt_xl], children: _jsx(NavSignupCard, {}) })) : null, hasSession && (_jsxs(_Fragment, { children: [_jsx(NavItem, { href: "/", hasNew: hasHomeBadge && gate('remove_show_latest_button'), icon: _jsx(Home, { "aria-hidden": true, width: NAV_ICON_WIDTH, style: pal.text }), iconFilled: _jsx(HomeFilled, { "aria-hidden": true, width: NAV_ICON_WIDTH, style: pal.text }), label: _(msg `Home`) }), _jsx(NavItem, { href: "/search", icon: _jsx(MagnifyingGlass, { style: pal.text, "aria-hidden": true, width: NAV_ICON_WIDTH }), iconFilled: _jsx(MagnifyingGlassFilled, { style: pal.text, "aria-hidden": true, width: NAV_ICON_WIDTH }), label: _(msg `Explore`) }), _jsx(NavItem, { href: "/notifications", count: numUnreadNotifications, icon: _jsx(Bell, { "aria-hidden": true, width: NAV_ICON_WIDTH, style: pal.text }), iconFilled: _jsx(BellFilled, { "aria-hidden": true, width: NAV_ICON_WIDTH, style: pal.text }), label: _(msg `Notifications`) }), _jsx(ChatNavItem, {}), _jsx(NavItem, { href: "/feeds", icon: _jsx(Hashtag, { style: pal.text, "aria-hidden": true, width: NAV_ICON_WIDTH }), iconFilled: _jsx(HashtagFilled, { style: pal.text, "aria-hidden": true, width: NAV_ICON_WIDTH }), label: _(msg `Feeds`) }), _jsx(NavItem, { href: "/lists", icon: _jsx(List, { style: pal.text, "aria-hidden": true, width: NAV_ICON_WIDTH }), iconFilled: _jsx(ListFilled, { style: pal.text, "aria-hidden": true, width: NAV_ICON_WIDTH }), label: _(msg `Lists`) }), _jsx(NavItem, { href: "/saved", icon: _jsx(Bookmark, { style: pal.text, "aria-hidden": true, width: NAV_ICON_WIDTH }), iconFilled: _jsx(BookmarkFilled, { style: pal.text, "aria-hidden": true, width: NAV_ICON_WIDTH }), label: _(msg({
                            message: 'Saved',
                            context: 'link to bookmarks screen',
                        })) }), _jsx(NavItem, { href: currentAccount ? makeProfileLink(currentAccount) : '/', icon: _jsx(UserCircle, { "aria-hidden": true, width: NAV_ICON_WIDTH, style: pal.text }), iconFilled: _jsx(UserCircleFilled, { "aria-hidden": true, width: NAV_ICON_WIDTH, style: pal.text }), label: _(msg `Profile`) }), _jsx(NavItem, { href: "/settings", icon: _jsx(Settings, { "aria-hidden": true, width: NAV_ICON_WIDTH, style: pal.text }), iconFilled: _jsx(SettingsFilled, { "aria-hidden": true, width: NAV_ICON_WIDTH, style: pal.text }), label: _(msg `Settings`) }), _jsx(ComposeBtn, {})] }))] }));
}
const styles = StyleSheet.create({
    leftNav: {
        ...a.fixed,
        top: 0,
        paddingTop: 10,
        paddingBottom: 10,
        left: '50%',
        width: 240,
        // @ts-expect-error web only
        maxHeight: '100vh',
        overflowY: 'auto',
    },
    leftNavMinimal: {
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        height: '100%',
        width: 86,
        alignItems: 'center',
        ...web({ overflowX: 'hidden' }),
    },
    backBtn: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 30,
        height: 30,
    },
});
//# sourceMappingURL=LeftNav.js.map