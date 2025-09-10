import { type AppBskyLabelerDefs } from '@atproto/api';
import { type ReportOption } from '#/lib/moderation/useReportOptions';
export { useDialogControl as useReportDialogControl } from '#/components/Dialog';
import { type ReportDialogProps } from './types';
export declare function SelectReportOptionView(props: {
    params: ReportDialogProps['params'];
    labelers: AppBskyLabelerDefs.LabelerViewDetailed[];
    onSelectReportOption: (reportOption: ReportOption) => void;
    goBack: () => void;
}): any;
//# sourceMappingURL=SelectReportOptionView.d.ts.map