import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { logger } from '#/logger';
import { isWeb } from '#/platform/detection';
import { useDeviceGeolocationApi } from '#/state/geolocation';
import { atoms as a, useBreakpoints, useTheme, web } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import { DeviceLocationRequestDialog } from '#/components/dialogs/DeviceLocationRequestDialog';
import { Divider } from '#/components/Divider';
import { Full as Logo, Mark } from '#/components/icons/Logo';
import { PinLocation_Stroke2_Corner0_Rounded as LocationIcon } from '#/components/icons/PinLocation';
import { SimpleInlineLinkText as InlineLinkText } from '#/components/Link';
import { Outlet as PortalOutlet } from '#/components/Portal';
import * as Toast from '#/components/Toast';
import { Text } from '#/components/Typography';
import { BottomSheetOutlet } from '#/../modules/bottom-sheet';
export function BlockedGeoOverlay() {
    const t = useTheme();
    const { _ } = useLingui();
    const { gtPhone } = useBreakpoints();
    const insets = useSafeAreaInsets();
    const geoDialog = Dialog.useDialogControl();
    const { setDeviceGeolocation } = useDeviceGeolocationApi();
    useEffect(() => {
        // just counting overall hits here
        logger.metric(`blockedGeoOverlay:shown`, {});
    }, []);
    const textStyles = [a.text_md, a.leading_normal];
    const links = {
        blog: {
            to: `https://bsky.social/about/blog/08-22-2025-mississippi-hb1126`,
            label: _(msg `Read our blog post`),
            overridePresentation: false,
            disableMismatchWarning: true,
            style: textStyles,
        },
    };
    const blocks = [
        _(msg `Unfortunately, Bluesky is unavailable in Mississippi right now.`),
        _(msg `A new Mississippi law requires us to implement age verification for all users before they can access Bluesky. We think this law creates challenges that go beyond its child safety goals, and creates significant barriers that limit free speech and disproportionately harm smaller platforms and emerging technologies.`),
        _(msg `As a small team, we cannot justify building the expensive infrastructure this requirement demands while legal challenges to this law are pending.`),
        _(msg `For now, we have made the difficult decision to block access to Bluesky in the state of Mississippi.`),
        _jsxs(_Fragment, { children: ["To learn more, read our", ' ', _jsx(InlineLinkText, { ...links.blog, children: "blog post" }), "."] }),
    ];
    return (_jsxs(_Fragment, { children: [_jsx(ScrollView, { contentContainerStyle: [
                    a.px_2xl,
                    {
                        paddingTop: isWeb ? a.p_5xl.padding : insets.top + a.p_2xl.padding,
                        paddingBottom: 100,
                    },
                ], children: _jsxs(View, { style: [
                        a.mx_auto,
                        web({
                            maxWidth: 380,
                            paddingTop: gtPhone ? '8vh' : undefined,
                        }),
                    ], children: [_jsx(View, { style: [a.align_start], children: _jsxs(View, { style: [
                                    a.pl_md,
                                    a.pr_lg,
                                    a.py_sm,
                                    a.rounded_full,
                                    a.flex_row,
                                    a.align_center,
                                    a.gap_xs,
                                    {
                                        backgroundColor: t.palette.primary_25,
                                    },
                                ], children: [_jsx(Mark, { fill: t.palette.primary_600, width: 14 }), _jsx(Text, { style: [
                                            a.font_bold,
                                            {
                                                color: t.palette.primary_600,
                                            },
                                        ], children: _jsx(Trans, { children: "Announcement" }) })] }) }), _jsx(View, { style: [a.gap_lg, { paddingTop: 32 }], children: blocks.map((block, index) => (_jsx(Text, { style: [textStyles], children: block }, index))) }), !isWeb && (_jsxs(_Fragment, { children: [_jsx(View, { style: [a.pt_2xl], children: _jsx(Divider, {}) }), _jsxs(View, { style: [a.mt_xl, a.align_start], children: [_jsx(Text, { style: [a.text_lg, a.font_heavy, a.leading_snug, a.pb_xs], children: _jsx(Trans, { children: "Not in Mississippi?" }) }), _jsx(Text, { style: [
                                                a.text_sm,
                                                a.leading_snug,
                                                t.atoms.text_contrast_medium,
                                                a.pb_md,
                                            ], children: _jsx(Trans, { children: "Confirm your location with GPS. Your location data is not tracked and does not leave your device." }) }), _jsxs(Button, { label: _(msg `Confirm your location`), onPress: () => geoDialog.open(), size: "small", color: "primary_subtle", children: [_jsx(ButtonIcon, { icon: LocationIcon }), _jsx(ButtonText, { children: _jsx(Trans, { children: "Confirm your location" }) })] })] }), _jsx(DeviceLocationRequestDialog, { control: geoDialog, onLocationAcquired: props => {
                                        if (props.geolocationStatus.isAgeBlockedGeo) {
                                            props.disableDialogAction();
                                            props.setDialogError(_(msg `We're sorry, but based on your device's location, you are currently located in a region where we cannot provide access at this time.`));
                                        }
                                        else {
                                            props.closeDialog(() => {
                                                // set this after close!
                                                setDeviceGeolocation({
                                                    countryCode: props.geolocationStatus.countryCode,
                                                    regionCode: props.geolocationStatus.regionCode,
                                                });
                                                Toast.show(_(msg `Thanks! You're all set.`), {
                                                    type: 'success',
                                                });
                                            });
                                        }
                                    } })] })), _jsx(View, { style: [{ paddingTop: 48 }], children: _jsx(Logo, { width: 120, textFill: t.atoms.text.color }) })] }) }), _jsx(BottomSheetOutlet, {}), _jsx(PortalOutlet, {})] }));
}
//# sourceMappingURL=BlockedGeoOverlay.js.map