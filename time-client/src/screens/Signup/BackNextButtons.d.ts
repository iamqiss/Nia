export interface BackNextButtonsProps {
    hideNext?: boolean;
    showRetry?: boolean;
    isLoading?: boolean;
    isNextDisabled?: boolean;
    onBackPress: () => void;
    onNextPress?: () => void;
    onRetryPress?: () => void;
    overrideNextText?: string;
}
export declare function BackNextButtons({ hideNext, showRetry, isLoading, isNextDisabled, onBackPress, onNextPress, onRetryPress, overrideNextText, }: BackNextButtonsProps): any;
//# sourceMappingURL=BackNextButtons.d.ts.map