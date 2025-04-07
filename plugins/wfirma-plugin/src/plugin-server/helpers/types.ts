export type Contractor = {
  id?: string; // Tylko do odczytu Klucz główny
  name?: string; // nazwa pełna
  altname?: string; // nazwa skrócona
  tax_id_type?: "nip" | "vat" | "pesel" | "regon" | "custom" | "none"; // Rodzaj identyfikatora podatkowego. Dopuszczalne wartości nip, vat, pesel, regon, custom, none.
  nip?: string; // Identyfikator podatkowy
  regon?: string; // Identyfikator REGON
  street?: string;
  zip?: string;
  city?: string;
  country?: string;
  diffrent_contact_address?: boolean; // Czy adres kontaktowy różni się od adresu głównego. 1 - TAK, 0 - NIE
  contact_name?: string; // Imię i nazwisko osoby kontaktowej
  contact_street?: string; // Adres osoby kontaktowej
  contact_zip?: string; // Kod pocztowy osoby kontaktowej
  contact_city?: string; // Miasto osoby kontaktowej
  contact_country?: string; // Kraj osoby kontaktowej
  contact_person?: string; // Osoba kontaktowa
  phone?: string; // Telefon
  skype?: string; // Skype
  fax?: string; // Fax
  email?: string; // Adres e-mail
  url?: string; // Strona www
  description?: string; // Opis kontrahenta
  buyer?: boolean; // Wartość 1 dla oznaczenia, że kontrahent jest nabywcą
  seller?: boolean; // Wartość 1 dla oznaczenia, że kontrahent jest dostawcą
  account_number?: string; // Numer rachunku bankowego kontrahenta
  discount_percent?: string; // Domyślna wartość rabatu w procentach, która będzie stosowana da kontrahenta. Dla rabatu 50% należy wprowadzić wartość 50.
  payment_days?: string; // Domyślny termin płatności
  payment_method?: string; // Domyślna metoda płatności
  remind?: boolean; // W przypadku wartości 1 i włączonych automatycznych powiadomieniach o niezaplaconych fakturach, kontrahent otrzyma monit w przypadku braku zapłaty za fakturę.
  hash?: string; // Wartość hasha zapezpieczającego panel klienta (dostępnego przez odsyłacz http://wfirma.pl/invoice_externals/find/HASH).
  notes?: string; // Liczba notatek powiązanych z kontrahentem
  documents?: string; // Liczba dokumentów powiązanych z kontrahentem
  tags?: string; // Znaczniki powiązane z kontrahentem w formacie (ID ZNACZNIKA X),(ID ZNACZNIKA Y)...
};

type InvoiceContent = {
  id?: string; // Tylko do odczytu Klucz główny
  name: string; // Odczyt i zapis Nazwa towaru lub usługi
  classification?: string; // Odczyt i zapis PKWiU
  unit?: string; // Odczyt i zapis Jednostka
  count: string; // Odczyt i zapis Ilość
  price: string; // Odczyt i zapis Cena netto lub brutto w zależności od wartości w polu price_type faktury
  discount?: boolean; // Odczyt i zapis W przypadku potrzeby zastosowania rabatu należy ustawić wartość 1
  discount_percent?: string; // Odczyt i zapis Procent rabatu dla 50% należy wprowadzić wartość 50
  netto?: string; // Tylko do odczytu Wartość netto pozycji
  brutto?: string; // Tylko do odczytu Wartość brutto pozycji
  vat?: string; // Odczyt i zapis Stawka VAT - pole dopuszczalne tylko w przypadku polskich stawek VAT (23, WDT itp). W przypadku stawek MOSS należy obligatoryjnie stosować strukturę <vat_code></id>Tutaj id stawki</id></vat_code>. Lista stawek dostępna jest w akcji /vat_codes/find.
  lumpcode?: number; // Odczyt i zapis Stawka ryczałtu - pole obowiązkowe w przypadku prowadzenia Ewidencji Przychodów
};

// interface InvoiceContent {
//   id: string;
//   name: string;
//   classification: string;
//   count: string;
//   unit_count: string;
//   price: string;
//   price_modified: string;
//   discount: string;
//   discount_percent: string;
//   netto: string;
//   brutto: string;
//   lumpcode: string;
//   final_account: string;
//   gtu: string;
//   created: string;
//   modified: string;
//   unit: string;
//   good: {
//     id: number;
//   };
//   invoice: {
//     id: string;
//   };
//   vat_code: {
//     id: number;
//   };
//   fixed_asset: {
//     id: number;
//   };
//   equipment: {
//     id: number;
//   };
//   warehouse_document_content: {
//     id: number;
//   };
//   parent: {
//     id: number;
//   };
//   contact_log: {
//     id: number;
//   };
// }

type CompanyDetails = {
  id: string;
  name: string;
  altname: string;
  nip: string;
  bdo: string;
  street: string;
  building_number: string;
  flat_number: string;
  zip: string;
  post: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  bank_name: string;
  bank_account: string;
  bank_swift: string;
  bank_address: string;
  created: string;
  modified: string;
};

export type InvoiceType =
  /// prawdopodobnie tylko te typy faktur są używane
  | "normal" //faktura VAT
  | "margin" //faktura marża
  | "proforma" //faktura proforma
  | "offer" //oferta
  | "receipt_normal" //paragon niefiskalny
  | "receipt_fiscal_normal" //paragon fiskalny

  ///
  | "income_normal"
  //no VAT (prawdopodonie nie do użycia, gdyż sprzedwca jest platnikiem VAT)
  | "bill"
  | "proforma_bill"
  | "offer_bill"
  | "receipt_bill"
  | "receipt_fiscal_bill"
  | "income_bill";

export type AddInvoiceInput = {
  invoices: {
    invoice: {
      type: string;
      type_of_sale: "WSTO_EE";
      contractor: Contractor;
      invoicecontents: Array<{ invoicecontent: InvoiceContent }>;
      price_type: "netto" | "brutto";
    };
  }[];
};

///

interface VatContent {
  id: string;
  object_name: string;
  object_id: string;
  netto: string;
  tax: string;
  brutto: string;
  created: string;
  vat_code: {
    id: number;
  };
}

interface ContractorDetail {
  id: string;
  tax_id_type: string;
  name: string;
  nip: string;
  street: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  account_number: string;
  affiliated_entity: string;
  discount_percent: string;
  empty: string;
  simple: string;
  created: string;
  modified: string;
}

interface CompanyDetail {
  id: string;
  name: string;
  altname: string;
  nip: string;
  bdo: string;
  street: string;
  building_number: string;
  flat_number: string;
  zip: string;
  post: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  bank_name: string;
  bank_account: string;
  bank_swift: string;
  bank_address: string;
  created: string;
  modified: string;
}

export interface Invoice {
  id: string;
  interest_status: string;
  warehouse_type: string;
  paymentmethod: string;
  paymentdate: string;
  paymentstate: string;
  disposaldate_format: string;
  disposaldate_empty: string;
  disposaldate: string;
  date: string;
  total: string;
  total_composed: string;
  alreadypaid: string;
  alreadypaid_initial: string;
  remaining: string;
  number: string;
  day: string;
  month: string;
  year: string;
  day_year: string;
  fullnumber: string;
  semitemplatenumber: string;
  type: string;
  correction_type: string;
  register_vat_book: string;
  register_tax_book: string;
  simplified_invoice: string;
  corrections: string;
  formal_data_corrections: string;
  formal_data_corrections_note: string;
  currency: string;
  currency_exchange: string;
  currency_label: string;
  currency_date: string;
  price_currency_exchange: string;
  type_of_sale: string;
  auto_send_postivo: string;
  auto_send: string;
  auto_sms: string;
  account_type: string;
  account_date: string;
  final_account_invoice_contents: string;
  template: string;
  description: string;
  header: string;
  footer: string;
  user_name: string;
  schema: string;
  schema_vat_cashbox: string;
  schema_vat_cashbox_limit: string;
  schema_vat_cashbox_small_taxpayer: string;
  schema_bill: string;
  schema_receipt_book: string;
  schema_cancelled: string;
  margin_tax_schema: string;
  margin_description_schema: string;
  register_description: string;
  income_lumpcode: string;
  income_correction: string;
  bill_legal_description: string;
  netto: string;
  netto_service: string;
  netto_good: string;
  tax: string;
  receipt_fiscal_printed: string;
  receipt_fiscal_fiscalization: string;
  ledger_auto: string;
  hash: string;
  id_external: string;
  client_accept: string;
  tags: string;
  notes: string;
  documents: string;
  created: string;
  modified: string;
  price_type: string;
  series: {
    id: number;
  };
  contractor: {
    id: string;
    altname: string;
    phone: string;
    email: string;
  };
  contractor_detail: ContractorDetail;
  contractor_receiver: {
    id: number;
  };
  contractor_detail_receiver: {
    id: number;
  };
  company_detail: CompanyDetail;
  parent: {
    id: number;
  };
  order: {
    id: number;
  };
  email: {
    id: number;
  };
  email2: {
    id: number;
  };
  invoice_pef_document: {
    id: number;
  };
  expense: {
    id: number;
  };
  ledger_operation_schema: {
    id: number;
  };
  company_account: {
    id: number;
  };
  payment_cashbox: {
    id: number;
  };
  translation_language: {
    id: number;
  };
  postivo_shipment: {
    id: number;
  };
  postivo_shipment_content: {
    id: number;
  };
  warehouse: {
    id: number;
  };
  good_price_group: {
    id: number;
  };
  vat_contents: {
    [key: string]: VatContent;
  };
  invoicecontents: {
    [key: string]: InvoiceContent;
  };
}

// interface Contractor {
//   id: string;
//   tax_id_type: string;
//   name: string;
//   altname: string;
//   nip: string;
//   regon: string;
//   street: string;
//   zip: string;
//   city: string;
//   country: string;
//   different_contact_address: string;
//   contact_name: string;
//   contact_street: string;
//   contact_zip: string;
//   contact_city: string;
//   contact_country: string;
//   contact_person: string;
//   phone: string;
//   skype: string;
//   fax: string;
//   email: string;
//   url: string;
//   description: string;
//   buyer: string;
//   seller: string;
//   discount_percent: string;
//   payment_days: string;
//   payment_method: string;
//   account_number: string;
//   affiliated_entity: string;
//   remind: string;
//   hash: string;
//   avatar_filename: string;
//   source: string;
//   ledger_analytic_number: string;
//   tags: string;
//   notes: string;
//   documents: string;
//   visibility: string;
//   created: string;
//   modified: string;
//   reference_company: {
//       id: number;
//   };
//   translation_language: {
//       id: number;
//   };
//   company_account: {
//       id: number;
//   };
//   good_price_group: {
//       id: number;
//   };
//   vat_code: {
//       id: number;
//   };
//   invoice_description: {
//       id: number;
//   };
//   shop_buyer: {
//       id: number;
//   };
//   contractor_account: {
//       id: string;
//       number: string;
//       is_main_number: string;
//       is_from_transaction: string;
//       created: string;
//       modified: string;
//       contractor: {
//           id: number;
//       };
//   };
// }

type FindInvoiceInput = {
  invoices: {
    parameters: {
      limit: number;
      page: number;
      fields: {
        field: keyof Invoice;
      }[];
      conditions: {
        condition: {
          field: keyof Invoice;
          operator:
            | "eq"
            | "ne"
            | "gt"
            | "lt"
            | "ge"
            | "le"
            | "like"
            | "not like"
            | "in"
            | "is null"
            | "is not null";
          value: string;
        };
      }[];
    };
  };
};

export type FindContractorInput = {
  contractors: {
    parameters: {
      limit: number;
      page: number;
      fields: {
        field: keyof Contractor;
      }[];
      conditions: {
        condition: {
          field: keyof Contractor;
          operator:
            | "eq"
            | "ne"
            | "gt"
            | "lt"
            | "ge"
            | "le"
            | "like"
            | "not like"
            | "in"
            | "is null"
            | "is not null";
          value: string;
        };
      }[];
    };
  };
};

export type AddContractorInput = {
  contractors: { contractor: Contractor }[];
};

export type DownloadInvoiceInput = {
  invoices: {
    parameters: {
      page: string;
      // address: number;
      // leaflet: number;
      // payment_cashbox_documents: number;
      // warehouse_documents: number;
    };
  };
};

type Contractors = Record<string, { contractor: Contractor }>;
type Invoices = Record<string, { invoice: Invoice }>;

export type WFirmaTypes = {
  "add-invoice": { input: AddInvoiceInput; return: { invoices: Invoices } };
  "find-invoice": { input: FindInvoiceInput; return: {} };
  "get-invoice": { input: { id: string }; return: {} };
  "download-invoice": { input: DownloadInvoiceInput; return: any };
  "find-contractor": {
    input: FindContractorInput;
    return: { contractors: Contractors };
  };
  "add-contractor": {
    input: AddContractorInput;
    return: { contractors: Contractors };
  };
};
