# @deenruv/seo-plugin

A lightweight SEO plugin that adds custom fields for SEO metadata (title, description, social media images) to Products and Collections in your Deenruv store.

## Installation

```bash
pnpm add @deenruv/seo-plugin
```

## Configuration

```typescript
import { SeoPlugin } from '@deenruv/seo-plugin';

// In your Deenruv server config:
plugins: [
  SeoPlugin,
]
```

No additional configuration options are required. The plugin automatically registers custom fields on Products and Collections.

## Features

- Locale-aware `seoTitle` custom field on Products and Collections
- Locale-aware `seoDescription` custom field on Products and Collections
- `facebookImage` asset relation for Open Graph social sharing images
- `twitterImage` asset relation for Twitter Card images
- All SEO fields grouped under an "SEO" tab in the admin UI
- All fields are publicly accessible via the Shop API

## Admin UI

This plugin is server-only and does not add any admin UI extensions. The SEO custom fields are automatically displayed under the "SEO" tab in the Product and Collection detail pages of the standard admin UI.

## API Extensions

This plugin does not add any custom GraphQL API extensions. The SEO fields are exposed as custom fields on the existing `Product` and `Collection` types and are accessible via the standard custom fields API.
