import { ComAtprotoModerationDefs } from '@atproto/api';
import {} from './utils/useReportOptions';
export const initialState = {
    selectedOption: undefined,
    selectedLabeler: undefined,
    details: undefined,
    detailsOpen: false,
    activeStepIndex1: 1,
};
export function reducer(state, action) {
    switch (action.type) {
        case 'selectOption':
            return {
                ...state,
                selectedOption: action.option,
                activeStepIndex1: 2,
                detailsOpen: !!state.details ||
                    action.option.reason === ComAtprotoModerationDefs.REASONOTHER,
            };
        case 'clearOption':
            return {
                ...state,
                selectedOption: undefined,
                selectedLabeler: undefined,
                activeStepIndex1: 1,
                detailsOpen: !!state.details ||
                    state.selectedOption?.reason === ComAtprotoModerationDefs.REASONOTHER,
            };
        case 'selectLabeler':
            return {
                ...state,
                selectedLabeler: action.labeler,
                activeStepIndex1: 3,
            };
        case 'clearLabeler':
            return {
                ...state,
                selectedLabeler: undefined,
                activeStepIndex1: 2,
                detailsOpen: !!state.details ||
                    state.selectedOption?.reason === ComAtprotoModerationDefs.REASONOTHER,
            };
        case 'setDetails':
            return {
                ...state,
                details: action.details,
            };
        case 'setError':
            return {
                ...state,
                error: action.error,
            };
        case 'clearError':
            return {
                ...state,
                error: undefined,
            };
        case 'showDetails':
            return {
                ...state,
                detailsOpen: true,
            };
    }
}
//# sourceMappingURL=state.js.map