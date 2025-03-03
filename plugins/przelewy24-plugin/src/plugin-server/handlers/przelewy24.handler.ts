import {
    EventBus,
    LanguageCode,
    Logger,
    OrderStateTransitionEvent,
    PaymentMethodHandler,
} from '@deenruv/core';
import { BadRequestException } from '@nestjs/common';
import { getPrzelewy24SecretsByChannel, getAxios, getSessionId, generateSHA384Hash } from '../utils';
import { Przelewy24NotificationBody } from '../types';
import { verifyPrzelewy24Payment } from '../verify';

let eventBus: EventBus;
export const przelewy24PaymentMethodHandler = new PaymentMethodHandler({
    code: 'przelewy24PaymentMethodHandler',
    description: [
        { languageCode: LanguageCode.en, value: 'Przelewy24' },
        { languageCode: LanguageCode.pl, value: 'Przelewy24' },
    ],
    args: {},
    init: injector => {
        eventBus = injector.get(EventBus);
    },
    async createPayment(ctx, order, amount, args, metadata) {
        const envs = {
            STOREFRONT_URL: process.env.STOREFRONT_URL || 'http://localhost:4200',
            API_URL: process.env.API_URL || 'http://localhost:3000',
            PRZELEWY24_URL: process.env.PRZELEWY24_URL || 'https://sandbox.przelewy24.pl',
        };
        const przelewy24Secrets = getPrzelewy24SecretsByChannel(ctx.channel.token);

        const api = getAxios(przelewy24Secrets);
        const sessionId = getSessionId(order);

        const secrets = {
            pos_id: przelewy24Secrets.PRZELEWY24_POS_ID,
            crc: przelewy24Secrets.PRZELEWY24_CRC,
        };

        const sum = `{"sessionId":"${sessionId}","merchantId":${secrets['pos_id']},"amount":${
            order.subTotalWithTax + order.shippingWithTax
        },"currency":"PLN","crc":"${secrets['crc']}"}`;

        try {
            const body = {
                description: `Zamówienie nr: ${order.id}, ${order.customer?.firstName} ${order.customer?.lastName}, #${order.code}`,
                language: 'pl',
                country: 'PL',
                currency: 'PLN',
                merchantId: secrets['pos_id'],
                posId: secrets['pos_id'],
                sessionId,
                amount: order.subTotalWithTax + order.shippingWithTax,
                email: order.customer?.emailAddress,
                client: `${order.customer?.firstName} ${order.customer?.lastName}`,
                address: order.billingAddress.streetLine1,
                zip: order.billingAddress.postalCode,
                city: order.billingAddress.city,
                phone: order.customer?.phoneNumber,
                urlReturn: `${envs['STOREFRONT_URL']}/order-status/${order.code}`,
                urlStatus: `${envs['API_URL']}/przelewy24/settle`,
                timeLimit: 0,
                sign: generateSHA384Hash(sum),
            };
            const result = await api.post('/transaction/register', body);
            Logger.info(`Payment created for order ${order.id}`, 'Przelewy24 Payment Handler');

            const parsed = Object.keys(metadata ?? {}).length
                ? JSON.parse(metadata as unknown as string)
                : null;
            const blikCode = parsed?.blikCode || null;
            const token = result.data.data.token;

            if (blikCode) {
                const blikResult = await api.post('/paymentMethod/blik/chargeByCode', {
                    token,
                    blikCode,
                });
                const verified = await waitForVerification({
                    merchantId: Number(secrets['pos_id']),
                    posId: Number(secrets['pos_id']),
                    sessionId,
                    amount: order.subTotalWithTax + order.shippingWithTax,
                    originAmount: `${order.subTotalWithTax + order.shippingWithTax}`,
                    currency: 'PLN',
                    orderId: Number(blikResult.data.data.orderId),
                    statement: `Minko Zamówienie ID:${order.id} CODE:${order.code}`,
                    sign: generateSHA384Hash(sum),
                });

                if (verified) {
                    return {
                        amount: order.totalWithTax,
                        state: 'Authorized',
                        transactionId: sessionId,
                        metadata: {
                            public: { paymentUrl: null, paymentMethod: 'BLIK' },
                        },
                    };
                } else {
                    Logger.error(`Blik payment failed for order ${order.id}`, 'Przelewy24 Payment Handler');
                    throw new BadRequestException();
                }
            }
            const paymentUrl = `${envs['PRZELEWY24_URL']}/trnRequest/${token}`;
            const assigned = order.payments.find(p => p.method === 'przelewy24')?.metadata?.public
                ?.paymentUrl;

            if (token && assigned) {
                await eventBus.publish(
                    new OrderStateTransitionEvent('AddingItems', 'ArrangingPayment', ctx, order),
                );
            }
            return {
                amount: order.totalWithTax,
                state: 'Authorized',
                transactionId: sessionId,
                metadata: { public: { paymentUrl, paymentMethod: 'SYSTEM' } },
            };
        } catch (err: any) {
            Logger.error(err.message, 'Przelewy24 Payment Handler');
            throw new BadRequestException();
        }
    },
    async settlePayment() {
        return {
            success: true,
        };
    },
});

const maxRetries = 10;
const waitForVerification = async (body: Przelewy24NotificationBody) => {
    let retries = 0;
    while (retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const verification = await verifyPrzelewy24Payment(body);
        if (verification === 'success') {
            return true;
        }
        retries++;
    }
    return false;
};
