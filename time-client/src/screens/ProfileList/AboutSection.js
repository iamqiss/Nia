import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useImperativeHandle, useState } from 'react';
import { View } from 'react-native';
import {} from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { isNative } from '#/platform/detection';
import { useSession } from '#/state/session';
import { ListMembers } from '#/view/com/lists/ListMembers';
import { EmptyState } from '#/view/com/util/EmptyState';
import {} from '#/view/com/util/List';
import { LoadLatestBtn } from '#/view/com/util/load-latest/LoadLatestBtn';
import { atoms as a, useBreakpoints } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import { PersonPlus_Stroke2_Corner0_Rounded as PersonPlusIcon } from '#/components/icons/Person';
export function AboutSection({ ref, list, onPressAddUser, headerHeight, scrollElRef, }) {
    const { _ } = useLingui();
    const { currentAccount } = useSession();
    const { gtMobile } = useBreakpoints();
    const [isScrolledDown, setIsScrolledDown] = useState(false);
    const isOwner = list.creator.did === currentAccount?.did;
    const onScrollToTop = useCallback(() => {
        scrollElRef.current?.scrollToOffset({
            animated: isNative,
            offset: -headerHeight,
        });
    }, [scrollElRef, headerHeight]);
    useImperativeHandle(ref, () => ({
        scrollToTop: onScrollToTop,
    }));
    const renderHeader = useCallback(() => {
        if (!isOwner) {
            return _jsx(View, {});
        }
        if (!gtMobile) {
            return (_jsx(View, { style: [a.px_sm, a.py_sm], children: _jsxs(Button, { testID: "addUserBtn", label: _(msg `Add a user to this list`), onPress: onPressAddUser, color: "primary", size: "small", variant: "outline", style: [a.py_md], children: [_jsx(ButtonIcon, { icon: PersonPlusIcon }), _jsx(ButtonText, { children: _jsx(Trans, { children: "Add people" }) })] }) }));
        }
        return (_jsx(View, { style: [a.px_lg, a.py_md, a.flex_row_reverse], children: _jsxs(Button, { testID: "addUserBtn", label: _(msg `Add a user to this list`), onPress: onPressAddUser, color: "primary", size: "small", variant: "ghost", style: [a.py_sm], children: [_jsx(ButtonIcon, { icon: PersonPlusIcon }), _jsx(ButtonText, { children: _jsx(Trans, { children: "Add people" }) })] }) }));
    }, [isOwner, _, onPressAddUser, gtMobile]);
    const renderEmptyState = useCallback(() => {
        return (_jsxs(View, { style: [a.gap_xl, a.align_center], children: [_jsx(EmptyState, { icon: "users-slash", message: _(msg `This list is empty.`) }), isOwner && (_jsxs(Button, { testID: "emptyStateAddUserBtn", label: _(msg `Start adding people`), onPress: onPressAddUser, color: "primary", size: "small", children: [_jsx(ButtonIcon, { icon: PersonPlusIcon }), _jsx(ButtonText, { children: _jsx(Trans, { children: "Start adding people!" }) })] }))] }));
    }, [_, onPressAddUser, isOwner]);
    return (_jsxs(View, { children: [_jsx(ListMembers, { testID: "listItems", list: list.uri, scrollElRef: scrollElRef, renderHeader: renderHeader, renderEmptyState: renderEmptyState, headerOffset: headerHeight, onScrolledDownChange: setIsScrolledDown }), isScrolledDown && (_jsx(LoadLatestBtn, { onPress: onScrollToTop, label: _(msg `Scroll to top`), showIndicator: false }))] }));
}
//# sourceMappingURL=AboutSection.js.map