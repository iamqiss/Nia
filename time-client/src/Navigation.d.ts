import { type AllNavigatorParams } from '#/lib/routes/types';
/**
 * The TabsNavigator is used by native mobile to represent the routes
 * in 3 distinct tab-stacks with a different root screen on each.
 */
declare function TabsNavigator(): any;
/**
 * The FlatNavigator is used by Web to represent the routes
 * in a single ("flat") stack.
 */
declare const FlatNavigator: () => any;
declare function RoutesContainer({ children }: React.PropsWithChildren<{}>): any;
/**
 * These helpers can be used from outside of the RoutesContainer
 * (eg in the state models).
 */
declare function navigate<K extends keyof AllNavigatorParams>(name: K, params?: AllNavigatorParams[K]): Promise<any>;
declare function resetToTab(tabName: 'HomeTab' | 'SearchTab' | 'MessagesTab' | 'NotificationsTab'): void;
declare function reset(): Promise<void>;
export { FlatNavigator, navigate, reset, resetToTab, RoutesContainer, TabsNavigator, };
//# sourceMappingURL=Navigation.d.ts.map