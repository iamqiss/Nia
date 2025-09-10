import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { launchImageLibraryAsync, UIImagePickerPreferredAssetRepresentationMode, } from 'expo-image-picker';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { usePhotoLibraryPermission } from '#/lib/hooks/usePermissions';
import { compressIfNeeded } from '#/lib/media/manip';
import { openCropper } from '#/lib/media/picker';
import { getDataUriSize } from '#/lib/media/util';
import { useRequestNotificationsPermission } from '#/lib/notifications/notifications';
import { logEvent, useGate } from '#/lib/statsig/statsig';
import { isNative, isWeb } from '#/platform/detection';
import { DescriptionText, OnboardingControls, TitleText, } from '#/screens/Onboarding/Layout';
import { Context } from '#/screens/Onboarding/state';
import { AvatarCircle } from '#/screens/Onboarding/StepProfile/AvatarCircle';
import { AvatarCreatorCircle } from '#/screens/Onboarding/StepProfile/AvatarCreatorCircle';
import { AvatarCreatorItems } from '#/screens/Onboarding/StepProfile/AvatarCreatorItems';
import { PlaceholderCanvas, } from '#/screens/Onboarding/StepProfile/PlaceholderCanvas';
import { atoms as a, useBreakpoints, useTheme } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import { useSheetWrapper } from '#/components/Dialog/sheet-wrapper';
import { IconCircle } from '#/components/IconCircle';
import { ChevronRight_Stroke2_Corner0_Rounded as ChevronRight } from '#/components/icons/Chevron';
import { CircleInfo_Stroke2_Corner0_Rounded } from '#/components/icons/CircleInfo';
import { StreamingLive_Stroke2_Corner0_Rounded as StreamingLive } from '#/components/icons/StreamingLive';
import { Text } from '#/components/Typography';
import { avatarColors, emojiItems } from './types';
const AvatarContext = React.createContext({});
AvatarContext.displayName = 'AvatarContext';
export const useAvatar = () => React.useContext(AvatarContext);
const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];
export function StepProfile() {
    const { _ } = useLingui();
    const t = useTheme();
    const { gtMobile } = useBreakpoints();
    const { requestPhotoAccessIfNeeded } = usePhotoLibraryPermission();
    const gate = useGate();
    const requestNotificationsPermission = useRequestNotificationsPermission();
    const creatorControl = Dialog.useDialogControl();
    const [error, setError] = React.useState('');
    const { state, dispatch } = React.useContext(Context);
    const [avatar, setAvatar] = React.useState({
        image: state.profileStepResults?.image,
        placeholder: state.profileStepResults.creatorState?.emoji || emojiItems.at,
        backgroundColor: state.profileStepResults.creatorState?.backgroundColor || randomColor,
        useCreatedAvatar: state.profileStepResults.isCreatedAvatar,
    });
    const canvasRef = React.useRef(null);
    React.useEffect(() => {
        requestNotificationsPermission('StartOnboarding');
    }, [gate, requestNotificationsPermission]);
    const sheetWrapper = useSheetWrapper();
    const openPicker = React.useCallback(async (opts) => {
        const response = await sheetWrapper(launchImageLibraryAsync({
            exif: false,
            mediaTypes: ['images'],
            quality: 1,
            ...opts,
            legacy: true,
            preferredAssetRepresentationMode: UIImagePickerPreferredAssetRepresentationMode.Automatic,
        }));
        return (response.assets ?? [])
            .slice(0, 1)
            .filter(asset => {
            if (!asset.mimeType?.startsWith('image/') ||
                (!asset.mimeType?.endsWith('jpeg') &&
                    !asset.mimeType?.endsWith('jpg') &&
                    !asset.mimeType?.endsWith('png'))) {
                setError(_(msg `Only .jpg and .png files are supported`));
                return false;
            }
            return true;
        })
            .map(image => ({
            mime: 'image/jpeg',
            height: image.height,
            width: image.width,
            path: image.uri,
            size: getDataUriSize(image.uri),
        }));
    }, [_, setError, sheetWrapper]);
    const onContinue = React.useCallback(async () => {
        let imageUri = avatar?.image?.path;
        // In the event that view-shot didn't load in time and the user pressed continue, this will just be undefined
        // and the default avatar will be used. We don't want to block getting through create if this fails for some
        // reason
        if (!imageUri || avatar.useCreatedAvatar) {
            imageUri = await canvasRef.current?.capture();
        }
        if (imageUri) {
            dispatch({
                type: 'setProfileStepResults',
                image: avatar.image,
                imageUri,
                imageMime: avatar.image?.mime ?? 'image/jpeg',
                isCreatedAvatar: avatar.useCreatedAvatar,
                creatorState: {
                    emoji: avatar.placeholder,
                    backgroundColor: avatar.backgroundColor,
                },
            });
        }
        dispatch({ type: 'next' });
        logEvent('onboarding:profile:nextPressed', {});
    }, [avatar, dispatch]);
    const onDoneCreating = React.useCallback(() => {
        setAvatar(prev => ({
            ...prev,
            image: undefined,
            useCreatedAvatar: true,
        }));
        creatorControl.close();
    }, [creatorControl]);
    const openLibrary = React.useCallback(async () => {
        if (!(await requestPhotoAccessIfNeeded())) {
            return;
        }
        setError('');
        const items = await sheetWrapper(openPicker({
            aspect: [1, 1],
        }));
        let image = items[0];
        if (!image)
            return;
        if (!isWeb) {
            image = await openCropper({
                imageUri: image.path,
                shape: 'circle',
                aspectRatio: 1 / 1,
            });
        }
        image = await compressIfNeeded(image, 1000000);
        // If we are on mobile, prefetching the image will load the image into memory before we try and display it,
        // stopping any brief flickers.
        if (isNative) {
            await ExpoImage.prefetch(image.path);
        }
        setAvatar(prev => ({
            ...prev,
            image,
            useCreatedAvatar: false,
        }));
    }, [
        requestPhotoAccessIfNeeded,
        setAvatar,
        openPicker,
        setError,
        sheetWrapper,
    ]);
    const onSecondaryPress = React.useCallback(() => {
        if (avatar.useCreatedAvatar) {
            openLibrary();
        }
        else {
            creatorControl.open();
        }
    }, [avatar.useCreatedAvatar, creatorControl, openLibrary]);
    const value = React.useMemo(() => ({
        avatar,
        setAvatar,
    }), [avatar]);
    return (_jsxs(AvatarContext.Provider, { value: value, children: [_jsxs(View, { style: [a.align_start, t.atoms.bg, a.justify_between], children: [_jsx(IconCircle, { icon: StreamingLive, style: [a.mb_2xl] }), _jsx(TitleText, { children: _jsx(Trans, { children: "Give your profile a face" }) }), _jsx(DescriptionText, { children: _jsx(Trans, { children: "Help people know you're not a bot by uploading a picture or creating an avatar." }) }), _jsxs(View, { style: [a.w_full, a.align_center, { paddingTop: gtMobile ? 80 : 40 }], children: [_jsx(AvatarCircle, { openLibrary: openLibrary, openCreator: creatorControl.open }), error && (_jsxs(View, { style: [
                                    a.flex_row,
                                    a.gap_sm,
                                    a.align_center,
                                    a.mt_xl,
                                    a.py_md,
                                    a.px_lg,
                                    a.border,
                                    a.rounded_md,
                                    t.atoms.bg_contrast_25,
                                    t.atoms.border_contrast_low,
                                ], children: [_jsx(CircleInfo_Stroke2_Corner0_Rounded, { size: "sm" }), _jsx(Text, { style: [a.leading_snug], children: error })] }))] }), _jsx(OnboardingControls.Portal, { children: _jsxs(View, { style: [a.gap_md, gtMobile && a.flex_row_reverse], children: [_jsxs(Button, { testID: "onboardingContinue", variant: "solid", color: "primary", size: "large", label: _(msg `Continue to next step`), onPress: onContinue, children: [_jsx(ButtonText, { children: _jsx(Trans, { children: "Continue" }) }), _jsx(ButtonIcon, { icon: ChevronRight, position: "right" })] }), _jsx(Button, { testID: "onboardingAvatarCreator", variant: "ghost", color: "primary", size: "large", label: _(msg `Open avatar creator`), onPress: onSecondaryPress, children: _jsx(ButtonText, { children: avatar.useCreatedAvatar ? (_jsx(Trans, { children: "Upload a photo instead" })) : (_jsx(Trans, { children: "Create an avatar instead" })) }) })] }) })] }), _jsx(Dialog.Outer, { control: creatorControl, children: _jsxs(Dialog.Inner, { label: "Avatar creator", style: [
                        {
                            width: 'auto',
                            maxWidth: 410,
                        },
                    ], children: [_jsx(View, { style: [a.align_center, { paddingTop: 20 }], children: _jsx(AvatarCreatorCircle, { avatar: avatar }) }), _jsxs(View, { style: [a.pt_3xl, a.gap_lg], children: [_jsx(AvatarCreatorItems, { type: "emojis", avatar: avatar, setAvatar: setAvatar }), _jsx(AvatarCreatorItems, { type: "colors", avatar: avatar, setAvatar: setAvatar })] }), _jsx(View, { style: [a.pt_4xl], children: _jsx(Button, { variant: "solid", color: "primary", size: "large", label: _(msg `Done`), onPress: onDoneCreating, children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Done" }) }) }) })] }) }), _jsx(PlaceholderCanvas, { ref: canvasRef })] }));
}
//# sourceMappingURL=index.js.map