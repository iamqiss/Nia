import { type AppBskyFeedDefs } from '@atproto/api';
import { type ViewStyleProp } from '#/alf';
import { ButtonIcon } from '#/components/Button';
import { type TextProps } from '#/components/Typography';
export declare function Container({ style, children, bottomBorder, }: {
    children: React.ReactNode;
    bottomBorder?: boolean;
} & ViewStyleProp): any;
export declare function FeedLink({ feed, children, }: {
    feed: AppBskyFeedDefs.GeneratorView;
    children?: React.ReactNode;
}): any;
export declare function FeedAvatar({ feed }: {
    feed: AppBskyFeedDefs.GeneratorView;
}): any;
export declare function Icon({ icon: Comp, size, }: Pick<React.ComponentProps<typeof ButtonIcon>, 'icon' | 'size'>): any;
export declare function TitleText({ style, ...props }: TextProps): any;
export declare function SubtitleText({ style, ...props }: TextProps): any;
export declare function SearchButton({ label, metricsTag, onPress, }: {
    label: string;
    metricsTag: 'suggestedAccounts' | 'suggestedFeeds';
    onPress?: () => void;
}): any;
export declare function PinButton({ feed }: {
    feed: AppBskyFeedDefs.GeneratorView;
}): any;
//# sourceMappingURL=ModuleHeader.d.ts.map