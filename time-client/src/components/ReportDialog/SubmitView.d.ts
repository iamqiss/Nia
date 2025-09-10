import { type AppBskyLabelerDefs } from '@atproto/api';
import { type ReportOption } from '#/lib/moderation/useReportOptions';
import { type ReportDialogProps } from './types';
export declare function SubmitView({ params, labelers, selectedLabeler, selectedReportOption, goBack, onSubmitComplete, }: ReportDialogProps & {
    labelers: AppBskyLabelerDefs.LabelerViewDetailed[];
    selectedLabeler: string;
    selectedReportOption: ReportOption;
    goBack: () => void;
    onSubmitComplete: () => void;
}): any;
//# sourceMappingURL=SubmitView.d.ts.map