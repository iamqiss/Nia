import React from 'react';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { logger } from '#/logger';
import {} from '#/screens/Onboarding/StepProfile/types';
// most popular selected interests
export const popularInterests = [
    'art',
    'gaming',
    'sports',
    'comics',
    'music',
    'politics',
    'photography',
    'science',
    'news',
];
export function useInterestsDisplayNames() {
    const { _ } = useLingui();
    return React.useMemo(() => {
        return {
            // Keep this alphabetized
            animals: _(msg `Animals`),
            art: _(msg `Art`),
            books: _(msg `Books`),
            comedy: _(msg `Comedy`),
            comics: _(msg `Comics`),
            culture: _(msg `Culture`),
            dev: _(msg `Software Dev`),
            education: _(msg `Education`),
            food: _(msg `Food`),
            gaming: _(msg `Video Games`),
            journalism: _(msg `Journalism`),
            movies: _(msg `Movies`),
            music: _(msg `Music`),
            nature: _(msg `Nature`),
            news: _(msg `News`),
            pets: _(msg `Pets`),
            photography: _(msg `Photography`),
            politics: _(msg `Politics`),
            science: _(msg `Science`),
            sports: _(msg `Sports`),
            tech: _(msg `Tech`),
            tv: _(msg `TV`),
            writers: _(msg `Writers`),
        };
    }, [_]);
}
export const initialState = {
    hasPrev: false,
    totalSteps: 3,
    activeStep: 'profile',
    activeStepIndex: 1,
    interestsStepResults: {
        selectedInterests: [],
        apiResponse: {
            interests: [],
            suggestedAccountDids: {},
            suggestedFeedUris: {},
        },
    },
    profileStepResults: {
        isCreatedAvatar: false,
        image: undefined,
        imageUri: '',
        imageMime: '',
    },
};
export const Context = React.createContext({
    state: { ...initialState },
    dispatch: () => { },
});
Context.displayName = 'OnboardingContext';
export function reducer(s, a) {
    let next = { ...s };
    switch (a.type) {
        case 'next': {
            if (s.experiments?.onboarding_suggested_accounts) {
                if (s.activeStep === 'profile') {
                    next.activeStep = 'interests';
                    next.activeStepIndex = 2;
                }
                else if (s.activeStep === 'interests') {
                    next.activeStep = 'suggested-accounts';
                    next.activeStepIndex = 3;
                }
                if (s.activeStep === 'suggested-accounts') {
                    next.activeStep = 'finished';
                    next.activeStepIndex = 4;
                }
            }
            else {
                if (s.activeStep === 'profile') {
                    next.activeStep = 'interests';
                    next.activeStepIndex = 2;
                }
                else if (s.activeStep === 'interests') {
                    next.activeStep = 'finished';
                    next.activeStepIndex = 3;
                }
            }
            break;
        }
        case 'prev': {
            if (s.experiments?.onboarding_suggested_accounts) {
                if (s.activeStep === 'interests') {
                    next.activeStep = 'profile';
                    next.activeStepIndex = 1;
                }
                else if (s.activeStep === 'suggested-accounts') {
                    next.activeStep = 'interests';
                    next.activeStepIndex = 2;
                }
                else if (s.activeStep === 'finished') {
                    next.activeStep = 'suggested-accounts';
                    next.activeStepIndex = 3;
                }
            }
            else {
                if (s.activeStep === 'interests') {
                    next.activeStep = 'profile';
                    next.activeStepIndex = 1;
                }
                else if (s.activeStep === 'finished') {
                    next.activeStep = 'interests';
                    next.activeStepIndex = 2;
                }
            }
            break;
        }
        case 'finish': {
            next = initialState;
            break;
        }
        case 'setInterestsStepResults': {
            next.interestsStepResults = {
                selectedInterests: a.selectedInterests,
                apiResponse: a.apiResponse,
            };
            break;
        }
        case 'setProfileStepResults': {
            next.profileStepResults = {
                isCreatedAvatar: a.isCreatedAvatar,
                image: a.image,
                imageUri: a.imageUri,
                imageMime: a.imageMime,
                creatorState: a.creatorState,
            };
            break;
        }
    }
    const state = {
        ...next,
        hasPrev: next.activeStep !== 'profile',
    };
    logger.debug(`onboarding`, {
        hasPrev: state.hasPrev,
        activeStep: state.activeStep,
        activeStepIndex: state.activeStepIndex,
        interestsStepResults: {
            selectedInterests: state.interestsStepResults.selectedInterests,
        },
        profileStepResults: state.profileStepResults,
    });
    if (s.activeStep !== state.activeStep) {
        logger.debug(`onboarding: step changed`, { activeStep: state.activeStep });
    }
    return state;
}
//# sourceMappingURL=state.js.map