import { type Did } from '@atproto/api';
/**
 * The semver version of the app, as defined in `package.json.`
 *
 * N.B. The fallback is needed for Render.com deployments
 */
export declare const RELEASE_VERSION: string;
/**
 * The env the app is running in e.g. development, testflight, production, e2e
 */
export declare const ENV: string;
/**
 * Indicates whether the app is running in TestFlight
 */
export declare const IS_TESTFLIGHT: boolean;
/**
 * Indicates whether the app is __DEV__
 */
export declare const IS_DEV: any;
/**
 * Indicates whether the app is __DEV__ or TestFlight
 */
export declare const IS_INTERNAL: any;
/**
 * The commit hash that the current bundle was made from. The user can
 * see the commit hash in the app's settings along with the other version info.
 * Useful for debugging/reporting.
 */
export declare const BUNDLE_IDENTIFIER: string;
/**
 * This will always be in the format of YYMMDDHH, so that it always increases
 * for each build. This should only be used for StatSig reporting and shouldn't
 * be used to identify a specific bundle.
 */
export declare const BUNDLE_DATE: number;
/**
 * The log level for the app.
 */
export declare const LOG_LEVEL: "debug" | "info" | "warn" | "error";
/**
 * Enable debug logs for specific logger instances
 */
export declare const LOG_DEBUG: string;
/**
 * The DID of the Bluesky appview to proxy to
 */
export declare const BLUESKY_PROXY_DID: Did;
/**
 * The DID of the chat service to proxy to
 */
export declare const CHAT_PROXY_DID: Did;
/**
 * Sentry DSN for telemetry
 */
export declare const SENTRY_DSN: string | undefined;
/**
 * Bitdrift API key. If undefined, Bitdrift should be disabled.
 */
export declare const BITDRIFT_API_KEY: string | undefined;
/**
 * GCP project ID which is required for native device attestation. On web, this
 * should be unset and evaluate to 0.
 */
export declare const GCP_PROJECT_ID: number;
/**
 * URL for the bapp-config web worker _development_ environment. Can be a
 * locally running server, see `env.example` for more.
 */
export declare const BAPP_CONFIG_DEV_URL: string | undefined;
/**
 * Dev environment passthrough value for bapp-config web worker. Allows local
 * dev access to the web worker running in `development` mode.
 */
export declare const BAPP_CONFIG_DEV_BYPASS_SECRET: string;
//# sourceMappingURL=common.d.ts.map