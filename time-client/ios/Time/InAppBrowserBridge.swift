import Foundation
import WebKit
import React

@objc(InAppBrowserBridge)
class InAppBrowserBridge: NSObject {
  
  private var webView: WKWebView?
  private var cookieStore: WKHTTPCookieStore?
  
  override init() {
    super.init()
    setupWebView()
  }
  
  private func setupWebView() {
    let configuration = WKWebViewConfiguration()
    configuration.websiteDataStore = WKWebsiteDataStore.default()
    configuration.allowsInlineMediaPlayback = true
    configuration.mediaTypesRequiringUserActionForPlayback = []
    
    // Enable JavaScript and DOM storage
    let preferences = WKPreferences()
    preferences.javaScriptEnabled = true
    configuration.preferences = preferences
    
    // Enable third-party cookies
    configuration.websiteDataStore = WKWebsiteDataStore.nonPersistent()
    
    self.webView = WKWebView(frame: .zero, configuration: configuration)
    self.cookieStore = configuration.websiteDataStore.httpCookieStore
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
  
  // MARK: - Cookie Management
  
  @objc
  func getCookies(_ url: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    guard let cookieStore = cookieStore else {
      rejecter("NO_COOKIE_STORE", "Cookie store not available", nil)
      return
    }
    
    cookieStore.getAllCookies { cookies in
      let urlCookies = cookies.filter { cookie in
        guard let cookieURL = URL(string: url) else { return false }
        return cookie.domain == cookieURL.host || cookieURL.host?.hasSuffix(cookie.domain) == true
      }
      
      let cookieString = urlCookies.map { cookie in
        "\(cookie.name)=\(cookie.value)"
      }.joined(separator: "; ")
      
      resolver(cookieString)
    }
  }
  
  @objc
  func setCookie(_ url: String, cookie: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    guard let cookieStore = cookieStore,
          let urlObj = URL(string: url) else {
      rejecter("INVALID_URL", "Invalid URL provided", nil)
      return
    }
    
    // Parse cookie string
    let cookieComponents = cookie.components(separatedBy: ";")
    guard let nameValue = cookieComponents.first?.components(separatedBy: "="),
          nameValue.count == 2 else {
      rejecter("INVALID_COOKIE", "Invalid cookie format", nil)
      return
    }
    
    let name = nameValue[0].trimmingCharacters(in: .whitespaces)
    let value = nameValue[1].trimmingCharacters(in: .whitespaces)
    
    var cookieProperties: [HTTPCookiePropertyKey: Any] = [
      .name: name,
      .value: value,
      .domain: urlObj.host ?? "",
      .path: "/"
    ]
    
    // Parse additional cookie attributes
    for component in cookieComponents.dropFirst() {
      let trimmed = component.trimmingCharacters(in: .whitespaces)
      if trimmed.lowercased().hasPrefix("expires=") {
        let expiresValue = String(trimmed.dropFirst(8))
        if let expiresDate = parseCookieDate(expiresValue) {
          cookieProperties[.expires] = expiresDate
        }
      } else if trimmed.lowercased().hasPrefix("max-age=") {
        let maxAgeValue = String(trimmed.dropFirst(8))
        if let maxAge = Int(maxAgeValue) {
          cookieProperties[.maximumAge] = maxAge
        }
      } else if trimmed.lowercased() == "secure" {
        cookieProperties[.secure] = true
      } else if trimmed.lowercased() == "httponly" {
        cookieProperties[.isHTTPOnly] = true
      } else if trimmed.lowercased().hasPrefix("samesite=") {
        let sameSiteValue = String(trimmed.dropFirst(9))
        if sameSiteValue.lowercased() == "strict" {
          cookieProperties[.sameSitePolicy] = "Strict"
        } else if sameSiteValue.lowercased() == "lax" {
          cookieProperties[.sameSitePolicy] = "Lax"
        } else if sameSiteValue.lowercased() == "none" {
          cookieProperties[.sameSitePolicy] = "None"
        }
      }
    }
    
    guard let httpCookie = HTTPCookie(properties: cookieProperties) else {
      rejecter("INVALID_COOKIE", "Failed to create HTTP cookie", nil)
      return
    }
    
    cookieStore.setCookie(httpCookie) {
      resolver(nil)
    }
  }
  
  @objc
  func clearCookies(_ url: String?, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    guard let cookieStore = cookieStore else {
      rejecter("NO_COOKIE_STORE", "Cookie store not available", nil)
      return
    }
    
    if let url = url, let urlObj = URL(string: url) {
      // Clear cookies for specific domain
      cookieStore.getAllCookies { cookies in
        let domainCookies = cookies.filter { cookie in
          cookie.domain == urlObj.host || urlObj.host?.hasSuffix(cookie.domain) == true
        }
        
        let group = DispatchGroup()
        for cookie in domainCookies {
          group.enter()
          cookieStore.delete(cookie) {
            group.leave()
          }
        }
        
        group.notify(queue: .main) {
          resolver(nil)
        }
      }
    } else {
      // Clear all cookies
      cookieStore.getAllCookies { cookies in
        let group = DispatchGroup()
        for cookie in cookies {
          group.enter()
          cookieStore.delete(cookie) {
            group.leave()
          }
        }
        
        group.notify(queue: .main) {
          resolver(nil)
        }
      }
    }
  }
  
  // MARK: - Navigation
  
  @objc
  func canGoBack(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      resolver(self.webView?.canGoBack ?? false)
    }
  }
  
  @objc
  func canGoForward(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      resolver(self.webView?.canGoForward ?? false)
    }
  }
  
  @objc
  func goBack(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      self.webView?.goBack()
      resolver(nil)
    }
  }
  
  @objc
  func goForward(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      self.webView?.goForward()
      resolver(nil)
    }
  }
  
  @objc
  func reload(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      self.webView?.reload()
      resolver(nil)
    }
  }
  
  // MARK: - Configuration
  
  @objc
  func setUserAgent(_ userAgent: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      self.webView?.customUserAgent = userAgent
      resolver(nil)
    }
  }
  
  @objc
  func getUserAgent(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      resolver(self.webView?.customUserAgent ?? "Time App InAppBrowser")
    }
  }
  
  @objc
  func setJavaScriptEnabled(_ enabled: Bool, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      self.webView?.configuration.preferences.javaScriptEnabled = enabled
      resolver(nil)
    }
  }
  
  @objc
  func setDomStorageEnabled(_ enabled: Bool, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      self.webView?.configuration.websiteDataStore = enabled ? WKWebsiteDataStore.default() : WKWebsiteDataStore.nonPersistent()
      resolver(nil)
    }
  }
  
  @objc
  func setThirdPartyCookiesEnabled(_ enabled: Bool, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      self.webView?.configuration.websiteDataStore = enabled ? WKWebsiteDataStore.default() : WKWebsiteDataStore.nonPersistent()
      resolver(nil)
    }
  }
  
  @objc
  func setAllowsInlineMediaPlayback(_ enabled: Bool, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      self.webView?.configuration.allowsInlineMediaPlayback = enabled
      resolver(nil)
    }
  }
  
  @objc
  func setMediaPlaybackRequiresUserAction(_ enabled: Bool, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      self.webView?.configuration.mediaTypesRequiringUserActionForPlayback = enabled ? [.video, .audio] : []
      resolver(nil)
    }
  }
  
  // MARK: - Helper Methods
  
  private func parseCookieDate(_ dateString: String) -> Date? {
    let formatter = DateFormatter()
    formatter.dateFormat = "EEE, dd MMM yyyy HH:mm:ss zzz"
    formatter.locale = Locale(identifier: "en_US_POSIX")
    formatter.timeZone = TimeZone(abbreviation: "GMT")
    
    return formatter.date(from: dateString)
  }
}