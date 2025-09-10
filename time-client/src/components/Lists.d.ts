import { type StyleProp, type ViewStyle } from 'react-native';
export declare function ListFooter({ isFetchingNextPage, hasNextPage, error, onRetry, height, style, showEndMessage, endMessageText, renderEndMessage, }: {
    isFetchingNextPage?: boolean;
    hasNextPage?: boolean;
    error?: string;
    onRetry?: () => Promise<unknown>;
    height?: number;
    style?: StyleProp<ViewStyle>;
    showEndMessage?: boolean;
    endMessageText?: string;
    renderEndMessage?: () => React.ReactNode;
}): any;
declare let ListMaybePlaceholder: ({ isLoading, noEmpty, isError, emptyTitle, emptyMessage, errorTitle, errorMessage, emptyType, onRetry, onGoBack, hideBackButton, sideBorders, topBorder, }: {
    isLoading: boolean;
    noEmpty?: boolean;
    isError?: boolean;
    emptyTitle?: string;
    emptyMessage?: string;
    errorTitle?: string;
    errorMessage?: string;
    emptyType?: "page" | "results";
    onRetry?: () => Promise<unknown>;
    onGoBack?: () => void;
    hideBackButton?: boolean;
    sideBorders?: boolean;
    topBorder?: boolean;
}) => React.ReactNode;
export { ListMaybePlaceholder };
//# sourceMappingURL=Lists.d.ts.map