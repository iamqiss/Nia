import { type AppBskyActorDefs, type ModerationDecision } from '@atproto/api';
import { type Shadow } from '#/state/cache/types';
interface Props {
    profile: Shadow<AppBskyActorDefs.ProfileViewDetailed>;
    moderation: ModerationDecision;
    hideBackButton?: boolean;
    isPlaceholderProfile?: boolean;
}
declare let ProfileHeaderShell: ({ children, profile, moderation, hideBackButton, isPlaceholderProfile, }: React.PropsWithChildren<Props>) => React.ReactNode;
export { ProfileHeaderShell };
//# sourceMappingURL=Shell.d.ts.map