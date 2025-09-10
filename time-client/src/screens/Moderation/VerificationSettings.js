import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { urls } from '#/lib/constants';
import { logger } from '#/logger';
import { usePreferencesQuery, } from '#/state/queries/preferences';
import { useSetVerificationPrefsMutation } from '#/state/queries/preferences';
import * as SettingsList from '#/screens/Settings/components/SettingsList';
import { atoms as a, useGutters } from '#/alf';
import { Admonition } from '#/components/Admonition';
import * as Toggle from '#/components/forms/Toggle';
import { CircleCheck_Stroke2_Corner0_Rounded as CircleCheck } from '#/components/icons/CircleCheck';
import * as Layout from '#/components/Layout';
import { InlineLinkText } from '#/components/Link';
import { Loader } from '#/components/Loader';
export function Screen() {
    const { _ } = useLingui();
    const gutters = useGutters(['base']);
    const { data: preferences } = usePreferencesQuery();
    return (_jsxs(Layout.Screen, { testID: "ModerationVerificationSettingsScreen", children: [_jsxs(Layout.Header.Outer, { children: [_jsx(Layout.Header.BackButton, {}), _jsx(Layout.Header.Content, { children: _jsx(Layout.Header.TitleText, { children: _jsx(Trans, { children: "Verification Settings" }) }) }), _jsx(Layout.Header.Slot, {})] }), _jsx(Layout.Content, { children: _jsxs(SettingsList.Container, { children: [_jsx(SettingsList.Item, { children: _jsx(Admonition, { type: "tip", style: [a.flex_1], children: _jsxs(Trans, { children: ["Verifications on Bluesky work differently than on other platforms.", ' ', _jsx(InlineLinkText, { overridePresentation: true, to: urls.website.blog.initialVerificationAnnouncement, label: _(msg({
                                                message: `Learn more`,
                                                context: `english-only-resource`,
                                            })), onPress: () => {
                                                logger.metric('verification:learn-more', {
                                                    location: 'verificationSettings',
                                                }, { statsig: true });
                                            }, children: "Learn more here." })] }) }) }), preferences ? (_jsx(Inner, { preferences: preferences })) : (_jsx(View, { style: [gutters, a.justify_center, a.align_center], children: _jsx(Loader, { size: "xl" }) }))] }) })] }));
}
function Inner({ preferences }) {
    const { _ } = useLingui();
    const { hideBadges } = preferences.verificationPrefs;
    const { mutate: setVerificationPrefs, isPending } = useSetVerificationPrefsMutation();
    return (_jsx(Toggle.Item, { type: "checkbox", name: "hideBadges", label: _(msg `Hide verification badges`), value: hideBadges, disabled: isPending, onChange: value => {
            setVerificationPrefs({ hideBadges: value });
        }, children: _jsxs(SettingsList.Item, { children: [_jsx(SettingsList.ItemIcon, { icon: CircleCheck }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Hide verification badges" }) }), _jsx(Toggle.Platform, {})] }) }));
}
//# sourceMappingURL=VerificationSettings.js.map