import { type StyleProp, type ViewStyle } from 'react-native';
import { type TypographyVariant } from '#/lib/ThemeContext';
import { type ButtonType } from './Button';
/**
 * @deprecated use Toggle from `#/components/form/Toggle.tsx` instead
 */
export declare function ToggleButton({ testID, type, label, isSelected, style, labelType, onPress, }: {
    testID?: string;
    type?: ButtonType;
    label: string;
    isSelected: boolean;
    style?: StyleProp<ViewStyle>;
    labelType?: TypographyVariant;
    onPress?: () => void;
}): any;
//# sourceMappingURL=ToggleButton.d.ts.map