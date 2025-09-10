import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import * as persisted from '#/state/persisted';
const stateContext = React.createContext(Boolean(persisted.defaults.subtitlesEnabled));
stateContext.displayName = 'SubtitlesStateContext';
const setContext = React.createContext((_) => { });
setContext.displayName = 'SubtitlesSetContext';
export function Provider({ children }) {
    const [state, setState] = React.useState(Boolean(persisted.get('subtitlesEnabled')));
    const setStateWrapped = React.useCallback((subtitlesEnabled) => {
        setState(Boolean(subtitlesEnabled));
        persisted.write('subtitlesEnabled', subtitlesEnabled);
    }, [setState]);
    React.useEffect(() => {
        return persisted.onUpdate('subtitlesEnabled', nextSubtitlesEnabled => {
            setState(Boolean(nextSubtitlesEnabled));
        });
    }, [setStateWrapped]);
    return (_jsx(stateContext.Provider, { value: state, children: _jsx(setContext.Provider, { value: setStateWrapped, children: children }) }));
}
export const useSubtitlesEnabled = () => React.useContext(stateContext);
export const useSetSubtitlesEnabled = () => React.useContext(setContext);
//# sourceMappingURL=subtitles.js.map