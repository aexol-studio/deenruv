// eslint-disable-next-line no-restricted-imports
import { useTranslation as useI18NTranslation } from "react-i18next";

type KnownEntityType =
  | "Product"
  | "product"
  | "Products"
  | "products"
  | "Collection"
  | "collection"
  | "Collections"
  | "collections"
  | "Variant"
  | "variant"
  | "Variants"
  | "variants"
  | "Order"
  | "order"
  | "Orders"
  | "orders"
  | "Customer"
  | "customer"
  | "Customers"
  | "customers";

type EntityType = KnownEntityType | (string & {});
type CountType = number | "single" | "many" | "one";

export const useTranslation = (ns: string | string[] = "common") => {
  const i18n = useI18NTranslation(ns, {
    i18n: window.__DEENRUV_SETTINGS__.i18n,
  });

  function tEntity(
    value: string,
    entity: EntityType,
    _count: CountType = "one"
  ) {
    let count = 1;
    if (typeof _count === "number") {
      count = _count;
    } else if (_count === "single" || _count === "one") {
      count = 1;
    } else if (_count === "many") {
      count = 2;
    }
    return i18n.t(value, {
      count,
      value: i18n.t(`entity.${entity}`, { count }).toLowerCase(),
    });
  }

  return { t: i18n.t, i18n: i18n.i18n, tEntity };
};
