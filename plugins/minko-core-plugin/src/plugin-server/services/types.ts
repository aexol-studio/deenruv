import { ShippingMethodQuote } from "@deenruv/common/lib/generated-types";
import {
  Administrator,
  Order,
  Payment,
  Product,
  Translated,
} from "@deenruv/core";

export type PROFormaInputType = {
  order: Order & {
    product: Translated<Product>;
    shippingMethod?: ShippingMethodQuote;
    payments: Payment[];
  };
};

export type PDFProps = {
  user: Administrator | null;
  order: Order & {
    shippingMethod: any;
  };
  options: {
    assets?: {
      id: string;
      orderLineID: string;
      preview: string;
    }[];
    plannedAt: string;
    finalPlannedAt: string;
    note: string;
    color: string;
  };
};

export type PROFormaType = typeof basePROForma;
export const basePROForma = {
  logo: "https://shop.dev.minko.aexol.work/assets/logo__preview.png?preset=medium",
  sellerL: "Sprzedawca",
  seller: {
    name: "Meble Płachciński Michał Płachcińsko",
    address: "Fasty przy ul. Białostockiej 46",
    zip: "15-694",
    city: "Białystok",
  },
  sellerAdditional: {
    NIP: "966-188-04-39",
    TEL: "+48 50750721",
    REGON: "200690056",
  },
  bank: {
    accountL: "Nr konta",
    account: "68 1050 1823 1000 0092 4174 9325",
    bankL: "Bank:",
    bank: "ING Bank Śląski S.A.",
  },

  // vat: 23,
  totalQuantity: 0,
  totalNetto: "0",
  totalVat: "0",
  totalBrutto: "0",

  number: "1/04-2018",
  dateL: "Data wystawienia",
  date: "2018-04-09",
  title: "Proforma",
  totalQ: "łączenie:",
  sumL: "Razem",
  sumFullL: "Razem do zapłaty",
  showTextPrice: true,
  showTextPriceL: "Kwota słownie",
  currencyCode: "PLN",
  bottomL: "Osoba upoważniona do odbioru",
  bottomR: "Osoba upoważniona do wystawienia",
  headings: [
    "Nazwa towaru/usługi",
    "Ilość",
    "Cena jedn.",
    "Cena netto",
    "Rabat",
    "Cena netto po rabacie",
    "VAT",
    "Kwota VAT",
    "Kwota brutto",
  ],
  buyerL: "Nabywca",
  buyer: {
    name: "STOLARZ",
    address: "ul. Wrocławska 12",
    zip: "86-011",
    city: "Wrocław",
  },
  payment: {
    methodL: "Sposób zapłaty",
    method: "przelew",
    // deadlineL: "Termin płatności",
    // deadline: "2018-04-23",
    // deadlineDays: "14 dni",
  },
  products: [
    {
      name: "Regał TALL POCKET",
      quantity: 1,
      unitPrice: "5432.0",
      nettoPrice: "5432.0",
      nettoAfterDiscountPrice: "5432.0",
      vatPrice: "248.96",
      bruttoPrice: "6680.96",
      discount: "0",
      vat: 23,
    },
    {
      name: "Regał TALL POCKET",
      quantity: 1,
      unitPrice: "5432.0",
      nettoPrice: "5432.0",
      nettoAfterDiscountPrice: "5432.0",
      vatPrice: "248.96",
      bruttoPrice: "6680.96",
      discount: "0",
      vat: 23,
    },
    {
      name: "Regał TALL POCKET",
      quantity: 1,
      unitPrice: "5432.0",
      nettoPrice: "5432.0",
      nettoAfterDiscountPrice: "5432.0",
      vatPrice: "248.96",
      bruttoPrice: "6680.96",
      discount: "0",
      vat: 23,
    },
  ],
};
