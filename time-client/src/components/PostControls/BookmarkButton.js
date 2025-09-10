import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo } from 'react';
import {} from 'react-native';
import {} from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useCleanError } from '#/lib/hooks/useCleanError';
import { logger } from '#/logger';
import {} from '#/state/cache/post-shadow';
import { useBookmarkMutation } from '#/state/queries/bookmarks/useBookmarkMutation';
import { useRequireAuth } from '#/state/session';
import { useTheme } from '#/alf';
import { Bookmark, BookmarkFilled } from '#/components/icons/Bookmark';
import { Trash_Stroke2_Corner0_Rounded as TrashIcon } from '#/components/icons/Trash';
import * as toast from '#/components/Toast';
import { PostControlButton, PostControlButtonIcon } from './PostControlButton';
export const BookmarkButton = memo(function BookmarkButton({ post, big, logContext, hitSlop, }) {
    const t = useTheme();
    const { _ } = useLingui();
    const { mutateAsync: bookmark } = useBookmarkMutation();
    const cleanError = useCleanError();
    const requireAuth = useRequireAuth();
    const { viewer } = post;
    const isBookmarked = !!viewer?.bookmarked;
    const undoLabel = _(msg({
        message: `Undo`,
        context: `Button label to undo saving/removing a post from saved posts.`,
    }));
    const save = async ({ disableUndo } = {}) => {
        try {
            await bookmark({
                action: 'create',
                post,
            });
            logger.metric('post:bookmark', { logContext });
            toast.show(_jsxs(toast.Outer, { children: [_jsx(toast.Icon, {}), _jsx(toast.Text, { children: _jsx(Trans, { children: "Post saved" }) }), !disableUndo && (_jsx(toast.Action, { label: undoLabel, onPress: () => remove({ disableUndo: true }), children: undoLabel }))] }), {
                type: 'success',
            });
        }
        catch (e) {
            const { raw, clean } = cleanError(e);
            toast.show(clean || raw || e, {
                type: 'error',
            });
        }
    };
    const remove = async ({ disableUndo } = {}) => {
        try {
            await bookmark({
                action: 'delete',
                uri: post.uri,
            });
            logger.metric('post:unbookmark', { logContext });
            toast.show(_jsxs(toast.Outer, { children: [_jsx(toast.Icon, { icon: TrashIcon }), _jsx(toast.Text, { children: _jsx(Trans, { children: "Removed from saved posts" }) }), !disableUndo && (_jsx(toast.Action, { label: undoLabel, onPress: () => save({ disableUndo: true }), children: undoLabel }))] }));
        }
        catch (e) {
            const { raw, clean } = cleanError(e);
            toast.show(clean || raw || e, {
                type: 'error',
            });
        }
    };
    const onHandlePress = () => requireAuth(async () => {
        if (isBookmarked) {
            await remove();
        }
        else {
            await save();
        }
    });
    return (_jsx(PostControlButton, { testID: "postBookmarkBtn", big: big, label: isBookmarked
            ? _(msg `Remove from saved posts`)
            : _(msg `Add to saved posts`), onPress: onHandlePress, hitSlop: hitSlop, children: _jsx(PostControlButtonIcon, { fill: isBookmarked ? t.palette.primary_500 : undefined, icon: isBookmarked ? BookmarkFilled : Bookmark }) }));
});
//# sourceMappingURL=BookmarkButton.js.map