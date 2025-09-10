import { jsx as _jsx } from "react/jsx-runtime";
import { View } from 'react-native';
import { useWebMediaQueries } from '#/lib/hooks/useWebMediaQueries';
import { FABInner } from './FABInner';
export const FAB = (_opts) => {
    const { isDesktop } = useWebMediaQueries();
    if (!isDesktop) {
        return _jsx(FABInner, { ..._opts });
    }
    return _jsx(View, {});
};
//# sourceMappingURL=FAB.web.js.map