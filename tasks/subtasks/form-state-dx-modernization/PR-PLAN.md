# PR Plan: Migracja useGFFLP -> useDeenruvForm

11 PR-sized taskow z acceptance criteria i komendami walidacji.
Strategia: hard-cut removal — brak okresu deprecation. Stare hooki usuwane natychmiast po zakonczeniu migracji.

---

## PR-01: Infrastruktura — useDeenruvForm adapter

**Scope:** `packages/react-ui-devkit`

**Zmiany:**
- Dodaj `react-hook-form`, `@hookform/resolvers`, `zod` do `package.json`
- Stworz `src/hooks/useDeenruvForm.ts` — adapter RHF + zodResolver
- Stworz `src/hooks/createFormSchema.ts` — helper do budowy Zod schemas
- Stworz `src/components/core/DeenruvForm.tsx` — wrapper `<Form>` z RHF context
- Eksportuj z `src/hooks/index.ts` i `src/index.ts`
- Testy unit: `src/hooks/useDeenruvForm.spec.ts`

**Acceptance criteria:**
- [ ] `useDeenruvForm({ schema, defaultValues })` zwraca `UseFormReturn`
- [ ] `<DeenruvForm>` propaguje RHF context do children
- [ ] Testy pokrywaja: init, validation, setField, reset, errors
- [ ] Brak zmian w istniejacym kodzie `useGFFLP`
- [ ] Build przechodzi

**Walidacja:**
```bash
cd packages/react-ui-devkit && pnpm build
cd packages/react-ui-devkit && pnpm test
pnpm check-imports
```

---

## PR-02: Pilot — AddOptionGroupDialog (admin-dashboard)

**Scope:** `packages/admin-dashboard/src/pages/products/_components/AddOptionGroupDialog.tsx`

**Zmiany:**
- Stworz `AddOptionGroupDialog.schema.ts` z Zod schema
- Zamien `useGFFLP` na `useDeenruvForm` w `AddOptionGroupDialog.tsx`
- Uzyj `<DeenruvForm>` + `<FormField>` zamiast manualnego `setField`

**Acceptance criteria:**
- [ ] Dialog tworzy option group poprawnie
- [ ] Walidacja Zod dziala (required code, translations)
- [ ] Error messages wyswietlaja sie w UI
- [ ] Zero uzyc `useGFFLP` w tym pliku

**Walidacja:**
```bash
cd packages/admin-dashboard && npx tsc --noEmit
rg useGFFLP packages/admin-dashboard/src/pages/products/_components/AddOptionGroupDialog.tsx
# oczekiwany wynik: brak wynikow
```

---

## PR-03: Pilot — AddFacetValueDialog + SurchargeCard

**Scope:** `packages/admin-dashboard`

**Zmiany:**
- Migruj `pages/facets/_components/AddFacetValueDialog.tsx`
- Migruj `pages/orders/_components/SurchargeCard.tsx`
- Stworz odpowiednie Zod schemas

**Acceptance criteria:**
- [ ] Oba formularze dzialaja poprawnie
- [ ] Walidacja Zod (required fields, typy numeryczne dla surcharge)
- [ ] Zero uzyc `useGFFLP` w zmienionych plikach

**Walidacja:**
```bash
cd packages/admin-dashboard && npx tsc --noEmit
rg useGFFLP packages/admin-dashboard/src/pages/facets/_components/AddFacetValueDialog.tsx
rg useGFFLP packages/admin-dashboard/src/pages/orders/_components/SurchargeCard.tsx
```

---

## PR-04: Pilot — TestCard (shipping-methods)

**Scope:** `packages/admin-dashboard/src/pages/shipping-methods/_components/TestCard.tsx`

**Zmiany:**
- Migruj `TestCard.tsx` na `useDeenruvForm`
- Stworz schema Zod

**Acceptance criteria:**
- [ ] Test shipping method dziala poprawnie
- [ ] Walidacja pol (address, weight, etc.)
- [ ] Zero uzyc `useGFFLP` w pliku

**Walidacja:**
```bash
cd packages/admin-dashboard && npx tsc --noEmit
rg useGFFLP packages/admin-dashboard/src/pages/shipping-methods/
```

---

## PR-05: Formularze adresowe — AddressCard + AddressForm

**Scope:** `packages/admin-dashboard`

**Zmiany:**
- Migruj `pages/orders/_components/AddressCard.tsx`
- Migruj `pages/customers/_components/AddressForm.tsx`
- Wspolna schema adresowa (reuse miedzy komponentami)

**Acceptance criteria:**
- [ ] Edycja adresu zamowienia dziala
- [ ] Formularz adresu klienta dziala
- [ ] Wspolna `addressSchema` uzywana w obu miejscach
- [ ] Nested fields (country, province) obslugiwane poprawnie

**Walidacja:**
```bash
cd packages/admin-dashboard && npx tsc --noEmit
rg useGFFLP packages/admin-dashboard/src/pages/orders/_components/AddressCard.tsx
rg useGFFLP packages/admin-dashboard/src/pages/customers/_components/AddressForm.tsx
```

---

## PR-06: Formularze zamowien — CustomerSelectCard + ModifyingCard + FulfillmentModal

**Scope:** `packages/admin-dashboard/src/pages/orders/_components/`

**Zmiany:**
- Migruj `CustomerSelectCard.tsx`
- Migruj `ModifyingCard.tsx`
- Migruj `FulfillmentModal.tsx`

**Acceptance criteria:**
- [ ] Wyszukiwanie klienta z walidacja
- [ ] Modyfikacja zamowienia zachowuje zachowanie
- [ ] Fulfillment modal z dynamicznymi polami (quantities)
- [ ] `checkIfAllFieldsAreValid` zamienione na `trigger()` lub `handleSubmit()`

**Walidacja:**
```bash
cd packages/admin-dashboard && npx tsc --noEmit
rg useGFFLP packages/admin-dashboard/src/pages/orders/
# oczekiwany wynik: brak
```

---

## PR-07: Formularze produktow — Variant + OptionValueCard

**Scope:** `packages/admin-dashboard/src/pages/products/_components/`

**Zmiany:**
- Migruj `Variant.tsx`
- Migruj `OptionValueCard.tsx`
- Obsluga customFields via `useDeenruvForm`

**Acceptance criteria:**
- [ ] Edycja wariantu produktu dziala (cena, SKU, stock)
- [ ] Edycja wartosci opcji dziala (code, translations, customFields)
- [ ] CustomFields poprawnie integrowane z RHF

**Walidacja:**
```bash
cd packages/admin-dashboard && npx tsc --noEmit
rg useGFFLP packages/admin-dashboard/src/pages/products/
# oczekiwany wynik: brak (po PR-02 i PR-07)
```

---

## PR-08: Migracja SDK — EntityCustomFields

**Scope:** `packages/react-ui-devkit/src/components/core/EntityCustomFields.tsx`

**Zmiany:**
- Zamien wewnetrzne uzycie `useGFFLP` na `useDeenruvForm`
- Zachowaj publiczne props API bez zmian (backward compat)
- Dynamiczne schema generation z custom field definitions

**Acceptance criteria:**
- [ ] Custom fields renderuja sie poprawnie
- [ ] Walidacja custom fields dziala
- [ ] Props API EntityCustomFields BEZ breaking changes
- [ ] Pluginy uzywajace EntityCustomFields dzialaja bez zmian

**Walidacja:**
```bash
cd packages/react-ui-devkit && pnpm build
cd packages/react-ui-devkit && pnpm test
```

---

## PR-09: Migracja SDK — DetailView

**Scope:** `packages/react-ui-devkit/src/components/templates/DetailView/DetailView.tsx`

**Zmiany:**
- Zamien wewnetrzne uzycie `useGFFLP` na `useDeenruvForm`
- Zachowaj props API `DetailViewFormProps` (backward compat)
- Wewnetrzne mapowanie: stare config -> Zod schema

**Acceptance criteria:**
- [ ] DetailView renderuje poprawnie z nowymi forms
- [ ] `onSubmitted` callback otrzymuje dane w zgodnym formacie
- [ ] `onDeleted` callback dziala
- [ ] Istniejace pluginy uzywajace DetailView NIE wymagaja zmian
- [ ] Tab navigation zachowana

**Walidacja:**
```bash
cd packages/react-ui-devkit && pnpm build
cd packages/admin-dashboard && npx tsc --noEmit
# Manual: sprawdz 2-3 strony Detail w admin UI
```

---

## PR-10: Migration guide + aktualizacja dokumentacji

**Scope:** `packages/react-ui-devkit`, `apps/docs`

**Zmiany:**
- Stworz `MIGRATION.md` w `packages/react-ui-devkit/` z przykladami before/after
- Zaktualizuj `README.md` z nowym API (`useDeenruvForm`)
- Zaktualizuj strone `react-ui-devkit-form-roadmap.mdx` w docs
- Dodaj sekcje "Migration complete" / status update
- Zaktualizuj przyklady kodu w docs

**Acceptance criteria:**
- [ ] Migration guide z przykladami before/after dla kazdego patternu
- [ ] Docs page odzwierciedla aktualny stan
- [ ] Przyklady uzywaja `useDeenruvForm`
- [ ] Build docs przechodzi

**Walidacja:**
```bash
cd packages/react-ui-devkit && pnpm build
cd apps/docs && pnpm build
```

---

## PR-11: Final removal — pelne usuniecie useGFFLP + walidacja zero referencji

**Scope:** `packages/react-ui-devkit`

**Zmiany:**
- Usun `src/hooks/useGFFLP.ts` (cala definicja hooka)
- Usun eksporty `useGFFLP`, `useFFLP`, `useGLFFP` z `src/hooks/index.ts` i `src/index.ts`
- Usun typ `GFFLPFormField`
- Usun `setInArrayBy` helper (jesli nieuzywany poza useGFFLP)
- Zaktualizuj `DetailView` typy (usun stare referencje)
- BREAKING CHANGE w changelog

**Acceptance criteria:**
- [ ] `rg "useGFFLP|useFFLP|useGLFFP|GFFLPFormField" --type ts` = 0 wynikow w calym monorepo
- [ ] Brak eksportow starych hookow w `react-ui-devkit`
- [ ] Wszystkie testy przechodzace
- [ ] Build calego monorepo przechodzi
- [ ] BREAKING CHANGE oznaczony w commit message

**Walidacja:**
```bash
pnpm build
pnpm test
rg "useGFFLP|useGLFFP|useFFLP|GFFLPFormField" --type ts
# oczekiwany wynik: brak
pnpm check-imports
```

---

## Podsumowanie

| PR | Faza | Pliki | Estymacja |
|----|------|-------|-----------|
| PR-01 | 0 — Infra | 5 nowych + 2 edycje | 1-2 dni |
| PR-02 | 1 — Pilot | 2 pliki | 0.5 dnia |
| PR-03 | 1 — Pilot | 4 pliki | 0.5 dnia |
| PR-04 | 1 — Pilot | 2 pliki | 0.5 dnia |
| PR-05 | 2 — Zlozony | 4 pliki | 1 dzien |
| PR-06 | 2 — Zlozony | 3 pliki | 1-2 dni |
| PR-07 | 2 — Zlozony | 4 pliki | 1 dzien |
| PR-08 | 3 — SDK | 1 plik + testy | 1 dzien |
| PR-09 | 3 — SDK | 1 plik + testy | 2 dni |
| PR-10 | 4 — Docs + Guide | 4 pliki | 0.5 dnia |
| PR-11 | 4 — Final Removal | 5 plikow | 0.5 dnia |

**Laczna estymacja: 9-14 dni roboczych**

**Strategia:** Hard-cut removal. PR-11 (final removal) wykonywany w tym samym release train co PR-09/PR-10. Brak okresu deprecation — po migracji wszystkich uzyc nastepuje natychmiastowe usuniecie starych hookow.
