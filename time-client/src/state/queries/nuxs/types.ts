import {type AppBskyActorDefs} from '@atproto/api' // Legacy - will be removed

export type Data = Record<string, unknown> | undefined

export type BaseNux<
  T extends Pick<AppBskyActorDefs.Nux, 'id' | 'expiresAt'> & {data: Data},
> = Pick<AppBskyActorDefs.Nux, 'id' | 'completed' | 'expiresAt'> & T
