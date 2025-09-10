import { type BskyAgent } from '@atproto/api';
import { type I18n } from '@lingui/core';
export declare function getServiceAuthToken({ agent, aud, lxm, exp, }: {
    agent: BskyAgent;
    aud?: string;
    lxm: string;
    exp?: number;
}): Promise<any>;
export declare function getVideoUploadLimits(agent: BskyAgent, _: I18n['_']): Promise<void>;
//# sourceMappingURL=upload.shared.d.ts.map