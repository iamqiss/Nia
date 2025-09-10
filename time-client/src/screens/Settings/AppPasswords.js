import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut, LayoutAnimationConfig, LinearTransition, StretchOutY, } from 'react-native-reanimated';
import {} from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {} from '@react-navigation/native-stack';
import {} from '#/lib/routes/types';
import { cleanError } from '#/lib/strings/errors';
import { isWeb } from '#/platform/detection';
import { useAppPasswordDeleteMutation, useAppPasswordsQuery, } from '#/state/queries/app-passwords';
import { EmptyState } from '#/view/com/util/EmptyState';
import { ErrorScreen } from '#/view/com/util/error/ErrorScreen';
import * as Toast from '#/view/com/util/Toast';
import { atoms as a, useTheme } from '#/alf';
import { Admonition, colors } from '#/components/Admonition';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import { useDialogControl } from '#/components/Dialog';
import { PlusLarge_Stroke2_Corner0_Rounded as PlusIcon } from '#/components/icons/Plus';
import { Trash_Stroke2_Corner0_Rounded as TrashIcon } from '#/components/icons/Trash';
import { Warning_Stroke2_Corner0_Rounded as WarningIcon } from '#/components/icons/Warning';
import * as Layout from '#/components/Layout';
import { Loader } from '#/components/Loader';
import * as Prompt from '#/components/Prompt';
import { Text } from '#/components/Typography';
import { AddAppPasswordDialog } from './components/AddAppPasswordDialog';
import * as SettingsList from './components/SettingsList';
export function AppPasswordsScreen({}) {
    const { _ } = useLingui();
    const { data: appPasswords, error } = useAppPasswordsQuery();
    const createAppPasswordControl = useDialogControl();
    return (_jsxs(Layout.Screen, { testID: "AppPasswordsScreen", children: [_jsxs(Layout.Header.Outer, { children: [_jsx(Layout.Header.BackButton, {}), _jsx(Layout.Header.Content, { children: _jsx(Layout.Header.TitleText, { children: _jsx(Trans, { children: "App Passwords" }) }) }), _jsx(Layout.Header.Slot, {})] }), _jsx(Layout.Content, { children: error ? (_jsx(ErrorScreen, { title: _(msg `Oops!`), message: _(msg `There was an issue fetching your app passwords`), details: cleanError(error) })) : (_jsxs(SettingsList.Container, { children: [_jsx(SettingsList.Item, { children: _jsx(Admonition, { type: "tip", style: [a.flex_1], children: _jsx(Trans, { children: "Use app passwords to sign in to other Bluesky clients without giving full access to your account or password." }) }) }), _jsx(SettingsList.Item, { children: _jsxs(Button, { label: _(msg `Add App Password`), size: "large", color: "primary", variant: "solid", onPress: () => createAppPasswordControl.open(), style: [a.flex_1], children: [_jsx(ButtonIcon, { icon: PlusIcon }), _jsx(ButtonText, { children: _jsx(Trans, { children: "Add App Password" }) })] }) }), _jsx(SettingsList.Divider, {}), _jsx(LayoutAnimationConfig, { skipEntering: true, skipExiting: true, children: appPasswords ? (appPasswords.length > 0 ? (_jsx(View, { style: [a.overflow_hidden], children: appPasswords.map(appPassword => (_jsx(Animated.View, { style: a.w_full, entering: FadeIn, exiting: isWeb ? FadeOut : StretchOutY, layout: LinearTransition.delay(150), children: _jsx(SettingsList.Item, { children: _jsx(AppPasswordCard, { appPassword: appPassword }) }) }, appPassword.name))) })) : (_jsx(EmptyState, { icon: "growth", message: _(msg `No app passwords yet`) }))) : (_jsx(View, { style: [
                                    a.flex_1,
                                    a.justify_center,
                                    a.align_center,
                                    a.py_4xl,
                                ], children: _jsx(Loader, { size: "xl" }) })) })] })) }), _jsx(AddAppPasswordDialog, { control: createAppPasswordControl, passwords: appPasswords?.map(p => p.name) || [] })] }));
}
function AppPasswordCard({ appPassword, }) {
    const t = useTheme();
    const { i18n, _ } = useLingui();
    const deleteControl = Prompt.usePromptControl();
    const { mutateAsync: deleteMutation } = useAppPasswordDeleteMutation();
    const onDelete = useCallback(async () => {
        await deleteMutation({ name: appPassword.name });
        Toast.show(_(msg({ message: 'App password deleted', context: 'toast' })));
    }, [deleteMutation, appPassword.name, _]);
    return (_jsxs(View, { style: [
            a.w_full,
            a.border,
            a.rounded_sm,
            a.px_md,
            a.py_sm,
            t.atoms.bg_contrast_25,
            t.atoms.border_contrast_low,
        ], children: [_jsxs(View, { style: [
                    a.flex_row,
                    a.justify_between,
                    a.align_start,
                    a.w_full,
                    a.gap_sm,
                ], children: [_jsxs(View, { style: [a.gap_xs], children: [_jsx(Text, { style: [t.atoms.text, a.text_md, a.font_bold], children: appPassword.name }), _jsx(Text, { style: [t.atoms.text_contrast_medium], children: _jsxs(Trans, { children: ["Created", ' ', i18n.date(appPassword.createdAt, {
                                            year: 'numeric',
                                            month: 'numeric',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })] }) })] }), _jsx(Button, { label: _(msg `Delete app password`), variant: "ghost", color: "negative", size: "small", style: [a.bg_transparent], onPress: () => deleteControl.open(), children: _jsx(ButtonIcon, { icon: TrashIcon }) })] }), appPassword.privileged && (_jsxs(View, { style: [a.flex_row, a.gap_sm, a.align_center, a.mt_md], children: [_jsx(WarningIcon, { style: [{ color: colors.warning[t.scheme] }] }), _jsx(Text, { style: t.atoms.text_contrast_high, children: _jsx(Trans, { children: "Allows access to direct messages" }) })] })), _jsx(Prompt.Basic, { control: deleteControl, title: _(msg `Delete app password?`), description: _(msg `Are you sure you want to delete the app password "${appPassword.name}"?`), onConfirm: onDelete, confirmButtonCta: _(msg `Delete`), confirmButtonColor: "negative" })] }));
}
//# sourceMappingURL=AppPasswords.js.map