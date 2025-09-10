import { type SvgProps } from 'react-native-svg';
export declare function ControlButton({ active, activeLabel, inactiveLabel, activeIcon: ActiveIcon, inactiveIcon: InactiveIcon, onPress, }: {
    active: boolean;
    activeLabel: string;
    inactiveLabel: string;
    activeIcon: React.ComponentType<Pick<SvgProps, 'fill' | 'width'>>;
    inactiveIcon: React.ComponentType<Pick<SvgProps, 'fill' | 'width'>>;
    onPress: () => void;
}): any;
//# sourceMappingURL=ControlButton.d.ts.map