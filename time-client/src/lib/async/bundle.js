/**
 * A helper which ensures that multiple calls to an async function
 * only produces one in-flight request at a time.
 */
export function bundleAsync(fn) {
    let promise;
    return async (...args) => {
        if (promise) {
            return promise;
        }
        promise = fn(...args);
        try {
            return await promise;
        }
        finally {
            promise = undefined;
        }
    };
}
//# sourceMappingURL=bundle.js.map