import { useCallback } from 'react';
export var OnceKey;
(function (OnceKey) {
    OnceKey["PreferencesThread"] = "preferences:thread";
})(OnceKey || (OnceKey = {}));
const called = {
    [OnceKey.PreferencesThread]: false,
};
export function useCallOnce(key) {
    return useCallback((cb) => {
        if (called[key] === true)
            return;
        called[key] = true;
        cb();
    }, [key]);
}
//# sourceMappingURL=useCallOnce.js.map