import React from 'react';
import {} from '#/components/Dialog/types';
export function useAutoOpen(control, showTimeout) {
    React.useEffect(() => {
        if (showTimeout) {
            const timeout = setTimeout(() => {
                control.open();
            }, showTimeout);
            return () => {
                clearTimeout(timeout);
            };
        }
        else {
            control.open();
        }
    }, [control, showTimeout]);
}
//# sourceMappingURL=utils.js.map