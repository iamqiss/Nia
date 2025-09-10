import { jsx as _jsx } from "react/jsx-runtime";
import { Image } from 'expo-image';
export function HighPriorityImage({ source, ...props }) {
    const updatedSource = {
        uri: typeof source === 'object' && source ? source.uri : '',
    };
    return (_jsx(Image, { accessibilityIgnoresInvertColors: true, source: updatedSource, ...props }));
}
//# sourceMappingURL=Image.js.map