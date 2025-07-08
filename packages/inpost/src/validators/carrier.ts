import { Carrier } from '../models/index.js';

const mustBeCarrier = (v: Carrier): true => {
  switch (v) {
    case 'inpost_locker':
    case 'inpost_letter':
    case 'inpost_courier':
      return true;
  }
};

export const isCarrier = (v: unknown): v is Carrier =>
  !!mustBeCarrier(v as Carrier);
