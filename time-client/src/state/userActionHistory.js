import React from 'react';
const LIKE_WINDOW = 100;
const FOLLOW_WINDOW = 100;
const FOLLOW_SUGGESTION_WINDOW = 100;
const SEEN_WINDOW = 100;
const userActionHistory = {
    likes: [],
    follows: [],
    followSuggestions: [],
    seen: [],
};
export function getActionHistory() {
    return userActionHistory;
}
export function useActionHistorySnapshot() {
    return React.useState(() => getActionHistory())[0];
}
export function like(postUris) {
    userActionHistory.likes = userActionHistory.likes
        .concat(postUris)
        .slice(-LIKE_WINDOW);
}
export function unlike(postUris) {
    userActionHistory.likes = userActionHistory.likes.filter(uri => !postUris.includes(uri));
}
export function follow(dids) {
    userActionHistory.follows = userActionHistory.follows
        .concat(dids)
        .slice(-FOLLOW_WINDOW);
}
export function followSuggestion(dids) {
    userActionHistory.followSuggestions = userActionHistory.followSuggestions
        .concat(dids)
        .slice(-FOLLOW_SUGGESTION_WINDOW);
}
export function unfollow(dids) {
    userActionHistory.follows = userActionHistory.follows.filter(uri => !dids.includes(uri));
}
export function seen(posts) {
    userActionHistory.seen = userActionHistory.seen
        .concat(posts)
        .slice(-SEEN_WINDOW);
}
//# sourceMappingURL=userActionHistory.js.map