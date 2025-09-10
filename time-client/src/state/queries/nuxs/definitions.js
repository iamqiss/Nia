import {} from '#/state/queries/nuxs/types';
export var Nux;
(function (Nux) {
    Nux["NeueTypography"] = "NeueTypography";
    Nux["ExploreInterestsCard"] = "ExploreInterestsCard";
    Nux["InitialVerificationAnnouncement"] = "InitialVerificationAnnouncement";
    Nux["ActivitySubscriptions"] = "ActivitySubscriptions";
    Nux["AgeAssuranceDismissibleNotice"] = "AgeAssuranceDismissibleNotice";
    Nux["AgeAssuranceDismissibleFeedBanner"] = "AgeAssuranceDismissibleFeedBanner";
    Nux["BookmarksAnnouncement"] = "BookmarksAnnouncement";
    /*
     * Blocking announcements. New IDs are required for each new announcement.
     */
    Nux["PolicyUpdate202508"] = "PolicyUpdate202508";
})(Nux || (Nux = {}));
export const nuxNames = new Set(Object.values(Nux));
export const NuxSchemas = {
    [Nux.NeueTypography]: undefined,
    [Nux.ExploreInterestsCard]: undefined,
    [Nux.InitialVerificationAnnouncement]: undefined,
    [Nux.ActivitySubscriptions]: undefined,
    [Nux.AgeAssuranceDismissibleNotice]: undefined,
    [Nux.AgeAssuranceDismissibleFeedBanner]: undefined,
    [Nux.PolicyUpdate202508]: undefined,
    [Nux.BookmarksAnnouncement]: undefined,
};
//# sourceMappingURL=definitions.js.map