import { type AppBskyActorDefs } from '@atproto/api';
declare let AutocompleteResults: ({ isAutocompleteFetching, autocompleteData, searchText, onSubmit, onResultPress, onProfileClick, }: {
    isAutocompleteFetching: boolean;
    autocompleteData: AppBskyActorDefs.ProfileViewBasic[] | undefined;
    searchText: string;
    onSubmit: () => void;
    onResultPress: () => void;
    onProfileClick: (profile: AppBskyActorDefs.ProfileViewBasic) => void;
}) => React.ReactNode;
export { AutocompleteResults };
//# sourceMappingURL=AutocompleteResults.d.ts.map