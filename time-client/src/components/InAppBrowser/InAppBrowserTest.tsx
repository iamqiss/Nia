import React from 'react'
import {View, StyleSheet, TouchableOpacity, Text, Alert} from 'react-native'
import {useTheme} from '#/alf'
import {useInAppBrowser} from './useInAppBrowser'
import {cookieManager} from '#/lib/cookies'

export function InAppBrowserTest() {
  const t = useTheme()
  const {openBrowser, isOpen, error, clearError} = useInAppBrowser()

  const testUrls = [
    {
      name: 'Google',
      url: 'https://www.google.com',
    },
    {
      name: 'GitHub',
      url: 'https://github.com',
    },
    {
      name: 'React Native WebView Docs',
      url: 'https://github.com/react-native-webview/react-native-webview',
    },
    {
      name: 'Cookie Test Site',
      url: 'https://httpbin.org/cookies',
    },
  ]

  const handleOpenUrl = async (url: string) => {
    try {
      await openBrowser(url)
    } catch (err) {
      Alert.alert('Error', `Failed to open browser: ${err}`)
    }
  }

  const handleTestCookies = async () => {
    try {
      const testUrl = 'https://httpbin.org'
      await cookieManager.setCookie(testUrl, {
        name: 'test_cookie',
        value: 'test_value_123',
        domain: 'httpbin.org',
        path: '/',
        secure: true,
        sameSite: 'Lax',
      })
      
      const cookies = await cookieManager.getCookies(testUrl)
      Alert.alert('Cookie Test', `Set and retrieved ${cookies.length} cookies`)
    } catch (err) {
      Alert.alert('Cookie Error', `Failed to test cookies: ${err}`)
    }
  }

  const handleClearCookies = async () => {
    try {
      await cookieManager.clearCookies()
      Alert.alert('Success', 'All cookies cleared')
    } catch (err) {
      Alert.alert('Error', `Failed to clear cookies: ${err}`)
    }
  }

  return (
    <View style={[styles.container, {backgroundColor: t.atoms.bg.backgroundColor}]}>
      <Text style={[styles.title, {color: t.palette.neutral_900}]}>
        In-App Browser Test
      </Text>
      
      <Text style={[styles.status, {color: t.palette.neutral_600}]}>
        Status: {isOpen ? 'Open' : 'Closed'}
      </Text>
      
      {error && (
        <View style={[styles.errorContainer, {backgroundColor: t.palette.error_50}]}>
          <Text style={[styles.errorText, {color: t.palette.error_700}]}>
            Error: {error}
          </Text>
          <TouchableOpacity
            style={[styles.clearButton, {backgroundColor: t.palette.error_100}]}
            onPress={clearError}
          >
            <Text style={[styles.clearButtonText, {color: t.palette.error_700}]}>
              Clear Error
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.buttonContainer}>
        {testUrls.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.button, {backgroundColor: t.palette.primary_500}]}
            onPress={() => handleOpenUrl(item.url)}
          >
            <Text style={[styles.buttonText, {color: t.palette.white}]}>
              Open {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.cookieContainer}>
        <Text style={[styles.sectionTitle, {color: t.palette.neutral_700}]}>
          Cookie Management
        </Text>
        
        <TouchableOpacity
          style={[styles.cookieButton, {backgroundColor: t.palette.secondary_500}]}
          onPress={handleTestCookies}
        >
          <Text style={[styles.buttonText, {color: t.palette.white}]}>
            Test Cookies
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.cookieButton, {backgroundColor: t.palette.neutral_500}]}
          onPress={handleClearCookies}
        >
          <Text style={[styles.buttonText, {color: t.palette.white}]}>
            Clear All Cookies
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  status: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  errorContainer: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 14,
    marginBottom: 10,
  },
  clearButton: {
    padding: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  buttonContainer: {
    marginBottom: 30,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cookieContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  cookieButton: {
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    alignItems: 'center',
  },
})