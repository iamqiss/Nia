import { type StyleProp, type ViewStyle } from 'react-native';
import { type ModerationUI } from '@atproto/api';
import { type PickerImage } from '#/lib/media/picker.shared';
import type * as bsky from '#/types/bsky';
export type UserAvatarType = 'user' | 'algo' | 'list' | 'labeler';
interface BaseUserAvatarProps {
    type?: UserAvatarType;
    shape?: 'circle' | 'square';
    size: number;
    avatar?: string | null;
    live?: boolean;
    hideLiveBadge?: boolean;
}
interface UserAvatarProps extends BaseUserAvatarProps {
    type: UserAvatarType;
    moderation?: ModerationUI;
    usePlainRNImage?: boolean;
    noBorder?: boolean;
    onLoad?: () => void;
    style?: StyleProp<ViewStyle>;
}
interface EditableUserAvatarProps extends BaseUserAvatarProps {
    onSelectNewAvatar: (img: PickerImage | null) => void;
}
interface PreviewableUserAvatarProps extends BaseUserAvatarProps {
    moderation?: ModerationUI;
    profile: bsky.profile.AnyProfileView;
    disableHoverCard?: boolean;
    disableNavigation?: boolean;
    onBeforePress?: () => void;
}
declare let DefaultAvatar: ({ type, shape: overrideShape, size, }: {
    type: UserAvatarType;
    shape?: "square" | "circle";
    size: number;
}) => React.ReactNode;
export { DefaultAvatar };
declare let UserAvatar: ({ type, shape: overrideShape, size, avatar, moderation, usePlainRNImage, onLoad, style, live, hideLiveBadge, noBorder, }: UserAvatarProps) => React.ReactNode;
export { UserAvatar };
declare let EditableUserAvatar: ({ type, size, avatar, onSelectNewAvatar, }: EditableUserAvatarProps) => React.ReactNode;
export { EditableUserAvatar };
declare let PreviewableUserAvatar: ({ moderation, profile, disableHoverCard, disableNavigation, onBeforePress, live, ...props }: PreviewableUserAvatarProps) => React.ReactNode;
export { PreviewableUserAvatar };
//# sourceMappingURL=UserAvatar.d.ts.map