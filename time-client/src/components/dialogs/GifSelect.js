import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useImperativeHandle, useMemo, useRef, useState, } from 'react';
import { View } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { logEvent } from '#/lib/statsig/statsig';
import { cleanError } from '#/lib/strings/errors';
import { isWeb } from '#/platform/detection';
import { tenorUrlToBskyGifUrl, useFeaturedGifsQuery, useGifSearchQuery, } from '#/state/queries/tenor';
import { ErrorScreen } from '#/view/com/util/error/ErrorScreen';
import { ErrorBoundary } from '#/view/com/util/ErrorBoundary';
import {} from '#/view/com/util/List';
import { atoms as a, ios, native, useBreakpoints, useTheme, web } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import * as TextField from '#/components/forms/TextField';
import { useThrottledValue } from '#/components/hooks/useThrottledValue';
import { ArrowLeft_Stroke2_Corner0_Rounded as Arrow } from '#/components/icons/Arrow';
import { MagnifyingGlass2_Stroke2_Corner0_Rounded as Search } from '#/components/icons/MagnifyingGlass2';
import { ListFooter, ListMaybePlaceholder } from '#/components/Lists';
export function GifSelectDialog({ controlRef, onClose, onSelectGif: onSelectGifProp, }) {
    const control = Dialog.useDialogControl();
    useImperativeHandle(controlRef, () => ({
        open: () => control.open(),
    }));
    const onSelectGif = useCallback((gif) => {
        control.close(() => onSelectGifProp(gif));
    }, [control, onSelectGifProp]);
    const renderErrorBoundary = useCallback((error) => _jsx(DialogError, { details: String(error) }), []);
    return (_jsxs(Dialog.Outer, { control: control, onClose: onClose, nativeOptions: {
            bottomInset: 0,
            // use system corner radius on iOS
            ...ios({ cornerRadius: undefined }),
        }, children: [_jsx(Dialog.Handle, {}), _jsx(ErrorBoundary, { renderError: renderErrorBoundary, children: _jsx(GifList, { control: control, onSelectGif: onSelectGif }) })] }));
}
function GifList({ control, onSelectGif, }) {
    const { _ } = useLingui();
    const t = useTheme();
    const { gtMobile } = useBreakpoints();
    const textInputRef = useRef(null);
    const listRef = useRef(null);
    const [undeferredSearch, setSearch] = useState('');
    const search = useThrottledValue(undeferredSearch, 500);
    const { height } = useWindowDimensions();
    const isSearching = search.length > 0;
    const trendingQuery = useFeaturedGifsQuery();
    const searchQuery = useGifSearchQuery(search);
    const { data, fetchNextPage, isFetchingNextPage, hasNextPage, error, isPending, isError, refetch, } = isSearching ? searchQuery : trendingQuery;
    const flattenedData = useMemo(() => {
        return data?.pages.flatMap(page => page.results) || [];
    }, [data]);
    const renderItem = useCallback(({ item }) => {
        return _jsx(GifPreview, { gif: item, onSelectGif: onSelectGif });
    }, [onSelectGif]);
    const onEndReached = useCallback(() => {
        if (isFetchingNextPage || !hasNextPage || error)
            return;
        fetchNextPage();
    }, [isFetchingNextPage, hasNextPage, error, fetchNextPage]);
    const hasData = flattenedData.length > 0;
    const onGoBack = useCallback(() => {
        if (isSearching) {
            // clear the input and reset the state
            textInputRef.current?.clear();
            setSearch('');
        }
        else {
            control.close();
        }
    }, [control, isSearching]);
    const listHeader = useMemo(() => {
        return (_jsxs(View, { style: [
                native(a.pt_4xl),
                a.relative,
                a.mb_lg,
                a.flex_row,
                a.align_center,
                !gtMobile && web(a.gap_md),
                a.pb_sm,
                t.atoms.bg,
            ], children: [!gtMobile && isWeb && (_jsx(Button, { size: "small", variant: "ghost", color: "secondary", shape: "round", onPress: () => control.close(), label: _(msg `Close GIF dialog`), children: _jsx(ButtonIcon, { icon: Arrow, size: "md" }) })), _jsxs(TextField.Root, { style: [!gtMobile && isWeb && a.flex_1], children: [_jsx(TextField.Icon, { icon: Search }), _jsx(TextField.Input, { label: _(msg `Search GIFs`), placeholder: _(msg `Search Tenor`), onChangeText: text => {
                                setSearch(text);
                                listRef.current?.scrollToOffset({ offset: 0, animated: false });
                            }, returnKeyType: "search", clearButtonMode: "while-editing", inputRef: textInputRef, maxLength: 50, onKeyPress: ({ nativeEvent }) => {
                                if (nativeEvent.key === 'Escape') {
                                    control.close();
                                }
                            } })] })] }));
    }, [gtMobile, t.atoms.bg, _, control]);
    return (_jsxs(_Fragment, { children: [gtMobile && _jsx(Dialog.Close, {}), _jsx(Dialog.InnerFlatList, { ref: listRef, data: flattenedData, renderItem: renderItem, numColumns: gtMobile ? 3 : 2, columnWrapperStyle: [a.gap_sm], contentContainerStyle: [native([a.px_xl, { minHeight: height }])], webInnerStyle: [web({ minHeight: '80vh' })], webInnerContentContainerStyle: [web(a.pb_0)], ListHeaderComponent: _jsxs(_Fragment, { children: [listHeader, !hasData && (_jsx(ListMaybePlaceholder, { isLoading: isPending, isError: isError, onRetry: refetch, onGoBack: onGoBack, emptyType: "results", sideBorders: false, topBorder: false, errorTitle: _(msg `Failed to load GIFs`), errorMessage: _(msg `There was an issue connecting to Tenor.`), emptyMessage: isSearching
                                ? _(msg `No search results found for "${search}".`)
                                : _(msg `No featured GIFs found. There may be an issue with Tenor.`) }))] }), stickyHeaderIndices: [0], onEndReached: onEndReached, onEndReachedThreshold: 4, keyExtractor: (item) => item.id, keyboardDismissMode: "on-drag", ListFooterComponent: hasData ? (_jsx(ListFooter, { isFetchingNextPage: isFetchingNextPage, error: cleanError(error), onRetry: fetchNextPage, style: { borderTopWidth: 0 } })) : null }, gtMobile ? '3 cols' : '2 cols')] }));
}
function DialogError({ details }) {
    const { _ } = useLingui();
    const control = Dialog.useDialogContext();
    return (_jsxs(Dialog.ScrollableInner, { style: a.gap_md, label: _(msg `An error has occurred`), children: [_jsx(Dialog.Close, {}), _jsx(ErrorScreen, { title: _(msg `Oh no!`), message: _(msg `There was an unexpected issue in the application. Please let us know if this happened to you!`), details: details }), _jsx(Button, { label: _(msg `Close dialog`), onPress: () => control.close(), color: "primary", size: "large", variant: "solid", children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Close" }) }) })] }));
}
export function GifPreview({ gif, onSelectGif, }) {
    const { gtTablet } = useBreakpoints();
    const { _ } = useLingui();
    const t = useTheme();
    const onPress = useCallback(() => {
        logEvent('composer:gif:select', {});
        onSelectGif(gif);
    }, [onSelectGif, gif]);
    return (_jsx(Button, { label: _(msg `Select GIF "${gif.title}"`), style: [a.flex_1, gtTablet ? { maxWidth: '33%' } : { maxWidth: '50%' }], onPress: onPress, children: ({ pressed }) => (_jsx(Image, { style: [
                a.flex_1,
                a.mb_sm,
                a.rounded_sm,
                { aspectRatio: 1, opacity: pressed ? 0.8 : 1 },
                t.atoms.bg_contrast_25,
            ], source: {
                uri: tenorUrlToBskyGifUrl(gif.media_formats.tinygif.url),
            }, contentFit: "cover", accessibilityLabel: gif.title, accessibilityHint: "", cachePolicy: "none", accessibilityIgnoresInvertColors: true })) }));
}
//# sourceMappingURL=GifSelect.js.map