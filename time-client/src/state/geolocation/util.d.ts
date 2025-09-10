import { type LocationGeocodedAddress } from 'expo-location';
import { type DeviceLocation } from '#/state/geolocation/types';
import { type Device } from '#/storage';
/**
 * Maps full US region names to their short codes.
 *
 * Context: in some cases, like on Android, we get the full region name instead
 * of the short code. We may need to expand this in the future to other
 * countries, hence the prefix.
 */
export declare const USRegionNameToRegionCode: {
    [regionName: string]: string;
};
/**
 * Normalizes a `LocationGeocodedAddress` into a `DeviceLocation`.
 *
 * We don't want or care about the full location data, so we trim it down and
 * normalize certain fields, like region, into the format we need.
 */
export declare function normalizeDeviceLocation(location: LocationGeocodedAddress): DeviceLocation;
/**
 * Combines precise location data with the geolocation config fetched from the
 * IP service, with preference to the precise data.
 */
export declare function mergeGeolocation(location?: DeviceLocation, config?: Device['geolocation']): DeviceLocation;
/**
 * Computes the geolocation status (age-restricted, age-blocked) based on the
 * given location and geolocation config. `location` here should be merged with
 * `mergeGeolocation()` ahead of time if needed.
 */
export declare function computeGeolocationStatus(location: DeviceLocation, config: Device['geolocation']): any;
export declare function getDeviceGeolocation(): Promise<DeviceLocation>;
//# sourceMappingURL=util.d.ts.map