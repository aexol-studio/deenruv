import { createContext } from 'react';
import { NotificationStore } from './types.js';

export const NotificationContext = createContext<NotificationStore | null>(null);
