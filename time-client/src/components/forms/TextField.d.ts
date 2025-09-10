import { type AccessibilityProps, TextInput, type TextInputProps } from 'react-native';
import { type TextStyleProp } from '#/alf';
import { type Props as SVGIconProps } from '#/components/icons/common';
export type RootProps = React.PropsWithChildren<{
    isInvalid?: boolean;
} & TextStyleProp>;
export declare function Root({ children, isInvalid, style }: RootProps): any;
export declare function useSharedInputStyles(): any;
export type InputProps = Omit<TextInputProps, 'value' | 'onChangeText'> & {
    label: string;
    /**
     * @deprecated Controlled inputs are *strongly* discouraged. Use `defaultValue` instead where possible.
     *
     * See https://github.com/facebook/react-native-website/pull/4247
     */
    value?: string;
    onChangeText?: (value: string) => void;
    isInvalid?: boolean;
    inputRef?: React.RefObject<TextInput | null> | React.ForwardedRef<TextInput>;
};
export declare function createInput(Component: typeof TextInput): ({ label, placeholder, value, onChangeText, onFocus, onBlur, isInvalid, inputRef, style, ...rest }: InputProps) => any;
export declare const Input: ({ label, placeholder, value, onChangeText, onFocus, onBlur, isInvalid, inputRef, style, ...rest }: InputProps) => any;
export declare function LabelText({ nativeID, children, }: React.PropsWithChildren<{
    nativeID?: string;
}>): any;
export declare function Icon({ icon: Comp }: {
    icon: React.ComponentType<SVGIconProps>;
}): any;
export declare function SuffixText({ children, label, accessibilityHint, style, }: React.PropsWithChildren<TextStyleProp & {
    label: string;
    accessibilityHint?: AccessibilityProps['accessibilityHint'];
}>): any;
export declare function GhostText({ children, value, }: {
    children: string;
    value: string;
}): any;
//# sourceMappingURL=TextField.d.ts.map