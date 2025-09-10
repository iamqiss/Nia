import React from 'react';
import { type AppBskyFeedDefs, type AppBskyGraphDefs } from '@atproto/api';
import { type ButtonProps } from '#/components/Button';
import { type LinkProps } from '#/components/Link';
import { type RichTextProps } from '#/components/RichText';
import type * as bsky from '#/types/bsky';
type Props = {
    view: AppBskyFeedDefs.GeneratorView;
    onPress?: () => void;
};
export declare function Default(props: Props): any;
export declare function Link({ view, children, ...props }: Props & Omit<LinkProps, 'to' | 'label'>): any;
export declare function Outer({ children }: {
    children: React.ReactNode;
}): any;
export declare function Header({ children }: {
    children: React.ReactNode;
}): any;
export type AvatarProps = {
    src: string | undefined;
    size?: number;
};
export declare function Avatar({ src, size }: AvatarProps): any;
export declare function AvatarPlaceholder({ size }: Omit<AvatarProps, 'src'>): any;
export declare function TitleAndByline({ title, creator, }: {
    title: string;
    creator?: bsky.profile.AnyProfileView;
}): any;
export declare function TitleAndBylinePlaceholder({ creator }: {
    creator?: boolean;
}): any;
export declare function Description({ description, ...rest }: {
    description?: string;
} & Partial<RichTextProps>): any;
export declare function DescriptionPlaceholder(): any;
export declare function Likes({ count }: {
    count: number;
}): any;
export declare function SaveButton({ view, pin, ...props }: {
    view: AppBskyFeedDefs.GeneratorView | AppBskyGraphDefs.ListView;
    pin?: boolean;
    text?: boolean;
} & Partial<ButtonProps>): any;
export declare function createProfileFeedHref({ feed, }: {
    feed: AppBskyFeedDefs.GeneratorView;
}): string;
export {};
//# sourceMappingURL=FeedCard.d.ts.map