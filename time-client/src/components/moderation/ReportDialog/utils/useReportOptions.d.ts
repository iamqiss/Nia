export interface ReportOption {
    reason: string;
    title: string;
    description: string;
}
interface ReportOptions {
    account: ReportOption[];
    post: ReportOption[];
    list: ReportOption[];
    starterPack: ReportOption[];
    feed: ReportOption[];
    chatMessage: ReportOption[];
}
export declare function useReportOptions(): ReportOptions;
export {};
//# sourceMappingURL=useReportOptions.d.ts.map