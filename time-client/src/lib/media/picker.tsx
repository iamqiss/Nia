import { Platform } from 'react-native'
import ExpoImageCropTool, {type OpenCropperOptions} from 'expo-image-crop-tool'

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

// Fallback to Expo implementation
import {type ImagePickerOptions, launchCameraAsync} from 'expo-image-picker'

export {
  openPicker,
  openUnifiedPicker,
  type PickerImage as RNImage,
} from './picker.shared'

export async function openCamera(customOpts: ImagePickerOptions) {
  // Use native implementation if available
  if (isNative && nativePicker) {
    try {
      const asset = await nativePicker.openCamera(customOpts)
      return {
        path: asset.uri,
        mime: asset.mimeType ?? 'image/jpeg',
        size: asset.size ?? 0,
        width: asset.width,
        height: asset.height,
      }
    } catch (error) {
      console.warn('Native camera failed, falling back to Expo:', error)
    }
  }

  // Fallback to Expo implementation
  const opts: ImagePickerOptions = {
    mediaTypes: 'images',
    ...customOpts,
  }
  const res = await launchCameraAsync(opts)

  if (!res || !res.assets) {
    throw new Error('Camera was closed before taking a photo')
  }

  const asset = res?.assets[0]

  return {
    path: asset.uri,
    mime: asset.mimeType ?? 'image/jpeg',
    size: asset.fileSize ?? 0,
    width: asset.width,
    height: asset.height,
  }
}

export async function openCropper(opts: OpenCropperOptions) {
  const item = await ExpoImageCropTool.openCropperAsync({
    ...opts,
    format: 'jpeg',
  })

  return {
    path: item.path,
    mime: item.mime,
    size: item.size,
    width: item.width,
    height: item.height,
  }
}
