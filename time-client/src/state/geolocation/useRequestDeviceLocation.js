import { useCallback } from 'react';
import * as Location from 'expo-location';
import {} from '#/state/geolocation/types';
import { getDeviceGeolocation } from '#/state/geolocation/util';
export { PermissionStatus } from 'expo-location';
export function useRequestDeviceLocation() {
    return useCallback(async () => {
        const status = await Location.requestForegroundPermissionsAsync();
        if (status.granted) {
            return {
                granted: true,
                location: await getDeviceGeolocation(),
            };
        }
        else {
            return {
                granted: false,
                status: {
                    canAskAgain: status.canAskAgain,
                    permissionStatus: status.status,
                },
            };
        }
    }, []);
}
//# sourceMappingURL=useRequestDeviceLocation.js.map