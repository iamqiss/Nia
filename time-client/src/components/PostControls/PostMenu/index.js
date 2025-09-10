import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useMemo, useState } from 'react';
import {} from 'react-native';
import {} from '@atproto/api';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {} from '#/state/cache/post-shadow';
import { EventStopper } from '#/view/com/util/EventStopper';
import { DotGrid_Stroke2_Corner0_Rounded as DotsHorizontal } from '#/components/icons/DotGrid';
import { useMenuControl } from '#/components/Menu';
import * as Menu from '#/components/Menu';
import { PostControlButton, PostControlButtonIcon } from '../PostControlButton';
import { PostMenuItems } from './PostMenuItems';
let PostMenuButton = ({ testID, post, postFeedContext, postReqId, big, record, richText, timestamp, threadgateRecord, onShowLess, hitSlop, }) => {
    const { _ } = useLingui();
    const menuControl = useMenuControl();
    const [hasBeenOpen, setHasBeenOpen] = useState(false);
    const lazyMenuControl = useMemo(() => ({
        ...menuControl,
        open() {
            setHasBeenOpen(true);
            // HACK. We need the state update to be flushed by the time
            // menuControl.open() fires but RN doesn't expose flushSync.
            setTimeout(menuControl.open);
        },
    }), [menuControl, setHasBeenOpen]);
    return (_jsx(EventStopper, { onKeyDown: false, children: _jsxs(Menu.Root, { control: lazyMenuControl, children: [_jsx(Menu.Trigger, { label: _(msg `Open post options menu`), children: ({ props }) => {
                        return (_jsx(PostControlButton, { testID: "postDropdownBtn", big: big, label: props.accessibilityLabel, ...props, hitSlop: hitSlop, children: _jsx(PostControlButtonIcon, { icon: DotsHorizontal }) }));
                    } }), hasBeenOpen && (
                // Lazily initialized. Once mounted, they stay mounted.
                _jsx(PostMenuItems, { testID: testID, post: post, postFeedContext: postFeedContext, postReqId: postReqId, record: record, richText: richText, timestamp: timestamp, threadgateRecord: threadgateRecord, onShowLess: onShowLess }))] }) }));
};
PostMenuButton = memo(PostMenuButton);
export { PostMenuButton };
//# sourceMappingURL=index.js.map