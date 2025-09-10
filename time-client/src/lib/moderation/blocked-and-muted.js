export function isBlockedOrBlocking(profile) {
    return profile.viewer?.blockedBy || profile.viewer?.blocking;
}
export function isMuted(profile) {
    return profile.viewer?.muted || profile.viewer?.mutedByList;
}
//# sourceMappingURL=blocked-and-muted.js.map