import { type CommonNavigatorParams, type NativeStackScreenProps } from '#/lib/routes/types';
import { type Props as SVGIconProps } from '#/components/icons/common';
type Props = NativeStackScreenProps<CommonNavigatorParams, 'AppearanceSettings'>;
export declare function AppearanceSettingsScreen({}: Props): any;
export declare function AppearanceToggleButtonGroup({ title, description, icon: Icon, items, values, onChange, }: {
    title: string;
    description?: string;
    icon: React.ComponentType<SVGIconProps>;
    items: {
        label: string;
        name: string;
    }[];
    values: string[];
    onChange: (values: string[]) => void;
}): any;
export {};
//# sourceMappingURL=AppearanceSettings.d.ts.map