import { type LinkProps as BaseLinkProps } from '#/components/Link';
import * as bsky from '#/types/bsky';
export declare function Default({ starterPack, }: {
    starterPack?: bsky.starterPack.AnyStarterPackView;
}): any;
export declare function Notification({ starterPack, }: {
    starterPack?: bsky.starterPack.AnyStarterPackView;
}): any;
export declare function Card({ starterPack, noIcon, noDescription, }: {
    starterPack: bsky.starterPack.AnyStarterPackView;
    noIcon?: boolean;
    noDescription?: boolean;
}): any;
export declare function useStarterPackLink({ view, }: {
    view: bsky.starterPack.AnyStarterPackView;
}): {
    to: string;
    label: any;
    precache: () => void;
};
export declare function Link({ starterPack, children, }: {
    starterPack: bsky.starterPack.AnyStarterPackView;
    onPress?: () => void;
    children: BaseLinkProps['children'];
}): any;
export declare function Embed({ starterPack, }: {
    starterPack: bsky.starterPack.AnyStarterPackView;
}): any;
//# sourceMappingURL=StarterPackCard.d.ts.map