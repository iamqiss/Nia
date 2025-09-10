import {} from '@atproto/api';
import shuffle from 'lodash.shuffle';
import { bundleAsync } from '#/lib/async/bundle';
import { timeout } from '#/lib/async/timeout';
import { feedUriToHref } from '#/lib/strings/url-helpers';
import { getContentLanguages } from '#/state/preferences/languages';
import {} from '#/state/queries/post-feed';
import { FeedTuner } from '../feed-manip';
import {} from '../feed-manip';
import {} from './types';
import { createBskyTopicsHeader, isBlueskyOwnedFeed } from './utils';
const REQUEST_WAIT_MS = 500; // 500ms
const POST_AGE_CUTOFF = 60e3 * 60 * 24; // 24hours
export class MergeFeedAPI {
    userInterests;
    agent;
    params;
    feedTuners;
    following;
    customFeeds = [];
    feedCursor = 0;
    itemCursor = 0;
    sampleCursor = 0;
    constructor({ agent, feedParams, feedTuners, userInterests, }) {
        this.agent = agent;
        this.params = feedParams;
        this.feedTuners = feedTuners;
        this.userInterests = userInterests;
        this.following = new MergeFeedSource_Following({
            agent: this.agent,
            feedTuners: this.feedTuners,
        });
    }
    reset() {
        this.following = new MergeFeedSource_Following({
            agent: this.agent,
            feedTuners: this.feedTuners,
        });
        this.customFeeds = [];
        this.feedCursor = 0;
        this.itemCursor = 0;
        this.sampleCursor = 0;
        if (this.params.mergeFeedSources) {
            this.customFeeds = shuffle(this.params.mergeFeedSources.map(feedUri => new MergeFeedSource_Custom({
                agent: this.agent,
                feedUri,
                feedTuners: this.feedTuners,
                userInterests: this.userInterests,
            })));
        }
        else {
            this.customFeeds = [];
        }
    }
    async peekLatest() {
        const res = await this.agent.getTimeline({
            limit: 1,
        });
        return res.data.feed[0];
    }
    async fetch({ cursor, limit, }) {
        if (!cursor) {
            this.reset();
        }
        const promises = [];
        // always keep following topped up
        if (this.following.numReady < limit) {
            await this.following.fetchNext(60);
        }
        // pick the next feeds to sample from
        const feeds = this.customFeeds.slice(this.feedCursor, this.feedCursor + 3);
        this.feedCursor += 3;
        if (this.feedCursor > this.customFeeds.length) {
            this.feedCursor = 0;
        }
        // top up the feeds
        const outOfFollows = !this.following.hasMore && this.following.numReady < limit;
        if (this.params.mergeFeedEnabled || outOfFollows) {
            for (const feed of feeds) {
                if (feed.numReady < 5) {
                    promises.push(feed.fetchNext(10));
                }
            }
        }
        // wait for requests (all capped at a fixed timeout)
        await Promise.all(promises);
        // assemble a response by sampling from feeds with content
        const posts = [];
        while (posts.length < limit) {
            let slice = this.sampleItem();
            if (slice[0]) {
                posts.push(slice[0]);
            }
            else {
                break;
            }
        }
        return {
            cursor: String(this.itemCursor),
            feed: posts,
        };
    }
    sampleItem() {
        const i = this.itemCursor++;
        const candidateFeeds = this.customFeeds.filter(f => f.numReady > 0);
        const canSample = candidateFeeds.length > 0;
        const hasFollows = this.following.hasMore;
        const hasFollowsReady = this.following.numReady > 0;
        // this condition establishes the frequency that custom feeds are woven into follows
        const shouldSample = this.params.mergeFeedEnabled &&
            i >= 15 &&
            candidateFeeds.length >= 2 &&
            (i % 4 === 0 || i % 5 === 0);
        if (!canSample && !hasFollows) {
            // no data available
            return [];
        }
        if (shouldSample || !hasFollows) {
            // time to sample, or the user isnt following anybody
            return candidateFeeds[this.sampleCursor++ % candidateFeeds.length].take(1);
        }
        if (!hasFollowsReady) {
            // stop here so more follows can be fetched
            return [];
        }
        // provide follow
        return this.following.take(1);
    }
}
class MergeFeedSource {
    agent;
    feedTuners;
    sourceInfo;
    cursor = undefined;
    queue = [];
    hasMore = true;
    constructor({ agent, feedTuners, }) {
        this.agent = agent;
        this.feedTuners = feedTuners;
    }
    get numReady() {
        return this.queue.length;
    }
    get needsFetch() {
        return this.hasMore && this.queue.length === 0;
    }
    take(n) {
        return this.queue.splice(0, n);
    }
    async fetchNext(n) {
        await Promise.race([this._fetchNextInner(n), timeout(REQUEST_WAIT_MS)]);
    }
    _fetchNextInner = bundleAsync(async (n) => {
        const res = await this._getFeed(this.cursor, n);
        if (res.success) {
            this.cursor = res.data.cursor;
            if (res.data.feed.length) {
                this.queue = this.queue.concat(res.data.feed);
            }
            else {
                this.hasMore = false;
            }
        }
        else {
            this.hasMore = false;
        }
    });
    _getFeed(_cursor, _limit) {
        throw new Error('Must be overridden');
    }
}
class MergeFeedSource_Following extends MergeFeedSource {
    tuner = new FeedTuner(this.feedTuners);
    async fetchNext(n) {
        return this._fetchNextInner(n);
    }
    async _getFeed(cursor, limit) {
        const res = await this.agent.getTimeline({ cursor, limit });
        // run the tuner pre-emptively to ensure better mixing
        const slices = this.tuner.tune(res.data.feed, {
            dryRun: false,
        });
        res.data.feed = slices.map(slice => slice._feedPost);
        return res;
    }
}
class MergeFeedSource_Custom extends MergeFeedSource {
    agent;
    minDate;
    feedUri;
    userInterests;
    constructor({ agent, feedUri, feedTuners, userInterests, }) {
        super({
            agent,
            feedTuners,
        });
        this.agent = agent;
        this.feedUri = feedUri;
        this.userInterests = userInterests;
        this.sourceInfo = {
            $type: 'reasonFeedSource',
            uri: feedUri,
            href: feedUriToHref(feedUri),
        };
        this.minDate = new Date(Date.now() - POST_AGE_CUTOFF);
    }
    async _getFeed(cursor, limit) {
        try {
            const contentLangs = getContentLanguages().join(',');
            const isBlueskyOwned = isBlueskyOwnedFeed(this.feedUri);
            const res = await this.agent.app.bsky.feed.getFeed({
                cursor,
                limit,
                feed: this.feedUri,
            }, {
                headers: {
                    ...(isBlueskyOwned
                        ? createBskyTopicsHeader(this.userInterests)
                        : {}),
                    'Accept-Language': contentLangs,
                },
            });
            // NOTE
            // some custom feeds fail to enforce the pagination limit
            // so we manually truncate here
            // -prf
            if (limit && res.data.feed.length > limit) {
                res.data.feed = res.data.feed.slice(0, limit);
            }
            // filter out older posts
            res.data.feed = res.data.feed.filter(post => new Date(post.post.indexedAt) > this.minDate);
            // attach source info
            for (const post of res.data.feed) {
                // @ts-ignore
                post.__source = this.sourceInfo;
            }
            return res;
        }
        catch {
            // dont bubble custom-feed errors
            return { success: false, headers: {}, data: { feed: [] } };
        }
    }
}
//# sourceMappingURL=merge.js.map