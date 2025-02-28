import axios, { AxiosRequestConfig } from 'axios';
import { ENDPOINTS } from '../constants';
import { WFirmaTypes } from './types';
import { WFirmaPluginConfig } from '../types';
import { Logger } from '@deenruv/core';

const API_RETURN_CODES = {
    UNKNOWN: 'Nieznany błąd połączenia',
    OK: 'Operacja zakończona sukcesem',
    'ACCESS DENIED': 'Odmowa dostępu',
    'ACTION NOT FOUND': 'Akcja nie znaleziona',
    AUTH: 'Bład autoryzacji',
    'AUTH FAILED LIMIT WAIT 5 MINUTES': 'Błąd autoryzacji. Przekroczono limit prób. Odczekaj 5 minut',
    'COMPANY ID REQUIRED': 'Wymagane jest podanie identyfikatora firmy',
    'DENIED SCOPE REQUESTED': 'Odmowa dostępu do zasobu',
    ERROR: 'Błąd zapytania',
    FATAL: 'Błąd krytyczny',
    'INPUT ERROR': 'Błąd wejścia',
    'NOT FOUND': 'Nie znaleziono',
    'OUT OF SERVICE': 'Serwis niedostępny',
    'SNAPSHOT LOCK': 'Błąd blokady',
    'TOTAL REQUESTS LIMIT EXCEEDED': 'Przekroczono limit żądań',
    'TOTAL EXECUTION TIME LIMIT EXCEEDED': 'Przekroczono limit czasu wykonania',
};

const buildAxiosHeaders = (authHeaders: WFirmaPluginConfig['authorization']) => {
    const headers: any = {
        'Content-Type': 'application/json',
    };
    Object.entries(authHeaders).forEach(([key, value]) => {
        headers[key] = value;
    });

    return headers;
};

const fetchWithBackoff = async (config: AxiosRequestConfig) => {
    const backoff = [1000, 3000, 5000, 10000];
    let response;
    for (const delay of backoff) {
        try {
            response = await axios(config);
            break;
        } catch (error) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    return response;
};

export const fetchWFirmaAPI =
    (authorization: WFirmaPluginConfig['authorization']) =>
    async <T extends keyof WFirmaTypes>(endpoint: T, data: WFirmaTypes[T]['input'], invoiceID?: string) => {
        const { method, url } = ENDPOINTS[endpoint];
        let correctUrl = invoiceID ? url.replace('{{INVOICE_ID}}', invoiceID) : url;
        const responseType = url.includes('/download') ? 'stream' : 'json';
        try {
            const response = await fetchWithBackoff({
                url: correctUrl,
                method,
                headers: buildAxiosHeaders(authorization),
                data: JSON.stringify(data),
                responseType,
            });
            if (!response || response.statusText != 'OK') throw new Error(API_RETURN_CODES['UNKNOWN']);

            Logger.info(`WFirma API response: ${JSON.stringify(response.data)}`, 'fetchWFirmaAPI');
            return response.data as WFirmaTypes[T]['return'];
        } catch (error) {
            Logger.error(`WFirma API error: ${error}`, 'fetchWFirmaAPI');
            return null;
        }
    };
