export declare function useToggleMutationQueue<TServerState>({ initialState, runMutation, onSuccess, }: {
    initialState: TServerState;
    runMutation: (prevState: TServerState, nextIsOn: boolean) => Promise<TServerState>;
    onSuccess: (finalState: TServerState) => void;
}): any;
//# sourceMappingURL=useToggleMutationQueue.d.ts.map