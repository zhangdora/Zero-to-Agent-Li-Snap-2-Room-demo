# Snap2Room

Snap2Room is a Next.js App Router demo for generating a room preview, placing furniture assets, and preparing shopping options.

## Bright Data integration

Snap2Room can use Bright Data to search public web product results for furniture alternatives.

Optional env var:

```bash
BRIGHT_DATA_API_KEY=...
```

`BRIGHT_DATA_API_KEY` is optional. If present, Snap2Room uses Bright Data to search public web results for furniture products. If missing, the app uses mock fallback product data and remains fully demoable.

The key is only used in server-side code through the product search API route and is never exposed to the browser.

Vercel setup:

Project -> Settings -> Environment Variables -> Add `BRIGHT_DATA_API_KEY` -> Redeploy
