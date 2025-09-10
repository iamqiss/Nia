import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
export function Img(props) {
    const { src, ...others } = props;
    return (_jsx("img", { ...others, src: `data:image/jpeg;base64,${src.toString('base64')}` }));
}
//# sourceMappingURL=Img.js.map