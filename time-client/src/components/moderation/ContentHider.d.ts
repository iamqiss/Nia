import React from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { type ModerationUI } from '@atproto/api';
export declare function ContentHider({ testID, modui, ignoreMute, style, activeStyle, childContainerStyle, children, }: {
    testID?: string;
    modui: ModerationUI | undefined;
    ignoreMute?: boolean;
    style?: StyleProp<ViewStyle>;
    activeStyle?: StyleProp<ViewStyle>;
    childContainerStyle?: StyleProp<ViewStyle>;
    children?: React.ReactNode | ((props: {
        active: boolean;
    }) => React.ReactNode);
}): any;
//# sourceMappingURL=ContentHider.d.ts.map