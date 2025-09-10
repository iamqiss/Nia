import { type AppBskyLabelerDefs } from '@atproto/api';
import type React from 'react';
import { type ViewStyleProp } from '#/alf';
import { type LinkProps } from '#/components/Link';
type LabelingServiceProps = {
    labeler: AppBskyLabelerDefs.LabelerViewDetailed;
};
export declare function Outer({ children, style, }: React.PropsWithChildren<ViewStyleProp>): any;
export declare function Avatar({ avatar }: {
    avatar?: string;
}): any;
export declare function Title({ value }: {
    value: string;
}): any;
export declare function Description({ value, handle }: {
    value?: string;
    handle: string;
}): any;
export declare function RegionalNotice(): any;
export declare function LikeCount({ likeCount }: {
    likeCount: number;
}): any;
export declare function Content({ children }: React.PropsWithChildren<{}>): any;
/**
 * The canonical view for a labeling service. Use this or compose your own.
 */
export declare function Default({ labeler, style, }: LabelingServiceProps & ViewStyleProp): any;
export declare function Link({ children, labeler, }: LabelingServiceProps & Pick<LinkProps, 'children'>): any;
export declare function DefaultSkeleton(): any;
export declare function Loader({ did, loading: LoadingComponent, error: ErrorComponent, component: Component, }: {
    did: string;
    loading?: React.ComponentType<{}>;
    error?: React.ComponentType<{
        error: string;
    }>;
    component: React.ComponentType<{
        labeler: AppBskyLabelerDefs.LabelerViewDetailed;
    }>;
}): any;
export {};
//# sourceMappingURL=index.d.ts.map