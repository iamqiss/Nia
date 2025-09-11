import {type AppBskyActorDefs, type ChatBskyActorDefs} from '@atproto/api' // Legacy - will be removed

/**
 * Matches any profile view exported by our SDK
 */
export type AnyProfileView =
  | AppBskyActorDefs.ProfileViewBasic
  | AppBskyActorDefs.ProfileView
  | AppBskyActorDefs.ProfileViewDetailed
  | ChatBskyActorDefs.ProfileViewBasic
