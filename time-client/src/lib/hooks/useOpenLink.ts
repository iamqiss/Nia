import {useCallback} from 'react'
import {Linking} from 'react-native'

import {logEvent} from '#/lib/statsig/statsig'
import {
  createBskyAppAbsoluteUrl,
  createProxiedUrl,
  isBskyAppUrl,
  isBskyRSSUrl,
  isRelativeUrl,
  toNiceDomain,
} from '#/lib/strings/url-helpers'
import {logger} from '#/logger'
import {isNative} from '#/platform/detection'
import {useInAppBrowser} from '#/state/preferences/in-app-browser'
import {useTheme} from '#/alf'
import {useDialogContext} from '#/components/Dialog'
import {useSheetWrapper} from '#/components/Dialog/sheet-wrapper'
import {useGlobalDialogsControlContext} from '#/components/dialogs/Context'
import {useInAppBrowser as useCustomInAppBrowser} from '#/components/InAppBrowser'

export function useOpenLink() {
  const enabled = useInAppBrowser()
  const customInAppBrowser = useCustomInAppBrowser()
  const t = useTheme()
  const sheetWrapper = useSheetWrapper()
  const dialogContext = useDialogContext()
  const {inAppBrowserConsentControl} = useGlobalDialogsControlContext()

  const openLink = useCallback(
    async (url: string, override?: boolean, shouldProxy?: boolean) => {
      if (isBskyRSSUrl(url) && isRelativeUrl(url)) {
        url = createBskyAppAbsoluteUrl(url)
      }

      if (!isBskyAppUrl(url)) {
        logEvent('link:clicked', {
          domain: toNiceDomain(url),
          url,
        })

        if (shouldProxy) {
          url = createProxiedUrl(url)
        }
      }

      if (isNative && !url.startsWith('mailto:')) {
        if (override === undefined && enabled === undefined) {
          // consent dialog is a global dialog, and while it's possible to nest dialogs,
          // the actual components need to be nested. sibling dialogs on iOS are not supported.
          // thus, check if we're in a dialog, and if so, close the existing dialog before opening the
          // consent dialog -sfn
          if (dialogContext.isWithinDialog) {
            dialogContext.close(() => {
              inAppBrowserConsentControl.open(url)
            })
          } else {
            inAppBrowserConsentControl.open(url)
          }
          return
        } else if (override ?? enabled) {
          try {
            await customInAppBrowser.openBrowser(url)
          } catch (err) {
            if (__DEV__)
              logger.error('Could not open custom in-app browser', {message: err})
            Linking.openURL(url)
          }
          return
        }
      }
      Linking.openURL(url)
    },
    [enabled, customInAppBrowser, inAppBrowserConsentControl, t, sheetWrapper, dialogContext],
  )

  return openLink
}
