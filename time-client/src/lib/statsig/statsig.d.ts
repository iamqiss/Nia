import React from 'react';
import { type MetricEvents } from '#/logger/metrics';
import { type Gate } from './gates';
export declare const initPromise: any;
export type { MetricEvents as LogEvents };
type FlatJSONRecord = Record<string, string | number | boolean | null | undefined | string[]>;
export declare function attachRouteToLogEvents(getRouteName: () => string | null | undefined): void;
export declare function toClout(n: number | null | undefined): number | undefined;
/**
 * @deprecated use `logger.metric()` instead
 */
export declare function logEvent<E extends keyof MetricEvents>(eventName: E & string, rawMetadata: MetricEvents[E] & FlatJSONRecord, options?: {
    /**
     * Send to our data lake only, not to StatSig
     */
    lake?: boolean;
}): void;
type GateOptions = {
    dangerouslyDisableExposureLogging?: boolean;
};
export declare function useGate(): (gateName: Gate, options?: GateOptions) => boolean;
/**
 * Debugging tool to override a gate. USE ONLY IN E2E TESTS!
 */
export declare function useDangerousSetGate(): (gateName: Gate, value: boolean) => void;
export declare function tryFetchGates(did: string | undefined, strategy: 'prefer-low-latency' | 'prefer-fresh-gates'): Promise<void>;
export declare function initialize(): any;
export declare function Provider({ children }: {
    children: React.ReactNode;
}): any;
//# sourceMappingURL=statsig.d.ts.map