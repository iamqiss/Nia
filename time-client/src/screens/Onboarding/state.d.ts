import { type AvatarColor, type Emoji } from '#/screens/Onboarding/StepProfile/types';
export type OnboardingState = {
    hasPrev: boolean;
    totalSteps: number;
    activeStep: 'profile' | 'interests' | 'suggested-accounts' | 'finished';
    activeStepIndex: number;
    interestsStepResults: {
        selectedInterests: string[];
        apiResponse: ApiResponseMap;
    };
    profileStepResults: {
        isCreatedAvatar: boolean;
        image?: {
            path: string;
            mime: string;
            size: number;
            width: number;
            height: number;
        };
        imageUri?: string;
        imageMime?: string;
        creatorState?: {
            emoji: Emoji;
            backgroundColor: AvatarColor;
        };
    };
    experiments?: {
        onboarding_suggested_accounts?: boolean;
        onboarding_value_prop?: boolean;
    };
};
export type OnboardingAction = {
    type: 'next';
} | {
    type: 'prev';
} | {
    type: 'finish';
} | {
    type: 'setInterestsStepResults';
    selectedInterests: string[];
    apiResponse: ApiResponseMap;
} | {
    type: 'setProfileStepResults';
    isCreatedAvatar: boolean;
    image: OnboardingState['profileStepResults']['image'] | undefined;
    imageUri: string | undefined;
    imageMime: string;
    creatorState: {
        emoji: Emoji;
        backgroundColor: AvatarColor;
    } | undefined;
};
export type ApiResponseMap = {
    interests: string[];
    suggestedAccountDids: {
        [key: string]: string[];
    };
    suggestedFeedUris: {
        [key: string]: string[];
    };
};
export declare const popularInterests: string[];
export declare function useInterestsDisplayNames(): any;
export declare const initialState: OnboardingState;
export declare const Context: any;
export declare function reducer(s: OnboardingState, a: OnboardingAction): OnboardingState;
//# sourceMappingURL=state.d.ts.map