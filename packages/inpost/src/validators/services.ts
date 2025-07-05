import { Service } from '../models/index.js';

const mustBeService = (v: Service): true => {
  switch (v) {
    case 'inpost_locker_allegro':
    case 'inpost_locker_pass_thru':
    case 'inpost_locker_standard':
    case 'inpost_locker_economy':
    case 'inpost_letter_allegro':
    case 'inpost_courier_palette':
    case 'inpost_courier_allegro':
    case 'inpost_courier_standard':
    case 'inpost_courier_express_1000':
    case 'inpost_courier_express_1200':
    case 'inpost_courier_express_1700':
    case 'inpost_courier_c2c':
    case 'inpost_locker_standard_smart':
    case 'inpost_locker_allegro_smart':
      return true;
  }
};

export const isService = (v: unknown): v is Service =>
  !!mustBeService(v as Service);
