import React from 'react';
import { type StyleProp, type TextStyle } from 'react-native';
import { type ConvoItem } from '#/state/messages/convo/types';
declare let MessageItem: ({ item, }: {
    item: ConvoItem & {
        type: "message" | "pending-message";
    };
}) => React.ReactNode;
export { MessageItem };
declare let MessageItemMetadata: ({ item, style, }: {
    item: ConvoItem & {
        type: "message" | "pending-message";
    };
    style: StyleProp<TextStyle>;
}) => React.ReactNode;
export { MessageItemMetadata };
//# sourceMappingURL=MessageItem.d.ts.map