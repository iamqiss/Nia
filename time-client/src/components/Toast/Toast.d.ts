import { type ButtonProps, type UninheritableButtonProps } from '#/components/Button';
import { type Props as SVGIconProps } from '#/components/icons/common';
import { type ToastType } from '#/components/Toast/types';
export declare const ICONS: {
    default: any;
    success: any;
    error: any;
    warning: any;
    info: any;
};
export declare function ToastConfigProvider({ children, id, type, }: {
    children: React.ReactNode;
    id: string;
    type: ToastType;
}): any;
export declare function Outer({ children }: {
    children: React.ReactNode;
}): any;
export declare function Icon({ icon }: {
    icon?: React.ComponentType<SVGIconProps>;
}): any;
export declare function Text({ children }: {
    children: React.ReactNode;
}): any;
export declare function Action(props: Omit<ButtonProps, UninheritableButtonProps | 'children'> & {
    children: React.ReactNode;
}): any;
//# sourceMappingURL=Toast.d.ts.map