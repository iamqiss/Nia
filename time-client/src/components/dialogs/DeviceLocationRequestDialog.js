import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { wait } from '#/lib/async/wait';
import { isNetworkError, useCleanError } from '#/lib/hooks/useCleanError';
import { logger } from '#/logger';
import { isWeb } from '#/platform/detection';
import { computeGeolocationStatus, useGeolocationConfig, } from '#/state/geolocation';
import { useRequestDeviceLocation } from '#/state/geolocation/useRequestDeviceLocation';
import { atoms as a, useTheme, web } from '#/alf';
import { Admonition } from '#/components/Admonition';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import { PinLocation_Stroke2_Corner0_Rounded as LocationIcon } from '#/components/icons/PinLocation';
import { Loader } from '#/components/Loader';
import { Text } from '#/components/Typography';
export function DeviceLocationRequestDialog({ control, onLocationAcquired, }) {
    const { _ } = useLingui();
    return (_jsxs(Dialog.Outer, { control: control, children: [_jsx(Dialog.Handle, {}), _jsxs(Dialog.ScrollableInner, { label: _(msg `Confirm your location`), style: [web({ maxWidth: 380 })], children: [_jsx(DeviceLocationRequestDialogInner, { onLocationAcquired: onLocationAcquired }), _jsx(Dialog.Close, {})] })] }));
}
function DeviceLocationRequestDialogInner({ onLocationAcquired }) {
    const t = useTheme();
    const { _ } = useLingui();
    const { close } = Dialog.useDialogContext();
    const requestDeviceLocation = useRequestDeviceLocation();
    const { config } = useGeolocationConfig();
    const cleanError = useCleanError();
    const [isRequesting, setIsRequesting] = useState(false);
    const [error, setError] = useState('');
    const [dialogDisabled, setDialogDisabled] = useState(false);
    const onPressConfirm = async () => {
        setError('');
        setIsRequesting(true);
        try {
            const req = await wait(1e3, requestDeviceLocation());
            if (req.granted) {
                const location = req.location;
                if (location && location.countryCode) {
                    const geolocationStatus = computeGeolocationStatus(location, config);
                    onLocationAcquired?.({
                        geolocationStatus,
                        setDialogError: setError,
                        disableDialogAction: () => setDialogDisabled(true),
                        closeDialog: close,
                    });
                }
                else {
                    setError(_(msg `Failed to resolve location. Please try again.`));
                }
            }
            else {
                setError(_(msg `Unable to access location. You'll need to visit your system settings to enable location services for Bluesky.`));
            }
        }
        catch (e) {
            const { clean, raw } = cleanError(e);
            setError(clean || raw || e.message);
            if (!isNetworkError(e)) {
                logger.error(`blockedGeoOverlay: unexpected error`, {
                    safeMessage: e.message,
                });
            }
        }
        finally {
            setIsRequesting(false);
        }
    };
    return (_jsxs(View, { style: [a.gap_md], children: [_jsx(Text, { style: [a.text_xl, a.font_heavy], children: _jsx(Trans, { children: "Confirm your location" }) }), _jsxs(View, { style: [a.gap_sm, a.pb_xs], children: [_jsx(Text, { style: [a.text_md, a.leading_snug, t.atoms.text_contrast_medium], children: _jsx(Trans, { children: "Tap below to allow Bluesky to access your GPS location. We will then use that data to more accurately determine the content and features available in your region." }) }), _jsx(Text, { style: [
                            a.text_md,
                            a.leading_snug,
                            t.atoms.text_contrast_medium,
                            a.pb_xs,
                        ], children: _jsx(Trans, { children: "Your location data is not tracked and does not leave your device." }) })] }), error && (_jsx(View, { style: [a.pb_xs], children: _jsx(Admonition, { type: "error", children: error }) })), _jsxs(View, { style: [a.gap_sm], children: [!dialogDisabled && (_jsxs(Button, { disabled: isRequesting, label: _(msg `Allow location access`), onPress: onPressConfirm, size: isWeb ? 'small' : 'large', color: "primary", children: [_jsx(ButtonIcon, { icon: isRequesting ? Loader : LocationIcon }), _jsx(ButtonText, { children: _jsx(Trans, { children: "Allow location access" }) })] })), !isWeb && (_jsx(Button, { label: _(msg `Cancel`), onPress: () => close(), size: isWeb ? 'small' : 'large', color: "secondary", children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Cancel" }) }) }))] })] }));
}
//# sourceMappingURL=DeviceLocationRequestDialog.js.map