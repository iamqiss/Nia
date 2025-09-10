import { BskyAgent } from '@atproto/api';
import { TestNetwork } from '@atproto/dev-env';
export interface TestUser {
    email: string;
    did: string;
    handle: string;
    password: string;
    agent: BskyAgent;
}
export interface TestPDS {
    appviewDid: string;
    pdsUrl: string;
    mocker: Mocker;
    close: () => Promise<void>;
}
export declare function createServer({ inviteRequired }?: {
    inviteRequired: boolean;
}): Promise<TestPDS>;
declare class Mocker {
    testNet: TestNetwork;
    service: string;
    pic: Uint8Array;
    agent: BskyAgent;
    users: Record<string, TestUser>;
    constructor(testNet: TestNetwork, service: string, pic: Uint8Array);
    get pds(): any;
    get bsky(): any;
    get plc(): any;
    dateGen(): Generator<string, void, unknown>;
    createUser(name: string): Promise<void>;
    follow(a: string, b: string): Promise<void>;
    generateStandardGraph(): Promise<void>;
    createPost(user: string, text: string): Promise<any>;
    createImagePost(user: string, text: string): Promise<any>;
    createQuotePost(user: string, text: string, { uri, cid }: {
        uri: string;
        cid: string;
    }): Promise<any>;
    createReply(user: string, text: string, { uri, cid }: {
        uri: string;
        cid: string;
    }): Promise<any>;
    like(user: string, { uri, cid }: {
        uri: string;
        cid: string;
    }): Promise<any>;
    createFeed(user: string, rkey: string, posts: string[]): Promise<any>;
    createInvite(forAccount: string): Promise<void>;
    labelAccount(label: string, user: string): Promise<void>;
    labelProfile(label: string, user: string): Promise<void>;
    labelPost(label: string, { uri, cid }: {
        uri: string;
        cid: string;
    }): Promise<void>;
    createMuteList(user: string, name: string): Promise<string>;
    addToMuteList(owner: string, list: string, subject: string): Promise<void>;
}
export {};
//# sourceMappingURL=test-pds.d.ts.map