// Migrated to gRPC

import {DEMO_FEED} from '#/lib/demo'
import {type FeedAPI, type FeedAPIResponse} from './types'

export class DemoFeedAPI implements FeedAPI {
  agent: TimeGrpcClient

  constructor({agent}: {agent: TimeGrpcClient}) {
    this.agent = agent
  }

  async peekLatest(): Promise<AppBskyFeedDefs.FeedViewPost> {
    return DEMO_FEED.feed[0]
  }

  async fetch(): Promise<FeedAPIResponse> {
    return DEMO_FEED
  }
}
