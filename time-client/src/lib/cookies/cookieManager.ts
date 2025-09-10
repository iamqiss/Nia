import InAppBrowserBridge from '#/native/InAppBrowserBridge'
import {logger} from '#/logger'

export interface CookieData {
  name: string
  value: string
  domain: string
  path: string
  expires?: Date
  secure?: boolean
  httpOnly?: boolean
  sameSite?: 'Strict' | 'Lax' | 'None'
}

export class CookieManager {
  private static instance: CookieManager
  private cookies: Map<string, CookieData[]> = new Map()

  static getInstance(): CookieManager {
    if (!CookieManager.instance) {
      CookieManager.instance = new CookieManager()
    }
    return CookieManager.instance
  }

  /**
   * Get cookies for a specific URL
   */
  async getCookies(url: string): Promise<CookieData[]> {
    try {
      const cookieString = await InAppBrowserBridge.getCookies(url)
      return this.parseCookieString(cookieString, url)
    } catch (error) {
      logger.error('Failed to get cookies', {error, url})
      return []
    }
  }

  /**
   * Set a cookie for a specific URL
   */
  async setCookie(url: string, cookie: CookieData): Promise<void> {
    try {
      const cookieString = this.buildCookieString(cookie)
      await InAppBrowserBridge.setCookie(url, cookieString)
      
      // Update local cache
      const domain = this.extractDomain(url)
      if (!this.cookies.has(domain)) {
        this.cookies.set(domain, [])
      }
      
      const existingCookies = this.cookies.get(domain) || []
      const existingIndex = existingCookies.findIndex(c => c.name === cookie.name)
      
      if (existingIndex >= 0) {
        existingCookies[existingIndex] = cookie
      } else {
        existingCookies.push(cookie)
      }
      
      this.cookies.set(domain, existingCookies)
    } catch (error) {
      logger.error('Failed to set cookie', {error, url, cookie})
      throw error
    }
  }

  /**
   * Clear cookies for a specific URL or all cookies
   */
  async clearCookies(url?: string): Promise<void> {
    try {
      await InAppBrowserBridge.clearCookies(url)
      
      if (url) {
        const domain = this.extractDomain(url)
        this.cookies.delete(domain)
      } else {
        this.cookies.clear()
      }
    } catch (error) {
      logger.error('Failed to clear cookies', {error, url})
      throw error
    }
  }

  /**
   * Get cookies for a domain from local cache
   */
  getCachedCookies(domain: string): CookieData[] {
    return this.cookies.get(domain) || []
  }

  /**
   * Check if a specific cookie exists
   */
  hasCookie(domain: string, name: string): boolean {
    const cookies = this.cookies.get(domain) || []
    return cookies.some(cookie => cookie.name === name)
  }

  /**
   * Get a specific cookie value
   */
  getCookie(domain: string, name: string): string | null {
    const cookies = this.cookies.get(domain) || []
    const cookie = cookies.find(c => c.name === name)
    return cookie?.value || null
  }

  /**
   * Parse cookie string into CookieData objects
   */
  private parseCookieString(cookieString: string, url: string): CookieData[] {
    if (!cookieString) return []
    
    const domain = this.extractDomain(url)
    const cookies: CookieData[] = []
    
    cookieString.split(';').forEach(cookiePart => {
      const trimmed = cookiePart.trim()
      if (!trimmed) return
      
      const [nameValue, ...attributes] = trimmed.split(';')
      const [name, value] = nameValue.split('=')
      
      if (!name || !value) return
      
      const cookie: CookieData = {
        name: name.trim(),
        value: value.trim(),
        domain,
        path: '/',
      }
      
      // Parse attributes
      attributes.forEach(attr => {
        const [attrName, attrValue] = attr.split('=')
        const trimmedName = attrName?.trim().toLowerCase()
        const trimmedValue = attrValue?.trim()
        
        switch (trimmedName) {
          case 'domain':
            cookie.domain = trimmedValue || domain
            break
          case 'path':
            cookie.path = trimmedValue || '/'
            break
          case 'expires':
            if (trimmedValue) {
              const expires = new Date(trimmedValue)
              if (!isNaN(expires.getTime())) {
                cookie.expires = expires
              }
            }
            break
          case 'max-age':
            if (trimmedValue) {
              const maxAge = parseInt(trimmedValue, 10)
              if (!isNaN(maxAge)) {
                cookie.expires = new Date(Date.now() + maxAge * 1000)
              }
            }
            break
          case 'secure':
            cookie.secure = true
            break
          case 'httponly':
            cookie.httpOnly = true
            break
          case 'samesite':
            if (trimmedValue) {
              const sameSite = trimmedValue.toLowerCase()
              if (['strict', 'lax', 'none'].includes(sameSite)) {
                cookie.sameSite = sameSite as 'Strict' | 'Lax' | 'None'
              }
            }
            break
        }
      })
      
      cookies.push(cookie)
    })
    
    return cookies
  }

  /**
   * Build cookie string from CookieData object
   */
  private buildCookieString(cookie: CookieData): string {
    let cookieString = `${cookie.name}=${cookie.value}`
    
    if (cookie.domain) {
      cookieString += `; Domain=${cookie.domain}`
    }
    
    if (cookie.path) {
      cookieString += `; Path=${cookie.path}`
    }
    
    if (cookie.expires) {
      cookieString += `; Expires=${cookie.expires.toUTCString()}`
    }
    
    if (cookie.secure) {
      cookieString += '; Secure'
    }
    
    if (cookie.httpOnly) {
      cookieString += '; HttpOnly'
    }
    
    if (cookie.sameSite) {
      cookieString += `; SameSite=${cookie.sameSite}`
    }
    
    return cookieString
  }

  /**
   * Extract domain from URL
   */
  private extractDomain(url: string): string {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname
    } catch {
      return url
    }
  }
}

export const cookieManager = CookieManager.getInstance()