import { Parcel } from '../models/index.js';
import { isObject } from './object.js';
import { isOptional } from './optional.js';

const mustBeParcel = (v: Parcel): v is Parcel =>
  isOptional(
    (v: unknown): v is Parcel['template'] =>
      v === 'small' || v === 'medium' || v === 'large' || v === 'xlarge',
  )(v.template);
export const isParcel = (v: unknown): v is Parcel =>
  isObject(v) && mustBeParcel(v as Parcel);
