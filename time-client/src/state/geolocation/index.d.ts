import React from 'react';
export * from '#/state/geolocation/config';
export * from '#/state/geolocation/types';
export * from '#/state/geolocation/util';
/**
 * Provider of geolocation config and computed geolocation status.
 */
export declare function GeolocationStatusProvider({ children, }: {
    children: React.ReactNode;
}): any;
/**
 * Provider of providers. Provides device geolocation data to lower-level
 * `GeolocationStatusProvider`, and device geolocation APIs to children.
 */
export declare function Provider({ children }: {
    children: React.ReactNode;
}): any;
export declare function useDeviceGeolocationApi(): any;
export declare function useGeolocationConfig(): any;
export declare function useGeolocationStatus(): any;
//# sourceMappingURL=index.d.ts.map