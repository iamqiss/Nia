import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { DEFAULT_GEOLOCATION_CONFIG, DEFAULT_GEOLOCATION_STATUS, } from '#/state/geolocation/const';
import { onGeolocationConfigUpdate } from '#/state/geolocation/events';
import { logger } from '#/state/geolocation/logger';
import {} from '#/state/geolocation/types';
import { useSyncedDeviceGeolocation } from '#/state/geolocation/useSyncedDeviceGeolocation';
import { computeGeolocationStatus, mergeGeolocation, } from '#/state/geolocation/util';
import { device } from '#/storage';
export * from '#/state/geolocation/config';
export * from '#/state/geolocation/types';
export * from '#/state/geolocation/util';
const DeviceGeolocationContext = React.createContext({
    deviceGeolocation: undefined,
});
DeviceGeolocationContext.displayName = 'DeviceGeolocationContext';
const DeviceGeolocationAPIContext = React.createContext({
    setDeviceGeolocation: () => { },
});
DeviceGeolocationAPIContext.displayName = 'DeviceGeolocationAPIContext';
const GeolocationConfigContext = React.createContext({
    config: DEFAULT_GEOLOCATION_CONFIG,
});
GeolocationConfigContext.displayName = 'GeolocationConfigContext';
const GeolocationStatusContext = React.createContext({
    location: {
        countryCode: undefined,
        regionCode: undefined,
    },
    status: DEFAULT_GEOLOCATION_STATUS,
});
GeolocationStatusContext.displayName = 'GeolocationStatusContext';
/**
 * Provider of geolocation config and computed geolocation status.
 */
export function GeolocationStatusProvider({ children, }) {
    const { deviceGeolocation } = React.useContext(DeviceGeolocationContext);
    const [config, setConfig] = React.useState(() => {
        const initial = device.get(['geolocation']) || DEFAULT_GEOLOCATION_CONFIG;
        return initial;
    });
    React.useEffect(() => {
        return onGeolocationConfigUpdate(config => {
            setConfig(config);
        });
    }, []);
    const configContext = React.useMemo(() => ({ config }), [config]);
    const statusContext = React.useMemo(() => {
        if (deviceGeolocation?.countryCode) {
            logger.debug('has device geolocation available');
        }
        const geolocation = mergeGeolocation(deviceGeolocation, config);
        const status = computeGeolocationStatus(geolocation, config);
        // ensure this remains debug and never leaves device
        logger.debug('result', { deviceGeolocation, geolocation, status, config });
        return { location: geolocation, status };
    }, [config, deviceGeolocation]);
    return (_jsx(GeolocationConfigContext.Provider, { value: configContext, children: _jsx(GeolocationStatusContext.Provider, { value: statusContext, children: children }) }));
}
/**
 * Provider of providers. Provides device geolocation data to lower-level
 * `GeolocationStatusProvider`, and device geolocation APIs to children.
 */
export function Provider({ children }) {
    const [deviceGeolocation, setDeviceGeolocation] = useSyncedDeviceGeolocation();
    const handleSetDeviceGeolocation = React.useCallback((location) => {
        logger.debug('setting device geolocation');
        setDeviceGeolocation({
            countryCode: location.countryCode ?? undefined,
            regionCode: location.regionCode ?? undefined,
        });
    }, [setDeviceGeolocation]);
    return (_jsx(DeviceGeolocationAPIContext.Provider, { value: React.useMemo(() => ({ setDeviceGeolocation: handleSetDeviceGeolocation }), [handleSetDeviceGeolocation]), children: _jsx(DeviceGeolocationContext.Provider, { value: React.useMemo(() => ({ deviceGeolocation }), [deviceGeolocation]), children: _jsx(GeolocationStatusProvider, { children: children }) }) }));
}
export function useDeviceGeolocationApi() {
    return React.useContext(DeviceGeolocationAPIContext);
}
export function useGeolocationConfig() {
    return React.useContext(GeolocationConfigContext);
}
export function useGeolocationStatus() {
    return React.useContext(GeolocationStatusContext);
}
//# sourceMappingURL=index.js.map