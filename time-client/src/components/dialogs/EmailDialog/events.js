import { useEffect } from 'react';
import EventEmitter from 'eventemitter3';
const events = new EventEmitter();
export function emitEmailVerified() {
    events.emit('emailVerified');
}
export function useOnEmailVerified(cb) {
    useEffect(() => {
        /*
         * N.B. Use `once` here, since the event can fire multiple times for each
         * instance of `useAccountEmailState`
         */
        events.once('emailVerified', cb);
        return () => {
            events.off('emailVerified', cb);
        };
    }, [cb]);
}
//# sourceMappingURL=events.js.map