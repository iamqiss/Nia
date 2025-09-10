import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback } from 'react';
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {} from '@react-navigation/native-stack';
import {} from '#/lib/routes/types';
import { isNative } from '#/platform/detection';
import { useUpdateActorDeclaration } from '#/state/queries/messages/actor-declaration';
import { useProfileQuery } from '#/state/queries/profile';
import { useSession } from '#/state/session';
import * as Toast from '#/view/com/util/Toast';
import { atoms as a } from '#/alf';
import { Admonition } from '#/components/Admonition';
import { Divider } from '#/components/Divider';
import * as Toggle from '#/components/forms/Toggle';
import * as Layout from '#/components/Layout';
import { Text } from '#/components/Typography';
import { useBackgroundNotificationPreferences } from '../../../modules/expo-background-notification-handler/src/BackgroundNotificationHandlerProvider';
export function MessagesSettingsScreen(props) {
    return _jsx(MessagesSettingsScreenInner, { ...props });
}
export function MessagesSettingsScreenInner({}) {
    const { _ } = useLingui();
    const { currentAccount } = useSession();
    const { data: profile } = useProfileQuery({
        did: currentAccount.did,
    });
    const { preferences, setPref } = useBackgroundNotificationPreferences();
    const { mutate: updateDeclaration } = useUpdateActorDeclaration({
        onError: () => {
            Toast.show(_(msg `Failed to update settings`), 'xmark');
        },
    });
    const onSelectMessagesFrom = useCallback((keys) => {
        const key = keys[0];
        if (!key)
            return;
        updateDeclaration(key);
    }, [updateDeclaration]);
    const onSelectSoundSetting = useCallback((keys) => {
        const key = keys[0];
        if (!key)
            return;
        setPref('playSoundChat', key === 'enabled');
    }, [setPref]);
    return (_jsxs(Layout.Screen, { testID: "messagesSettingsScreen", children: [_jsxs(Layout.Header.Outer, { children: [_jsx(Layout.Header.BackButton, {}), _jsx(Layout.Header.Content, { children: _jsx(Layout.Header.TitleText, { children: _jsx(Trans, { children: "Chat Settings" }) }) }), _jsx(Layout.Header.Slot, {})] }), _jsx(Layout.Content, { children: _jsxs(View, { style: [a.p_lg, a.gap_md], children: [_jsx(Text, { style: [a.text_lg, a.font_bold], children: _jsx(Trans, { children: "Allow new messages from" }) }), _jsx(Toggle.Group, { label: _(msg `Allow new messages from`), type: "radio", values: [
                                profile?.associated?.chat?.allowIncoming ??
                                    'following',
                            ], onChange: onSelectMessagesFrom, children: _jsxs(View, { children: [_jsxs(Toggle.Item, { name: "all", label: _(msg `Everyone`), style: [a.justify_between, a.py_sm], children: [_jsx(Toggle.LabelText, { children: _jsx(Trans, { children: "Everyone" }) }), _jsx(Toggle.Radio, {})] }), _jsxs(Toggle.Item, { name: "following", label: _(msg `Users I follow`), style: [a.justify_between, a.py_sm], children: [_jsx(Toggle.LabelText, { children: _jsx(Trans, { children: "Users I follow" }) }), _jsx(Toggle.Radio, {})] }), _jsxs(Toggle.Item, { name: "none", label: _(msg `No one`), style: [a.justify_between, a.py_sm], children: [_jsx(Toggle.LabelText, { children: _jsx(Trans, { children: "No one" }) }), _jsx(Toggle.Radio, {})] })] }) }), _jsx(Admonition, { type: "tip", children: _jsx(Trans, { children: "You can continue ongoing conversations regardless of which setting you choose." }) }), isNative && (_jsxs(_Fragment, { children: [_jsx(Divider, { style: a.my_md }), _jsx(Text, { style: [a.text_lg, a.font_bold], children: _jsx(Trans, { children: "Notification Sounds" }) }), _jsx(Toggle.Group, { label: _(msg `Notification sounds`), type: "radio", values: [preferences.playSoundChat ? 'enabled' : 'disabled'], onChange: onSelectSoundSetting, children: _jsxs(View, { children: [_jsxs(Toggle.Item, { name: "enabled", label: _(msg `Enabled`), style: [a.justify_between, a.py_sm], children: [_jsx(Toggle.LabelText, { children: _jsx(Trans, { children: "Enabled" }) }), _jsx(Toggle.Radio, {})] }), _jsxs(Toggle.Item, { name: "disabled", label: _(msg `Disabled`), style: [a.justify_between, a.py_sm], children: [_jsx(Toggle.LabelText, { children: _jsx(Trans, { children: "Disabled" }) }), _jsx(Toggle.Radio, {})] })] }) })] }))] }) })] }));
}
//# sourceMappingURL=Settings.js.map