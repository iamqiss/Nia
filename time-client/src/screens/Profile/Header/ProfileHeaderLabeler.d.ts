import React from 'react';
import { type AppBskyActorDefs, type AppBskyLabelerDefs, type ModerationOpts, type RichText as RichTextAPI } from '@atproto/api';
interface Props {
    profile: AppBskyActorDefs.ProfileViewDetailed;
    labeler: AppBskyLabelerDefs.LabelerViewDetailed;
    descriptionRT: RichTextAPI | null;
    moderationOpts: ModerationOpts;
    hideBackButton?: boolean;
    isPlaceholderProfile?: boolean;
}
declare let ProfileHeaderLabeler: ({ profile: profileUnshadowed, labeler, descriptionRT, moderationOpts, hideBackButton, isPlaceholderProfile, }: Props) => React.ReactNode;
export { ProfileHeaderLabeler };
//# sourceMappingURL=ProfileHeaderLabeler.d.ts.map