# IranBlackout Architecture

## Overview

IranBlackout is a cross-platform React Native application designed to monitor and report internet connectivity status in Iran. The architecture prioritizes privacy, offline capability, and data redundancy.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────────┐ │
│  │ HomeScreen  │ │TimelineScr. │ │AlertsScreen │ │SettingsScr.│ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └────────────┘ │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    COMPONENTS                             │   │
│  │  IranMap  │  ISPStatusCard  │  StatusIndicator  │  ...   │   │
│  └──────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                         STATE & CONTEXT                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │ThemeContext │ │   i18n      │ │Navigation   │               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
├─────────────────────────────────────────────────────────────────┤
│                         SERVICE LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    API CLIENTS                            │   │
│  │  OONIClient  │  CloudflareClient  │  RIPEAtlasClient     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────┐     ┌─────────────────┐                   │
│  │  CacheService   │     │ TelemetryService│                   │
│  │  (AsyncStorage) │     │   (Anonymous)   │                   │
│  └─────────────────┘     └─────────────────┘                   │
├─────────────────────────────────────────────────────────────────┤
│                        EXTERNAL APIs                             │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │    OONI     │ │  Cloudflare │ │ RIPE Atlas  │               │
│  │  Explorer   │ │    Radar    │ │             │               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
└─────────────────────────────────────────────────────────────────┘
```

## Layer Descriptions

### Presentation Layer

**Screens**
- `HomeScreen` - Main dashboard with map and ISP status list
- `TimelineScreen` - Historical outage data with charts
- `AlertsScreen` - Notification list with read/unread management
- `SettingsScreen` - Theme, language, and privacy controls

**Components**
- `IranMap` - SVG-based interactive map with province coloring
- `ISPStatusCard` - Card displaying ISP name, type, and status
- `StatusIndicator` - Colored dot indicating online/limited/offline

### State & Context

**ThemeContext**
- Dark/light/system mode toggle
- Color tokens and typography
- RTL detection

**i18n**
- English and Farsi translations
- Persian numeral conversion (۱۲۳)
- RTL layout support

### Service Layer

**API Clients**
- `OONIClient` - Fetches network interference measurements
- `CloudflareClient` - Traffic anomaly detection
- `RIPEAtlasClient` - Network probe status

**CacheService**
- AsyncStorage-based persistence
- Timestamp-based expiry
- Stale-while-revalidate pattern

**TelemetryService**
- Anonymous device ID generation
- City-level location only (no GPS)
- Opt-in with user consent

## Data Flow

```
1. App Launch
   └─> Check cached data
       └─> If valid cache: Display immediately
       └─> Fetch fresh data from APIs
           └─> Update cache
           └─> Update UI

2. User Pull-to-Refresh
   └─> Fetch all API sources
   └─> Merge & deduplicate data
   └─> Update cache
   └─> Update UI

3. Telemetry Report (if enabled)
   └─> Collect: timestamp, city, ISP, status
   └─> Store locally
   └─> Attempt server upload
       └─> On failure: Queue for retry
```

## Privacy Architecture

```
╔═══════════════════════════════════════════════════════════════╗
║                    PRIVACY BOUNDARIES                          ║
╠═══════════════════════════════════════════════════════════════╣
║  NEVER COLLECTED              │  COLLECTED (opt-in only)      ║
║  ─────────────────────────────│────────────────────────────── ║
║  • GPS coordinates            │  • Timestamp                  ║
║  • Personal identifiers       │  • City name (from IP)        ║
║  • Login/account data         │  • ISP identifier             ║
║  • Phone number               │  • Connectivity status        ║
║  • Device identifiers         │  • Latency (optional)         ║
║  • Browsing history           │  • Random device ID           ║
║  • App usage analytics        │                               ║
╚═══════════════════════════════════════════════════════════════╝
```

## Technology Choices

| Technology | Reason |
|------------|--------|
| React Native | Cross-platform (Android, iOS, Windows) |
| TypeScript | Type safety, better tooling |
| react-native-svg | Province map rendering |
| react-i18next | RTL + Farsi support |
| AsyncStorage | Persistent offline cache |
| Chart Kit | Time-series visualization |

## Future Enhancements

1. **Push Notifications** - FCM integration for outage alerts
2. **Background Sync** - Periodic data refresh
3. **VPN Detection** - Detect and report VPN usage patterns
4. **Community Reports** - User-submitted incident reports
5. **Export Data** - CSV/JSON export for researchers
