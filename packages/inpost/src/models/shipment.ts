import { Person } from "./person.js";
import { Parcel } from "./parcel.js";
import { Money } from "./money.js";
import { Service } from "./service.js";
import { Offer } from "./offer.js";
import { Transaction } from "./transaction.js";

export interface Shipment {
  id?: number;
  receiver: Person;
  sender?: Person;
  parcels: Parcel[];
  custom_attributes?: {
    sending_method?:
      | "parcel_locker"
      | "dispatch_order"
      | "branch"
      | "pop"
      | "any_point"
      | "courier_pok";
    target_point?: string;
    dropoff_point?: string;
    dispatch_order_id?: string;
  };
  cod?: Money;
  insurance?: Money;
  reference?: string;
  is_return?: boolean;
  service: Service;
  additional_services?: ("sms" | "email" | "saturday")[];
  external_customer_id?: string;
  only_choice_of_offer?: boolean;
  mpk?: string;
  comments?: string;
  status?: "created" | "offer_selected";
  offers?: Offer[];
  selected_offer?: Offer;
  transactions?: Transaction[];
}
