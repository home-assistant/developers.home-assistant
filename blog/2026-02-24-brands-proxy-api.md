---
author: Frenck
authorURL: https://github.com/frenck
authorImageURL: https://avatars.githubusercontent.com/u/195327?v=4
title: "Custom integrations can now ship their own brand images"
---

Starting with Home Assistant 2026.3, custom integrations can include their own brand images (icons and logos) directly in the integration directory. No more submitting to a separate repository — just drop your images in a `brand/` folder and they show up in the UI.

## Local brand images for custom integrations

Add a `brand/` directory to your custom integration with your icon and logo files:

```text
custom_components/my_integration/
├── __init__.py
├── manifest.json
└── brand/
    ├── icon.png
    └── logo.png
```

The following image filenames are supported:

- `icon.png` / `dark_icon.png`
- `logo.png` / `dark_logo.png`
- `icon@2x.png` / `dark_icon@2x.png`
- `logo@2x.png` / `dark_logo@2x.png`

Local brand images automatically take priority over images from the brands CDN. That's it — no extra configuration needed.

For more details, see the [integration file structure documentation](/docs/creating_integration_file_structure#local-brand-images-for-custom-integrations).

## Brand images now served through a local API

To make local brand images possible, all brand images are now served through the Home Assistant local API instead of being fetched directly from the CDN by the browser.

A new `brands` system integration proxies brand images through two endpoints:

- `/api/brands/integration/{domain}/{image}` — Integration icons and logos
- `/api/brands/hardware/{category}/{image}` — Hardware images

Images are cached locally on disk and served with a stale-while-revalidate strategy, so they remain available during internet outages.

### Impact on the frontend

The `brandsUrl()` and `hardwareBrandsUrl()` helpers in `src/util/brands-url.ts` now return local API paths instead of CDN URLs. If your custom card or panel uses these helpers, no changes are needed.

If you are constructing brand image URLs manually, update them:

```typescript
// Old
const url = `https://brands.home-assistant.io/_/${domain}/icon.png`;

// New
import { brandsUrl } from "../util/brands-url";
const url = brandsUrl({ domain, type: "icon" });
```

These endpoints require authentication. The `brandsUrl()` helper handles this automatically by appending an access token. If you construct URLs manually, obtain a token via the `brands/access_token` WebSocket command and append it as a `token` query parameter.
