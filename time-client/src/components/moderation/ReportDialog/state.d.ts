import { type AppBskyLabelerDefs } from '@atproto/api';
import { type ReportOption } from './utils/useReportOptions';
export type ReportState = {
    selectedOption?: ReportOption;
    selectedLabeler?: AppBskyLabelerDefs.LabelerViewDetailed;
    details?: string;
    detailsOpen: boolean;
    activeStepIndex1: number;
    error?: string;
};
export type ReportAction = {
    type: 'selectOption';
    option: ReportOption;
} | {
    type: 'clearOption';
} | {
    type: 'selectLabeler';
    labeler: AppBskyLabelerDefs.LabelerViewDetailed;
} | {
    type: 'clearLabeler';
} | {
    type: 'setDetails';
    details: string;
} | {
    type: 'setError';
    error: string;
} | {
    type: 'clearError';
} | {
    type: 'showDetails';
};
export declare const initialState: ReportState;
export declare function reducer(state: ReportState, action: ReportAction): ReportState;
//# sourceMappingURL=state.d.ts.map