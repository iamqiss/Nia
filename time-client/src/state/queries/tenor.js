import { Platform } from 'react-native';
import { getLocales } from 'expo-localization';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { GIF_FEATURED, GIF_SEARCH } from '#/lib/constants';
import { logger } from '#/logger';
export const RQKEY_ROOT = 'gif-service';
export const RQKEY_FEATURED = [RQKEY_ROOT, 'featured'];
export const RQKEY_SEARCH = (query) => [RQKEY_ROOT, 'search', query];
const getTrendingGifs = createTenorApi(GIF_FEATURED);
const searchGifs = createTenorApi(GIF_SEARCH);
export function useFeaturedGifsQuery() {
    return useInfiniteQuery({
        queryKey: RQKEY_FEATURED,
        queryFn: ({ pageParam }) => getTrendingGifs({ pos: pageParam }),
        initialPageParam: undefined,
        getNextPageParam: lastPage => lastPage.next,
    });
}
export function useGifSearchQuery(query) {
    return useInfiniteQuery({
        queryKey: RQKEY_SEARCH(query),
        queryFn: ({ pageParam }) => searchGifs({ q: query, pos: pageParam }),
        initialPageParam: undefined,
        getNextPageParam: lastPage => lastPage.next,
        enabled: !!query,
        placeholderData: keepPreviousData,
    });
}
function createTenorApi(urlFn) {
    return async (input) => {
        const params = new URLSearchParams();
        // set client key based on platform
        params.set('client_key', Platform.select({
            ios: 'bluesky-ios',
            android: 'bluesky-android',
            default: 'bluesky-web',
        }));
        // 30 is divisible by 2 and 3, so both 2 and 3 column layouts can be used
        params.set('limit', '30');
        params.set('contentfilter', 'high');
        params.set('media_filter', ['preview', 'gif', 'tinygif'].join(','));
        const locale = getLocales?.()?.[0];
        if (locale) {
            params.set('locale', locale.languageTag.replace('-', '_'));
        }
        for (const [key, value] of Object.entries(input)) {
            if (value !== undefined) {
                params.set(key, String(value));
            }
        }
        const res = await fetch(urlFn(params.toString()), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!res.ok) {
            throw new Error('Failed to fetch Tenor API');
        }
        return res.json();
    };
}
export function tenorUrlToBskyGifUrl(tenorUrl) {
    let url;
    try {
        url = new URL(tenorUrl);
    }
    catch (e) {
        logger.debug('invalid url passed to tenorUrlToBskyGifUrl()');
        return '';
    }
    url.hostname = 't.gifs.bsky.app';
    return url.href;
}
// | 'nanogif'
// | 'mp4'
// | 'loopedmp4'
// | 'tinymp4'
// | 'nanomp4'
// | 'webm'
// | 'tinywebm'
// | 'nanowebm'
//# sourceMappingURL=tenor.js.map