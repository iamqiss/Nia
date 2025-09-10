/**
 * Hook to register the device's push notification token with the Bluesky. If
 * the user is not logged in, this will do nothing.
 *
 * Use this instead of using `_registerPushToken` or
 * `_registerPushTokenDebounced` directly.
 */
export declare function useRegisterPushToken(): any;
/**
 * Hook to get the device push token and register it with the Bluesky server.
 * Should only be called after a user has logged-in, since registration is an
 * authed endpoint.
 *
 * N.B. A previous regression in `expo-notifications` caused
 * `addPushTokenListener` to not fire on Android after calling
 * `getPushToken()`. Therefore, as insurance, we also call
 * `registerPushToken` here.
 *
 * Because `registerPushToken` is debounced, even if the the listener _does_
 * fire, it's OK to also call `registerPushToken` below since only a single
 * call will be made to the server (ideally). This does race the listener (if
 * it fires), so there's a possibility that multiple calls will be made, but
 * that is acceptable.
 *
 * @see https://github.com/expo/expo/issues/28656
 * @see https://github.com/expo/expo/issues/29909
 * @see https://github.com/bluesky-social/social-app/pull/4467
 */
export declare function useGetAndRegisterPushToken(): any;
/**
 * Hook to register the device's push notification token with the Bluesky
 * server, as well as listen for push token updates, should they occurr.
 *
 * Registered via the shell, which wraps the navigation stack, meaning if we
 * have a current account, this handling will be registered and ready to go.
 */
export declare function useNotificationsRegistration(): void;
export declare function useRequestNotificationsPermission(): (context: "StartOnboarding" | "AfterOnboarding" | "Login" | "Home") => Promise<void>;
export declare function decrementBadgeCount(by: number): Promise<void>;
export declare function resetBadgeCount(): Promise<void>;
//# sourceMappingURL=notifications.d.ts.map