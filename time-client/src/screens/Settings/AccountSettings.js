import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {} from '@react-navigation/native-stack';
import {} from '#/lib/routes/types';
import { useModalControls } from '#/state/modals';
import { useSession } from '#/state/session';
import * as SettingsList from '#/screens/Settings/components/SettingsList';
import { atoms as a, useTheme } from '#/alf';
import { AgeAssuranceAccountCard } from '#/components/ageAssurance/AgeAssuranceAccountCard';
import { useDialogControl } from '#/components/Dialog';
import { BirthDateSettingsDialog } from '#/components/dialogs/BirthDateSettings';
import { EmailDialogScreenID, useEmailDialogControl, } from '#/components/dialogs/EmailDialog';
import { At_Stroke2_Corner2_Rounded as AtIcon } from '#/components/icons/At';
import { BirthdayCake_Stroke2_Corner2_Rounded as BirthdayCakeIcon } from '#/components/icons/BirthdayCake';
import { Car_Stroke2_Corner2_Rounded as CarIcon } from '#/components/icons/Car';
import { Envelope_Stroke2_Corner2_Rounded as EnvelopeIcon } from '#/components/icons/Envelope';
import { Freeze_Stroke2_Corner2_Rounded as FreezeIcon } from '#/components/icons/Freeze';
import { Lock_Stroke2_Corner2_Rounded as LockIcon } from '#/components/icons/Lock';
import { PencilLine_Stroke2_Corner2_Rounded as PencilIcon } from '#/components/icons/Pencil';
import { ShieldCheck_Stroke2_Corner0_Rounded as ShieldIcon } from '#/components/icons/Shield';
import { Trash_Stroke2_Corner2_Rounded } from '#/components/icons/Trash';
import * as Layout from '#/components/Layout';
import { ChangeHandleDialog } from './components/ChangeHandleDialog';
import { ChangePasswordDialog } from './components/ChangePasswordDialog';
import { DeactivateAccountDialog } from './components/DeactivateAccountDialog';
import { ExportCarDialog } from './components/ExportCarDialog';
export function AccountSettingsScreen({}) {
    const t = useTheme();
    const { _ } = useLingui();
    const { currentAccount } = useSession();
    const { openModal } = useModalControls();
    const emailDialogControl = useEmailDialogControl();
    const birthdayControl = useDialogControl();
    const changeHandleControl = useDialogControl();
    const changePasswordControl = useDialogControl();
    const exportCarControl = useDialogControl();
    const deactivateAccountControl = useDialogControl();
    return (_jsxs(Layout.Screen, { children: [_jsxs(Layout.Header.Outer, { children: [_jsx(Layout.Header.BackButton, {}), _jsx(Layout.Header.Content, { children: _jsx(Layout.Header.TitleText, { children: _jsx(Trans, { children: "Account" }) }) }), _jsx(Layout.Header.Slot, {})] }), _jsx(Layout.Content, { children: _jsxs(SettingsList.Container, { children: [_jsxs(SettingsList.Item, { children: [_jsx(SettingsList.ItemIcon, { icon: EnvelopeIcon }), _jsx(SettingsList.ItemText, { style: [a.flex_0], children: _jsx(Trans, { children: "Email" }) }), currentAccount && (_jsxs(_Fragment, { children: [_jsx(SettingsList.BadgeText, { style: [a.flex_1], children: currentAccount.email || _jsx(Trans, { children: "(no email)" }) }), currentAccount.emailConfirmed && (_jsx(ShieldIcon, { fill: t.palette.primary_500, size: "md" }))] }))] }), currentAccount && !currentAccount.emailConfirmed && (_jsxs(SettingsList.PressableItem, { label: _(msg `Verify your email`), onPress: () => emailDialogControl.open({
                                id: EmailDialogScreenID.Verify,
                            }), style: [
                                a.my_xs,
                                a.mx_lg,
                                a.rounded_md,
                                { backgroundColor: t.palette.primary_50 },
                            ], hoverStyle: [{ backgroundColor: t.palette.primary_100 }], contentContainerStyle: [a.rounded_md, a.px_lg], children: [_jsx(SettingsList.ItemIcon, { icon: ShieldIcon, color: t.palette.primary_500 }), _jsx(SettingsList.ItemText, { style: [{ color: t.palette.primary_500 }, a.font_bold], children: _jsx(Trans, { children: "Verify your email" }) }), _jsx(SettingsList.Chevron, { color: t.palette.primary_500 })] })), _jsxs(SettingsList.PressableItem, { label: _(msg `Update email`), onPress: () => emailDialogControl.open({
                                id: EmailDialogScreenID.Update,
                            }), children: [_jsx(SettingsList.ItemIcon, { icon: PencilIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Update email" }) }), _jsx(SettingsList.Chevron, {})] }), _jsx(SettingsList.Divider, {}), _jsxs(SettingsList.PressableItem, { label: _(msg `Password`), onPress: () => changePasswordControl.open(), children: [_jsx(SettingsList.ItemIcon, { icon: LockIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Password" }) }), _jsx(SettingsList.Chevron, {})] }), _jsxs(SettingsList.PressableItem, { label: _(msg `Handle`), accessibilityHint: _(msg `Opens change handle dialog`), onPress: () => changeHandleControl.open(), children: [_jsx(SettingsList.ItemIcon, { icon: AtIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Handle" }) }), _jsx(SettingsList.Chevron, {})] }), _jsxs(SettingsList.Item, { children: [_jsx(SettingsList.ItemIcon, { icon: BirthdayCakeIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Birthday" }) }), _jsx(SettingsList.BadgeButton, { label: _(msg `Edit`), onPress: () => birthdayControl.open() })] }), _jsx(AgeAssuranceAccountCard, { style: [a.px_xl, a.pt_xs, a.pb_md] }), _jsx(SettingsList.Divider, {}), _jsxs(SettingsList.PressableItem, { label: _(msg `Export my data`), onPress: () => exportCarControl.open(), children: [_jsx(SettingsList.ItemIcon, { icon: CarIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Export my data" }) }), _jsx(SettingsList.Chevron, {})] }), _jsxs(SettingsList.PressableItem, { label: _(msg `Deactivate account`), onPress: () => deactivateAccountControl.open(), destructive: true, children: [_jsx(SettingsList.ItemIcon, { icon: FreezeIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Deactivate account" }) }), _jsx(SettingsList.Chevron, {})] }), _jsxs(SettingsList.PressableItem, { label: _(msg `Delete account`), onPress: () => openModal({ name: 'delete-account' }), destructive: true, children: [_jsx(SettingsList.ItemIcon, { icon: Trash_Stroke2_Corner2_Rounded }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Delete account" }) }), _jsx(SettingsList.Chevron, {})] })] }) }), _jsx(BirthDateSettingsDialog, { control: birthdayControl }), _jsx(ChangeHandleDialog, { control: changeHandleControl }), _jsx(ChangePasswordDialog, { control: changePasswordControl }), _jsx(ExportCarDialog, { control: exportCarControl }), _jsx(DeactivateAccountDialog, { control: deactivateAccountControl })] }));
}
//# sourceMappingURL=AccountSettings.js.map