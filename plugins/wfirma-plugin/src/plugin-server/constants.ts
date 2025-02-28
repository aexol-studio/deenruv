import { WFirmaTypes } from './helpers/types';
export const PLUGIN_INIT_OPTIONS = Symbol('WFIRMA_PLUGIN_OPTIONS');

export const HOST = 'https://api2.wfirma.pl';
export const COMPANY_ID = 'Aleksander';
export const DATA_FORMAT = 'json';
export const QUERY_PARAMS = `?outputFormat=${DATA_FORMAT}&inputFormat=${DATA_FORMAT}`;
// export const QUERY_PARAMS = `?outputFormat=${DATA_FORMAT}&inputFormat=${DATA_FORMAT}&company_id=${COMPANY_ID}`;

type ENDPOINTS = Record<keyof WFirmaTypes, { method: string; url: string }>;

export const ENDPOINTS: ENDPOINTS = {
    'add-invoice': { method: 'POST', url: `${HOST}/invoices/add${QUERY_PARAMS}` },
    'find-invoice': {
        method: 'GET',
        url: `${HOST}/invoices/find${QUERY_PARAMS}`,
    },
    'get-invoice': {
        method: 'GET',
        url: `${HOST}/invoices/get/{{INVOICE_ID}}${QUERY_PARAMS}`,
    },
    'download-invoice': {
        method: 'POST',
        url: `${HOST}/invoices/download/{{INVOICE_ID}}${QUERY_PARAMS}`,
    },
    'find-contractor': {
        method: 'GET',
        url: `${HOST}/contractors/find${QUERY_PARAMS}`,
    },
    'add-contractor': {
        method: 'POST',
        url: `${HOST}/contractors/add${QUERY_PARAMS}`,
    },
};
