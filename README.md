# Everyday Winners Mobile App

Neon City login screen (HTML via WebView) opens first, then routes to the dashboard when the screen is tapped.

## Features
- Home dashboard greets the user by name, shows scores from all three bureaus, lets you upload a credit report HTML file, and renders parsed tradelines as cards.
- Upload buttons accept ID and proof-of-residency documents.
- Recommended actions appear centered beneath tradelines for quick next steps.
- Bottom navigation includes a **Messages** tab with an RSS-style feed, quick contact buttons (email & call), and four preset questions for fast outreach. Message threads stay hidden until a question is picked and each question keeps its own conversation.
- A **Movies** tab plays credit education videos from YouTube inside the app.

## Prereqs
- Node 18+
- Expo CLI (`npm install -g expo-cli`)

## Env vars
None required. The login HTML can be customized in `login.html`.

## Install
```bash
npm install
expo install react-native-webview expo-document-picker expo-file-system
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
