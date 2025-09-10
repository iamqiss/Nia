import { type NavigatorTypeBagBase, type ParamListBase, type StackNavigationState, type StaticConfig, type TypedNavigator } from '@react-navigation/native';
import { type NativeStackNavigationEventMap, type NativeStackNavigationOptions, type NativeStackNavigationProp, type NativeStackNavigatorProps } from '@react-navigation/native-stack';
type NativeStackNavigationOptionsWithAuth = NativeStackNavigationOptions & {
    requireAuth?: boolean;
};
declare function NativeStackNavigator({ id, initialRouteName, children, layout, screenListeners, screenOptions, screenLayout, ...rest }: NativeStackNavigatorProps): any;
export declare function createNativeStackNavigatorWithAuth<const ParamList extends ParamListBase, const NavigatorID extends string | undefined = undefined, const TypeBag extends NavigatorTypeBagBase = {
    ParamList: ParamList;
    NavigatorID: NavigatorID;
    State: StackNavigationState<ParamList>;
    ScreenOptions: NativeStackNavigationOptionsWithAuth;
    EventMap: NativeStackNavigationEventMap;
    NavigationList: {
        [RouteName in keyof ParamList]: NativeStackNavigationProp<ParamList, RouteName, NavigatorID>;
    };
    Navigator: typeof NativeStackNavigator;
}, const Config extends StaticConfig<TypeBag> = StaticConfig<TypeBag>>(config?: Config): TypedNavigator<TypeBag, Config>;
export {};
//# sourceMappingURL=createNativeStackNavigatorWithAuth.d.ts.map