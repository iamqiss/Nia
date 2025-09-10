import { AtUri, BskyAgent } from '@atproto/api';
import { TestNetwork } from '@atproto/dev-env';
import fs from 'fs';
import net from 'net';
import path from 'path';
class StringIdGenerator {
    _chars;
    _nextId = [0];
    constructor(_chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
        this._chars = _chars;
    }
    next() {
        const r = [];
        for (const char of this._nextId) {
            r.unshift(this._chars[char]);
        }
        this._increment();
        return r.join('');
    }
    _increment() {
        for (let i = 0; i < this._nextId.length; i++) {
            const val = ++this._nextId[i];
            if (val >= this._chars.length) {
                this._nextId[i] = 0;
            }
            else {
                return;
            }
        }
        this._nextId.push(0);
    }
    *[Symbol.iterator]() {
        while (true) {
            yield this.next();
        }
    }
}
const ids = new StringIdGenerator();
export async function createServer({ inviteRequired } = {
    inviteRequired: false,
}) {
    const port = 3000;
    const port2 = await getPort(port + 1);
    const port3 = await getPort(port2 + 1);
    const pdsUrl = `http://localhost:${port}`;
    const id = ids.next();
    const testNet = await TestNetwork.create({
        pds: {
            port,
            hostname: 'localhost',
            inviteRequired,
        },
        bsky: {
            dbPostgresSchema: `bsky_${id}`,
            port: port3,
            publicUrl: 'http://localhost:2584',
        },
        plc: { port: port2 },
    });
    // DISABLED - looks like dev-env added this and now it conflicts
    // add the test mod authority
    // const agent = new BskyAgent({service: pdsUrl})
    // const res = await agent.api.com.atproto.server.createAccount({
    //   email: 'mod-authority@test.com',
    //   handle: 'mod-authority.test',
    //   password: 'hunter2',
    // })
    // agent.api.setHeader('Authorization', `Bearer ${res.data.accessJwt}`)
    // await agent.api.app.bsky.actor.profile.create(
    //   {repo: res.data.did},
    //   {
    //     displayName: 'Dev-env Moderation',
    //     description: `The pretend version of mod.bsky.app`,
    //   },
    // )
    // await agent.api.app.bsky.labeler.service.create(
    //   {repo: res.data.did, rkey: 'self'},
    //   {
    //     policies: {
    //       labelValues: ['!hide', '!warn'],
    //       labelValueDefinitions: [],
    //     },
    //     createdAt: new Date().toISOString(),
    //   },
    // )
    const pic = fs.readFileSync(path.join(__dirname, '..', 'assets', 'default-avatar.png'));
    return {
        appviewDid: testNet.bsky.serverDid,
        pdsUrl,
        mocker: new Mocker(testNet, pdsUrl, pic),
        async close() {
            await testNet.close();
        },
    };
}
class Mocker {
    testNet;
    service;
    pic;
    agent;
    users = {};
    constructor(testNet, service, pic) {
        this.testNet = testNet;
        this.service = service;
        this.pic = pic;
        this.agent = new BskyAgent({ service });
    }
    get pds() {
        return this.testNet.pds;
    }
    get bsky() {
        return this.testNet.bsky;
    }
    get plc() {
        return this.testNet.plc;
    }
    // NOTE
    // deterministic date generator
    // we use this to ensure the mock dataset is always the same
    // which is very useful when testing
    *dateGen() {
        let start = 1657846031914;
        while (true) {
            yield new Date(start).toISOString();
            start += 1e3;
        }
    }
    async createUser(name) {
        const agent = new BskyAgent({ service: this.service });
        const inviteRes = await agent.api.com.atproto.server.createInviteCode({ useCount: 1 }, {
            headers: this.pds.adminAuthHeaders(),
            encoding: 'application/json',
        });
        const email = `fake${Object.keys(this.users).length + 1}@fake.com`;
        const res = await agent.createAccount({
            inviteCode: inviteRes.data.code,
            email,
            handle: name + '.test',
            password: 'hunter2',
        });
        await agent.upsertProfile(async () => {
            const blob = await agent.uploadBlob(this.pic, {
                encoding: 'image/jpeg',
            });
            return {
                displayName: name,
                avatar: blob.data.blob,
            };
        });
        this.users[name] = {
            did: res.data.did,
            email,
            handle: name + '.test',
            password: 'hunter2',
            agent: agent,
        };
    }
    async follow(a, b) {
        await this.users[a].agent.follow(this.users[b].did);
    }
    async generateStandardGraph() {
        await this.createUser('alice');
        await this.createUser('bob');
        await this.createUser('carla');
        await this.users.alice.agent.upsertProfile(() => ({
            displayName: 'Alice',
            description: 'Test user 1',
        }));
        await this.users.bob.agent.upsertProfile(() => ({
            displayName: 'Bob',
            description: 'Test user 2',
        }));
        await this.users.carla.agent.upsertProfile(() => ({
            displayName: 'Carla',
            description: 'Test user 3',
        }));
        await this.follow('alice', 'bob');
        await this.follow('alice', 'carla');
        await this.follow('bob', 'alice');
        await this.follow('bob', 'carla');
        await this.follow('carla', 'alice');
        await this.follow('carla', 'bob');
    }
    async createPost(user, text) {
        const agent = this.users[user]?.agent;
        if (!agent) {
            throw new Error(`Not a user: ${user}`);
        }
        return await agent.post({
            text,
            langs: ['en'],
            createdAt: new Date().toISOString(),
        });
    }
    async createImagePost(user, text) {
        const agent = this.users[user]?.agent;
        if (!agent) {
            throw new Error(`Not a user: ${user}`);
        }
        const blob = await agent.uploadBlob(this.pic, {
            encoding: 'image/jpeg',
        });
        return await agent.post({
            text,
            langs: ['en'],
            embed: {
                $type: 'app.bsky.embed.images',
                images: [{ image: blob.data.blob, alt: '' }],
            },
            createdAt: new Date().toISOString(),
        });
    }
    async createQuotePost(user, text, { uri, cid }) {
        const agent = this.users[user]?.agent;
        if (!agent) {
            throw new Error(`Not a user: ${user}`);
        }
        return await agent.post({
            text,
            embed: { $type: 'app.bsky.embed.record', record: { uri, cid } },
            langs: ['en'],
            createdAt: new Date().toISOString(),
        });
    }
    async createReply(user, text, { uri, cid }) {
        const agent = this.users[user]?.agent;
        if (!agent) {
            throw new Error(`Not a user: ${user}`);
        }
        return await agent.post({
            text,
            reply: { root: { uri, cid }, parent: { uri, cid } },
            langs: ['en'],
            createdAt: new Date().toISOString(),
        });
    }
    async like(user, { uri, cid }) {
        const agent = this.users[user]?.agent;
        if (!agent) {
            throw new Error(`Not a user: ${user}`);
        }
        return await agent.like(uri, cid);
    }
    async createFeed(user, rkey, posts) {
        const agent = this.users[user]?.agent;
        if (!agent) {
            throw new Error(`Not a user: ${user}`);
        }
        const fgUri = AtUri.make(this.users[user].did, 'app.bsky.feed.generator', rkey);
        const fg1 = await this.testNet.createFeedGen({
            [fgUri.toString()]: async () => {
                return {
                    encoding: 'application/json',
                    body: {
                        feed: posts.slice(0, 30).map(uri => ({ post: uri })),
                    },
                };
            },
        });
        const avatarRes = await agent.api.com.atproto.repo.uploadBlob(this.pic, {
            encoding: 'image/png',
        });
        return await agent.api.app.bsky.feed.generator.create({ repo: this.users[user].did, rkey }, {
            did: fg1.did,
            displayName: rkey,
            description: 'all my fav stuff',
            avatar: avatarRes.data.blob,
            createdAt: new Date().toISOString(),
        });
    }
    async createInvite(forAccount) {
        const agent = new BskyAgent({ service: this.service });
        await agent.api.com.atproto.server.createInviteCode({ useCount: 1, forAccount }, {
            headers: this.pds.adminAuthHeaders(),
            encoding: 'application/json',
        });
    }
    async labelAccount(label, user) {
        const did = this.users[user]?.did;
        if (!did) {
            throw new Error(`Invalid user: ${user}`);
        }
        const ctx = this.bsky.ctx;
        if (!ctx) {
            throw new Error('Invalid appview');
        }
        await createLabel(this.bsky, {
            uri: did,
            cid: '',
            val: label,
        });
    }
    async labelProfile(label, user) {
        const agent = this.users[user]?.agent;
        const did = this.users[user]?.did;
        if (!did) {
            throw new Error(`Invalid user: ${user}`);
        }
        const profile = await agent.app.bsky.actor.profile.get({
            repo: user + '.test',
            rkey: 'self',
        });
        const ctx = this.bsky.ctx;
        if (!ctx) {
            throw new Error('Invalid appview');
        }
        await createLabel(this.bsky, {
            uri: profile.uri,
            cid: profile.cid,
            val: label,
        });
    }
    async labelPost(label, { uri, cid }) {
        const ctx = this.bsky.ctx;
        if (!ctx) {
            throw new Error('Invalid appview');
        }
        await createLabel(this.bsky, {
            uri,
            cid,
            val: label,
        });
    }
    async createMuteList(user, name) {
        const res = await this.users[user]?.agent.app.bsky.graph.list.create({ repo: this.users[user]?.did }, {
            purpose: 'app.bsky.graph.defs#modlist',
            name,
            createdAt: new Date().toISOString(),
        });
        await this.users[user]?.agent.app.bsky.graph.muteActorList({
            list: res.uri,
        });
        return res.uri;
    }
    async addToMuteList(owner, list, subject) {
        await this.users[owner]?.agent.app.bsky.graph.listitem.create({ repo: this.users[owner]?.did }, {
            list,
            subject,
            createdAt: new Date().toISOString(),
        });
    }
}
const checkAvailablePort = (port) => new Promise(resolve => {
    const server = net.createServer();
    server.unref();
    server.on('error', () => resolve(false));
    server.listen({ port }, () => {
        server.close(() => {
            resolve(true);
        });
    });
});
async function getPort(start = 3000) {
    for (let i = start; i < 65000; i++) {
        if (await checkAvailablePort(i)) {
            return i;
        }
    }
    throw new Error('Unable to find an available port');
}
const createLabel = async (bsky, opts) => {
    await bsky.db.db
        .insertInto('label')
        .values({
        uri: opts.uri,
        cid: opts.cid,
        val: opts.val,
        cts: new Date().toISOString(),
        neg: false,
        src: 'did:example:labeler',
    })
        .execute();
};
//# sourceMappingURL=test-pds.js.map