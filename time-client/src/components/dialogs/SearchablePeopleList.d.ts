import type * as bsky from '#/types/bsky';
export type ProfileItem = {
    type: 'profile';
    key: string;
    profile: bsky.profile.AnyProfileView;
};
export declare function SearchablePeopleList({ title, showRecentConvos, sortByMessageDeclaration, onSelectChat, renderProfileCard, }: {
    title: string;
    showRecentConvos?: boolean;
    sortByMessageDeclaration?: boolean;
} & ({
    renderProfileCard: (item: ProfileItem) => React.ReactNode;
    onSelectChat?: undefined;
} | {
    onSelectChat: (did: string) => void;
    renderProfileCard?: undefined;
})): any;
//# sourceMappingURL=SearchablePeopleList.d.ts.map