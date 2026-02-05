# @deenruv/replicate-simple-bg-plugin

An AI-powered background generation plugin that uses [Replicate](https://replicate.com/) models to generate styled room backgrounds from uploaded images, ideal for virtual staging of product photography.

## Installation

```bash
pnpm add @deenruv/replicate-simple-bg-plugin replicate
```

## Configuration

```typescript
import { ReplicateSimpleBGPlugin } from '@deenruv/replicate-simple-bg-plugin';

// In your Deenruv server config:
plugins: [
  ReplicateSimpleBGPlugin.init({
    envs: {
      deploymentName: 'your-replicate-deployment',
      apiToken: process.env.REPLICATE_API_TOKEN,
      assetPrefix: 'https://your-cdn.com/assets',
    },
    // Optional: custom prompts for image generation
    prompts: {
      positive: 'modern interior design',
      negative: 'blurry, distorted',
    },
    // Optional: predefined room types and themes
    roomType: [{ value: 'living-room', label: 'Living Room' }],
    roomTheme: [{ value: 'modern', label: 'Modern', image: '/themes/modern.jpg' }],
  }),
]
```

## Features

- AI-powered background generation using Replicate models
- Configurable room types and interior design themes
- File upload support with drag-and-drop interface
- Custom entity for tracking generation jobs and results
- Configurable positive/negative prompts and seed values
- Admin API for triggering and managing background generation tasks

## Admin UI

This plugin extends the admin UI with a background generation interface including image upload via drag-and-drop, room type and style selection, generation progress tracking, and a product sidebar for quick access to generated backgrounds.

## API Extensions

The plugin extends the **Admin API** with:

- Mutations for triggering background generation from uploaded images
- Queries for retrieving generation status and results
