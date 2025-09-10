export declare function useOTAUpdates(): void;
export declare function useApplyPullRequestOTAUpdate(): {
    tryApplyUpdate: () => void;
    revertToEmbedded: () => void;
    isCurrentlyRunningPullRequestDeployment: boolean;
    currentChannel: string;
    pending: boolean;
};
//# sourceMappingURL=useOTAUpdates.web.d.ts.map