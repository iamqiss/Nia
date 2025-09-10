import { type SuggestionOptions } from '@tiptap/suggestion';
import { type ActorAutocompleteFn } from '#/state/queries/actor-autocomplete';
export interface AutocompleteRef {
    maybeClose: () => boolean;
}
export declare function createSuggestion({ autocomplete, autocompleteRef, }: {
    autocomplete: ActorAutocompleteFn;
    autocompleteRef: React.Ref<AutocompleteRef>;
}): Omit<SuggestionOptions, 'editor'>;
//# sourceMappingURL=Autocomplete.d.ts.map