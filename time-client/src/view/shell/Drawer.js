import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, {} from 'react';
import { Linking, ScrollView, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { msg, Plural, plural, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { StackActions, useNavigation } from '@react-navigation/native';
import { useActorStatus } from '#/lib/actor-status';
import { FEEDBACK_FORM_URL, HELP_DESK_URL } from '#/lib/constants';
import {} from '#/lib/custom-animations/PressableScale';
import { useNavigationTabState } from '#/lib/hooks/useNavigationTabState';
import { getTabState, TabState } from '#/lib/routes/helpers';
import {} from '#/lib/routes/types';
import { sanitizeHandle } from '#/lib/strings/handles';
import { colors } from '#/lib/styles';
import { isWeb } from '#/platform/detection';
import { emitSoftReset } from '#/state/events';
import { useKawaiiMode } from '#/state/preferences/kawaii';
import { useUnreadNotifications } from '#/state/queries/notifications/unread';
import { useProfileQuery } from '#/state/queries/profile';
import { useSession } from '#/state/session';
import { useSetDrawerOpen } from '#/state/shell';
import { formatCount } from '#/view/com/util/numeric/format';
import { UserAvatar } from '#/view/com/util/UserAvatar';
import { NavSignupCard } from '#/view/shell/NavSignupCard';
import { atoms as a, tokens, useTheme, web } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import { Divider } from '#/components/Divider';
import { Bell_Filled_Corner0_Rounded as BellFilled, Bell_Stroke2_Corner0_Rounded as Bell, } from '#/components/icons/Bell';
import { Bookmark, BookmarkFilled } from '#/components/icons/Bookmark';
import { BulletList_Stroke2_Corner0_Rounded as List } from '#/components/icons/BulletList';
import { Hashtag_Filled_Corner0_Rounded as HashtagFilled, Hashtag_Stroke2_Corner0_Rounded as Hashtag, } from '#/components/icons/Hashtag';
import { HomeOpen_Filled_Corner0_Rounded as HomeFilled, HomeOpen_Stoke2_Corner0_Rounded as Home, } from '#/components/icons/HomeOpen';
import { MagnifyingGlass_Filled_Stroke2_Corner0_Rounded as MagnifyingGlassFilled } from '#/components/icons/MagnifyingGlass';
import { MagnifyingGlass2_Stroke2_Corner0_Rounded as MagnifyingGlass } from '#/components/icons/MagnifyingGlass2';
import { Message_Stroke2_Corner0_Rounded as Message, Message_Stroke2_Corner0_Rounded_Filled as MessageFilled, } from '#/components/icons/Message';
import { SettingsGear2_Stroke2_Corner0_Rounded as Settings } from '#/components/icons/SettingsGear2';
import { UserCircle_Filled_Corner0_Rounded as UserCircleFilled, UserCircle_Stroke2_Corner0_Rounded as UserCircle, } from '#/components/icons/UserCircle';
import { InlineLinkText } from '#/components/Link';
import { Text } from '#/components/Typography';
import { useSimpleVerificationState } from '#/components/verification';
import { VerificationCheck } from '#/components/verification/VerificationCheck';
const iconWidth = 26;
let DrawerProfileCard = ({ account, onPressProfile, }) => {
    const { _, i18n } = useLingui();
    const t = useTheme();
    const { data: profile } = useProfileQuery({ did: account.did });
    const verification = useSimpleVerificationState({ profile });
    const { isActive: live } = useActorStatus(profile);
    return (_jsxs(TouchableOpacity, { testID: "profileCardButton", accessibilityLabel: _(msg `Profile`), accessibilityHint: _(msg `Navigates to your profile`), onPress: onPressProfile, style: [a.gap_sm, a.pr_lg], children: [_jsx(UserAvatar, { size: 52, avatar: profile?.avatar, 
                // See https://github.com/bluesky-social/social-app/pull/1801:
                usePlainRNImage: true, type: profile?.associated?.labeler ? 'labeler' : 'user', live: live }), _jsxs(View, { style: [a.gap_2xs], children: [_jsxs(View, { style: [a.flex_row, a.align_center, a.gap_xs, a.flex_1], children: [_jsx(Text, { emoji: true, style: [a.font_heavy, a.text_xl, a.mt_2xs, a.leading_tight], numberOfLines: 1, children: profile?.displayName || account.handle }), verification.showBadge && (_jsx(View, { style: {
                                    top: 0,
                                }, children: _jsx(VerificationCheck, { width: 16, verifier: verification.role === 'verifier' }) }))] }), _jsx(Text, { emoji: true, style: [t.atoms.text_contrast_medium, a.text_md, a.leading_tight], numberOfLines: 1, children: sanitizeHandle(account.handle, '@') })] }), _jsxs(Text, { style: [a.text_md, t.atoms.text_contrast_medium], children: [_jsxs(Trans, { children: [_jsx(Text, { style: [a.text_md, a.font_bold], children: formatCount(i18n, profile?.followersCount ?? 0) }), ' ', _jsx(Plural, { value: profile?.followersCount || 0, one: "follower", other: "followers" })] }), ' ', "\u00B7", ' ', _jsxs(Trans, { children: [_jsx(Text, { style: [a.text_md, a.font_bold], children: formatCount(i18n, profile?.followsCount ?? 0) }), ' ', _jsx(Plural, { value: profile?.followsCount || 0, one: "following", other: "following" })] })] })] }));
};
DrawerProfileCard = React.memo(DrawerProfileCard);
export { DrawerProfileCard };
let DrawerContent = ({}) => {
    const t = useTheme();
    const insets = useSafeAreaInsets();
    const setDrawerOpen = useSetDrawerOpen();
    const navigation = useNavigation();
    const { isAtHome, isAtSearch, isAtFeeds, isAtBookmarks, isAtNotifications, isAtMyProfile, isAtMessages, } = useNavigationTabState();
    const { hasSession, currentAccount } = useSession();
    // events
    // =
    const onPressTab = React.useCallback((tab) => {
        const state = navigation.getState();
        setDrawerOpen(false);
        if (isWeb) {
            // hack because we have flat navigator for web and MyProfile does not exist on the web navigator -ansh
            if (tab === 'MyProfile') {
                navigation.navigate('Profile', { name: currentAccount.handle });
            }
            else {
                // @ts-expect-error struggles with string unions, apparently
                navigation.navigate(tab);
            }
        }
        else {
            const tabState = getTabState(state, tab);
            if (tabState === TabState.InsideAtRoot) {
                emitSoftReset();
            }
            else if (tabState === TabState.Inside) {
                // find the correct navigator in which to pop-to-top
                const target = state.routes.find(route => route.name === `${tab}Tab`)
                    ?.state?.key;
                if (target) {
                    // if we found it, trigger pop-to-top
                    navigation.dispatch({
                        ...StackActions.popToTop(),
                        target,
                    });
                }
                else {
                    // fallback: reset navigation
                    navigation.reset({
                        index: 0,
                        routes: [{ name: `${tab}Tab` }],
                    });
                }
            }
            else {
                navigation.navigate(`${tab}Tab`);
            }
        }
    }, [navigation, setDrawerOpen, currentAccount]);
    const onPressHome = React.useCallback(() => onPressTab('Home'), [onPressTab]);
    const onPressSearch = React.useCallback(() => onPressTab('Search'), [onPressTab]);
    const onPressMessages = React.useCallback(() => onPressTab('Messages'), [onPressTab]);
    const onPressNotifications = React.useCallback(() => onPressTab('Notifications'), [onPressTab]);
    const onPressProfile = React.useCallback(() => {
        onPressTab('MyProfile');
    }, [onPressTab]);
    const onPressMyFeeds = React.useCallback(() => {
        navigation.navigate('Feeds');
        setDrawerOpen(false);
    }, [navigation, setDrawerOpen]);
    const onPressLists = React.useCallback(() => {
        navigation.navigate('Lists');
        setDrawerOpen(false);
    }, [navigation, setDrawerOpen]);
    const onPressBookmarks = React.useCallback(() => {
        navigation.navigate('Bookmarks');
        setDrawerOpen(false);
    }, [navigation, setDrawerOpen]);
    const onPressSettings = React.useCallback(() => {
        navigation.navigate('Settings');
        setDrawerOpen(false);
    }, [navigation, setDrawerOpen]);
    const onPressFeedback = React.useCallback(() => {
        Linking.openURL(FEEDBACK_FORM_URL({
            email: currentAccount?.email,
            handle: currentAccount?.handle,
        }));
    }, [currentAccount]);
    const onPressHelp = React.useCallback(() => {
        Linking.openURL(HELP_DESK_URL);
    }, []);
    // rendering
    // =
    return (_jsxs(View, { testID: "drawer", style: [a.flex_1, a.border_r, t.atoms.bg, t.atoms.border_contrast_low], children: [_jsxs(ScrollView, { style: [a.flex_1], contentContainerStyle: [
                    {
                        paddingTop: Math.max(insets.top + a.pt_xl.paddingTop, a.pt_xl.paddingTop),
                    },
                ], children: [_jsxs(View, { style: [a.px_xl], children: [hasSession && currentAccount ? (_jsx(DrawerProfileCard, { account: currentAccount, onPressProfile: onPressProfile })) : (_jsx(View, { style: [a.pr_xl], children: _jsx(NavSignupCard, {}) })), _jsx(Divider, { style: [a.mt_xl, a.mb_sm] })] }), hasSession ? (_jsxs(_Fragment, { children: [_jsx(SearchMenuItem, { isActive: isAtSearch, onPress: onPressSearch }), _jsx(HomeMenuItem, { isActive: isAtHome, onPress: onPressHome }), _jsx(ChatMenuItem, { isActive: isAtMessages, onPress: onPressMessages }), _jsx(NotificationsMenuItem, { isActive: isAtNotifications, onPress: onPressNotifications }), _jsx(FeedsMenuItem, { isActive: isAtFeeds, onPress: onPressMyFeeds }), _jsx(ListsMenuItem, { onPress: onPressLists }), _jsx(BookmarksMenuItem, { isActive: isAtBookmarks, onPress: onPressBookmarks }), _jsx(ProfileMenuItem, { isActive: isAtMyProfile, onPress: onPressProfile }), _jsx(SettingsMenuItem, { onPress: onPressSettings })] })) : (_jsxs(_Fragment, { children: [_jsx(HomeMenuItem, { isActive: isAtHome, onPress: onPressHome }), _jsx(FeedsMenuItem, { isActive: isAtFeeds, onPress: onPressMyFeeds }), _jsx(SearchMenuItem, { isActive: isAtSearch, onPress: onPressSearch })] })), _jsxs(View, { style: [a.px_xl], children: [_jsx(Divider, { style: [a.mb_xl, a.mt_sm] }), _jsx(ExtraLinks, {})] })] }), _jsx(DrawerFooter, { onPressFeedback: onPressFeedback, onPressHelp: onPressHelp })] }));
};
DrawerContent = React.memo(DrawerContent);
export { DrawerContent };
let DrawerFooter = ({ onPressFeedback, onPressHelp, }) => {
    const { _ } = useLingui();
    const insets = useSafeAreaInsets();
    return (_jsxs(View, { style: [
            a.flex_row,
            a.gap_sm,
            a.flex_wrap,
            a.pl_xl,
            a.pt_md,
            {
                paddingBottom: Math.max(insets.bottom + tokens.space.xs, tokens.space.xl),
            },
        ], children: [_jsxs(Button, { label: _(msg `Send feedback`), size: "small", variant: "solid", color: "secondary", onPress: onPressFeedback, children: [_jsx(ButtonIcon, { icon: Message, position: "left" }), _jsx(ButtonText, { children: _jsx(Trans, { children: "Feedback" }) })] }), _jsx(Button, { label: _(msg `Get help`), size: "small", variant: "outline", color: "secondary", onPress: onPressHelp, style: {
                    backgroundColor: 'transparent',
                }, children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Help" }) }) })] }));
};
DrawerFooter = React.memo(DrawerFooter);
let SearchMenuItem = ({ isActive, onPress, }) => {
    const { _ } = useLingui();
    const t = useTheme();
    return (_jsx(MenuItem, { icon: isActive ? (_jsx(MagnifyingGlassFilled, { style: [t.atoms.text], width: iconWidth })) : (_jsx(MagnifyingGlass, { style: [t.atoms.text], width: iconWidth })), label: _(msg `Explore`), bold: isActive, onPress: onPress }));
};
SearchMenuItem = React.memo(SearchMenuItem);
let HomeMenuItem = ({ isActive, onPress, }) => {
    const { _ } = useLingui();
    const t = useTheme();
    return (_jsx(MenuItem, { icon: isActive ? (_jsx(HomeFilled, { style: [t.atoms.text], width: iconWidth })) : (_jsx(Home, { style: [t.atoms.text], width: iconWidth })), label: _(msg `Home`), bold: isActive, onPress: onPress }));
};
HomeMenuItem = React.memo(HomeMenuItem);
let ChatMenuItem = ({ isActive, onPress, }) => {
    const { _ } = useLingui();
    const t = useTheme();
    return (_jsx(MenuItem, { icon: isActive ? (_jsx(MessageFilled, { style: [t.atoms.text], width: iconWidth })) : (_jsx(Message, { style: [t.atoms.text], width: iconWidth })), label: _(msg `Chat`), bold: isActive, onPress: onPress }));
};
ChatMenuItem = React.memo(ChatMenuItem);
let NotificationsMenuItem = ({ isActive, onPress, }) => {
    const { _ } = useLingui();
    const t = useTheme();
    const numUnreadNotifications = useUnreadNotifications();
    return (_jsx(MenuItem, { icon: isActive ? (_jsx(BellFilled, { style: [t.atoms.text], width: iconWidth })) : (_jsx(Bell, { style: [t.atoms.text], width: iconWidth })), label: _(msg `Notifications`), accessibilityHint: numUnreadNotifications === ''
            ? ''
            : _(msg `${plural(numUnreadNotifications ?? 0, {
                one: '# unread item',
                other: '# unread items',
            })}` || ''), count: numUnreadNotifications, bold: isActive, onPress: onPress }));
};
NotificationsMenuItem = React.memo(NotificationsMenuItem);
let FeedsMenuItem = ({ isActive, onPress, }) => {
    const { _ } = useLingui();
    const t = useTheme();
    return (_jsx(MenuItem, { icon: isActive ? (_jsx(HashtagFilled, { width: iconWidth, style: [t.atoms.text] })) : (_jsx(Hashtag, { width: iconWidth, style: [t.atoms.text] })), label: _(msg `Feeds`), bold: isActive, onPress: onPress }));
};
FeedsMenuItem = React.memo(FeedsMenuItem);
let ListsMenuItem = ({ onPress }) => {
    const { _ } = useLingui();
    const t = useTheme();
    return (_jsx(MenuItem, { icon: _jsx(List, { style: [t.atoms.text], width: iconWidth }), label: _(msg `Lists`), onPress: onPress }));
};
ListsMenuItem = React.memo(ListsMenuItem);
let BookmarksMenuItem = ({ isActive, onPress, }) => {
    const { _ } = useLingui();
    const t = useTheme();
    return (_jsx(MenuItem, { icon: isActive ? (_jsx(BookmarkFilled, { style: [t.atoms.text], width: iconWidth })) : (_jsx(Bookmark, { style: [t.atoms.text], width: iconWidth })), label: _(msg({ message: 'Saved', context: 'link to bookmarks screen' })), onPress: onPress }));
};
BookmarksMenuItem = React.memo(BookmarksMenuItem);
let ProfileMenuItem = ({ isActive, onPress, }) => {
    const { _ } = useLingui();
    const t = useTheme();
    return (_jsx(MenuItem, { icon: isActive ? (_jsx(UserCircleFilled, { style: [t.atoms.text], width: iconWidth })) : (_jsx(UserCircle, { style: [t.atoms.text], width: iconWidth })), label: _(msg `Profile`), onPress: onPress }));
};
ProfileMenuItem = React.memo(ProfileMenuItem);
let SettingsMenuItem = ({ onPress }) => {
    const { _ } = useLingui();
    const t = useTheme();
    return (_jsx(MenuItem, { icon: _jsx(Settings, { style: [t.atoms.text], width: iconWidth }), label: _(msg `Settings`), onPress: onPress }));
};
SettingsMenuItem = React.memo(SettingsMenuItem);
function MenuItem({ icon, label, count, bold, onPress }) {
    const t = useTheme();
    return (_jsx(Button, { testID: `menuItemButton-${label}`, onPress: onPress, accessibilityRole: "tab", label: label, children: ({ hovered, pressed }) => (_jsxs(View, { style: [
                a.flex_1,
                a.flex_row,
                a.align_center,
                a.gap_md,
                a.py_md,
                a.px_xl,
                (hovered || pressed) && t.atoms.bg_contrast_25,
            ], children: [_jsxs(View, { style: [a.relative], children: [icon, count ? (_jsx(View, { style: [
                                a.absolute,
                                a.inset_0,
                                a.align_end,
                                { top: -4, right: a.gap_sm.gap * -1 },
                            ], children: _jsx(View, { style: [
                                    a.rounded_full,
                                    {
                                        right: count.length === 1 ? 6 : 0,
                                        paddingHorizontal: 4,
                                        paddingVertical: 1,
                                        backgroundColor: t.palette.primary_500,
                                    },
                                ], children: _jsx(Text, { style: [
                                        a.text_xs,
                                        a.leading_tight,
                                        a.font_bold,
                                        {
                                            fontVariant: ['tabular-nums'],
                                            color: colors.white,
                                        },
                                    ], numberOfLines: 1, children: count }) }) })) : undefined] }), _jsx(Text, { style: [
                        a.flex_1,
                        a.text_2xl,
                        bold && a.font_heavy,
                        web(a.leading_snug),
                    ], numberOfLines: 1, children: label })] })) }));
}
function ExtraLinks() {
    const { _ } = useLingui();
    const t = useTheme();
    const kawaii = useKawaiiMode();
    return (_jsxs(View, { style: [a.flex_col, a.gap_md, a.flex_wrap], children: [_jsx(InlineLinkText, { style: [a.text_md], label: _(msg `Terms of Service`), to: "https://bsky.social/about/support/tos", children: _jsx(Trans, { children: "Terms of Service" }) }), _jsx(InlineLinkText, { style: [a.text_md], to: "https://bsky.social/about/support/privacy-policy", label: _(msg `Privacy Policy`), children: _jsx(Trans, { children: "Privacy Policy" }) }), kawaii && (_jsx(Text, { style: t.atoms.text_contrast_medium, children: _jsxs(Trans, { children: ["Logo by", ' ', _jsx(InlineLinkText, { style: [a.text_md], to: "/profile/sawaratsuki.bsky.social", label: "@sawaratsuki.bsky.social", children: "@sawaratsuki.bsky.social" })] }) }))] }));
}
//# sourceMappingURL=Drawer.js.map