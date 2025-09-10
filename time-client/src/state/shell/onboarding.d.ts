import React from 'react';
import * as persisted from '#/state/persisted';
export declare const OnboardingScreenSteps: {
    readonly Welcome: "Welcome";
    readonly RecommendedFeeds: "RecommendedFeeds";
    readonly RecommendedFollows: "RecommendedFollows";
    readonly Home: "Home";
};
type OnboardingStep = (typeof OnboardingScreenSteps)[keyof typeof OnboardingScreenSteps];
type Action = {
    type: 'set';
    step: OnboardingStep;
} | {
    type: 'next';
    currentStep?: OnboardingStep;
} | {
    type: 'start';
} | {
    type: 'finish';
} | {
    type: 'skip';
};
export type StateContext = persisted.Schema['onboarding'] & {
    isComplete: boolean;
    isActive: boolean;
};
export type DispatchContext = (action: Action) => void;
export declare function Provider({ children }: React.PropsWithChildren<{}>): any;
export declare function useOnboardingState(): any;
export declare function useOnboardingDispatch(): any;
export declare function isOnboardingActive(): any;
export {};
//# sourceMappingURL=onboarding.d.ts.map