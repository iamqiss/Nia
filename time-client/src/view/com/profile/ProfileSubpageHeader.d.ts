import React from 'react';
import { type AppBskyGraphDefs } from '@atproto/api';
import { type UserAvatarType } from '#/view/com/util/UserAvatar';
export declare function ProfileSubpageHeader({ isLoading, href, title, avatar, isOwner, purpose, creator, avatarType, children, }: React.PropsWithChildren<{
    isLoading?: boolean;
    href: string;
    title: string | undefined;
    avatar: string | undefined;
    isOwner: boolean | undefined;
    purpose: AppBskyGraphDefs.ListPurpose | undefined;
    creator: {
        did: string;
        handle: string;
    } | undefined;
    avatarType: UserAvatarType | 'starter-pack';
}>): any;
//# sourceMappingURL=ProfileSubpageHeader.d.ts.map