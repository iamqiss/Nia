import { cacheDirectory, deleteAsync, makeDirectoryAsync, moveAsync, } from 'expo-file-system';
import { manipulateAsync, SaveFormat, } from 'expo-image-manipulator';
import { nanoid } from 'nanoid/non-secure';
import { POST_IMG_MAX } from '#/lib/constants';
import { getImageDim } from '#/lib/media/manip';
import { openCropper } from '#/lib/media/picker';
import {} from '#/lib/media/picker.shared';
import { getDataUriSize } from '#/lib/media/util';
import { isNative } from '#/platform/detection';
let _imageCacheDirectory;
function getImageCacheDirectory() {
    if (isNative) {
        return (_imageCacheDirectory ??= joinPath(cacheDirectory, 'bsky-composer'));
    }
    return null;
}
export async function createComposerImage(raw) {
    return {
        alt: '',
        source: {
            id: nanoid(),
            path: await moveIfNecessary(raw.path),
            width: raw.width,
            height: raw.height,
            mime: raw.mime,
        },
    };
}
export function createInitialImages(uris = []) {
    return uris.map(({ uri, width, height, altText = '' }) => {
        return {
            alt: altText,
            source: {
                id: nanoid(),
                path: uri,
                width: width,
                height: height,
                mime: 'image/jpeg',
            },
        };
    });
}
export async function pasteImage(uri) {
    const { width, height } = await getImageDim(uri);
    const match = /^data:(.+?);/.exec(uri);
    return {
        alt: '',
        source: {
            id: nanoid(),
            path: uri,
            width: width,
            height: height,
            mime: match ? match[1] : 'image/jpeg',
        },
    };
}
export async function cropImage(img) {
    if (!isNative) {
        return img;
    }
    const source = img.source;
    // @todo: we're always passing the original image here, does image-cropper
    // allows for setting initial crop dimensions? -mary
    try {
        const cropped = await openCropper({
            imageUri: source.path,
        });
        return {
            alt: img.alt,
            source: source,
            transformed: {
                path: await moveIfNecessary(cropped.path),
                width: cropped.width,
                height: cropped.height,
                mime: cropped.mime,
            },
        };
    }
    catch (e) {
        if (e instanceof Error && e.message.includes('User cancelled')) {
            return img;
        }
        throw e;
    }
}
export async function manipulateImage(img, trans) {
    const rawActions = [trans.crop && { crop: trans.crop }];
    const actions = rawActions.filter((a) => a !== undefined);
    if (actions.length === 0) {
        if (img.transformed === undefined) {
            return img;
        }
        return { alt: img.alt, source: img.source };
    }
    const source = img.source;
    const result = await manipulateAsync(source.path, actions, {
        format: SaveFormat.PNG,
    });
    return {
        alt: img.alt,
        source: img.source,
        transformed: {
            path: await moveIfNecessary(result.uri),
            width: result.width,
            height: result.height,
            mime: 'image/png',
        },
        manips: trans,
    };
}
export function resetImageManipulation(img) {
    if (img.transformed !== undefined) {
        return { alt: img.alt, source: img.source };
    }
    return img;
}
export async function compressImage(img) {
    const source = img.transformed || img.source;
    const [w, h] = containImageRes(source.width, source.height, POST_IMG_MAX);
    let minQualityPercentage = 0;
    let maxQualityPercentage = 101; // exclusive
    let newDataUri;
    while (maxQualityPercentage - minQualityPercentage > 1) {
        const qualityPercentage = Math.round((maxQualityPercentage + minQualityPercentage) / 2);
        const res = await manipulateAsync(source.path, [{ resize: { width: w, height: h } }], {
            compress: qualityPercentage / 100,
            format: SaveFormat.JPEG,
            base64: true,
        });
        const base64 = res.base64;
        const size = base64 ? getDataUriSize(base64) : 0;
        if (base64 && size <= POST_IMG_MAX.size) {
            minQualityPercentage = qualityPercentage;
            newDataUri = {
                path: await moveIfNecessary(res.uri),
                width: res.width,
                height: res.height,
                mime: 'image/jpeg',
                size,
            };
        }
        else {
            maxQualityPercentage = qualityPercentage;
        }
    }
    if (newDataUri) {
        return newDataUri;
    }
    throw new Error(`Unable to compress image`);
}
async function moveIfNecessary(from) {
    const cacheDir = isNative && getImageCacheDirectory();
    if (cacheDir && from.startsWith(cacheDir)) {
        const to = joinPath(cacheDir, nanoid(36));
        await makeDirectoryAsync(cacheDir, { intermediates: true });
        await moveAsync({ from, to });
        return to;
    }
    return from;
}
/** Purge files that were created to accomodate image manipulation */
export async function purgeTemporaryImageFiles() {
    const cacheDir = isNative && getImageCacheDirectory();
    if (cacheDir) {
        await deleteAsync(cacheDir, { idempotent: true });
        await makeDirectoryAsync(cacheDir);
    }
}
function joinPath(a, b) {
    if (a.endsWith('/')) {
        if (b.startsWith('/')) {
            return a.slice(0, -1) + b;
        }
        return a + b;
    }
    else if (b.startsWith('/')) {
        return a + b;
    }
    return a + '/' + b;
}
function containImageRes(w, h, { width: maxW, height: maxH }) {
    let scale = 1;
    if (w > maxW || h > maxH) {
        scale = w > h ? maxW / w : maxH / h;
        w = Math.floor(w * scale);
        h = Math.floor(h * scale);
    }
    return [w, h];
}
//# sourceMappingURL=gallery.js.map