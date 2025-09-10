import * as Dialog from '#/components/Dialog';
type Control = Dialog.DialogControlProps;
export type StatefulControl<T> = {
    control: Control;
    open: (value: T) => void;
    clear: () => void;
    value: T | undefined;
};
export declare function useGlobalDialogsControlContext(): any;
export declare function Provider({ children }: React.PropsWithChildren<{}>): any;
export declare function useStatefulDialogControl<T>(initialValue?: T): StatefulControl<T>;
export {};
//# sourceMappingURL=Context.d.ts.map