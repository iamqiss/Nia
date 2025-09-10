import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useCallback, useEffect, useMemo } from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import Animated, { measure, runOnJS, runOnUI, useAnimatedRef, } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {} from '@atproto/api';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useNavigation } from '@react-navigation/native';
import { useActorStatus } from '#/lib/actor-status';
import { BACK_HITSLOP } from '#/lib/constants';
import { useHaptics } from '#/lib/haptics';
import {} from '#/lib/routes/types';
import { logger } from '#/logger';
import { isIOS } from '#/platform/detection';
import {} from '#/state/cache/types';
import { useLightboxControls } from '#/state/lightbox';
import { useSession } from '#/state/session';
import { LoadingPlaceholder } from '#/view/com/util/LoadingPlaceholder';
import { UserAvatar } from '#/view/com/util/UserAvatar';
import { UserBanner } from '#/view/com/util/UserBanner';
import { atoms as a, platform, useTheme } from '#/alf';
import { transparentifyColor } from '#/alf/util/colorGeneration';
import { Button } from '#/components/Button';
import { useDialogControl } from '#/components/Dialog';
import { ArrowLeft_Stroke2_Corner0_Rounded as ArrowLeftIcon } from '#/components/icons/Arrow';
import { EditLiveDialog } from '#/components/live/EditLiveDialog';
import { LiveIndicator } from '#/components/live/LiveIndicator';
import { LiveStatusDialog } from '#/components/live/LiveStatusDialog';
import { LabelsOnMe } from '#/components/moderation/LabelsOnMe';
import { ProfileHeaderAlerts } from '#/components/moderation/ProfileHeaderAlerts';
import { GrowableAvatar } from './GrowableAvatar';
import { GrowableBanner } from './GrowableBanner';
import { StatusBarShadow } from './StatusBarShadow';
let ProfileHeaderShell = ({ children, profile, moderation, hideBackButton = false, isPlaceholderProfile, }) => {
    const t = useTheme();
    const { currentAccount } = useSession();
    const { _ } = useLingui();
    const { openLightbox } = useLightboxControls();
    const navigation = useNavigation();
    const { top: topInset } = useSafeAreaInsets();
    const playHaptic = useHaptics();
    const liveStatusControl = useDialogControl();
    const aviRef = useAnimatedRef();
    const onPressBack = useCallback(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
        else {
            navigation.navigate('Home');
        }
    }, [navigation]);
    const _openLightbox = useCallback((uri, thumbRect) => {
        openLightbox({
            images: [
                {
                    uri,
                    thumbUri: uri,
                    thumbRect,
                    dimensions: {
                        // It's fine if it's actually smaller but we know it's 1:1.
                        height: 1000,
                        width: 1000,
                    },
                    thumbDimensions: null,
                    type: 'circle-avi',
                },
            ],
            index: 0,
        });
    }, [openLightbox]);
    const isMe = useMemo(() => currentAccount?.did === profile.did, [currentAccount, profile]);
    const live = useActorStatus(profile);
    useEffect(() => {
        if (live.isActive) {
            logger.metric('live:view:profile', { subject: profile.did }, { statsig: true });
        }
    }, [live.isActive, profile.did]);
    const onPressAvi = useCallback(() => {
        if (live.isActive) {
            playHaptic('Light');
            logger.metric('live:card:open', { subject: profile.did, from: 'profile' }, { statsig: true });
            liveStatusControl.open();
        }
        else {
            const modui = moderation.ui('avatar');
            const avatar = profile.avatar;
            if (avatar && !(modui.blur && modui.noOverride)) {
                runOnUI(() => {
                    'worklet';
                    const rect = measure(aviRef);
                    runOnJS(_openLightbox)(avatar, rect);
                })();
            }
        }
    }, [
        profile,
        moderation,
        _openLightbox,
        aviRef,
        liveStatusControl,
        live,
        playHaptic,
    ]);
    return (_jsxs(View, { style: t.atoms.bg, pointerEvents: isIOS ? 'auto' : 'box-none', children: [_jsxs(View, { pointerEvents: isIOS ? 'auto' : 'box-none', style: [a.relative, { height: 150 }], children: [_jsx(StatusBarShadow, {}), _jsx(GrowableBanner, { backButton: !hideBackButton && (_jsx(Button, { testID: "profileHeaderBackBtn", onPress: onPressBack, hitSlop: BACK_HITSLOP, label: _(msg `Back`), style: [
                                a.absolute,
                                a.pointer,
                                {
                                    top: platform({
                                        web: 10,
                                        default: topInset,
                                    }),
                                    left: platform({
                                        web: 18,
                                        default: 12,
                                    }),
                                },
                            ], children: ({ hovered }) => (_jsx(View, { style: [
                                    a.align_center,
                                    a.justify_center,
                                    a.rounded_sm,
                                    {
                                        width: 31,
                                        height: 31,
                                        backgroundColor: transparentifyColor('#000', 0.5),
                                    },
                                    hovered && {
                                        backgroundColor: transparentifyColor('#000', 0.75),
                                    },
                                ], children: _jsx(ArrowLeftIcon, { size: "lg", fill: "white" }) })) })), children: isPlaceholderProfile ? (_jsx(LoadingPlaceholder, { width: "100%", height: "100%", style: { borderRadius: 0 } })) : (_jsx(UserBanner, { type: profile.associated?.labeler ? 'labeler' : 'default', banner: profile.banner, moderation: moderation.ui('banner') })) })] }), children, !isPlaceholderProfile && (_jsx(View, { style: [a.px_lg, a.pt_xs, a.pb_sm], pointerEvents: isIOS ? 'auto' : 'box-none', children: isMe ? (_jsx(LabelsOnMe, { type: "account", labels: profile.labels })) : (_jsx(ProfileHeaderAlerts, { moderation: moderation })) })), _jsx(GrowableAvatar, { style: [a.absolute, { top: 104, left: 10 }], children: _jsx(TouchableWithoutFeedback, { testID: "profileHeaderAviButton", onPress: onPressAvi, accessibilityRole: "image", accessibilityLabel: _(msg `View ${profile.handle}'s avatar`), accessibilityHint: "", children: _jsx(View, { style: [
                            t.atoms.bg,
                            a.rounded_full,
                            {
                                width: 94,
                                height: 94,
                                borderWidth: live.isActive ? 3 : 2,
                                borderColor: live.isActive
                                    ? t.palette.negative_500
                                    : t.atoms.bg.backgroundColor,
                            },
                            profile.associated?.labeler && a.rounded_md,
                        ], children: _jsxs(Animated.View, { ref: aviRef, collapsable: false, children: [_jsx(UserAvatar, { type: profile.associated?.labeler ? 'labeler' : 'user', size: live.isActive ? 88 : 90, avatar: profile.avatar, moderation: moderation.ui('avatar'), noBorder: true }), live.isActive && _jsx(LiveIndicator, { size: "large" })] }) }) }) }), live.isActive &&
                (isMe ? (_jsx(EditLiveDialog, { control: liveStatusControl, status: live, embed: live.embed })) : (_jsx(LiveStatusDialog, { control: liveStatusControl, status: live, embed: live.embed, profile: profile })))] }));
};
ProfileHeaderShell = memo(ProfileHeaderShell);
export { ProfileHeaderShell };
//# sourceMappingURL=Shell.js.map