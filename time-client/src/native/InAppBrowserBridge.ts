import {NativeModules, Platform} from 'react-native'

interface InAppBrowserBridgeInterface {
  // Cookie management
  getCookies(url: string): Promise<string>
  setCookie(url: string, cookie: string): Promise<void>
  clearCookies(url?: string): Promise<void>
  
  // Browser state management
  canGoBack(): Promise<boolean>
  canGoForward(): Promise<boolean>
  goBack(): Promise<void>
  goForward(): Promise<void>
  reload(): Promise<void>
  
  // Browser configuration
  setUserAgent(userAgent: string): Promise<void>
  getUserAgent(): Promise<string>
  
  // Security and privacy
  setJavaScriptEnabled(enabled: boolean): Promise<void>
  setDomStorageEnabled(enabled: boolean): Promise<void>
  setThirdPartyCookiesEnabled(enabled: boolean): Promise<void>
  
  // Media handling
  setAllowsInlineMediaPlayback(enabled: boolean): Promise<void>
  setMediaPlaybackRequiresUserAction(enabled: boolean): Promise<void>
}

const {InAppBrowserBridge} = NativeModules

export const InAppBrowserBridge: InAppBrowserBridgeInterface = InAppBrowserBridge || {
  // Fallback implementations for development
  getCookies: async (url: string) => {
    if (__DEV__) {
      console.log('InAppBrowserBridge.getCookies called with URL:', url)
      return ''
    }
    throw new Error('InAppBrowserBridge not available')
  },
  
  setCookie: async (url: string, cookie: string) => {
    if (__DEV__) {
      console.log('InAppBrowserBridge.setCookie called with URL:', url, 'Cookie:', cookie)
      return
    }
    throw new Error('InAppBrowserBridge not available')
  },
  
  clearCookies: async (url?: string) => {
    if (__DEV__) {
      console.log('InAppBrowserBridge.clearCookies called with URL:', url)
      return
    }
    throw new Error('InAppBrowserBridge not available')
  },
  
  canGoBack: async () => {
    if (__DEV__) {
      console.log('InAppBrowserBridge.canGoBack called')
      return false
    }
    throw new Error('InAppBrowserBridge not available')
  },
  
  canGoForward: async () => {
    if (__DEV__) {
      console.log('InAppBrowserBridge.canGoForward called')
      return false
    }
    throw new Error('InAppBrowserBridge not available')
  },
  
  goBack: async () => {
    if (__DEV__) {
      console.log('InAppBrowserBridge.goBack called')
      return
    }
    throw new Error('InAppBrowserBridge not available')
  },
  
  goForward: async () => {
    if (__DEV__) {
      console.log('InAppBrowserBridge.goForward called')
      return
    }
    throw new Error('InAppBrowserBridge not available')
  },
  
  reload: async () => {
    if (__DEV__) {
      console.log('InAppBrowserBridge.reload called')
      return
    }
    throw new Error('InAppBrowserBridge not available')
  },
  
  setUserAgent: async (userAgent: string) => {
    if (__DEV__) {
      console.log('InAppBrowserBridge.setUserAgent called with:', userAgent)
      return
    }
    throw new Error('InAppBrowserBridge not available')
  },
  
  getUserAgent: async () => {
    if (__DEV__) {
      console.log('InAppBrowserBridge.getUserAgent called')
      return 'Time App InAppBrowser'
    }
    throw new Error('InAppBrowserBridge not available')
  },
  
  setJavaScriptEnabled: async (enabled: boolean) => {
    if (__DEV__) {
      console.log('InAppBrowserBridge.setJavaScriptEnabled called with:', enabled)
      return
    }
    throw new Error('InAppBrowserBridge not available')
  },
  
  setDomStorageEnabled: async (enabled: boolean) => {
    if (__DEV__) {
      console.log('InAppBrowserBridge.setDomStorageEnabled called with:', enabled)
      return
    }
    throw new Error('InAppBrowserBridge not available')
  },
  
  setThirdPartyCookiesEnabled: async (enabled: boolean) => {
    if (__DEV__) {
      console.log('InAppBrowserBridge.setThirdPartyCookiesEnabled called with:', enabled)
      return
    }
    throw new Error('InAppBrowserBridge not available')
  },
  
  setAllowsInlineMediaPlayback: async (enabled: boolean) => {
    if (__DEV__) {
      console.log('InAppBrowserBridge.setAllowsInlineMediaPlayback called with:', enabled)
      return
    }
    throw new Error('InAppBrowserBridge not available')
  },
  
  setMediaPlaybackRequiresUserAction: async (enabled: boolean) => {
    if (__DEV__) {
      console.log('InAppBrowserBridge.setMediaPlaybackRequiresUserAction called with:', enabled)
      return
    }
    throw new Error('InAppBrowserBridge not available')
  },
}

export default InAppBrowserBridge