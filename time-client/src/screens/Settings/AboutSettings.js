import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo } from 'react';
import { Platform } from 'react-native';
import { setStringAsync } from 'expo-clipboard';
import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {} from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';
import { Statsig } from 'statsig-react-native-expo';
import { STATUS_PAGE_URL } from '#/lib/constants';
import {} from '#/lib/routes/types';
import { isAndroid, isIOS, isNative } from '#/platform/detection';
import * as Toast from '#/view/com/util/Toast';
import * as SettingsList from '#/screens/Settings/components/SettingsList';
import { Atom_Stroke2_Corner0_Rounded as AtomIcon } from '#/components/icons/Atom';
import { BroomSparkle_Stroke2_Corner2_Rounded as BroomSparkleIcon } from '#/components/icons/BroomSparkle';
import { CodeLines_Stroke2_Corner2_Rounded as CodeLinesIcon } from '#/components/icons/CodeLines';
import { Globe_Stroke2_Corner0_Rounded as GlobeIcon } from '#/components/icons/Globe';
import { Newspaper_Stroke2_Corner2_Rounded as NewspaperIcon } from '#/components/icons/Newspaper';
import { Wrench_Stroke2_Corner2_Rounded as WrenchIcon } from '#/components/icons/Wrench';
import * as Layout from '#/components/Layout';
import { Loader } from '#/components/Loader';
import * as env from '#/env';
import { useDemoMode } from '#/storage/hooks/demo-mode';
import { useDevMode } from '#/storage/hooks/dev-mode';
import { OTAInfo } from './components/OTAInfo';
export function AboutSettingsScreen({}) {
    const { _, i18n } = useLingui();
    const [devModeEnabled, setDevModeEnabled] = useDevMode();
    const [demoModeEnabled, setDemoModeEnabled] = useDemoMode();
    const stableID = useMemo(() => Statsig.getStableID(), []);
    const { mutate: onClearImageCache, isPending: isClearingImageCache } = useMutation({
        mutationFn: async () => {
            const freeSpaceBefore = await FileSystem.getFreeDiskStorageAsync();
            await Image.clearDiskCache();
            const freeSpaceAfter = await FileSystem.getFreeDiskStorageAsync();
            const spaceDiff = freeSpaceBefore - freeSpaceAfter;
            return spaceDiff * -1;
        },
        onSuccess: sizeDiffBytes => {
            if (isAndroid) {
                Toast.show(_(msg({
                    message: `Image cache cleared, freed ${i18n.number(Math.abs(sizeDiffBytes / 1024 / 1024), {
                        notation: 'compact',
                        style: 'unit',
                        unit: 'megabyte',
                    })}`,
                    comment: `Android-only toast message which includes amount of space freed using localized number formatting`,
                })));
            }
            else {
                Toast.show(_(msg `Image cache cleared`));
            }
        },
    });
    return (_jsxs(Layout.Screen, { children: [_jsxs(Layout.Header.Outer, { children: [_jsx(Layout.Header.BackButton, {}), _jsx(Layout.Header.Content, { children: _jsx(Layout.Header.TitleText, { children: _jsx(Trans, { children: "About" }) }) }), _jsx(Layout.Header.Slot, {})] }), _jsx(Layout.Content, { children: _jsxs(SettingsList.Container, { children: [_jsxs(SettingsList.LinkItem, { to: "https://bsky.social/about/support/tos", label: _(msg `Terms of Service`), children: [_jsx(SettingsList.ItemIcon, { icon: NewspaperIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Terms of Service" }) })] }), _jsxs(SettingsList.LinkItem, { to: "https://bsky.social/about/support/privacy-policy", label: _(msg `Privacy Policy`), children: [_jsx(SettingsList.ItemIcon, { icon: NewspaperIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Privacy Policy" }) })] }), _jsxs(SettingsList.LinkItem, { to: STATUS_PAGE_URL, label: _(msg `Status Page`), children: [_jsx(SettingsList.ItemIcon, { icon: GlobeIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Status Page" }) })] }), _jsx(SettingsList.Divider, {}), _jsxs(SettingsList.LinkItem, { to: "/sys/log", label: _(msg `System log`), children: [_jsx(SettingsList.ItemIcon, { icon: CodeLinesIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "System log" }) })] }), isNative && (_jsxs(SettingsList.PressableItem, { onPress: () => onClearImageCache(), label: _(msg `Clear image cache`), disabled: isClearingImageCache, children: [_jsx(SettingsList.ItemIcon, { icon: BroomSparkleIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Clear image cache" }) }), isClearingImageCache && _jsx(SettingsList.ItemIcon, { icon: Loader })] })), _jsxs(SettingsList.PressableItem, { label: _(msg `Version ${env.APP_VERSION}`), accessibilityHint: _(msg `Copies build version to clipboard`), onLongPress: () => {
                                const newDevModeEnabled = !devModeEnabled;
                                setDevModeEnabled(newDevModeEnabled);
                                Toast.show(newDevModeEnabled
                                    ? _(msg({
                                        message: 'Developer mode enabled',
                                        context: 'toast',
                                    }))
                                    : _(msg({
                                        message: 'Developer mode disabled',
                                        context: 'toast',
                                    })));
                            }, onPress: () => {
                                setStringAsync(`Build version: ${env.APP_VERSION}; Bundle info: ${env.APP_METADATA}; Bundle date: ${env.BUNDLE_DATE}; Platform: ${Platform.OS}; Platform version: ${Platform.Version}; Anonymous ID: ${stableID}`);
                                Toast.show(_(msg `Copied build version to clipboard`));
                            }, children: [_jsx(SettingsList.ItemIcon, { icon: WrenchIcon }), _jsx(SettingsList.ItemText, { children: _jsxs(Trans, { children: ["Version ", env.APP_VERSION] }) }), _jsx(SettingsList.BadgeText, { children: env.APP_METADATA })] }), devModeEnabled && (_jsxs(_Fragment, { children: [_jsx(OTAInfo, {}), isIOS && (_jsxs(SettingsList.PressableItem, { onPress: () => {
                                        const newDemoModeEnabled = !demoModeEnabled;
                                        setDemoModeEnabled(newDemoModeEnabled);
                                        Toast.show('Demo mode ' +
                                            (newDemoModeEnabled ? 'enabled' : 'disabled'));
                                    }, label: demoModeEnabled ? 'Disable demo mode' : 'Enable demo mode', disabled: isClearingImageCache, children: [_jsx(SettingsList.ItemIcon, { icon: AtomIcon }), _jsx(SettingsList.ItemText, { children: demoModeEnabled ? 'Disable demo mode' : 'Enable demo mode' })] }))] }))] }) })] }));
}
//# sourceMappingURL=AboutSettings.js.map