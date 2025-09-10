import React from 'react';
const PostProgressContext = React.createContext({
    progress: 0,
    status: 'idle',
});
PostProgressContext.displayName = 'PostProgressContext';
export function Provider() { }
export function usePostProgress() {
    return React.useContext(PostProgressContext);
}
//# sourceMappingURL=post-progress.js.map