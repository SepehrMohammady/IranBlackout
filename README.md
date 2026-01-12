# IranBlackout

A cross-platform React Native application for monitoring internet connectivity in Iran. Built with privacy-first design, supporting crowdsourced telemetry and integration with external monitoring APIs.

> **Stay strong. Stay connected.**  
> Access is a right, not a privilege.

## Features

- 🗺️ **Real-time Map** - Province-level connectivity status visualization
- 📊 **ISP/MNO Monitoring** - Track status of major Iranian internet providers
- 📈 **Outage Timeline** - Historical data and time-series graphs
- 🔔 **Alerts** - Push notifications for connectivity changes
- 🌙 **Dark/Light Mode** - Automatic system detection with manual override
- 🌐 **Bilingual** - Full English and Farsi (فارسی) support with RTL
- 🔒 **Privacy First** - No GPS, no personal identifiers, encrypted communication
- 📴 **Offline Mode** - Cached data when disconnected

## Screenshots

*Coming soon*

## Getting Started

### Prerequisites

- Node.js 18+
- React Native development environment ([Setup Guide](https://reactnative.dev/docs/environment-setup))
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

```bash
# Clone the repository
git clone https://github.com/SepehrMohammady/IranBlackout.git
cd IranBlackout

# Install dependencies
npm install

# Start Metro bundler
npm start
```

### Running on Android

```bash
# Start Android emulator or connect device
npx react-native run-android
```

### Running on iOS

```bash
# iOS only (requires macOS)
cd ios && pod install && cd ..
npx react-native run-ios
```

## Tech Stack

- **React Native** 0.83 - Cross-platform mobile framework
- **TypeScript** - Type-safe JavaScript
- **React Navigation** - Navigation library
- **react-i18next** - Internationalization with RTL support
- **react-native-svg** - SVG rendering for map
- **react-native-chart-kit** - Data visualization
- **AsyncStorage** - Offline caching

## Data Sources

The app integrates with multiple free/open APIs for data redundancy:

| Source | Description | API |
|--------|-------------|-----|
| **OONI** | Network interference measurements | [OONI Explorer](https://explorer.ooni.org) |
| **Cloudflare Radar** | Traffic anomaly detection | [Radar API](https://radar.cloudflare.com) |
| **RIPE Atlas** | Network probe status | [RIPE Atlas](https://atlas.ripe.net) |
| **Crowdsourced** | Anonymous user reports | Built-in telemetry |

## Privacy

IranBlackout is designed with privacy as a core principle:

- ✅ **No GPS coordinates** - Only city-level location from IP
- ✅ **No personal identifiers** - Random anonymous device ID
- ✅ **No login required** - Fully anonymous usage
- ✅ **Opt-in telemetry** - User consent required
- ✅ **Encrypted communication** - HTTPS only
- ✅ **Minimal data collection** - Only connectivity status

## Project Structure

```
src/
├── App.tsx              # Main entry point
├── components/          # Reusable UI components
│   ├── IranMap.tsx      # SVG map with provinces
│   ├── ISPStatusCard.tsx
│   └── StatusIndicator.tsx
├── i18n/                # Translations
│   ├── index.ts
│   └── locales/
│       ├── en.json
│       └── fa.json
├── navigation/          # React Navigation setup
│   └── RootNavigator.tsx
├── screens/             # Main screens
│   ├── HomeScreen.tsx
│   ├── TimelineScreen.tsx
│   ├── AlertsScreen.tsx
│   └── SettingsScreen.tsx
├── services/            # API clients and services
│   ├── api/
│   │   ├── ooniClient.ts
│   │   ├── cloudflareClient.ts
│   │   └── ripeClient.ts
│   ├── cache.ts
│   └── telemetry.ts
├── theme/               # Design system
│   ├── colors.ts
│   ├── ThemeContext.tsx
│   └── typography.ts
└── types/               # TypeScript interfaces
    └── connectivity.ts
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source. See LICENSE file for details.

## Acknowledgments

- [OONI](https://ooni.org) - Open Observatory of Network Interference
- [Cloudflare Radar](https://radar.cloudflare.com) - Internet insights
- [RIPE NCC](https://atlas.ripe.net) - RIPE Atlas network
- The people of Iran fighting for freedom and access

---

**Made with ❤️ for Iran**

*Together, we document. Together, we resist.*
