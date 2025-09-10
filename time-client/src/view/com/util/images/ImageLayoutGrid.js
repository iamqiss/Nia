import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAnimatedRef } from 'react-native-reanimated';
import {} from '@atproto/api';
import { atoms as a, useBreakpoints } from '#/alf';
import { PostEmbedViewContext } from '#/components/Post/Embed/types';
import {} from '../../lightbox/ImageViewing/@types';
import { GalleryItem } from './Gallery';
export function ImageLayoutGrid({ style, ...props }) {
    const { gtMobile } = useBreakpoints();
    const gap = props.viewContext === PostEmbedViewContext.FeedEmbedRecordWithMedia
        ? gtMobile
            ? a.gap_xs
            : a.gap_2xs
        : a.gap_xs;
    return (_jsx(View, { style: style, children: _jsx(View, { style: [gap, a.rounded_md, a.overflow_hidden], children: _jsx(ImageLayoutGridInner, { ...props, gap: gap }) }) }));
}
function ImageLayoutGridInner(props) {
    const gap = props.gap;
    const count = props.images.length;
    const containerRef1 = useAnimatedRef();
    const containerRef2 = useAnimatedRef();
    const containerRef3 = useAnimatedRef();
    const containerRef4 = useAnimatedRef();
    const thumbDimsRef = React.useRef([]);
    switch (count) {
        case 2: {
            const containerRefs = [containerRef1, containerRef2];
            return (_jsxs(View, { style: [a.flex_1, a.flex_row, gap], children: [_jsx(View, { style: [a.flex_1, { aspectRatio: 1 }], children: _jsx(GalleryItem, { ...props, index: 0, insetBorderStyle: noCorners(['topRight', 'bottomRight']), containerRefs: containerRefs, thumbDimsRef: thumbDimsRef }) }), _jsx(View, { style: [a.flex_1, { aspectRatio: 1 }], children: _jsx(GalleryItem, { ...props, index: 1, insetBorderStyle: noCorners(['topLeft', 'bottomLeft']), containerRefs: containerRefs, thumbDimsRef: thumbDimsRef }) })] }));
        }
        case 3: {
            const containerRefs = [containerRef1, containerRef2, containerRef3];
            return (_jsxs(View, { style: [a.flex_1, a.flex_row, gap], children: [_jsx(View, { style: [a.flex_1, { aspectRatio: 1 }], children: _jsx(GalleryItem, { ...props, index: 0, insetBorderStyle: noCorners(['topRight', 'bottomRight']), containerRefs: containerRefs, thumbDimsRef: thumbDimsRef }) }), _jsxs(View, { style: [a.flex_1, { aspectRatio: 1 }, gap], children: [_jsx(View, { style: [a.flex_1], children: _jsx(GalleryItem, { ...props, index: 1, insetBorderStyle: noCorners([
                                        'topLeft',
                                        'bottomLeft',
                                        'bottomRight',
                                    ]), containerRefs: containerRefs, thumbDimsRef: thumbDimsRef }) }), _jsx(View, { style: [a.flex_1], children: _jsx(GalleryItem, { ...props, index: 2, insetBorderStyle: noCorners([
                                        'topLeft',
                                        'bottomLeft',
                                        'topRight',
                                    ]), containerRefs: containerRefs, thumbDimsRef: thumbDimsRef }) })] })] }));
        }
        case 4: {
            const containerRefs = [
                containerRef1,
                containerRef2,
                containerRef3,
                containerRef4,
            ];
            return (_jsxs(_Fragment, { children: [_jsxs(View, { style: [a.flex_row, gap], children: [_jsx(View, { style: [a.flex_1, { aspectRatio: 1.5 }], children: _jsx(GalleryItem, { ...props, index: 0, insetBorderStyle: noCorners([
                                        'bottomLeft',
                                        'topRight',
                                        'bottomRight',
                                    ]), containerRefs: containerRefs, thumbDimsRef: thumbDimsRef }) }), _jsx(View, { style: [a.flex_1, { aspectRatio: 1.5 }], children: _jsx(GalleryItem, { ...props, index: 1, insetBorderStyle: noCorners([
                                        'topLeft',
                                        'bottomLeft',
                                        'bottomRight',
                                    ]), containerRefs: containerRefs, thumbDimsRef: thumbDimsRef }) })] }), _jsxs(View, { style: [a.flex_row, gap], children: [_jsx(View, { style: [a.flex_1, { aspectRatio: 1.5 }], children: _jsx(GalleryItem, { ...props, index: 2, insetBorderStyle: noCorners([
                                        'topLeft',
                                        'topRight',
                                        'bottomRight',
                                    ]), containerRefs: containerRefs, thumbDimsRef: thumbDimsRef }) }), _jsx(View, { style: [a.flex_1, { aspectRatio: 1.5 }], children: _jsx(GalleryItem, { ...props, index: 3, insetBorderStyle: noCorners([
                                        'topLeft',
                                        'bottomLeft',
                                        'topRight',
                                    ]), containerRefs: containerRefs, thumbDimsRef: thumbDimsRef }) })] })] }));
        }
        default:
            return null;
    }
}
function noCorners(corners) {
    const styles = [];
    if (corners.includes('topLeft')) {
        styles.push({ borderTopLeftRadius: 0 });
    }
    if (corners.includes('topRight')) {
        styles.push({ borderTopRightRadius: 0 });
    }
    if (corners.includes('bottomLeft')) {
        styles.push({ borderBottomLeftRadius: 0 });
    }
    if (corners.includes('bottomRight')) {
        styles.push({ borderBottomRightRadius: 0 });
    }
    return StyleSheet.flatten(styles);
}
//# sourceMappingURL=ImageLayoutGrid.js.map