import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useState } from 'react';
import { Dimensions, View } from 'react-native';
import {} from '@atproto/api';
import { msg, Plural, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { urls } from '#/lib/constants';
import { cleanError } from '#/lib/strings/errors';
import { useWarnMaxGraphemeCount } from '#/lib/strings/helpers';
import { logger } from '#/logger';
import {} from '#/state/gallery';
import { useProfileUpdateMutation } from '#/state/queries/profile';
import { ErrorMessage } from '#/view/com/util/error/ErrorMessage';
import * as Toast from '#/view/com/util/Toast';
import { EditableUserAvatar } from '#/view/com/util/UserAvatar';
import { UserBanner } from '#/view/com/util/UserBanner';
import { atoms as a, useTheme } from '#/alf';
import { Admonition } from '#/components/Admonition';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import * as TextField from '#/components/forms/TextField';
import { InlineLinkText } from '#/components/Link';
import { Loader } from '#/components/Loader';
import * as Prompt from '#/components/Prompt';
import { Text } from '#/components/Typography';
import { useSimpleVerificationState } from '#/components/verification';
const DISPLAY_NAME_MAX_GRAPHEMES = 64;
const DESCRIPTION_MAX_GRAPHEMES = 256;
const SCREEN_HEIGHT = Dimensions.get('window').height;
export function EditProfileDialog({ profile, control, onUpdate, }) {
    const { _ } = useLingui();
    const cancelControl = Dialog.useDialogControl();
    const [dirty, setDirty] = useState(false);
    const onPressCancel = useCallback(() => {
        if (dirty) {
            cancelControl.open();
        }
        else {
            control.close();
        }
    }, [dirty, control, cancelControl]);
    return (_jsxs(Dialog.Outer, { control: control, nativeOptions: {
            preventDismiss: dirty,
            minHeight: SCREEN_HEIGHT,
        }, webOptions: {
            onBackgroundPress: () => {
                if (dirty) {
                    cancelControl.open();
                }
                else {
                    control.close();
                }
            },
        }, testID: "editProfileModal", children: [_jsx(DialogInner, { profile: profile, onUpdate: onUpdate, setDirty: setDirty, onPressCancel: onPressCancel }), _jsx(Prompt.Basic, { control: cancelControl, title: _(msg `Discard changes?`), description: _(msg `Are you sure you want to discard your changes?`), onConfirm: () => control.close(), confirmButtonCta: _(msg `Discard`), confirmButtonColor: "negative" })] }));
}
function DialogInner({ profile, onUpdate, setDirty, onPressCancel, }) {
    const { _ } = useLingui();
    const t = useTheme();
    const control = Dialog.useDialogContext();
    const verification = useSimpleVerificationState({
        profile,
    });
    const { mutateAsync: updateProfileMutation, error: updateProfileError, isError: isUpdateProfileError, isPending: isUpdatingProfile, } = useProfileUpdateMutation();
    const [imageError, setImageError] = useState('');
    const initialDisplayName = profile.displayName || '';
    const [displayName, setDisplayName] = useState(initialDisplayName);
    const initialDescription = profile.description || '';
    const [description, setDescription] = useState(initialDescription);
    const [userBanner, setUserBanner] = useState(profile.banner);
    const [userAvatar, setUserAvatar] = useState(profile.avatar);
    const [newUserBanner, setNewUserBanner] = useState();
    const [newUserAvatar, setNewUserAvatar] = useState();
    const dirty = displayName !== initialDisplayName ||
        description !== initialDescription ||
        userAvatar !== profile.avatar ||
        userBanner !== profile.banner;
    useEffect(() => {
        setDirty(dirty);
    }, [dirty, setDirty]);
    const onSelectNewAvatar = useCallback((img) => {
        setImageError('');
        if (img === null) {
            setNewUserAvatar(null);
            setUserAvatar(null);
            return;
        }
        try {
            setNewUserAvatar(img);
            setUserAvatar(img.path);
        }
        catch (e) {
            setImageError(cleanError(e));
        }
    }, [setNewUserAvatar, setUserAvatar, setImageError]);
    const onSelectNewBanner = useCallback((img) => {
        setImageError('');
        if (!img) {
            setNewUserBanner(null);
            setUserBanner(null);
            return;
        }
        try {
            setNewUserBanner(img);
            setUserBanner(img.path);
        }
        catch (e) {
            setImageError(cleanError(e));
        }
    }, [setNewUserBanner, setUserBanner, setImageError]);
    const onPressSave = useCallback(async () => {
        setImageError('');
        try {
            await updateProfileMutation({
                profile,
                updates: {
                    displayName: displayName.trimEnd(),
                    description: description.trimEnd(),
                },
                newUserAvatar,
                newUserBanner,
            });
            onUpdate?.();
            control.close();
            Toast.show(_(msg({ message: 'Profile updated', context: 'toast' })));
        }
        catch (e) {
            logger.error('Failed to update user profile', { message: String(e) });
        }
    }, [
        updateProfileMutation,
        profile,
        onUpdate,
        control,
        displayName,
        description,
        newUserAvatar,
        newUserBanner,
        setImageError,
        _,
    ]);
    const displayNameTooLong = useWarnMaxGraphemeCount({
        text: displayName,
        maxCount: DISPLAY_NAME_MAX_GRAPHEMES,
    });
    const descriptionTooLong = useWarnMaxGraphemeCount({
        text: description,
        maxCount: DESCRIPTION_MAX_GRAPHEMES,
    });
    const cancelButton = useCallback(() => (_jsx(Button, { label: _(msg `Cancel`), onPress: onPressCancel, size: "small", color: "primary", variant: "ghost", style: [a.rounded_full], testID: "editProfileCancelBtn", children: _jsx(ButtonText, { style: [a.text_md], children: _jsx(Trans, { children: "Cancel" }) }) })), [onPressCancel, _]);
    const saveButton = useCallback(() => (_jsxs(Button, { label: _(msg `Save`), onPress: onPressSave, disabled: !dirty ||
            isUpdatingProfile ||
            displayNameTooLong ||
            descriptionTooLong, size: "small", color: "primary", variant: "ghost", style: [a.rounded_full], testID: "editProfileSaveBtn", children: [_jsx(ButtonText, { style: [a.text_md, !dirty && t.atoms.text_contrast_low], children: _jsx(Trans, { children: "Save" }) }), isUpdatingProfile && _jsx(ButtonIcon, { icon: Loader })] })), [
        _,
        t,
        dirty,
        onPressSave,
        isUpdatingProfile,
        displayNameTooLong,
        descriptionTooLong,
    ]);
    return (_jsxs(Dialog.ScrollableInner, { label: _(msg `Edit profile`), style: [a.overflow_hidden], contentContainerStyle: [a.px_0, a.pt_0], header: _jsx(Dialog.Header, { renderLeft: cancelButton, renderRight: saveButton, children: _jsx(Dialog.HeaderText, { children: _jsx(Trans, { children: "Edit profile" }) }) }), children: [_jsxs(View, { style: [a.relative], children: [_jsx(UserBanner, { banner: userBanner, onSelectNewBanner: onSelectNewBanner }), _jsx(View, { style: [
                            a.absolute,
                            {
                                top: 80,
                                left: 20,
                                width: 84,
                                height: 84,
                                borderWidth: 2,
                                borderRadius: 42,
                                borderColor: t.atoms.bg.backgroundColor,
                            },
                        ], children: _jsx(EditableUserAvatar, { size: 80, avatar: userAvatar, onSelectNewAvatar: onSelectNewAvatar }) })] }), isUpdateProfileError && (_jsx(View, { style: [a.mt_xl], children: _jsx(ErrorMessage, { message: cleanError(updateProfileError) }) })), imageError !== '' && (_jsx(View, { style: [a.mt_xl], children: _jsx(ErrorMessage, { message: imageError }) })), _jsxs(View, { style: [a.mt_4xl, a.px_xl, a.gap_xl], children: [_jsxs(View, { children: [_jsx(TextField.LabelText, { children: _jsx(Trans, { children: "Display name" }) }), _jsx(TextField.Root, { isInvalid: displayNameTooLong, children: _jsx(Dialog.Input, { defaultValue: displayName, onChangeText: setDisplayName, label: _(msg `Display name`), placeholder: _(msg `e.g. Alice Lastname`), testID: "editProfileDisplayNameInput" }) }), displayNameTooLong && (_jsx(Text, { style: [
                                    a.text_sm,
                                    a.mt_xs,
                                    a.font_bold,
                                    { color: t.palette.negative_400 },
                                ], children: _jsx(Plural, { value: DISPLAY_NAME_MAX_GRAPHEMES, other: "Display name is too long. The maximum number of characters is #." }) }))] }), verification.isVerified &&
                        verification.role === 'default' &&
                        displayName !== initialDisplayName && (_jsx(Admonition, { type: "error", children: _jsxs(Trans, { children: ["You are verified. You will lose your verification status if you change your display name.", ' ', _jsx(InlineLinkText, { label: _(msg({
                                        message: `Learn more`,
                                        context: `english-only-resource`,
                                    })), to: urls.website.blog.initialVerificationAnnouncement, children: _jsx(Trans, { context: "english-only-resource", children: "Learn more." }) })] }) })), _jsxs(View, { children: [_jsx(TextField.LabelText, { children: _jsx(Trans, { children: "Description" }) }), _jsx(TextField.Root, { isInvalid: descriptionTooLong, children: _jsx(Dialog.Input, { defaultValue: description, onChangeText: setDescription, multiline: true, label: _(msg `Display name`), placeholder: _(msg `Tell us a bit about yourself`), testID: "editProfileDescriptionInput" }) }), descriptionTooLong && (_jsx(Text, { style: [
                                    a.text_sm,
                                    a.mt_xs,
                                    a.font_bold,
                                    { color: t.palette.negative_400 },
                                ], children: _jsx(Plural, { value: DESCRIPTION_MAX_GRAPHEMES, other: "Description is too long. The maximum number of characters is #." }) }))] })] })] }));
}
//# sourceMappingURL=EditProfileDialog.js.map