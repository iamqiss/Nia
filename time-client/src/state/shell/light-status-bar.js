import { useEffect } from 'react';
import { SystemBars } from 'react-native-edge-to-edge';
export function useSetLightStatusBar(enabled) {
    useEffect(() => {
        if (enabled) {
            const entry = SystemBars.pushStackEntry({
                style: {
                    statusBar: 'light',
                },
            });
            return () => {
                SystemBars.popStackEntry(entry);
            };
        }
    }, [enabled]);
}
//# sourceMappingURL=light-status-bar.js.map