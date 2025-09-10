import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import * as persisted from '#/state/persisted';
export const OnboardingScreenSteps = {
    Welcome: 'Welcome',
    RecommendedFeeds: 'RecommendedFeeds',
    RecommendedFollows: 'RecommendedFollows',
    Home: 'Home',
};
const OnboardingStepsArray = Object.values(OnboardingScreenSteps);
const stateContext = React.createContext(compute(persisted.defaults.onboarding));
stateContext.displayName = 'OnboardingStateContext';
const dispatchContext = React.createContext((_) => { });
dispatchContext.displayName = 'OnboardingDispatchContext';
function reducer(state, action) {
    switch (action.type) {
        case 'set': {
            if (OnboardingStepsArray.includes(action.step)) {
                persisted.write('onboarding', { step: action.step });
                return compute({ ...state, step: action.step });
            }
            return state;
        }
        case 'next': {
            const currentStep = action.currentStep || state.step;
            let nextStep = 'Home';
            if (currentStep === 'Welcome') {
                nextStep = 'RecommendedFeeds';
            }
            else if (currentStep === 'RecommendedFeeds') {
                nextStep = 'RecommendedFollows';
            }
            else if (currentStep === 'RecommendedFollows') {
                nextStep = 'Home';
            }
            persisted.write('onboarding', { step: nextStep });
            return compute({ ...state, step: nextStep });
        }
        case 'start': {
            persisted.write('onboarding', { step: 'Welcome' });
            return compute({ ...state, step: 'Welcome' });
        }
        case 'finish': {
            persisted.write('onboarding', { step: 'Home' });
            return compute({ ...state, step: 'Home' });
        }
        case 'skip': {
            persisted.write('onboarding', { step: 'Home' });
            return compute({ ...state, step: 'Home' });
        }
        default: {
            throw new Error('Invalid action');
        }
    }
}
export function Provider({ children }) {
    const [state, dispatch] = React.useReducer(reducer, compute(persisted.get('onboarding')));
    React.useEffect(() => {
        return persisted.onUpdate('onboarding', nextOnboarding => {
            const next = nextOnboarding.step;
            // TODO we've introduced a footgun
            if (state.step !== next) {
                dispatch({
                    type: 'set',
                    step: nextOnboarding.step,
                });
            }
        });
    }, [state, dispatch]);
    return (_jsx(stateContext.Provider, { value: state, children: _jsx(dispatchContext.Provider, { value: dispatch, children: children }) }));
}
export function useOnboardingState() {
    return React.useContext(stateContext);
}
export function useOnboardingDispatch() {
    return React.useContext(dispatchContext);
}
export function isOnboardingActive() {
    return compute(persisted.get('onboarding')).isActive;
}
function compute(state) {
    return {
        ...state,
        isActive: state.step !== 'Home',
        isComplete: state.step === 'Home',
    };
}
//# sourceMappingURL=onboarding.js.map