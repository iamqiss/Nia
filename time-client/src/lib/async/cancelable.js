export function cancelable(f, signal) {
    return (args) => {
        return new Promise((resolve, reject) => {
            signal.addEventListener('abort', () => {
                reject(new AbortError());
            });
            f(args).then(resolve, reject);
        });
    };
}
export class AbortError extends Error {
    constructor() {
        super('Aborted');
        this.name = 'AbortError';
    }
}
//# sourceMappingURL=cancelable.js.map