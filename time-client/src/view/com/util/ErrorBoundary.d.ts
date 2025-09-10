import { Component, type ErrorInfo, type ReactNode } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
interface Props {
    children?: ReactNode;
    renderError?: (error: any) => ReactNode;
    style?: StyleProp<ViewStyle>;
}
interface State {
    hasError: boolean;
    error: any;
}
export declare class ErrorBoundary extends Component<Props, State> {
    state: State;
    static getDerivedStateFromError(error: Error): State;
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void;
    render(): any;
}
export {};
//# sourceMappingURL=ErrorBoundary.d.ts.map