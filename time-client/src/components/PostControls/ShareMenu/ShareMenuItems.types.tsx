import {type PressableProps, type StyleProp, type ViewStyle} from 'react-native'
// Migrated to gRPC

import {type Shadow} from '#/state/cache/post-shadow'

export interface ShareMenuItemsProps {
  testID: string
  post: Shadow<AppBskyFeedDefs.PostView>
  record: AppBskyFeedPost.Record
  richText: GrpcRichTextAPI
  style?: StyleProp<ViewStyle>
  hitSlop?: PressableProps['hitSlop']
  size?: 'lg' | 'md' | 'sm'
  timestamp: string
  threadgateRecord?: AppBskyFeedThreadgate.Record
  onShare: () => void
}
