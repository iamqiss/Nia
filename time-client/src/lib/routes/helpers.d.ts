import { type NavigationProp } from '@react-navigation/native';
import { type RouteParams, type State } from './types';
export declare function getRootNavigation<T extends {}>(nav: NavigationProp<T>): NavigationProp<T>;
export declare function getCurrentRoute(state?: State): any;
export declare function isStateAtTabRoot(state: State | undefined): boolean;
export declare function isTab(current: string, route: string): boolean;
export declare enum TabState {
    InsideAtRoot = 0,
    Inside = 1,
    Outside = 2
}
export declare function getTabState(state: State | undefined, tab: string): TabState;
type ExistingState = {
    name: string;
    params?: RouteParams;
};
export declare function buildStateObject(stack: string, route: string, params: RouteParams, state?: ExistingState[]): {
    routes: {
        name: string;
        params: RouteParams;
    }[];
} | {
    routes: {
        name: string;
        state: {
            routes: ExistingState[];
        };
    }[];
};
export {};
//# sourceMappingURL=helpers.d.ts.map