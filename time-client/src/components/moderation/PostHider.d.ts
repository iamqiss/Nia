import { type ComponentProps } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { type AppBskyActorDefs, type ModerationUI } from '@atproto/api';
import { Link } from '#/view/com/util/Link';
interface Props extends ComponentProps<typeof Link> {
    disabled: boolean;
    iconSize: number;
    iconStyles: StyleProp<ViewStyle>;
    modui: ModerationUI;
    profile: AppBskyActorDefs.ProfileViewBasic;
    interpretFilterAsBlur?: boolean;
}
export declare function PostHider({ testID, href, disabled, modui, style, children, iconSize, iconStyles, profile, interpretFilterAsBlur, ...props }: Props): any;
export {};
//# sourceMappingURL=PostHider.d.ts.map