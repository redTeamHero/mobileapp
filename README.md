# Everyday Winners Mobile App

Neon City login screen (HTML via WebView) opens first, then routes to the dashboard when the screen is tapped.

## Features
- Home dashboard shows coin, flame, gem, and energy balances at a glance.
- Bottom navigation includes a **Messages** tab with an RSS-style feed, quick contact buttons (email & call), and four preset questions for fast outreach.

## Prereqs
- Node 18+
- Expo CLI (`npm install -g expo-cli`)

## Env vars
None required. The login HTML can be customized in `login.html`.

## Install
```bash
npm install
expo install react-native-webview
```

## Run
```bash
npx expo start
```

## Test
```bash
npm test
```

## Deploy
Use Expo or EAS Build for iOS/Android/web.
