import { useSaveNux } from '#/state/queries/nuxs';
export type PolicyUpdateState = {
    completed: boolean;
    complete: () => void;
};
export declare function usePolicyUpdateState({ enabled, }: {
    /**
     * Used to skip the policy update overlay until we're actually ready to
     * show it.
     */
    enabled: boolean;
}): any;
export declare function computeCompletedState({ nuxIsReady, nuxIsCompleted, nuxIsOptimisticallyCompleted, completedForDevice, }: {
    nuxIsReady: boolean;
    nuxIsCompleted: boolean;
    nuxIsOptimisticallyCompleted: boolean;
    completedForDevice: boolean | undefined;
}): boolean;
export declare function syncCompletedState({ nuxIsReady, nuxIsCompleted, nuxIsOptimisticallyCompleted, completedForDevice, save, setCompletedForDevice, }: {
    nuxIsReady: boolean;
    nuxIsCompleted: boolean;
    nuxIsOptimisticallyCompleted: boolean;
    completedForDevice: boolean | undefined;
    save: ReturnType<typeof useSaveNux>['mutate'];
    setCompletedForDevice: (value: boolean) => void;
}): void;
//# sourceMappingURL=usePolicyUpdateState.d.ts.map