import { Shipment } from '../models/index.js';
import { isObject } from './object.js';

// TODO: finish validation of shipment
export const isShipment = (v: unknown): v is Shipment => isObject(v);
