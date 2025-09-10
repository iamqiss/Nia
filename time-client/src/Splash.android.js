import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
export function Splash({ isReady, children }) {
    useEffect(() => {
        if (isReady) {
            SplashScreen.hideAsync();
        }
    }, [isReady]);
    if (isReady) {
        return children;
    }
}
//# sourceMappingURL=Splash.android.js.map