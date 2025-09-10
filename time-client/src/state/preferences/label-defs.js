import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import {} from '@atproto/api';
import { useLabelDefinitionsQuery } from '../queries/preferences';
const stateContext = React.createContext({
    labelDefs: {},
    labelers: [],
});
stateContext.displayName = 'LabelDefsStateContext';
export function Provider({ children }) {
    const state = useLabelDefinitionsQuery();
    return _jsx(stateContext.Provider, { value: state, children: children });
}
export function useLabelDefinitions() {
    return React.useContext(stateContext);
}
//# sourceMappingURL=label-defs.js.map