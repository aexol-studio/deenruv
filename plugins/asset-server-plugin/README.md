# @deenruv/asset-server-plugin

Serves assets (images and other files) from the local file system or cloud storage (e.g. S3), with on-the-fly image transformation (resize, crop, format conversion) and result caching.

## Installation

```bash
pnpm add @deenruv/asset-server-plugin
```

## Configuration

```typescript
import { AssetServerPlugin } from '@deenruv/asset-server-plugin';
import path from 'path';

const config = {
  plugins: [
    AssetServerPlugin.init({
      route: 'assets',
      assetUploadDir: path.join(__dirname, 'assets'),
    }),
  ],
};
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `route` | `string` | *required* | URL route for serving assets (e.g. `'assets'`) |
| `assetUploadDir` | `string` | *required* | Local directory for asset storage |
| `assetUrlPrefix` | `string \| fn` | auto-detected | Complete URL prefix for asset files |
| `presets` | `ImageTransformPreset[]` | See below | Named image transform presets |
| `namingStrategy` | `AssetNamingStrategy` | `HashedAssetNamingStrategy` | Strategy for naming uploaded assets |
| `previewStrategy` | `AssetPreviewStrategy` | `SharpAssetPreviewStrategy` | Strategy for generating preview images |
| `storageStrategyFactory` | `fn` | `LocalAssetStorageStrategy` | Factory for custom storage backends (e.g. S3) |
| `cacheHeader` | `string \| CacheConfig` | `'public, max-age=15552000'` | Cache-Control header (default: 6 months) |

## Image Transformation

Assets can be transformed on-the-fly via URL query parameters:

```
http://localhost:3000/assets/photo.jpg?w=500&h=300&mode=resize
```

**Query Parameters:**

| Param | Description |
|-------|-------------|
| `w` | Target width in pixels |
| `h` | Target height in pixels |
| `mode` | `crop` (cover) or `resize` (contain) |
| `preset` | Named preset (e.g. `?preset=thumb`) |
| `fpx`, `fpy` | Focal point (0-1 normalized coordinates) for crop mode |
| `format` | Output format: `jpg`, `png`, `webp`, `avif` |
| `q` | Quality (1-100, default: 80 for jpg/webp, 50 for avif) |
| `cache` | Set to `false` to skip caching |

### Default Presets

| Name | Width | Height | Mode |
|------|-------|--------|------|
| `tiny` | 50px | 50px | crop |
| `thumb` | 150px | 150px | crop |
| `small` | 300px | 300px | resize |
| `medium` | 500px | 500px | resize |
| `large` | 800px | 800px | resize |

Custom presets can be added via the `presets` option:

```typescript
AssetServerPlugin.init({
  route: 'assets',
  assetUploadDir: path.join(__dirname, 'assets'),
  presets: [
    { name: 'hero', width: 1200, height: 600, mode: 'crop' },
  ],
});
```

## Features

- On-the-fly image resize and crop via URL query parameters
- Format conversion (JPEG, PNG, WebP, AVIF)
- Quality control for lossy formats
- Focal point-aware cropping
- Named transform presets
- Transformed image caching for subsequent requests
- Configurable Cache-Control headers
- S3-compatible cloud storage via `S3AssetStorageStrategy`
- Hashed asset naming for cache busting
- Sharp-based image processing
- Content-type detection with fallback

## Admin UI

Server-only plugin. No Admin UI extensions.

## API Extensions

No GraphQL API extensions. Assets are served via Express middleware at the configured route.
