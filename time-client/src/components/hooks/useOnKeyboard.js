import React from 'react';
import { Keyboard } from 'react-native';
export function useOnKeyboardDidShow(cb) {
    React.useEffect(() => {
        const subscription = Keyboard.addListener('keyboardDidShow', cb);
        return () => {
            subscription.remove();
        };
    }, [cb]);
}
//# sourceMappingURL=useOnKeyboard.js.map