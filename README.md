# Iran Blackout

> ✊ **Woman, Life, Freedom** | زن، زندگی، آزادی

A privacy-focused internet connectivity monitoring app for Iran, built with React Native.

![Status](https://img.shields.io/badge/Platform-Android-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## Features

- 📊 **Real-time Dashboard** - Live internet status by region and ISP
- 🗺️ **Interactive Map** - Iran provinces map with connectivity visualization
- 📈 **Timeline Charts** - Historical outage data and trends
- 🔔 **Alerts** - Push notifications for connectivity changes
- 🌓 **Dark/Light Mode** - Beautiful theming with activist-inspired design
- 🌐 **Bilingual** - English and Farsi (فارسی) with full RTL support
- 🔒 **Privacy-First** - No GPS, no personal data, anonymous telemetry
- 📴 **Offline Mode** - Cached data when you can't connect

## Quick Start

### Prerequisites

- Node.js 18+
- Java JDK 17
- Android Studio with SDK
- React Native CLI

### Installation

```bash
# Clone and enter directory
cd IranBlackout

# Install dependencies
npm install

# Start Metro bundler
npm start

# Run on Android (in separate terminal)
npm run android
```

## Project Structure

```
src/
├── components/     # Reusable UI components
│   └── common/     # StatusBadge, Card, ISPCard
├── screens/        # App screens
│   ├── HomeScreen.tsx
│   ├── TimelineScreen.tsx
│   ├── AlertsScreen.tsx
│   └── SettingsScreen.tsx
├── navigation/     # React Navigation setup
├── i18n/           # English & Farsi translations
├── services/       # OONI API integration
├── store/          # Zustand state management
├── theme/          # Colors, typography, spacing
├── types/          # TypeScript definitions
└── data/           # Iran provinces & ISPs data
```

## Data Sources

This app integrates with free, public APIs:

| Source | Description | Access |
|--------|-------------|--------|
| [OONI](https://ooni.org) | Open Observatory of Network Interference | Free, no key |
| [Cloudflare Radar](https://radar.cloudflare.com) | Global internet traffic data | Free tier |
| [RIPE Atlas](https://atlas.ripe.net) | Internet measurement network | Free registration |

## Privacy

**Your privacy is protected:**

- ❌ No GPS coordinates collected
- ❌ No device identifiers
- ❌ No personal information
- ✅ City-level location only (if reported)
- ✅ All data is anonymized
- ✅ HTTPS encryption for all traffic

## Localization

The app supports:

- **English** - LTR layout
- **فارسی (Farsi)** - RTL layout with Persian numerals (۱۲۳)

## Contributing

This is an open-source project supporting freedom of information. Contributions welcome!

## License

MIT License - Free to use, modify, and distribute.

---

**Standing with Iran's fight for freedom** ✊
