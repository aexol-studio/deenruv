# Modernizacja stanu formularzy: useGFFLP -> useDeenruvForm (RHF)

## Cel

Zastapienie wlasnego hooka `useGFFLP` adapterem `useDeenruvForm` opartym o React Hook Form (RHF) + Zod.
Dotyczy dwoch pakietow:

- `packages/react-ui-devkit` (SDK dla plugin devs)
- `packages/admin-dashboard` (wbudowane strony admina)

## Architektura docelowa

```
react-hook-form (kontroler stanu)
       |
  useDeenruvForm()          <-- adapter: laczy RHF z ModelTypes + customFields
       |
   +---+---+
   |       |
FormField  useFormContext()  <-- shadcn/ui <Form> + <FormField>
   |
zodResolver(schema)          <-- walidacja Zod ze wsparciem i18n
```

### Kluczowe decyzje architektoniczne

| Decyzja | Uzasadnienie |
|---------|-------------|
| RHF jako silnik formularzy | Standardowa biblioteka; uncontrolled-by-default; DevTools |
| Zod zamiast inline `validate` | Composable schemas; integracja z zodResolver; reuse w backendzie |
| Adapter `useDeenruvForm` zamiast golyego RHF | Zachowanie ergonomii ModelTypes + customFields; obudowa specyfik Deenruv |
| Hard-cut: pelne usuniecie `useGFFLP` po migracji | Czysta baza kodu; brak martwego kodu; wymusza migracje pluginow w ramach rollout |

### Schemat adaptera

```ts
// packages/react-ui-devkit/src/hooks/useDeenruvForm.ts

import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z, ZodSchema } from 'zod';
import { ModelTypes } from '@deenruv/admin-types';

interface UseDeenruvFormOptions<T extends z.ZodTypeAny> {
  schema: T;
  defaultValues?: z.input<T>;
}

export function useDeenruvForm<T extends z.ZodTypeAny>(
  options: UseDeenruvFormOptions<T>,
): UseFormReturn<z.output<T>> {
  return useForm<z.output<T>>({
    resolver: zodResolver(options.schema),
    defaultValues: options.defaultValues,
    mode: 'onBlur',
  });
}
```

## Stan obecny — audyt

### Lokalizacje useGFFLP

| Pakiet | Plik | Wzorzec |
|--------|------|---------|
| `react-ui-devkit` | `hooks/useGFFLP.ts` | Definicja hooka (233 linie) |
| `react-ui-devkit` | `components/templates/DetailView/DetailView.tsx` | Glowny template formularza |
| `react-ui-devkit` | `components/core/EntityCustomFields.tsx` | Custom fields form |
| `admin-dashboard` | `pages/orders/_components/CustomerSelectCard.tsx` | Wyszukiwanie klienta |
| `admin-dashboard` | `pages/orders/_components/SurchargeCard.tsx` | Dopłaty |
| `admin-dashboard` | `pages/orders/_components/AddressCard.tsx` | Adres zamowienia |
| `admin-dashboard` | `pages/orders/_components/ModifyingCard.tsx` | Modyfikacja zamowienia |
| `admin-dashboard` | `pages/orders/_components/FulfillmentModal.tsx` | Realizacja zamowienia |
| `admin-dashboard` | `pages/shipping-methods/_components/TestCard.tsx` | Test metod wysylki |
| `admin-dashboard` | `pages/products/_components/Variant.tsx` | Wariant produktu |
| `admin-dashboard` | `pages/products/_components/OptionValueCard.tsx` | Opcje produktu |
| `admin-dashboard` | `pages/products/_components/AddOptionGroupDialog.tsx` | Dodawanie grupy opcji |
| `admin-dashboard` | `pages/facets/_components/AddFacetValueDialog.tsx` | Dodawanie wartosci facet |
| `admin-dashboard` | `pages/customers/_components/AddressForm.tsx` | Formularz adresu klienta |

**Razem: 14 plikow (2 react-ui-devkit, 11 admin-dashboard + 1 definicja hooka)**

## Plan fazowy

### Faza 0: Infrastruktura (1-2 dni)

- Dodanie `react-hook-form`, `@hookform/resolvers`, `zod` do react-ui-devkit
- Stworzenie `useDeenruvForm` adaptera
- Stworzenie helper-a `createFormSchema` do budowy Zod schemas z ModelTypes
- Stworzenie wrapper-a `<DeenruvForm>` (opakowanie shadcn `<Form>`)
- Testy unit dla adaptera

### Faza 1: Pilot — proste formularze (3-4 dni)

Migracja 3-4 prostych dialogow/kart z admin-dashboard:

- `AddOptionGroupDialog.tsx` (1 pole + translations)
- `AddFacetValueDialog.tsx` (1 pole + translations)
- `SurchargeCard.tsx` (3 pola)
- `TestCard.tsx` (2-3 pola)

Cel: walidacja API adaptera na prostych przypadkach.

### Faza 2: Formularze ze zlozonym stanem (3-5 dni)

Migracja formularzy z nested state, customFields, walidacja:

- `AddressCard.tsx` + `AddressForm.tsx`
- `CustomerSelectCard.tsx`
- `ModifyingCard.tsx`
- `FulfillmentModal.tsx`
- `Variant.tsx` + `OptionValueCard.tsx`

### Faza 3: Komponenty SDK (3-5 dni)

Migracja komponentow bazowych z react-ui-devkit:

- `DetailView.tsx` — glowny template (krytyczny)
- `EntityCustomFields.tsx` — dynamiczne custom fields

To jest najwrazliwsze miejsce — DetailView jest uzywany przez pluginy.

### Faza 4: Usuniecie useGFFLP + cleanup (1-2 dni)

- Pelne usuniecie `useGFFLP`, `useFFLP`, `useGLFFP`, `GFFLPFormField` z calego monorepo
- Usuniecie eksportow z `src/hooks/index.ts` i `src/index.ts`
- Aktualizacja dokumentacji SDK z nowym API
- Walidacja: `rg "useGFFLP|useFFLP|useGLFFP|GFFLPFormField" --type ts` = 0 wynikow

## Strategia migracji

### Podejscie: strangler fig pattern + hard-cut removal

1. Nowy `useDeenruvForm` dziala obok `useGFFLP` w trakcie migracji
2. Kazdy formularz migrowany osobno w izolowanym PR
3. `useGFFLP` pozostaje dostepny w trakcie trwania migracji
4. Po migracji wszystkich uzyc (wewnetrznych + pluginowych) — natychmiastowe pelne usuniecie
5. Brak okresu deprecation — stary kod usuwany w tym samym release train co ostatnia migracja

### Mapowanie API

```
useGFFLP                          useDeenruvForm
-------                           --------------
state[field].value          ->    watch(field) / getValues(field)
state[field].errors         ->    formState.errors[field]
setField(field, value)      ->    setValue(field, value)
setState(values)            ->    reset(values)
checkIfAllFieldsAreValid()  ->    trigger() / handleSubmit()
haveValidFields             ->    formState.isValid
clearErrors()               ->    clearErrors()
clearAllForm()              ->    reset()
```

### Backward compatibility

- `useGFFLP` dziala bez zmian w trakcie faz 0-3 (czas trwania migracji)
- `DetailView` po Fazie 3 bedzie uzywal `useDeenruvForm`, ale jego publiczne API (props) nie ulegnie zmianie w sposob breaking
- Po Fazie 4 stare hooki sa CALKOWICIE usuwane — plugin devs musza byc zmigrowani przed ta faza

## Ryzyko i rollback

| Ryzyko | Prawdopodobienstwo | Wplyw | Mitygacja |
|--------|-------------------|-------|-----------|
| Regresja w istniejacych formularzach | Srednie | Wysoki | Kazdy PR z E2E; strangler fig umozliwia revert per-form |
| Plugin devs uzywaja wewnetrznych API useGFFLP | Niskie | Sredni | Migration guide + wsparcie w ramach rollout; pluginy migrated przed removal |
| DetailView migration breaks plugin UIs | Srednie | Wysoki | DetailView props API niezmienione; migracja wewnetrzna |
| Zod schema duplication z backendowymi typami | Niskie | Niski | Wspolne schemas w `@deenruv/common` jesli potrzeba |

**Plan rollback:** Kazda faza jest niezalezna. Jesli faza N powoduje problemy — revert PR-ow tej fazy. `useGFFLP` istnieje do momentu wykonania Fazy 4 (final removal). Po Fazie 4 rollback wymaga revertu calej Fazy 4.

## KPIs

| Metryka | Wartosc docelowa | Sposob pomiaru |
|---------|-----------------|----------------|
| Formularze zmigrowane | 14/14 (100%) | `rg "useGFFLP\|useFFLP\|useGLFFP\|GFFLPFormField"` = 0 uzyc |
| Regresje E2E | 0 nowych failures | CI pipeline / `pnpm test` |
| Bundle size delta | < +5 KB gzip | `pnpm build` + size-limit |
| Czas migracji pluginu | < 30 min per form | Dokumentacja + codemod |
| Developer satisfaction | Brak blokujacych issues | GitHub issues tracking |

## Definition of Done

- [x] `useDeenruvForm` adapter zaimplementowany z testami
- [ ] Wszystkie 14 formularzy zmigrowane
- [ ] `useGFFLP`, `useFFLP`, `useGLFFP`, `GFFLPFormField` calkowicie usuniete z monorepo (zero referencji)
- [ ] Brak eksportow starych hookow w `react-ui-devkit`
- [ ] Dokumentacja SDK zaktualizowana
- [ ] E2E testy przechodzace
- [ ] Build bez ostrzezen TypeScript
- [ ] Bundle size w limicie
- [ ] Migration guide opublikowany w docs
- [ ] Walidacja: `rg "useGFFLP|useFFLP|useGLFFP|GFFLPFormField" --type ts` = 0 wynikow
