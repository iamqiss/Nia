package com.time

import android.webkit.*
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.net.URL
import java.text.SimpleDateFormat
import java.util.*

class InAppBrowserBridgeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    
    private var webView: WebView? = null
    private var cookieManager: CookieManager? = null
    
    init {
        setupWebView()
    }
    
    private fun setupWebView() {
        cookieManager = CookieManager.getInstance()
        cookieManager?.setAcceptCookie(true)
        cookieManager?.setAcceptThirdPartyCookies(null, true)
        
        webView = WebView(reactApplicationContext).apply {
            settings.apply {
                javaScriptEnabled = true
                domStorageEnabled = true
                allowFileAccess = true
                allowContentAccess = true
                allowFileAccessFromFileURLs = true
                allowUniversalAccessFromFileURLs = true
                mediaPlaybackRequiresUserGesture = false
                mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
            }
        }
    }
    
    override fun getName(): String {
        return "InAppBrowserBridge"
    }
    
    // MARK: - Cookie Management
    
    @ReactMethod
    fun getCookies(url: String, promise: Promise) {
        try {
            val urlObj = URL(url)
            val cookies = cookieManager?.getCookie(url)
            promise.resolve(cookies ?: "")
        } catch (e: Exception) {
            promise.reject("INVALID_URL", "Invalid URL provided", e)
        }
    }
    
    @ReactMethod
    fun setCookie(url: String, cookie: String, promise: Promise) {
        try {
            val urlObj = URL(url)
            val domain = urlObj.host
            
            // Parse cookie string and set it
            val cookieString = if (cookie.contains("Domain=")) {
                cookie
            } else {
                "$cookie; Domain=$domain"
            }
            
            cookieManager?.setCookie(url, cookieString)
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("INVALID_COOKIE", "Failed to set cookie", e)
        }
    }
    
    @ReactMethod
    fun clearCookies(url: String?, promise: Promise) {
        try {
            if (url != null) {
                val urlObj = URL(url)
                val domain = urlObj.host
                cookieManager?.removeSessionCookies(null)
                cookieManager?.removeAllCookies(null)
            } else {
                cookieManager?.removeAllCookies(null)
            }
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("CLEAR_COOKIES_ERROR", "Failed to clear cookies", e)
        }
    }
    
    // MARK: - Navigation
    
    @ReactMethod
    fun canGoBack(promise: Promise) {
        promise.resolve(webView?.canGoBack() ?: false)
    }
    
    @ReactMethod
    fun canGoForward(promise: Promise) {
        promise.resolve(webView?.canGoForward() ?: false)
    }
    
    @ReactMethod
    fun goBack(promise: Promise) {
        webView?.goBack()
        promise.resolve(null)
    }
    
    @ReactMethod
    fun goForward(promise: Promise) {
        webView?.goForward()
        promise.resolve(null)
    }
    
    @ReactMethod
    fun reload(promise: Promise) {
        webView?.reload()
        promise.resolve(null)
    }
    
    // MARK: - Configuration
    
    @ReactMethod
    fun setUserAgent(userAgent: String, promise: Promise) {
        webView?.settings?.userAgentString = userAgent
        promise.resolve(null)
    }
    
    @ReactMethod
    fun getUserAgent(promise: Promise) {
        promise.resolve(webView?.settings?.userAgentString ?: "Time App InAppBrowser")
    }
    
    @ReactMethod
    fun setJavaScriptEnabled(enabled: Boolean, promise: Promise) {
        webView?.settings?.javaScriptEnabled = enabled
        promise.resolve(null)
    }
    
    @ReactMethod
    fun setDomStorageEnabled(enabled: Boolean, promise: Promise) {
        webView?.settings?.domStorageEnabled = enabled
        promise.resolve(null)
    }
    
    @ReactMethod
    fun setThirdPartyCookiesEnabled(enabled: Boolean, promise: Promise) {
        cookieManager?.setAcceptThirdPartyCookies(webView, enabled)
        promise.resolve(null)
    }
    
    @ReactMethod
    fun setAllowsInlineMediaPlayback(enabled: Boolean, promise: Promise) {
        webView?.settings?.mediaPlaybackRequiresUserGesture = !enabled
        promise.resolve(null)
    }
    
    @ReactMethod
    fun setMediaPlaybackRequiresUserAction(enabled: Boolean, promise: Promise) {
        webView?.settings?.mediaPlaybackRequiresUserGesture = enabled
        promise.resolve(null)
    }
    
    // MARK: - Helper Methods
    
    private fun parseCookieDate(dateString: String): Date? {
        val formats = listOf(
            "EEE, dd MMM yyyy HH:mm:ss zzz",
            "EEE, dd-MMM-yyyy HH:mm:ss zzz",
            "EEE MMM dd HH:mm:ss zzz yyyy"
        )
        
        for (format in formats) {
            try {
                val formatter = SimpleDateFormat(format, Locale.US)
                formatter.timeZone = TimeZone.getTimeZone("GMT")
                return formatter.parse(dateString)
            } catch (e: Exception) {
                // Try next format
            }
        }
        return null
    }
}