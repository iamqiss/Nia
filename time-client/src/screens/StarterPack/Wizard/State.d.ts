import React from 'react';
import { type AppBskyFeedDefs, type AppBskyGraphDefs } from '@atproto/api';
import * as bsky from '#/types/bsky';
declare const steps: readonly ["Details", "Profiles", "Feeds"];
type Step = (typeof steps)[number];
type Action = {
    type: 'Next';
} | {
    type: 'Back';
} | {
    type: 'SetCanNext';
    canNext: boolean;
} | {
    type: 'SetName';
    name: string;
} | {
    type: 'SetDescription';
    description: string;
} | {
    type: 'AddProfile';
    profile: bsky.profile.AnyProfileView;
} | {
    type: 'RemoveProfile';
    profileDid: string;
} | {
    type: 'AddFeed';
    feed: AppBskyFeedDefs.GeneratorView;
} | {
    type: 'RemoveFeed';
    feedUri: string;
} | {
    type: 'SetProcessing';
    processing: boolean;
} | {
    type: 'SetError';
    error: string;
};
interface State {
    canNext: boolean;
    currentStep: Step;
    name?: string;
    description?: string;
    profiles: bsky.profile.AnyProfileView[];
    feeds: AppBskyFeedDefs.GeneratorView[];
    processing: boolean;
    error?: string;
    transitionDirection: 'Backward' | 'Forward';
    targetDid?: string;
}
export declare const useWizardState: () => any;
export declare function Provider({ starterPack, listItems, targetProfile, children, }: {
    starterPack?: AppBskyGraphDefs.StarterPackView;
    listItems?: AppBskyGraphDefs.ListItemView[];
    targetProfile: bsky.profile.AnyProfileView;
    children: React.ReactNode;
}): any;
export { type Action as WizardAction, type State as WizardState, type Step as WizardStep, };
//# sourceMappingURL=State.d.ts.map