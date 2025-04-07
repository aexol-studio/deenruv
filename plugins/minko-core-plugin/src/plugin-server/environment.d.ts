export {};

declare module "@deenruv/core" {
  interface CustomProductFields {
    discountBy: number;
  }
  interface CustomOrderLineFields {
    discountBy: number;
  }
}
