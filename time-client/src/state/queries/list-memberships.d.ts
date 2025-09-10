/**
 * NOTE
 *
 * This query is a temporary solution to our lack of server API for
 * querying user membership in an API. It is extremely inefficient.
 *
 * THIS SHOULD ONLY BE USED IN MODALS FOR MODIFYING A USER'S LIST MEMBERSHIP!
 * Use the list-members query for rendering a list's members.
 *
 * It works by fetching *all* of the user's list item records and querying
 * or manipulating that cache. For users with large lists, it will fall
 * down completely, so be very conservative about how you use it.
 *
 * -prf
 */
export declare const RQKEY: () => string[];
export interface ListMembersip {
    membershipUri: string;
    listUri: string;
    actorDid: string;
}
/**
 * This API is dangerous! Read the note above!
 */
export declare function useDangerousListMembershipsQuery(): any;
/**
 * Returns undefined for pending, false for not a member, and string for a member (the URI of the membership record)
 */
export declare function getMembership(memberships: ListMembersip[] | undefined, list: string, actor: string): string | false | undefined;
export declare function useListMembershipAddMutation({ onSuccess, onError, }?: {
    onSuccess?: (data: {
        uri: string;
        cid: string;
    }) => void;
    onError?: (error: Error) => void;
}): any;
export declare function useListMembershipRemoveMutation({ onSuccess, onError, }?: {
    onSuccess?: (data: void) => void;
    onError?: (error: Error) => void;
}): any;
//# sourceMappingURL=list-memberships.d.ts.map