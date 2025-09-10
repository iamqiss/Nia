import { device, useStorage } from '#/storage';
export function useActivitySubscriptionsNudged() {
    const [activitySubscriptionsNudged = false, setActivitySubscriptionsNudged] = useStorage(device, ['activitySubscriptionsNudged']);
    return [activitySubscriptionsNudged, setActivitySubscriptionsNudged];
}
//# sourceMappingURL=activity-subscriptions-nudged.js.map