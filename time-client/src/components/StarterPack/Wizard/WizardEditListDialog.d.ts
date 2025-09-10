import { type AppBskyActorDefs, type ModerationOpts } from '@atproto/api';
import { type WizardAction, type WizardState } from '#/screens/StarterPack/Wizard/State';
import * as Dialog from '#/components/Dialog';
export declare function WizardEditListDialog({ control, state, dispatch, moderationOpts, profile, }: {
    control: Dialog.DialogControlProps;
    state: WizardState;
    dispatch: (action: WizardAction) => void;
    moderationOpts: ModerationOpts;
    profile: AppBskyActorDefs.ProfileViewDetailed;
}): any;
//# sourceMappingURL=WizardEditListDialog.d.ts.map