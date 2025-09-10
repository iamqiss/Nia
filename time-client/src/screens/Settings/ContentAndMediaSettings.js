import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {} from '@react-navigation/native-stack';
import {} from '#/lib/routes/types';
import { logEvent } from '#/lib/statsig/statsig';
import { isNative } from '#/platform/detection';
import { useAutoplayDisabled, useSetAutoplayDisabled } from '#/state/preferences';
import { useInAppBrowser, useSetInAppBrowser, } from '#/state/preferences/in-app-browser';
import { useTrendingSettings, useTrendingSettingsApi, } from '#/state/preferences/trending';
import { useTrendingConfig } from '#/state/service-config';
import * as SettingsList from '#/screens/Settings/components/SettingsList';
import * as Toggle from '#/components/forms/Toggle';
import { Bubbles_Stroke2_Corner2_Rounded as BubblesIcon } from '#/components/icons/Bubble';
import { CircleInfo_Stroke2_Corner0_Rounded as CircleInfo } from '#/components/icons/CircleInfo';
import { Hashtag_Stroke2_Corner0_Rounded as HashtagIcon } from '#/components/icons/Hashtag';
import { Home_Stroke2_Corner2_Rounded as HomeIcon } from '#/components/icons/Home';
import { Macintosh_Stroke2_Corner2_Rounded as MacintoshIcon } from '#/components/icons/Macintosh';
import { Play_Stroke2_Corner2_Rounded as PlayIcon } from '#/components/icons/Play';
import { Trending2_Stroke2_Corner2_Rounded as Graph } from '#/components/icons/Trending';
import { Window_Stroke2_Corner2_Rounded as WindowIcon } from '#/components/icons/Window';
import * as Layout from '#/components/Layout';
export function ContentAndMediaSettingsScreen({}) {
    const { _ } = useLingui();
    const autoplayDisabledPref = useAutoplayDisabled();
    const setAutoplayDisabledPref = useSetAutoplayDisabled();
    const inAppBrowserPref = useInAppBrowser();
    const setUseInAppBrowser = useSetInAppBrowser();
    const { enabled: trendingEnabled } = useTrendingConfig();
    const { trendingDisabled, trendingVideoDisabled } = useTrendingSettings();
    const { setTrendingDisabled, setTrendingVideoDisabled } = useTrendingSettingsApi();
    return (_jsxs(Layout.Screen, { children: [_jsxs(Layout.Header.Outer, { children: [_jsx(Layout.Header.BackButton, {}), _jsx(Layout.Header.Content, { children: _jsx(Layout.Header.TitleText, { children: _jsx(Trans, { children: "Content & Media" }) }) }), _jsx(Layout.Header.Slot, {})] }), _jsx(Layout.Content, { children: _jsxs(SettingsList.Container, { children: [_jsxs(SettingsList.LinkItem, { to: "/settings/saved-feeds", label: _(msg `Manage saved feeds`), children: [_jsx(SettingsList.ItemIcon, { icon: HashtagIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Manage saved feeds" }) })] }), _jsxs(SettingsList.LinkItem, { to: "/settings/threads", label: _(msg `Thread preferences`), children: [_jsx(SettingsList.ItemIcon, { icon: BubblesIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Thread preferences" }) })] }), _jsxs(SettingsList.LinkItem, { to: "/settings/following-feed", label: _(msg `Following feed preferences`), children: [_jsx(SettingsList.ItemIcon, { icon: HomeIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Following feed preferences" }) })] }), _jsxs(SettingsList.LinkItem, { to: "/settings/external-embeds", label: _(msg `External media`), children: [_jsx(SettingsList.ItemIcon, { icon: MacintoshIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "External media" }) })] }), _jsxs(SettingsList.LinkItem, { to: "/settings/interests", label: _(msg `Your interests`), children: [_jsx(SettingsList.ItemIcon, { icon: CircleInfo }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Your interests" }) })] }), _jsx(SettingsList.Divider, {}), isNative && (_jsx(Toggle.Item, { name: "use_in_app_browser", label: _(msg `Use in-app browser to open links`), value: inAppBrowserPref ?? false, onChange: value => setUseInAppBrowser(value), children: _jsxs(SettingsList.Item, { children: [_jsx(SettingsList.ItemIcon, { icon: WindowIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Use in-app browser to open links" }) }), _jsx(Toggle.Platform, {})] }) })), _jsx(Toggle.Item, { name: "disable_autoplay", label: _(msg `Autoplay videos and GIFs`), value: !autoplayDisabledPref, onChange: value => setAutoplayDisabledPref(!value), children: _jsxs(SettingsList.Item, { children: [_jsx(SettingsList.ItemIcon, { icon: PlayIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Autoplay videos and GIFs" }) }), _jsx(Toggle.Platform, {})] }) }), trendingEnabled && (_jsxs(_Fragment, { children: [_jsx(SettingsList.Divider, {}), _jsx(Toggle.Item, { name: "show_trending_topics", label: _(msg `Enable trending topics`), value: !trendingDisabled, onChange: value => {
                                        const hide = Boolean(!value);
                                        if (hide) {
                                            logEvent('trendingTopics:hide', { context: 'settings' });
                                        }
                                        else {
                                            logEvent('trendingTopics:show', { context: 'settings' });
                                        }
                                        setTrendingDisabled(hide);
                                    }, children: _jsxs(SettingsList.Item, { children: [_jsx(SettingsList.ItemIcon, { icon: Graph }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Enable trending topics" }) }), _jsx(Toggle.Platform, {})] }) }), _jsx(Toggle.Item, { name: "show_trending_videos", label: _(msg `Enable trending videos in your Discover feed`), value: !trendingVideoDisabled, onChange: value => {
                                        const hide = Boolean(!value);
                                        if (hide) {
                                            logEvent('trendingVideos:hide', { context: 'settings' });
                                        }
                                        else {
                                            logEvent('trendingVideos:show', { context: 'settings' });
                                        }
                                        setTrendingVideoDisabled(hide);
                                    }, children: _jsxs(SettingsList.Item, { children: [_jsx(SettingsList.ItemIcon, { icon: Graph }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Enable trending videos in your Discover feed" }) }), _jsx(Toggle.Platform, {})] }) })] }))] }) })] }));
}
//# sourceMappingURL=ContentAndMediaSettings.js.map