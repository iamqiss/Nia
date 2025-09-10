import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { BackgroundNotificationHandlerPreferences } from './ExpoBackgroundNotificationHandler.types';
import { BackgroundNotificationHandler } from './ExpoBackgroundNotificationHandlerModule';
const Context = React.createContext({});
export const useBackgroundNotificationPreferences = () => React.useContext(Context);
export function BackgroundNotificationPreferencesProvider({ children, }) {
    const [preferences, setPreferences] = React.useState({
        playSoundChat: true,
    });
    React.useEffect(() => {
        ;
        (async () => {
            const prefs = await BackgroundNotificationHandler.getAllPrefsAsync();
            setPreferences(prefs);
        })();
    }, []);
    const value = React.useMemo(() => ({
        preferences,
        setPref: async (k, v) => {
            switch (typeof v) {
                case 'boolean': {
                    await BackgroundNotificationHandler.setBoolAsync(k, v);
                    break;
                }
                case 'string': {
                    await BackgroundNotificationHandler.setStringAsync(k, v);
                    break;
                }
                default: {
                    throw new Error(`Invalid type for value: ${typeof v}`);
                }
            }
            setPreferences(prev => ({
                ...prev,
                [k]: v,
            }));
        },
    }), [preferences]);
    return _jsx(Context.Provider, { value: value, children: children });
}
//# sourceMappingURL=BackgroundNotificationHandlerProvider.js.map