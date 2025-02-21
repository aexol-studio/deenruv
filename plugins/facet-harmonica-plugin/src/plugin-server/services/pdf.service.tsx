import React from 'react';
import { RealizationPDF } from './react-pdf/realization.js';
import { PROFormaPDF } from './react-pdf/proforma.js';
import { Injectable } from '@nestjs/common';
import {
    Administrator,
    Asset,
    AssetService,
    EntityHydrator,
    FacetValue,
    ProductOptionGroupService,
    ProductVariantService,
    TransactionalConnection,
    TranslatorService,
} from '@deenruv/core';
import { RequestContext } from '@deenruv/core';
import { pdf } from '@react-pdf/renderer';
import { StorageService } from './storage.service';
import { PDFProps, PROFormaInputType, PROFormaType, basePROForma } from './types';

const formatPrice = (price: number) => {
    return (price / 100).toFixed(2);
};
@Injectable()
export class PDFService {
    constructor(
        private connection: TransactionalConnection,
        private storageService: StorageService,
        private productOptionGroupService: ProductOptionGroupService,
        private translator: TranslatorService,
        private assetService: AssetService,
        private productVariantService: ProductVariantService,
        private entityHydrator: EntityHydrator,
    ) {}

    private generatePROFormaDocument = async (ctx: RequestContext, props: PROFormaInputType) => {
        const {
            order: {
                code,
                lines,
                billingAddress,
                shippingAddress,
                customer,
                payments,
                shippingMethod,
                shippingWithTax,
                totalQuantity,
                totalWithTax,
                subTotalWithTax,
                shippingLines,
                total,
                taxSummary,
            },
        } = props;

        const filename = `promoforma_${props.order.id}_${new Date().getTime()}.pdf`;
        const payment = payments ? payments[0] : null;

        const _products = await Promise.all(
            //TODO - TS - dodać typy
            lines.map(async (line: any) => {
                return {
                    name: line?.product.name || '',
                    quantity: line.quantity,
                    vat: line.taxRate,
                    unitPrice: formatPrice(line.unitPriceWithTax),
                    nettoPrice: formatPrice(line.linePrice),
                    discount:
                        formatPrice(
                            line.discounts?.reduce((acc: number, d: any) => acc + -d.amountWithTax, 0),
                        ) ?? 0,
                    nettoAfterDiscountPrice: formatPrice(line.discountedLinePrice),
                    vatPrice: formatPrice(line.lineTax),
                    bruttoPrice: formatPrice(line.discountedLinePriceWithTax),
                };
            }),
        );

        const products = [
            ..._products,
            ...(shippingWithTax == 0
                ? []
                : [
                      {
                          name: shippingMethod?.name || 'Shipping',
                          quantity: 1,
                          vat: isNaN(shippingLines[0]?.taxRate) ? 0 : shippingLines[0]?.taxRate,
                          unitPrice: formatPrice(shippingWithTax),
                          nettoPrice: formatPrice(shippingLines[0]?.price ?? shippingWithTax),
                          discount: '-',
                          nettoAfterDiscountPrice: formatPrice(
                              shippingLines[0]?.discountedPrice ?? shippingWithTax,
                          ),
                          vatPrice: formatPrice(
                              shippingWithTax - shippingLines[0]?.price ? shippingLines[0]?.price : 0,
                          ),
                          bruttoPrice: formatPrice(shippingWithTax),
                      },
                  ]),
        ];

        const totalVat = taxSummary.reduce((acc, tax) => acc + tax.taxTotal, 0);

        const data: PROFormaType = {
            ...basePROForma,
            showTextPrice: true,
            // vat: 23,
            totalQuantity,
            totalNetto: formatPrice(total),
            totalVat: formatPrice(totalVat),
            totalBrutto: formatPrice(totalWithTax),
            products,
            date: new Date().toISOString().split('T')[0],
            number: code,
            buyer: {
                ...basePROForma.buyer,
                address: billingAddress?.streetLine1 || '',
                city: billingAddress?.city || '',
                name:
                    billingAddress?.fullName ||
                    shippingAddress?.fullName ||
                    `${customer?.firstName} ${customer?.lastName}` ||
                    '',
                zip: billingAddress?.postalCode || '',
                // delivery: shippingMethod.name || "-",
            },
            payment: {
                ...basePROForma.payment,
                method: payment?.method || '',
            },
        };
        const blob = await pdf(<PROFormaPDF data={data} />).toBlob();
        return {
            createReadStream: () => blob,
            filename,
            mimetype: 'application/pdf',
        };
    };

    private generateRealizationDocument = async (ctx: RequestContext, props: PDFProps) => {
        const { options, user, order } = props;
        const orderWithOptions = await Promise.all(
            order.lines.map(async line => {
                const data = await this.getOptionsFromLines(ctx, line);
                const additionalAsset = options?.assets?.find(
                    asset => Number(asset.orderLineID) === Number(line.id),
                );
                const image = additionalAsset?.preview ? `${additionalAsset.preview}?format=jpg` : null;
                return { ...line, options: data, additionalAsset: image };
            }),
        );
        const _order = { ...order, lines: orderWithOptions };
        const filename = `zamowienie-${order.code}-kartka-${options.color}.pdf`;
        const blob = await pdf(
            <RealizationPDF options={options} user={user} order={_order as any} />,
        ).toBlob();
        return {
            createReadStream: () => blob,
            filename,
            mimetype: 'application/pdf',
        };
    };

    //TODO SAME FUNCTION IS IN ORDER I SHOULD CACHE IT AS MUCH AS POSSIBLE + MOVE AS GLOBAL SERVICE?
    private getOptionsFromLines = async (ctx: RequestContext, orderLine: any) => {
        try {
            const modifiedCustomFields = orderLine.customFields as any;

            let json: Record<string, string> | null = null;
            try {
                json = JSON.parse(modifiedCustomFields.attributes);
            } catch (e) {
                json = null;
            }
            let results: { code: string; value: string }[] = [];
            if (json) {
                results = await Promise.all(
                    Object.entries(json).map(async ([code, value]) => {
                        let cleanTag = `${code}-${value.replace(/ /g, '-')}`;
                        const facetValue = await this.connection.getRepository(ctx, FacetValue).findOne({
                            where: { code: value, facet: { code } },
                            relations: ['facet', 'customFields.image'],
                        });

                        const options = await this.productOptionGroupService.getOptionGroupsByProductId(
                            ctx,
                            orderLine.productVariant.productId,
                        );

                        if (options.length > 0) {
                            const option = options.find(o => o.code === code);
                            if (option) {
                                const optionValue = option.options.find(o => o.code === value);
                                if (optionValue) {
                                    const image = await this.connection.getRepository(ctx, Asset).findOne({
                                        relations: ['tags'],
                                        where: {
                                            tags: { value: `${option.code}-${optionValue.code}` },
                                        },
                                    });
                                    return {
                                        code: option.name,
                                        value: optionValue.name,
                                        hexColor: null,
                                        image: image || null,
                                        asHandle: null,
                                        cleanCode: optionValue.code,
                                        cleanValue: optionValue.name,
                                    };
                                }
                            }
                        }

                        let result: {
                            code: string;
                            value: string;
                            hexColor: string | null;
                            image: Asset | null;
                            asHandle: string | null;
                            cleanCode: string | null;
                            cleanValue: string | null;
                        } | null = null;

                        const facetCustomFields = facetValue
                            ? ((facetValue.facet.customFields || {}) as any)
                            : null;
                        if (facetValue && facetCustomFields?.usedForColors) {
                            const facetValueCustomFields = (facetValue.customFields || {}) as any;

                            result = {
                                code: this.translator.translate(facetValue.facet, ctx).name || code,
                                value: this.translator.translate(facetValue, ctx).name || value,
                                hexColor: facetValueCustomFields?.hexColor || null,
                                image: facetValueCustomFields?.image || null,
                                asHandle: facetCustomFields?.usedForProductCreations ? value : null,
                                cleanCode: code,
                                cleanValue: value,
                            };
                        } else {
                            const image = await this.connection.getRepository(ctx, Asset).findOne({
                                relations: ['tags'],
                                where: { tags: { value: cleanTag } },
                            });

                            result = {
                                code,
                                value,
                                hexColor: null,
                                image: image ?? null,
                                asHandle: null,
                                cleanCode: code,
                                cleanValue: value,
                            };
                        }
                        return result;
                    }),
                );
            }
            return results;
        } catch (e) {
            console.error('Error resolving order line options', e);
            return [];
        }
    };

    async generateRealizationPDF(
        ctx: RequestContext,
        options: {
            order: any;
            assets: {
                id: string;
                orderLineID: string;
                preview: string;
            }[];
            plannedAt: String;
            finalPlannedAt: String;
            note: String;
            color: string;
        },
    ) {
        try {
            const loggedUser = ctx.activeUserId;
            const user = await this.connection
                .getRepository(ctx, Administrator)
                .findOne({ where: { id: loggedUser } });

            const file = await this.generateRealizationDocument(ctx, {
                order: options.order,
                options,
                user,
            });
            const url = await this.storageService.uploadWithSignature(file);
            return { url, key: file.filename };
        } catch (e: any) {
            console.log(e);
            return null;
        }
    }
    async generatePROFormaPDF(ctx: RequestContext, options: { order: any }) {
        try {
            const { order } = options;
            if (!order) throw new Error('Order not found');
            const file = await this.generatePROFormaDocument(ctx, { order });
            const url = await this.storageService.uploadWithSignature(file);
            return { url, key: file.filename };
        } catch (e: any) {
            console.log(e);
            return null;
        }
    }
}
