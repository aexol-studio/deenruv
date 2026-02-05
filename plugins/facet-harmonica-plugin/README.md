# @deenruv/facet-harmonica-plugin

Plugin that extends Facet and FacetValue entities with additional custom fields for enhanced product filtering. It adds color support, visibility controls, product creation flags, and image associations to facet values, enabling rich filter UI components like color swatches and accordion-style facet navigation.

## Installation

```bash
pnpm add @deenruv/facet-harmonica-plugin
```

## Configuration

```typescript
import { FacetHarmonicaServerPlugin } from '@deenruv/facet-harmonica-plugin';

// In your Deenruv server config:
plugins: [
  FacetHarmonicaServerPlugin.init({}),
]
```

## Features

- **Facet custom fields:**
  - `usedForColors` — Boolean flag to mark facets representing color attributes
  - `usedForProductCreations` — Boolean flag for facets used in product creation flows
  - `colorsCollection` — Boolean flag for color collection grouping (e.g., "BLAT/CORPUS" paths)
- **FacetValue custom fields:**
  - `hexColor` — Hex color string with a color picker UI component
  - `isNew` — Boolean flag to mark new facet values
  - `isHidden` — Boolean flag to hide facet values from the storefront
  - `image` — Relation to an Asset for visual representation

## Admin UI

This plugin extends the admin UI with an accordion-style facet management interface, including a color picker input for hex colors, checkbox accordion components, and dedicated action buttons for facet operations.

## API Extensions

This plugin does not add any GraphQL API extensions. It registers custom fields on Facet and FacetValue entities, which are automatically exposed through the standard Deenruv GraphQL API.
