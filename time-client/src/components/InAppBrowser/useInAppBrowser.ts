import {useCallback, useState} from 'react'
import {useSheetWrapper} from '#/components/Dialog/sheet-wrapper'
import {useGlobalDialogsControlContext} from '#/components/dialogs/Context'
import {logger} from '#/logger'

interface InAppBrowserState {
  isOpen: boolean
  url: string | null
  error: string | null
}

export function useInAppBrowser() {
  const [state, setState] = useState<InAppBrowserState>({
    isOpen: false,
    url: null,
    error: null,
  })
  
  const sheetWrapper = useSheetWrapper()
  const {inAppBrowserConsentControl} = useGlobalDialogsControlContext()

  const openBrowser = useCallback(async (url: string) => {
    try {
      setState({
        isOpen: true,
        url,
        error: null,
      })

      // Import the component dynamically to avoid circular dependencies
      const {InAppBrowser} = await import('./InAppBrowser')
      
      await sheetWrapper(
        <InAppBrowser
          url={url}
          onClose={() => {
            setState(prev => ({
              ...prev,
              isOpen: false,
              url: null,
            }))
          }}
          onError={(error) => {
            logger.error('InAppBrowser error', {error, url})
            setState(prev => ({
              ...prev,
              error,
            }))
          }}
        />
      )
    } catch (error) {
      logger.error('Failed to open in-app browser', {error, url})
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to open browser',
      }))
    }
  }, [sheetWrapper])

  const closeBrowser = useCallback(() => {
    setState({
      isOpen: false,
      url: null,
      error: null,
    })
  }, [])

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
    }))
  }, [])

  return {
    ...state,
    openBrowser,
    closeBrowser,
    clearError,
  }
}