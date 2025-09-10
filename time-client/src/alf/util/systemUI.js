import * as SystemUI from 'expo-system-ui';
import { isAndroid } from '#/platform/detection';
import {} from '../types';
export function setSystemUITheme(themeType, t) {
    if (isAndroid) {
        if (themeType === 'theme') {
            SystemUI.setBackgroundColorAsync(t.atoms.bg.backgroundColor);
        }
        else {
            SystemUI.setBackgroundColorAsync('black');
        }
    }
}
//# sourceMappingURL=systemUI.js.map