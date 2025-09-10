import React from 'react';
import { type AppBskyActorDefs, type AppBskyLabelerDefs, type ModerationOpts, type RichText as RichTextAPI } from '@atproto/api';
declare let ProfileHeaderLoading: (_props: {}) => React.ReactNode;
export { ProfileHeaderLoading };
interface Props {
    profile: AppBskyActorDefs.ProfileViewDetailed;
    labeler: AppBskyLabelerDefs.LabelerViewDetailed | undefined;
    descriptionRT: RichTextAPI | null;
    moderationOpts: ModerationOpts;
    hideBackButton?: boolean;
    isPlaceholderProfile?: boolean;
    setMinimumHeight: (height: number) => void;
}
declare let ProfileHeader: ({ setMinimumHeight, ...props }: Props) => React.ReactNode;
export { ProfileHeader };
//# sourceMappingURL=index.d.ts.map