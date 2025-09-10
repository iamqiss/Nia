import { type AppBskyActorDefs, type ModerationOpts, type RichText as RichTextAPI } from '@atproto/api';
interface Props {
    profile: AppBskyActorDefs.ProfileViewDetailed;
    descriptionRT: RichTextAPI | null;
    moderationOpts: ModerationOpts;
    hideBackButton?: boolean;
    isPlaceholderProfile?: boolean;
}
declare let ProfileHeaderStandard: ({ profile: profileUnshadowed, descriptionRT, moderationOpts, hideBackButton, isPlaceholderProfile, }: Props) => React.ReactNode;
export { ProfileHeaderStandard };
//# sourceMappingURL=ProfileHeaderStandard.d.ts.map