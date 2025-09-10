import React from 'react';
import { type ChatBskyConvoDefs, type ModerationCause } from '@atproto/api';
import { type Shadow } from '#/state/cache/types';
import { type ViewStyleProp } from '#/alf';
import * as Menu from '#/components/Menu';
import type * as bsky from '#/types/bsky';
declare let ConvoMenu: ({ convo, profile, control, currentScreen, showMarkAsRead, hideTrigger, blockInfo, latestReportableMessage, style, }: {
    convo: ChatBskyConvoDefs.ConvoView;
    profile: Shadow<bsky.profile.AnyProfileView>;
    control?: Menu.MenuControlProps;
    currentScreen: "list" | "conversation";
    showMarkAsRead?: boolean;
    hideTrigger?: boolean;
    blockInfo: {
        listBlocks: ModerationCause[];
        userBlock?: ModerationCause;
    };
    latestReportableMessage?: ChatBskyConvoDefs.MessageView;
    style?: ViewStyleProp["style"];
}) => React.ReactNode;
export { ConvoMenu };
//# sourceMappingURL=ConvoMenu.d.ts.map