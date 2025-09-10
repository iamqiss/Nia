import { Platform } from 'react-native'
import {
  type ImagePickerOptions,
  launchImageLibraryAsync,
  UIImagePickerPreferredAssetRepresentationMode,
} from 'expo-image-picker'
import {t} from '@lingui/macro'

import {isIOS, isWeb} from '#/platform/detection'
import {type ImageMeta} from '#/state/gallery'
import * as Toast from '#/view/com/util/Toast'
import {VIDEO_MAX_DURATION_MS} from '../constants'
import {getDataUriSize} from './util'

// Use native implementation on mobile platforms, fallback to Expo on web
const isNative = Platform.OS !== 'web'

let nativePicker: any = null
if (isNative) {
  try {
    nativePicker = require('./picker.native')
  } catch (error) {
    console.warn('Native camera module not available, falling back to Expo image picker')
  }
}

export type PickerImage = ImageMeta & {
  size: number
}

export async function openPicker(opts?: ImagePickerOptions) {
  // Use native implementation if available
  if (isNative && nativePicker) {
    try {
      const assets = await nativePicker.openPicker(opts)
      return assets.map((asset: any) => ({
        mime: asset.mimeType || 'image/jpeg',
        height: asset.height,
        width: asset.width,
        path: asset.uri,
        size: asset.size,
      }))
    } catch (error) {
      console.warn('Native picker failed, falling back to Expo:', error)
    }
  }

  // Fallback to Expo implementation
  const response = await launchImageLibraryAsync({
    exif: false,
    mediaTypes: ['images'],
    quality: 1,
    selectionLimit: 1,
    ...opts,
    legacy: true,
    preferredAssetRepresentationMode:
      UIImagePickerPreferredAssetRepresentationMode.Automatic,
  })

  return (response.assets ?? [])
    .filter(asset => {
      if (asset.mimeType?.startsWith('image/')) return true
      Toast.show(t`Only image files are supported`, 'exclamation-circle')
      return false
    })
    .map(image => ({
      mime: image.mimeType || 'image/jpeg',
      height: image.height,
      width: image.width,
      path: image.uri,
      size: getDataUriSize(image.uri),
    }))
}

export async function openUnifiedPicker({
  selectionCountRemaining,
}: {
  selectionCountRemaining: number
}) {
  // Use native implementation if available
  if (isNative && nativePicker) {
    try {
      const result = await nativePicker.openUnifiedPicker({ selectionCountRemaining })
      return result
    } catch (error) {
      console.warn('Native picker failed, falling back to Expo:', error)
    }
  }

  // Fallback to Expo implementation
  return await launchImageLibraryAsync({
    exif: false,
    mediaTypes: ['images', 'videos'],
    quality: 1,
    allowsMultipleSelection: true,
    legacy: true,
    base64: isWeb,
    selectionLimit: isIOS ? selectionCountRemaining : undefined,
    preferredAssetRepresentationMode:
      UIImagePickerPreferredAssetRepresentationMode.Automatic,
    videoMaxDuration: VIDEO_MAX_DURATION_MS / 1000,
  })
}
