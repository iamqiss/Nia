import { type AppBskyFeedDefs, type ModerationOpts } from '@atproto/api';
import { type WizardAction, type WizardState } from '#/screens/StarterPack/Wizard/State';
import type * as bsky from '#/types/bsky';
export declare function WizardProfileCard({ btnType, state, dispatch, profile, moderationOpts, }: {
    btnType: 'checkbox' | 'remove';
    state: WizardState;
    dispatch: (action: WizardAction) => void;
    profile: bsky.profile.AnyProfileView;
    moderationOpts: ModerationOpts;
}): any;
export declare function WizardFeedCard({ btnType, generator, state, dispatch, moderationOpts, }: {
    btnType: 'checkbox' | 'remove';
    generator: AppBskyFeedDefs.GeneratorView;
    state: WizardState;
    dispatch: (action: WizardAction) => void;
    moderationOpts: ModerationOpts;
}): any;
//# sourceMappingURL=WizardListCard.d.ts.map