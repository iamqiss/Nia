import { jsx as _jsx } from "react/jsx-runtime";
import { AccordionAnimation } from '#/lib/custom-animations/AccordionAnimation';
import { useGate } from '#/lib/statsig/statsig';
import { isAndroid } from '#/platform/detection';
import { useSuggestedFollowsByActorQuery } from '#/state/queries/suggested-follows';
import { ProfileGrid } from '#/components/FeedInterstitials';
export function ProfileHeaderSuggestedFollows({ actorDid }) {
    const { isLoading, data, error } = useSuggestedFollowsByActorQuery({
        did: actorDid,
    });
    return (_jsx(ProfileGrid, { isSuggestionsLoading: isLoading, profiles: data?.suggestions ?? [], recId: data?.recId, error: error, viewContext: "profileHeader" }));
}
export function AnimatedProfileHeaderSuggestedFollows({ isExpanded, actorDid, }) {
    const gate = useGate();
    /* NOTE (caidanw):
     * Android does not work well with this feature yet.
     * This issue stems from Android not allowing dragging on clickable elements in the profile header.
     * Blocking the ability to scroll on Android is too much of a trade-off for now.
     **/
    if (isAndroid)
        return null;
    if (!gate('post_follow_profile_suggested_accounts'))
        return null;
    return (_jsx(AccordionAnimation, { isExpanded: isExpanded, children: _jsx(ProfileHeaderSuggestedFollows, { actorDid: actorDid }) }));
}
//# sourceMappingURL=SuggestedFollows.js.map