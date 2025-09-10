import * as Location from 'expo-location';
import { type DeviceLocation } from '#/state/geolocation/types';
export { PermissionStatus } from 'expo-location';
export declare function useRequestDeviceLocation(): () => Promise<{
    granted: true;
    location: DeviceLocation | undefined;
} | {
    granted: false;
    status: {
        canAskAgain: boolean;
        /**
         * Enum, use `PermissionStatus` export for comparisons
         */
        permissionStatus: Location.PermissionStatus;
    };
}>;
//# sourceMappingURL=useRequestDeviceLocation.d.ts.map