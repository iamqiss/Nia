import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import * as persisted from '#/state/persisted';
const stateContext = React.createContext(persisted.defaults.invites);
stateContext.displayName = 'InvitesStateContext';
const apiContext = React.createContext({
    setInviteCopied(_) { },
});
apiContext.displayName = 'InvitesApiContext';
export function Provider({ children }) {
    const [state, setState] = React.useState(persisted.get('invites'));
    const api = React.useMemo(() => ({
        setInviteCopied(code) {
            setState(state => {
                state = {
                    ...state,
                    copiedInvites: state.copiedInvites.includes(code)
                        ? state.copiedInvites
                        : state.copiedInvites.concat([code]),
                };
                persisted.write('invites', state);
                return state;
            });
        },
    }), [setState]);
    React.useEffect(() => {
        return persisted.onUpdate('invites', nextInvites => {
            setState(nextInvites);
        });
    }, [setState]);
    return (_jsx(stateContext.Provider, { value: state, children: _jsx(apiContext.Provider, { value: api, children: children }) }));
}
export function useInvitesState() {
    return React.useContext(stateContext);
}
export function useInvitesAPI() {
    return React.useContext(apiContext);
}
//# sourceMappingURL=invites.js.map