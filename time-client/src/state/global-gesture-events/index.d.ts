import { type GestureStateChangeEvent, type GestureUpdateEvent, type PanGestureHandlerEventPayload } from 'react-native-gesture-handler';
export type GlobalGestureEvents = {
    begin: GestureStateChangeEvent<PanGestureHandlerEventPayload>;
    update: GestureUpdateEvent<PanGestureHandlerEventPayload>;
    end: GestureStateChangeEvent<PanGestureHandlerEventPayload>;
    finalize: GestureStateChangeEvent<PanGestureHandlerEventPayload>;
};
export declare function GlobalGestureEventsProvider({ children, }: {
    children: React.ReactNode;
}): any;
export declare function useGlobalGestureEvents(): any;
//# sourceMappingURL=index.d.ts.map