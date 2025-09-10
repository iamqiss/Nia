import * as React from 'react';
/**
 * Helper hook to run persistent timers on views
 */
export function useTimer(time, handler) {
    const timer = React.useRef(undefined);
    // function to restart the timer
    const reset = React.useCallback(() => {
        if (timer.current) {
            clearTimeout(timer.current);
        }
        timer.current = setTimeout(handler, time);
    }, [time, timer, handler]);
    // function to cancel the timer
    const cancel = React.useCallback(() => {
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = undefined;
        }
    }, [timer]);
    // start the timer immediately
    React.useEffect(() => {
        reset();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return [reset, cancel];
}
//# sourceMappingURL=useTimer.js.map