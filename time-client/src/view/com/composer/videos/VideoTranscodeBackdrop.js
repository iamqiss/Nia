import { jsx as _jsx } from "react/jsx-runtime";
import { clearCache, createVideoThumbnail } from 'react-native-compressor';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { useQuery } from '@tanstack/react-query';
import { atoms as a } from '#/alf';
export const RQKEY = 'video-thumbnail';
export function clearThumbnailCache(queryClient) {
    clearCache().catch(() => { });
    queryClient.resetQueries({ queryKey: [RQKEY] });
}
export function VideoTranscodeBackdrop({ uri }) {
    const { data: thumbnail } = useQuery({
        queryKey: [RQKEY, uri],
        queryFn: async () => {
            return await createVideoThumbnail(uri);
        },
    });
    return (thumbnail && (_jsx(Animated.View, { style: a.flex_1, entering: FadeIn, children: _jsx(Image, { style: a.flex_1, source: thumbnail.path, cachePolicy: "none", accessibilityIgnoresInvertColors: true, blurRadius: 15, contentFit: "cover" }) })));
}
//# sourceMappingURL=VideoTranscodeBackdrop.js.map