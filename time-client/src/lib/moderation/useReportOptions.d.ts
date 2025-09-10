export interface ReportOption {
    reason: string;
    title: string;
    description: string;
}
interface ReportOptions {
    account: ReportOption[];
    post: ReportOption[];
    list: ReportOption[];
    starterpack: ReportOption[];
    feedgen: ReportOption[];
    other: ReportOption[];
    convoMessage: ReportOption[];
}
export declare function useReportOptions(): ReportOptions;
export {};
//# sourceMappingURL=useReportOptions.d.ts.map