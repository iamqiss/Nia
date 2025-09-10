import { type StyleProp, type ViewStyle } from 'react-native';
import { type AppBskyActorDefs, type ModerationDecision } from '@atproto/api';
interface PostMetaOpts {
    author: AppBskyActorDefs.ProfileViewBasic;
    moderation: ModerationDecision | undefined;
    postHref: string;
    timestamp: string;
    showAvatar?: boolean;
    avatarSize?: number;
    onOpenAuthor?: () => void;
    style?: StyleProp<ViewStyle>;
}
declare let PostMeta: (opts: PostMetaOpts) => React.ReactNode;
export { PostMeta };
//# sourceMappingURL=PostMeta.d.ts.map