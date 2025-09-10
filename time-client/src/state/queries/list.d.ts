import { type Facet } from '@atproto/api';
import { type ImageMeta } from '#/state/gallery';
export declare const RQKEY_ROOT = "list";
export declare const RQKEY: (uri: string) => string[];
export declare function useListQuery(uri?: string): any;
export interface ListCreateMutateParams {
    purpose: string;
    name: string;
    description: string;
    descriptionFacets: Facet[] | undefined;
    avatar: ImageMeta | null | undefined;
}
export declare function useListCreateMutation(): any;
export interface ListMetadataMutateParams {
    uri: string;
    name: string;
    description: string;
    descriptionFacets: Facet[] | undefined;
    avatar: ImageMeta | null | undefined;
}
export declare function useListMetadataMutation(): any;
export declare function useListDeleteMutation(): any;
export declare function useListMuteMutation(): any;
export declare function useListBlockMutation(): any;
//# sourceMappingURL=list.d.ts.map