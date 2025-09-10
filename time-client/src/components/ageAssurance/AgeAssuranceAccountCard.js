import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { dateDiff, useGetTimeAgo } from '#/lib/hooks/useTimeAgo';
import { isNative } from '#/platform/detection';
import { useAgeAssurance } from '#/state/ageAssurance/useAgeAssurance';
import { logger } from '#/state/ageAssurance/util';
import { useDeviceGeolocationApi } from '#/state/geolocation';
import { atoms as a, useBreakpoints, useTheme } from '#/alf';
import { Admonition } from '#/components/Admonition';
import { AgeAssuranceAppealDialog } from '#/components/ageAssurance/AgeAssuranceAppealDialog';
import { AgeAssuranceBadge } from '#/components/ageAssurance/AgeAssuranceBadge';
import { AgeAssuranceInitDialog, useDialogControl, } from '#/components/ageAssurance/AgeAssuranceInitDialog';
import { useAgeAssuranceCopy } from '#/components/ageAssurance/useAgeAssuranceCopy';
import { Button, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import { DeviceLocationRequestDialog } from '#/components/dialogs/DeviceLocationRequestDialog';
import { Divider } from '#/components/Divider';
import { createStaticClick, InlineLinkText } from '#/components/Link';
import * as Toast from '#/components/Toast';
import { Text } from '#/components/Typography';
export function AgeAssuranceAccountCard({ style }) {
    const { isReady, isAgeRestricted, isDeclaredUnderage } = useAgeAssurance();
    if (!isReady)
        return null;
    if (isDeclaredUnderage)
        return null;
    if (!isAgeRestricted)
        return null;
    return _jsx(Inner, { style: style });
}
function Inner({ style }) {
    const t = useTheme();
    const { _, i18n } = useLingui();
    const control = useDialogControl();
    const appealControl = Dialog.useDialogControl();
    const locationControl = Dialog.useDialogControl();
    const getTimeAgo = useGetTimeAgo();
    const { gtPhone } = useBreakpoints();
    const { setDeviceGeolocation } = useDeviceGeolocationApi();
    const copy = useAgeAssuranceCopy();
    const { status, lastInitiatedAt } = useAgeAssurance();
    const isBlocked = status === 'blocked';
    const hasInitiated = !!lastInitiatedAt;
    const timeAgo = lastInitiatedAt
        ? getTimeAgo(lastInitiatedAt, new Date())
        : null;
    const diff = lastInitiatedAt
        ? dateDiff(lastInitiatedAt, new Date(), 'down')
        : null;
    return (_jsxs(_Fragment, { children: [_jsx(AgeAssuranceInitDialog, { control: control }), _jsx(AgeAssuranceAppealDialog, { control: appealControl }), _jsx(View, { style: style, children: _jsxs(View, { style: [a.p_lg, a.rounded_md, a.border, t.atoms.border_contrast_low], children: [_jsx(View, { style: [
                                a.flex_row,
                                a.justify_between,
                                a.align_center,
                                a.gap_lg,
                                a.pb_md,
                                a.z_10,
                            ], children: _jsx(View, { style: [a.align_start], children: _jsx(AgeAssuranceBadge, {}) }) }), _jsxs(View, { style: [a.pb_md, a.gap_xs], children: [_jsx(Text, { style: [a.text_sm, a.leading_snug], children: copy.notice }), isNative && (_jsxs(_Fragment, { children: [_jsx(Text, { style: [a.text_sm, a.leading_snug], children: _jsxs(Trans, { children: ["Is your location not accurate?", ' ', _jsx(InlineLinkText, { label: _(msg `Confirm your location`), ...createStaticClick(() => {
                                                            locationControl.open();
                                                        }), children: "Tap here to confirm your location." }), ' '] }) }), _jsx(DeviceLocationRequestDialog, { control: locationControl, onLocationAcquired: props => {
                                                if (props.geolocationStatus.isAgeRestrictedGeo) {
                                                    props.disableDialogAction();
                                                    props.setDialogError(_(msg `We're sorry, but based on your device's location, you are currently located in a region that requires age assurance.`));
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
                                            } })] }))] }), isBlocked ? (_jsx(Admonition, { type: "warning", children: _jsxs(Trans, { children: ["You are currently unable to access Bluesky's Age Assurance flow. Please", ' ', _jsx(InlineLinkText, { label: _(msg `Contact our moderation team`), ...createStaticClick(() => {
                                            appealControl.open();
                                            logger.metric('ageAssurance:appealDialogOpen', {});
                                        }), children: "contact our moderation team" }), ' ', "if you believe this is an error."] }) })) : (_jsxs(_Fragment, { children: [_jsx(Divider, {}), _jsxs(View, { style: [
                                        a.pt_md,
                                        gtPhone
                                            ? [
                                                a.flex_row_reverse,
                                                a.gap_xl,
                                                a.justify_between,
                                                a.align_center,
                                            ]
                                            : [a.gap_md],
                                    ], children: [_jsx(Button, { label: _(msg `Verify now`), size: "small", variant: "solid", color: hasInitiated ? 'secondary' : 'primary', onPress: () => {
                                                control.open();
                                                logger.metric('ageAssurance:initDialogOpen', {
                                                    hasInitiatedPreviously: hasInitiated,
                                                });
                                            }, children: _jsx(ButtonText, { children: hasInitiated ? (_jsx(Trans, { children: "Verify again" })) : (_jsx(Trans, { children: "Verify now" })) }) }), lastInitiatedAt && timeAgo && diff ? (_jsx(Text, { style: [a.text_sm, a.italic, t.atoms.text_contrast_medium], title: i18n.date(lastInitiatedAt, {
                                                dateStyle: 'medium',
                                                timeStyle: 'medium',
                                            }), children: diff.value === 0 ? (_jsx(Trans, { children: "Last initiated just now" })) : (_jsxs(Trans, { children: ["Last initiated ", timeAgo, " ago"] })) })) : (_jsx(Text, { style: [a.text_sm, a.italic, t.atoms.text_contrast_medium], children: _jsx(Trans, { children: "Age assurance only takes a few minutes" }) }))] })] }))] }) })] }));
}
//# sourceMappingURL=AgeAssuranceAccountCard.js.map