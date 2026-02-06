---
name: add-translation
description: How to add, update, and manage i18n translations in Deenruv plugins and admin UI
---

# Add & Manage Translations in Deenruv

## When to Use This Skill

- User asks to add translations or localize UI text
- User asks to support a new language
- User creates UI components that need labels or user-facing strings
- User asks about i18n setup or how translations work

## Two Translation Systems

Deenruv has **two separate** translation systems. Identify which one applies before making changes.

| System | Where | Library | Languages |
|--------|-------|---------|-----------|
| Admin Panel | `apps/panel/`, `plugins/*/src/plugin-ui/` | i18next + react-i18next | `en`, `pl` (extendable) |
| Docs Landing | `apps/docs/src/components/landing/` | Custom typed objects | `en`, `pl` |

---

## System 1: Admin Panel & Plugin Translations (i18next)

### Critical Rule

**NEVER import `react-i18next` directly.** Always use `useTranslation` from `@deenruv/react-ui-devkit`:

```typescript
// CORRECT
import { useTranslation } from "@deenruv/react-ui-devkit";

// WRONG — do NOT do this
import { useTranslation } from "react-i18next";
```

The devkit wrapper provides `tEntity` and binds to the correct i18next instance via `window.__DEENRUV_SETTINGS__.i18n`.

### Step 1: Create Namespace File

Create `plugin-ui/translation-ns.ts` using a Symbol-based namespace:

```typescript
// plugins/<name>-plugin/src/plugin-ui/translation-ns.ts
export const translationNS = Symbol("<name>-plugin").toString();
```

> The Symbol pattern ensures namespace uniqueness across all plugins. Use the plugin directory name as the Symbol label.

### Step 2: Create Locale JSON Files

Create locale directories with JSON translations for **both** `en` and `pl`:

```
plugin-ui/locales/
├── en/
│   ├── index.ts          # Barrel export
│   └── <feature>.json    # English translations
└── pl/
    ├── index.ts          # Barrel export
    └── <feature>.json    # Polish translations
```

**JSON file** (`locales/en/<feature>.json`):

```json
{
  "nav": {
    "group": "My Feature",
    "link": "Feature Settings"
  },
  "title": "Feature Configuration",
  "form": {
    "name": "Name",
    "description": "Description",
    "save": "Save Changes"
  },
  "modal": {
    "add": { "title": "Add item", "action": "Add", "success": "Added successfully" },
    "remove": { "title": "Remove item", "action": "Remove" },
    "cancel": "Cancel"
  }
}
```

**Barrel file** (`locales/en/index.ts`):

```typescript
import feature from "./<feature>.json";

export default [feature];
```

> The barrel must export a **default array** of JSON modules. If you have multiple JSON files per language, include them all: `export default [feature, settings];`

### Step 3: Register in UI Plugin

Wire translations into `createDeenruvUIPlugin`:

```typescript
// plugin-ui/index.tsx
import { createDeenruvUIPlugin } from "@deenruv/react-ui-devkit";
import pl from "./locales/pl";
import en from "./locales/en";
import { translationNS } from "./translation-ns.js";

export const MyFeatureUIPlugin = createDeenruvUIPlugin({
  version: "1.0.0",
  name: "my-feature-plugin-ui",
  translations: { ns: translationNS, data: { en, pl } },
  // pages, navMenuGroups, navMenuLinks, etc.
});
```

The framework calls `i18next.addResourceBundle(lng, ns, translations)` for each language at plugin registration time.

### Step 4: Use in Components

```typescript
import { useTranslation } from "@deenruv/react-ui-devkit";
import { translationNS } from "../translation-ns.js";

export const FeaturePage = () => {
  const { t } = useTranslation(translationNS);

  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("form.description")}</p>
      <button>{t("form.save")}</button>
    </div>
  );
};
```

### Step 5: Navigation Labels

Nav menu labels use `labelId` keys that the framework auto-prefixes with the plugin namespace:

```typescript
navMenuGroups: [
  { id: "my-feature", labelId: "nav.group", placement: { groupId: "settings" } },
],
navMenuLinks: [
  { groupId: "my-feature", id: "feature-settings", labelId: "nav.link", href: "", icon: SettingsIcon },
],
```

The framework resolves `labelId` to `${ns}.nav.group` automatically — just use the key relative to your JSON root.

### Step 6: Entity Translations (tEntity)

The `tEntity` helper handles pluralized entity actions:

```typescript
const { t, tEntity } = useTranslation("common");

tEntity("action.delete", "product", "one");   // "Delete product"
tEntity("action.delete", "product", "many");   // "Delete products"
tEntity("action.delete", "product", 5);        // "Delete products" (count > 1)
```

Internally it translates the entity name via `entity.<name>` keys from the `common` namespace and injects it as a `value` interpolation variable.

---

## System 2: Docs Landing Page Translations

**File**: `apps/docs/src/components/landing/translations.ts`

### Pattern

Translations are plain typed objects keyed by section, then by language:

```typescript
export const translations = {
  mySection: {
    en: {
      title: 'English Title',
      description: 'English description',
    },
    pl: {
      title: 'Polski Tytuł',
      description: 'Opis po polsku',
    },
  },
};
```

### Usage in Components

Use the exported `t()` helper function:

```tsx
import { t } from './translations';

// In component (lang comes from URL params or context)
const text = t('mySection', lang);
return <h1>{text.title}</h1>;
```

The `t()` function signature is `t(section, lang)` and falls back to `en` if the language key is missing.

### Type: `Lang`

```typescript
export type Lang = 'en' | 'pl';
```

When adding a new language, update this union type.

---

## Adding a New Language

1. **Admin Panel**: Create a new locale folder (e.g., `locales/de/`) with matching JSON files and barrel `index.ts`
2. **Register it**: Add the language key in the plugin's `translations.data`: `{ en, pl, de }`
3. **Docs Landing**: Add a new language branch under every section in `translations.ts`; update the `Lang` type union
4. **Verify**: Test that all keys exist in the new language — missing keys fall back to the namespace default

## Common Mistakes

- Importing `react-i18next` directly instead of `@deenruv/react-ui-devkit`
- Forgetting to register `translations` in `createDeenruvUIPlugin`
- Missing the namespace argument in `useTranslation(ns)` — without it you get keys from `"common"` only
- Adding only `en` translations — always provide both `en` and `pl`
- Barrel file not exporting an array — must be `export default [json1, json2]`
- Using flat keys when JSON is nested (use `"form.save"` not `"formSave"`)

## Checklist

- [ ] Namespace file created (`translation-ns.ts` with Symbol pattern)
- [ ] Locale JSON files created for **both** `en` and `pl`
- [ ] Barrel `index.ts` files export default arrays of JSON imports
- [ ] `translations` property set in `createDeenruvUIPlugin()`
- [ ] Components use `useTranslation(translationNS)` from `@deenruv/react-ui-devkit`
- [ ] Navigation `labelId` keys match JSON key paths
- [ ] Both languages manually verified in the UI
