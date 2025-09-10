import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo } from 'react';
import { View } from 'react-native';
import {} from '@atproto/api';
import {} from '@atproto/api/dist/client/types/app/bsky/notification/defs';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { logger } from '#/logger';
import { useNotificationSettingsUpdateMutation } from '#/state/queries/notifications/settings';
import { atoms as a, platform, useTheme } from '#/alf';
import * as Toggle from '#/components/forms/Toggle';
import { Loader } from '#/components/Loader';
import { Text } from '#/components/Typography';
import { Divider } from '../../components/SettingsList';
export function PreferenceControls({ name, syncOthers, preference, allowDisableInApp = true, }) {
    if (!preference)
        return (_jsx(View, { style: [a.w_full, a.pt_5xl, a.align_center], children: _jsx(Loader, { size: "xl" }) }));
    return (_jsx(Inner, { name: name, syncOthers: syncOthers, preference: preference, allowDisableInApp: allowDisableInApp }));
}
export function Inner({ name, syncOthers = [], preference, allowDisableInApp, }) {
    const t = useTheme();
    const { _ } = useLingui();
    const { mutate } = useNotificationSettingsUpdateMutation();
    const channels = useMemo(() => {
        const arr = [];
        if (preference.list)
            arr.push('list');
        if (preference.push)
            arr.push('push');
        return arr;
    }, [preference]);
    const onChangeChannels = (change) => {
        const newPreference = {
            ...preference,
            list: change.includes('list'),
            push: change.includes('push'),
        };
        logger.metric('activityPreference:changeChannels', {
            name,
            push: newPreference.push,
            list: newPreference.list,
        });
        mutate({
            [name]: newPreference,
            ...Object.fromEntries(syncOthers.map(key => [key, newPreference])),
        });
    };
    const onChangeFilter = ([change]) => {
        if (change !== 'all' && change !== 'follows')
            throw new Error('Invalid filter');
        const newPreference = {
            ...preference,
            include: change,
        };
        logger.metric('activityPreference:changeFilter', { name, value: change });
        mutate({
            [name]: newPreference,
            ...Object.fromEntries(syncOthers.map(key => [key, newPreference])),
        });
    };
    return (_jsxs(View, { style: [a.px_xl, a.pt_md, a.gap_sm], children: [_jsx(Toggle.Group, { type: "checkbox", label: _(msg `Select your preferred notification channels`), values: channels, onChange: onChangeChannels, children: _jsxs(View, { style: [a.gap_sm], children: [_jsxs(Toggle.Item, { label: _(msg `Receive push notifications`), name: "push", style: [
                                a.py_xs,
                                platform({
                                    native: [a.justify_between],
                                    web: [a.flex_row_reverse, a.gap_sm],
                                }),
                            ], children: [_jsx(Toggle.LabelText, { style: [t.atoms.text, a.font_normal, a.text_md, a.flex_1], children: _jsx(Trans, { children: "Push notifications" }) }), _jsx(Toggle.Platform, {})] }), allowDisableInApp && (_jsxs(Toggle.Item, { label: _(msg `Receive in-app notifications`), name: "list", style: [
                                a.py_xs,
                                platform({
                                    native: [a.justify_between],
                                    web: [a.flex_row_reverse, a.gap_sm],
                                }),
                            ], children: [_jsx(Toggle.LabelText, { style: [t.atoms.text, a.font_normal, a.text_md, a.flex_1], children: _jsx(Trans, { children: "In-app notifications" }) }), _jsx(Toggle.Platform, {})] }))] }) }), 'include' in preference && (_jsxs(_Fragment, { children: [_jsx(Divider, {}), _jsx(Text, { style: [a.font_bold, a.text_md], children: _jsx(Trans, { children: "From" }) }), _jsx(Toggle.Group, { type: "radio", label: _(msg `Filter who you receive notifications from`), values: [preference.include], onChange: onChangeFilter, disabled: channels.length === 0, children: _jsxs(View, { style: [a.gap_sm], children: [_jsxs(Toggle.Item, { label: _(msg `Everyone`), name: "all", style: [a.flex_row, a.py_xs, a.gap_sm], children: [_jsx(Toggle.Radio, {}), _jsx(Toggle.LabelText, { style: [
                                                channels.length > 0 && t.atoms.text,
                                                a.font_normal,
                                                a.text_md,
                                            ], children: _jsx(Trans, { children: "Everyone" }) })] }), _jsxs(Toggle.Item, { label: _(msg `People I follow`), name: "follows", style: [a.flex_row, a.py_xs, a.gap_sm], children: [_jsx(Toggle.Radio, {}), _jsx(Toggle.LabelText, { style: [
                                                channels.length > 0 && t.atoms.text,
                                                a.font_normal,
                                                a.text_md,
                                            ], children: _jsx(Trans, { children: "People I follow" }) })] })] }) })] }))] }));
}
//# sourceMappingURL=PreferenceControls.js.map