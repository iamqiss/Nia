import { type AppBskyGraphDefs, type ModerationUI } from '@atproto/api';
import { type LinkProps } from '#/components/Link';
import type * as bsky from '#/types/bsky';
export { Avatar, AvatarPlaceholder, Description, Header, Outer, SaveButton, TitleAndBylinePlaceholder, } from '#/components/FeedCard';
type Props = {
    view: AppBskyGraphDefs.ListView;
    showPinButton?: boolean;
};
export declare function Default(props: Props & Omit<LinkProps, 'to' | 'label' | 'children'>): any;
export declare function Link({ view, children, ...props }: Props & Omit<LinkProps, 'to' | 'label'>): any;
export declare function TitleAndByline({ title, creator, purpose, modUi, }: {
    title: string;
    creator?: bsky.profile.AnyProfileView;
    purpose?: AppBskyGraphDefs.ListView['purpose'];
    modUi?: ModerationUI;
}): any;
export declare function createProfileListHref({ list, }: {
    list: AppBskyGraphDefs.ListView;
}): string;
//# sourceMappingURL=ListCard.d.ts.map