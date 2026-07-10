# Backend Roles And Permissions

## Short Answer

You can create custom backend roles, but you cannot assign arbitrary permission strings through the Admin API.

A role can have an arbitrary `code`, `description`, selected `channelIds`, and a list of permissions, but each permission must be a valid value from the generated GraphQL `Permission` enum and must be assignable by the backend.

In the current `apps/server/dev-config.ts`, `authOptions.customPermissions` is empty, and no plugin-level custom permission definitions were found in `plugins/`. The list below is therefore the full permission list for the current base schema.

## Role Rules In Backend

Sources:

- `packages/core/src/entity/role/role.entity.ts`
- `packages/core/src/service/services/role.service.ts`
- `packages/core/src/api/resolvers/admin/role.resolver.ts`
- `packages/core/src/common/constants.ts`
- `packages/common/src/generated-types.ts`

Important rules:

- `Role` stores `code`, `description`, `permissions`, and assigned `channels`.
- `createRole` requires `Permission.CreateAdministrator`.
- `updateRole` requires `Permission.UpdateAdministrator`.
- `deleteRole` and `deleteRoles` require `Permission.DeleteAdministrator`.
- The active admin can only grant permissions they already have on the target channels.
- `Authenticated` is automatically included when a role is created or updated.
- `SuperAdmin` is rejected by normal `createRole`/`updateRole`, even though it exists in the enum.
- `Owner` and `Public` are internal/non-assignable and cannot be assigned to normal roles.
- Built-in `super-admin` and `customer` roles cannot be modified or deleted.
- Custom permissions are possible only through code/config, via `authOptions.customPermissions` using `PermissionDefinition` or `CrudPermissionDefinition`; they are not created dynamically from the admin UI.
- When custom permissions are removed from config, startup cleanup removes invalid permissions from existing roles.

## Special Permissions

| Permission | Assignable to normal roles through API | Meaning |
| --- | --- | --- |
| `Authenticated` | Yes, auto-added | User is logged in. |
| `SuperAdmin` | No | Unrestricted access. Reserved for the built-in super-admin role. |
| `Owner` | No | Resolver-level owner-only access. Must be enforced by resolver code. |
| `Public` | No | Operation is accessible without authentication. |

## Standalone Permission

| Permission | Meaning |
| --- | --- |
| `UpdateGlobalSettings` | Grants permission to update `GlobalSettings`. |

## Aggregate CRUD Permissions

These are broader permissions that cover multiple resources.

| Area | Create | Read | Update | Delete | Covers |
| --- | --- | --- | --- | --- | --- |
| Catalog | `CreateCatalog` | `ReadCatalog` | `UpdateCatalog` | `DeleteCatalog` | Products, facets, assets, collections. |
| Settings | `CreateSettings` | `ReadSettings` | `UpdateSettings` | `DeleteSettings` | Payment methods, shipping methods, tax categories, tax rates, zones, countries, system, global settings. |

## Entity CRUD Permissions

| Entity | Create | Read | Update | Delete |
| --- | --- | --- | --- | --- |
| Administrator | `CreateAdministrator` | `ReadAdministrator` | `UpdateAdministrator` | `DeleteAdministrator` |
| Asset | `CreateAsset` | `ReadAsset` | `UpdateAsset` | `DeleteAsset` |
| Channel | `CreateChannel` | `ReadChannel` | `UpdateChannel` | `DeleteChannel` |
| Collection | `CreateCollection` | `ReadCollection` | `UpdateCollection` | `DeleteCollection` |
| Country | `CreateCountry` | `ReadCountry` | `UpdateCountry` | `DeleteCountry` |
| Customer | `CreateCustomer` | `ReadCustomer` | `UpdateCustomer` | `DeleteCustomer` |
| CustomerGroup | `CreateCustomerGroup` | `ReadCustomerGroup` | `UpdateCustomerGroup` | `DeleteCustomerGroup` |
| Facet | `CreateFacet` | `ReadFacet` | `UpdateFacet` | `DeleteFacet` |
| Order | `CreateOrder` | `ReadOrder` | `UpdateOrder` | `DeleteOrder` |
| PaymentMethod | `CreatePaymentMethod` | `ReadPaymentMethod` | `UpdatePaymentMethod` | `DeletePaymentMethod` |
| Product | `CreateProduct` | `ReadProduct` | `UpdateProduct` | `DeleteProduct` |
| Promotion | `CreatePromotion` | `ReadPromotion` | `UpdatePromotion` | `DeletePromotion` |
| Seller | `CreateSeller` | `ReadSeller` | `UpdateSeller` | `DeleteSeller` |
| ShippingMethod | `CreateShippingMethod` | `ReadShippingMethod` | `UpdateShippingMethod` | `DeleteShippingMethod` |
| StockLocation | `CreateStockLocation` | `ReadStockLocation` | `UpdateStockLocation` | `DeleteStockLocation` |
| System | `CreateSystem` | `ReadSystem` | `UpdateSystem` | `DeleteSystem` |
| Tag | `CreateTag` | `ReadTag` | `UpdateTag` | `DeleteTag` |
| TaxCategory | `CreateTaxCategory` | `ReadTaxCategory` | `UpdateTaxCategory` | `DeleteTaxCategory` |
| TaxRate | `CreateTaxRate` | `ReadTaxRate` | `UpdateTaxRate` | `DeleteTaxRate` |
| Zone | `CreateZone` | `ReadZone` | `UpdateZone` | `DeleteZone` |

## Full Permission Enum

This is the exhaustive list from `packages/common/src/generated-types.ts` for the current base schema.

```ts
Authenticated
CreateAdministrator
CreateAsset
CreateCatalog
CreateChannel
CreateCollection
CreateCountry
CreateCustomer
CreateCustomerGroup
CreateFacet
CreateOrder
CreatePaymentMethod
CreateProduct
CreatePromotion
CreateSeller
CreateSettings
CreateShippingMethod
CreateStockLocation
CreateSystem
CreateTag
CreateTaxCategory
CreateTaxRate
CreateZone
DeleteAdministrator
DeleteAsset
DeleteCatalog
DeleteChannel
DeleteCollection
DeleteCountry
DeleteCustomer
DeleteCustomerGroup
DeleteFacet
DeleteOrder
DeletePaymentMethod
DeleteProduct
DeletePromotion
DeleteSeller
DeleteSettings
DeleteShippingMethod
DeleteStockLocation
DeleteSystem
DeleteTag
DeleteTaxCategory
DeleteTaxRate
DeleteZone
Owner
Public
ReadAdministrator
ReadAsset
ReadCatalog
ReadChannel
ReadCollection
ReadCountry
ReadCustomer
ReadCustomerGroup
ReadFacet
ReadOrder
ReadPaymentMethod
ReadProduct
ReadPromotion
ReadSeller
ReadSettings
ReadShippingMethod
ReadStockLocation
ReadSystem
ReadTag
ReadTaxCategory
ReadTaxRate
ReadZone
SuperAdmin
UpdateAdministrator
UpdateAsset
UpdateCatalog
UpdateChannel
UpdateCollection
UpdateCountry
UpdateCustomer
UpdateCustomerGroup
UpdateFacet
UpdateGlobalSettings
UpdateOrder
UpdatePaymentMethod
UpdateProduct
UpdatePromotion
UpdateSeller
UpdateSettings
UpdateShippingMethod
UpdateStockLocation
UpdateSystem
UpdateTag
UpdateTaxCategory
UpdateTaxRate
UpdateZone
```

## Permissions Usually Relevant For Mini Admin

The exact set depends on the first mini-admin persona, but likely candidates are:

| Mini-admin scope | Likely permissions |
| --- | --- |
| Order support, read-only | `ReadOrder`, `ReadCustomer`, possibly `ReadProduct` or `ReadCatalog` |
| Order support, edit order state | `ReadOrder`, `UpdateOrder`, `ReadCustomer`, possibly `ReadProduct` or `ReadCatalog` |
| Customer support | `ReadCustomer`, `UpdateCustomer`, `ReadCustomerGroup`, `ReadOrder` |
| Catalog editor | `ReadCatalog`, `CreateProduct`, `ReadProduct`, `UpdateProduct`, `ReadAsset`, `CreateAsset`, `UpdateAsset`, `ReadCollection`, `ReadFacet` |
| Merchant/seller admin | `ReadSeller`, `UpdateSeller`, plus the specific product/order permissions required by the merchant flow |
| Warehouse/fulfillment | `ReadOrder`, `UpdateOrder`, `ReadStockLocation`, `UpdateStockLocation`, possibly `ReadShippingMethod` |

The UI should still hide unavailable screens/actions, but the backend role remains the final authority.
