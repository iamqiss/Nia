import type zod from 'zod';
import { type BaseNux } from '#/state/queries/nuxs/types';
export declare enum Nux {
    NeueTypography = "NeueTypography",
    ExploreInterestsCard = "ExploreInterestsCard",
    InitialVerificationAnnouncement = "InitialVerificationAnnouncement",
    ActivitySubscriptions = "ActivitySubscriptions",
    AgeAssuranceDismissibleNotice = "AgeAssuranceDismissibleNotice",
    AgeAssuranceDismissibleFeedBanner = "AgeAssuranceDismissibleFeedBanner",
    BookmarksAnnouncement = "BookmarksAnnouncement",
    PolicyUpdate202508 = "PolicyUpdate202508"
}
export declare const nuxNames: Set<Nux>;
export type AppNux = BaseNux<{
    id: Nux.NeueTypography;
    data: undefined;
} | {
    id: Nux.ExploreInterestsCard;
    data: undefined;
} | {
    id: Nux.InitialVerificationAnnouncement;
    data: undefined;
} | {
    id: Nux.ActivitySubscriptions;
    data: undefined;
} | {
    id: Nux.AgeAssuranceDismissibleNotice;
    data: undefined;
} | {
    id: Nux.AgeAssuranceDismissibleFeedBanner;
    data: undefined;
} | {
    id: Nux.PolicyUpdate202508;
    data: undefined;
} | {
    id: Nux.BookmarksAnnouncement;
    data: undefined;
}>;
export declare const NuxSchemas: Record<Nux, zod.ZodObject<any> | undefined>;
//# sourceMappingURL=definitions.d.ts.map