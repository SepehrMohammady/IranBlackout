# Iran Blackout - Architecture Documentation

## Overview

Iran Blackout is a cross-platform React Native app that monitors internet connectivity across Iran. It uses a privacy-preserving design to protect users while providing real-time status updates.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                           IRAN BLACKOUT APP                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐ │
│  │  Dashboard  │  │  Timeline   │  │   Alerts    │  │  Settings  │ │
│  │   Screen    │  │   Screen    │  │   Screen    │  │   Screen   │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬─────┘ │
│         │                │                │                │       │
│         └────────────────┴────────────────┴────────────────┘       │
│                                   │                                 │
│  ┌────────────────────────────────┴─────────────────────────────┐  │
│  │                      NAVIGATION (React Navigation)            │  │
│  └────────────────────────────────┬─────────────────────────────┘  │
│                                   │                                 │
│  ┌────────────────────────────────┴─────────────────────────────┐  │
│  │                         COMPONENTS                            │  │
│  │    Card │ StatusBadge │ ISPCard │ Map │ Chart                │  │
│  └────────────────────────────────┬─────────────────────────────┘  │
│                                   │                                 │
│  ┌────────────────┬───────────────┴────────────┬───────────────┐   │
│  │    THEME       │          STORE             │      I18N     │   │
│  │  Dark/Light    │      (Zustand)             │   EN / FA     │   │
│  │  Colors/Fonts  │  Provinces, ISPs, Alerts   │   RTL/LTR     │   │
│  └────────┬───────┴─────────────┬──────────────┴───────┬───────┘   │
│           │                     │                      │           │
│  ┌────────┴─────────────────────┴──────────────────────┴────────┐  │
│  │                         SERVICES                              │  │
│  │              API (OONI, Cloudflare, RIPE)                    │  │
│  │              AsyncStorage (Persistence)                      │  │
│  └────────────────────────────────┬─────────────────────────────┘  │
│                                   │                                 │
└───────────────────────────────────┼─────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │         EXTERNAL APIs          │
                    ├───────────────────────────────┤
                    │  • OONI (api.ooni.io)         │
                    │  • Cloudflare Radar           │
                    │  • RIPE Atlas                 │
                    └───────────────────────────────┘
```

## Key Components

### 1. State Management (Zustand)

The app uses Zustand with persistence for lightweight state management:

```typescript
// Store structure
{
  provinces: Province[],      // 31 Iran provinces with status
  isps: ISP[],               // 8 major ISPs/MNOs
  outages: OutageEvent[],    // Historical events
  alerts: Alert[],           // User notifications
  timeline: TimelineDataPoint[],
  stats: DashboardStats,
  settings: AppSettings,     // Theme, language, notifications
  isOffline: boolean,        // Offline mode flag
}
```

### 2. Theme System

Dual-theme support with accessibility considerations:

- **Dark Mode**: Optimized for OLED screens, reduces visibility at night
- **Light Mode**: High contrast for daylight use
- **Status Colors**: Consistent green/yellow/red across themes

### 3. Internationalization (i18n)

Full bilingual support:

- **English (en)**: Left-to-right layout
- **Farsi (fa)**: Right-to-left layout with Persian numerals
- **Automatic**: Uses `I18nManager.forceRTL()` for layout mirroring

### 4. Data Flow

```
                    ┌─────────────┐
                    │  OONI API   │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  api.ts     │ Fetch & transform
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
       ┌─────────────┐          ┌─────────────┐
       │  Zustand    │          │ AsyncStorage│
       │   Store     │◄────────►│  (Cache)    │
       └──────┬──────┘          └─────────────┘
              │
              ▼
       ┌─────────────┐
       │   Screens   │ React UI
       └─────────────┘
```

## Privacy Design

### What We DON'T Collect
- GPS coordinates
- Device identifiers (IMEI, Android ID)
- IP addresses
- Personal information
- Browsing history

### What We MAY Collect (Optional Telemetry)
- Province/city (user-selected, not GPS)
- ISP name
- Connectivity status (online/limited/offline)
- Timestamp

All telemetry is:
- Fully anonymous
- User opt-in
- Transmitted over HTTPS
- Not stored with any identifiers

## API Integration

### OONI (Primary Source)

```typescript
// Fetch Iran connectivity data
const response = await fetch(
  'https://api.ooni.io/api/v1/aggregation?probe_cc=IR'
);
```

OONI provides:
- Network interference measurements
- Blocking detection by ASN
- Historical data

### Cloudflare Radar

Provides country-level traffic data for backup redundancy.

### RIPE Atlas

Network measurement probes for additional data points (requires free registration).

## Offline Strategy

1. **On Fetch Success**: Store to Zustand + AsyncStorage
2. **On Fetch Fail**: Check AsyncStorage for cached data
3. **Display Banner**: Show "Cached data" warning to user
4. **Retry**: Automatic retry with exponential backoff

## Future Enhancements

- [ ] Interactive SVG map with province tap
- [ ] Push notifications via Firebase
- [ ] Crowdsourced telemetry submission
- [ ] Widget for home screen
- [ ] Watchlist for specific regions/ISPs
