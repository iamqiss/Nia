import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { type CommonNavigatorParams } from '#/lib/routes/types';
type StarterPackScreeProps = NativeStackScreenProps<CommonNavigatorParams, 'StarterPack'>;
type StarterPackScreenShortProps = NativeStackScreenProps<CommonNavigatorParams, 'StarterPackShort'>;
export declare function StarterPackScreen({ route }: StarterPackScreeProps): any;
export declare function StarterPackScreenShort({ route }: StarterPackScreenShortProps): any;
export declare function StarterPackScreenInner({ routeParams, }: {
    routeParams: StarterPackScreeProps['route']['params'];
}): any;
export {};
//# sourceMappingURL=StarterPackScreen.d.ts.map