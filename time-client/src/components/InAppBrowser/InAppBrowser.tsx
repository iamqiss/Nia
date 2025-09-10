import React, {useCallback, useRef, useState, useEffect} from 'react'
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native'
import {WebView} from 'react-native-webview'
import {useTheme} from '#/alf'
import {useSheetWrapper} from '#/components/Dialog/sheet-wrapper'
import {useGlobalDialogsControlContext} from '#/components/dialogs/Context'
import {logger} from '#/logger'
import {cookieManager} from '#/lib/cookies'

interface InAppBrowserProps {
  url: string
  onClose: () => void
  onError?: (error: string) => void
}

interface WebViewMessage {
  type: 'error' | 'loading' | 'loaded' | 'navigation' | 'cookie'
  data?: any
}

export function InAppBrowser({url, onClose, onError}: InAppBrowserProps) {
  const t = useTheme()
  const webViewRef = useRef<WebView>(null)
  const [loading, setLoading] = useState(true)
  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)
  const [currentUrl, setCurrentUrl] = useState(url)
  const [title, setTitle] = useState('')

  // Load cookies when component mounts
  useEffect(() => {
    const loadCookies = async () => {
      try {
        const cookies = await cookieManager.getCookies(url)
        logger.debug('Loaded cookies for URL', {url, cookieCount: cookies.length})
      } catch (error) {
        logger.error('Failed to load cookies', {error, url})
      }
    }
    
    loadCookies()
  }, [url])

  const handleMessage = useCallback((event: any) => {
    try {
      const message: WebViewMessage = JSON.parse(event.nativeEvent.data)
      
      switch (message.type) {
        case 'loading':
          setLoading(true)
          break
        case 'loaded':
          setLoading(false)
          break
        case 'navigation':
          setCanGoBack(message.data?.canGoBack || false)
          setCanGoForward(message.data?.canGoForward || false)
          setCurrentUrl(message.data?.url || currentUrl)
          setTitle(message.data?.title || '')
          break
        case 'error':
          setLoading(false)
          const errorMsg = message.data?.message || 'An error occurred'
          logger.error('InAppBrowser error', {error: errorMsg, url: currentUrl})
          onError?.(errorMsg)
          break
        case 'cookie':
          // Handle cookie data if needed
          break
      }
    } catch (error) {
      logger.error('Failed to parse WebView message', {error})
    }
  }, [currentUrl, onError])

  const handleGoBack = useCallback(() => {
    webViewRef.current?.goBack()
  }, [])

  const handleGoForward = useCallback(() => {
    webViewRef.current?.goForward()
  }, [])

  const handleRefresh = useCallback(() => {
    webViewRef.current?.reload()
  }, [])

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  const injectedJavaScript = `
    (function() {
      // Enhanced cookie management
      function getCookies() {
        return document.cookie;
      }
      
      function setCookie(name, value, options = {}) {
        let cookieString = name + '=' + value;
        
        if (options.expires) {
          cookieString += '; expires=' + options.expires.toUTCString();
        } else if (options.maxAge) {
          cookieString += '; max-age=' + options.maxAge;
        }
        
        if (options.path) {
          cookieString += '; path=' + options.path;
        }
        
        if (options.domain) {
          cookieString += '; domain=' + options.domain;
        }
        
        if (options.secure) {
          cookieString += '; secure';
        }
        
        if (options.httpOnly) {
          cookieString += '; httponly';
        }
        
        if (options.sameSite) {
          cookieString += '; samesite=' + options.sameSite;
        }
        
        document.cookie = cookieString;
      }
      
      function deleteCookie(name, path = '/', domain = '') {
        setCookie(name, '', {
          expires: new Date(0),
          path: path,
          domain: domain
        });
      }
      
      // Navigation state management
      function updateNavigationState() {
        const canGoBack = window.history.length > 1;
        const canGoForward = false; // WebView doesn't support forward history
        const url = window.location.href;
        const title = document.title;
        
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'navigation',
          data: { canGoBack, canGoForward, url, title }
        }));
      }
      
      // Enhanced error handling
      window.addEventListener('error', function(e) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'error',
          data: { 
            message: e.message, 
            filename: e.filename, 
            lineno: e.lineno,
            colno: e.colno,
            stack: e.error?.stack
          }
        }));
      });
      
      // Unhandled promise rejection handling
      window.addEventListener('unhandledrejection', function(e) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'error',
          data: { 
            message: 'Unhandled Promise Rejection: ' + e.reason,
            type: 'promise'
          }
        }));
      });
      
      // Page load events
      window.addEventListener('load', function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'loaded'
        }));
        updateNavigationState();
      });
      
      // Navigation events
      window.addEventListener('popstate', updateNavigationState);
      
      // Hash change events
      window.addEventListener('hashchange', updateNavigationState);
      
      // Initial state
      updateNavigationState();
      
      // Make functions available globally for debugging
      window.getCookies = getCookies;
      window.setCookie = setCookie;
      window.deleteCookie = deleteCookie;
      
      // Enhanced console logging for debugging
      const originalLog = console.log;
      console.log = function(...args) {
        originalLog.apply(console, args);
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'console',
          data: { level: 'log', args: args }
        }));
      };
    })();
    true;
  `

  const webViewProps = {
    ref: webViewRef,
    source: {uri: url},
    style: styles.webView,
    onMessage: handleMessage,
    injectedJavaScript: injectedJavaScript,
    javaScriptEnabled: true,
    domStorageEnabled: true,
    thirdPartyCookiesEnabled: true,
    sharedCookiesEnabled: true,
    allowsInlineMediaPlayback: true,
    mediaPlaybackRequiresUserAction: false,
    startInLoadingState: true,
    renderLoading: () => (
      <View style={[styles.loadingContainer, {backgroundColor: t.atoms.bg.backgroundColor}]}>
        <ActivityIndicator size="large" color={t.palette.primary_500} />
        <Text style={[styles.loadingText, {color: t.palette.neutral_500}]}>
          Loading...
        </Text>
      </View>
    ),
    onError: (syntheticEvent: any) => {
      const {nativeEvent} = syntheticEvent
      logger.error('WebView error', {error: nativeEvent})
      onError?.(nativeEvent.description || 'Failed to load page')
    },
    onHttpError: (syntheticEvent: any) => {
      const {nativeEvent} = syntheticEvent
      logger.error('WebView HTTP error', {error: nativeEvent})
      onError?.(`HTTP Error: ${nativeEvent.statusCode}`)
    },
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: t.atoms.bg.backgroundColor}]}>
      {/* Header */}
      <View style={[styles.header, {backgroundColor: t.atoms.bg.backgroundColor, borderBottomColor: t.palette.neutral_200}]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={[styles.headerButton, !canGoBack && styles.headerButtonDisabled]}
            onPress={handleGoBack}
            disabled={!canGoBack}
          >
            <Text style={[styles.headerButtonText, {color: canGoBack ? t.palette.primary_500 : t.palette.neutral_400}]}>
              ←
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.headerButton, !canGoForward && styles.headerButtonDisabled]}
            onPress={handleGoForward}
            disabled={!canGoForward}
          >
            <Text style={[styles.headerButtonText, {color: canGoForward ? t.palette.primary_500 : t.palette.neutral_400}]}>
              →
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleRefresh}
          >
            <Text style={[styles.headerButtonText, {color: t.palette.primary_500}]}>
              ↻
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.headerCenter}>
          <Text style={[styles.urlText, {color: t.palette.neutral_700}]} numberOfLines={1}>
            {currentUrl}
          </Text>
          {title ? (
            <Text style={[styles.titleText, {color: t.palette.neutral_500}]} numberOfLines={1}>
              {title}
            </Text>
          ) : null}
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleClose}
          >
            <Text style={[styles.headerButtonText, {color: t.palette.primary_500}]}>
              ✕
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* WebView */}
      <View style={styles.webViewContainer}>
        <WebView {...webViewProps} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    minHeight: 60,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0,
  },
  headerCenter: {
    flex: 1,
    marginHorizontal: 12,
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0,
  },
  headerButton: {
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 6,
  },
  headerButtonDisabled: {
    opacity: 0.5,
  },
  headerButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  urlText: {
    fontSize: 14,
    fontWeight: '500',
  },
  titleText: {
    fontSize: 12,
    marginTop: 2,
  },
  webViewContainer: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
})