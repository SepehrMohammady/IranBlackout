# Obtaining Free API Keys

## OONI (Recommended - No Key Required)

[OONI](https://ooni.org) (Open Observatory of Network Interference) provides free, open access to censorship data worldwide. Their API is public and requires no authentication.

**API Docs**: https://api.ooni.io/

**Example Query for Iran**:
```bash
curl "https://api.ooni.io/api/v1/aggregation?probe_cc=IR&since=2024-01-01"
```

The app uses OONI by default for all connectivity data.

---

## Cloudflare Radar (Free Tier Available)

Cloudflare Radar provides global internet traffic insights.

### How to Get Access:

1. Visit https://developers.cloudflare.com/radar/
2. Sign up for a free Cloudflare account
3. Go to Dashboard → API Tokens
4. Create a token with "Radar: Read" permissions

**Rate Limits**: Free tier allows 10,000 requests/month

---

## RIPE Atlas (Free Credits)

RIPE Atlas is a global network measurement platform with probes worldwide.

### How to Get Access:

1. Visit https://atlas.ripe.net/
2. Click "Register" for a free account
3. Verify your email
4. Go to "API Keys" in your profile
5. Create a new API key

**Free Credits**: All users get free credits for measurements. Hosting a probe earns more credits.

**Docs**: https://atlas.ripe.net/docs/apis/

---

## Summary

| Service | Auth Required | Free Tier |
|---------|--------------|-----------|
| OONI | ❌ No | Unlimited |
| Cloudflare Radar | ✅ Key | 10K/month |
| RIPE Atlas | ✅ Key | Free credits |

For the basic app functionality, **OONI is sufficient** and requires no setup.
