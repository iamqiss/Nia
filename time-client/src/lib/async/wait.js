export async function wait(delay, fn) {
    return await Promise.all([fn, new Promise(y => setTimeout(y, delay))]).then(arr => arr[0]);
}
//# sourceMappingURL=wait.js.map