# In-App Browser Implementation

This directory contains a custom in-app browser implementation for the Time app, replacing Expo's web browser with a native solution that provides better cookie management and consistent branding across iOS and Android.

## Features

- **Consistent Branding**: Custom UI that matches the Time app's design system
- **Cookie Management**: Full cookie support for better UX and session persistence
- **Native Performance**: Uses react-native-webview for optimal performance
- **Cross-Platform**: Works identically on both iOS and Android
- **Error Handling**: Comprehensive error handling and logging
- **Navigation Controls**: Back, forward, refresh, and close buttons
- **Custom User Agent**: Configurable user agent string

## Components

### InAppBrowser
The main browser component that renders a WebView with custom controls.

```tsx
import {InAppBrowser} from '#/components/InAppBrowser'

<InAppBrowser
  url="https://example.com"
  onClose={() => console.log('Browser closed')}
  onError={(error) => console.error('Browser error:', error)}
/>
```

### useInAppBrowser
A hook that provides browser state management and methods.

```tsx
import {useInAppBrowser} from '#/components/InAppBrowser'

const {openBrowser, isOpen, error, closeBrowser} = useInAppBrowser()

// Open a URL
await openBrowser('https://example.com')
```

## Cookie Management

The implementation includes a comprehensive cookie management system:

```tsx
import {cookieManager} from '#/lib/cookies'

// Set a cookie
await cookieManager.setCookie('https://example.com', {
  name: 'session_id',
  value: 'abc123',
  domain: 'example.com',
  path: '/',
  secure: true,
  sameSite: 'Lax'
})

// Get cookies
const cookies = await cookieManager.getCookies('https://example.com')

// Clear cookies
await cookieManager.clearCookies('https://example.com')
```

## Native Bridge

The implementation includes native bridge modules for both platforms:

### iOS (Swift)
- `InAppBrowserBridge.swift`: Main bridge implementation
- `InAppBrowserBridge.m`: Objective-C bridge header

### Android (Kotlin)
- `InAppBrowserBridgeModule.kt`: Main bridge implementation
- `InAppBrowserPackage.kt`: Package registration

## Configuration

The browser can be configured through the native bridge:

```tsx
import InAppBrowserBridge from '#/native/InAppBrowserBridge'

// Set user agent
await InAppBrowserBridge.setUserAgent('Time App Browser')

// Enable/disable JavaScript
await InAppBrowserBridge.setJavaScriptEnabled(true)

// Configure cookie settings
await InAppBrowserBridge.setThirdPartyCookiesEnabled(true)
```

## Testing

Use the `InAppBrowserTest` component to test the browser functionality:

```tsx
import {InAppBrowserTest} from '#/components/InAppBrowser'

// Add to your app for testing
<InAppBrowserTest />
```

## Migration from Expo Web Browser

The implementation is designed as a drop-in replacement for `expo-web-browser`. The main differences:

1. **No Expo dependency**: Removed `expo-web-browser` from package.json
2. **Custom UI**: Replaced Expo's browser UI with custom branded interface
3. **Enhanced cookie support**: Full cookie management with persistence
4. **Native bridge**: Custom native modules for platform-specific functionality

## Browser Features

- **Navigation**: Back, forward, refresh controls
- **URL Display**: Shows current URL and page title
- **Loading States**: Loading indicator and error handling
- **Theme Support**: Adapts to app's theme system
- **Responsive Design**: Works on all screen sizes
- **Accessibility**: Proper accessibility labels and navigation

## Error Handling

The browser includes comprehensive error handling:

- JavaScript errors are caught and reported
- Network errors are handled gracefully
- Invalid URLs are validated
- Cookie operations include error recovery

## Performance

- Uses react-native-webview for optimal performance
- Lazy loading of native modules
- Efficient cookie management with caching
- Minimal memory footprint

## Security

- Secure cookie handling with proper attributes
- HTTPS enforcement for secure cookies
- SameSite cookie support
- HttpOnly cookie support
- Domain validation for cookie operations