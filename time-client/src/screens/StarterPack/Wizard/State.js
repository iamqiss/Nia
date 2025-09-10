import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { AppBskyGraphStarterpack, } from '@atproto/api';
import { msg, plural } from '@lingui/macro';
import { STARTER_PACK_MAX_SIZE } from '#/lib/constants';
import * as Toast from '#/view/com/util/Toast';
import * as bsky from '#/types/bsky';
const steps = ['Details', 'Profiles', 'Feeds'];
const StateContext = React.createContext([
    {},
    (_) => { },
]);
StateContext.displayName = 'StarterPackWizardStateContext';
export const useWizardState = () => React.useContext(StateContext);
function reducer(state, action) {
    let updatedState = state;
    // -- Navigation
    const currentIndex = steps.indexOf(state.currentStep);
    if (action.type === 'Next' && state.currentStep !== 'Feeds') {
        updatedState = {
            ...state,
            currentStep: steps[currentIndex + 1],
            transitionDirection: 'Forward',
        };
    }
    else if (action.type === 'Back' && state.currentStep !== 'Details') {
        updatedState = {
            ...state,
            currentStep: steps[currentIndex - 1],
            transitionDirection: 'Backward',
        };
    }
    switch (action.type) {
        case 'SetName':
            updatedState = { ...state, name: action.name.slice(0, 50) };
            break;
        case 'SetDescription':
            updatedState = { ...state, description: action.description };
            break;
        case 'AddProfile':
            if (state.profiles.length > STARTER_PACK_MAX_SIZE) {
                Toast.show(msg `You may only add up to ${plural(STARTER_PACK_MAX_SIZE, {
                    other: `${STARTER_PACK_MAX_SIZE} profiles`,
                })}`.message ?? '', 'info');
            }
            else {
                updatedState = { ...state, profiles: [...state.profiles, action.profile] };
            }
            break;
        case 'RemoveProfile':
            updatedState = {
                ...state,
                profiles: state.profiles.filter(profile => profile.did !== action.profileDid),
            };
            break;
        case 'AddFeed':
            if (state.feeds.length >= 3) {
                Toast.show(msg `You may only add up to 3 feeds`.message ?? '', 'info');
            }
            else {
                updatedState = { ...state, feeds: [...state.feeds, action.feed] };
            }
            break;
        case 'RemoveFeed':
            updatedState = {
                ...state,
                feeds: state.feeds.filter(f => f.uri !== action.feedUri),
            };
            break;
        case 'SetProcessing':
            updatedState = { ...state, processing: action.processing };
            break;
    }
    return updatedState;
}
export function Provider({ starterPack, listItems, targetProfile, children, }) {
    const createInitialState = () => {
        const targetDid = targetProfile?.did;
        if (starterPack &&
            bsky.validate(starterPack.record, AppBskyGraphStarterpack.validateRecord)) {
            return {
                canNext: true,
                currentStep: 'Details',
                name: starterPack.record.name,
                description: starterPack.record.description,
                profiles: listItems?.map(i => i.subject) ?? [],
                feeds: starterPack.feeds ?? [],
                processing: false,
                transitionDirection: 'Forward',
                targetDid,
            };
        }
        return {
            canNext: true,
            currentStep: 'Details',
            profiles: [targetProfile],
            feeds: [],
            processing: false,
            transitionDirection: 'Forward',
            targetDid,
        };
    };
    const [state, dispatch] = React.useReducer(reducer, null, createInitialState);
    return (_jsx(StateContext.Provider, { value: [state, dispatch], children: children }));
}
export {};
//# sourceMappingURL=State.js.map