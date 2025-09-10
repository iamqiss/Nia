export declare function useApplyPullRequestOTAUpdate(): {
    tryApplyUpdate: (channel: string) => Promise<void>;
    revertToEmbedded: () => Promise<void>;
    isCurrentlyRunningPullRequestDeployment: any;
    currentChannel: any;
    pending: any;
};
export declare function useOTAUpdates(): void;
//# sourceMappingURL=useOTAUpdates.d.ts.map