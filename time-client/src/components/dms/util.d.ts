import { type ChatBskyConvoDefs } from '@atproto/api';
import type * as bsky from '#/types/bsky';
export declare function canBeMessaged(profile: bsky.profile.AnyProfileView): boolean;
export declare function localDateString(date: Date): string;
export declare function hasAlreadyReacted(message: ChatBskyConvoDefs.MessageView, myDid: string | undefined, emoji: string): boolean;
export declare function hasReachedReactionLimit(message: ChatBskyConvoDefs.MessageView, myDid: string | undefined): boolean;
//# sourceMappingURL=util.d.ts.map