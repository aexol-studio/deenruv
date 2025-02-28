import { RealizationPDF } from './realization.js';
import { Injectable } from '@nestjs/common';
import {
    Administrator,
    Asset,
    FacetValue,
    Order,
    ProductOptionGroupService,
    TransactionalConnection,
    TranslatorService,
} from '@deenruv/core';
import { RequestContext } from '@deenruv/core';
import { pdf } from '@react-pdf/renderer';
import { StorageService } from './storage.service.js';
import { PDFProps } from './types.js';
import { ModelTypes } from '../zeus/index.js';

@Injectable()
export class PDFService {
    constructor(
        private connection: TransactionalConnection,
        private storageService: StorageService,
        private productOptionGroupService: ProductOptionGroupService,
        private translator: TranslatorService,
    ) {}

    private generateRealizationDocument = async (ctx: RequestContext, props: PDFProps) => {
        const { options, user, order } = props;
        const lines = await Promise.all(
            order.lines.map(async line => {
                const data = await this.getOptionsFromLines(ctx, line);
                const additionalAsset = options?.assets?.find(
                    asset => Number(asset.orderLineID) === Number(line.id),
                );
                const image = additionalAsset?.preview ? `${additionalAsset.preview}?format=jpg` : null;
                return { ...line, options: data, additionalAsset: image };
            }),
        );
        const _order = { ...order, lines };
        const filename = `zamowienie-${order.code}-kartka-${options.color}.pdf`;
        const blob = await pdf(
            <RealizationPDF options={options} user={user} order={_order as any} />,
        ).toBlob();
        return { createReadStream: () => blob, filename, mimetype: 'application/pdf' };
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

    async generateRealizationPDF(ctx: RequestContext, { options, order }: Omit<PDFProps, 'user'>) {
        try {
            const loggedUser = ctx.activeUserId;
            const user = await this.connection
                .getRepository(ctx, Administrator)
                .findOne({ where: { id: loggedUser } });
            const file = await this.generateRealizationDocument(ctx, { order, options, user });
            const url = await this.storageService.uploadWithSignature(file);
            return { url, key: file.filename };
        } catch (e: any) {
            console.log(e);
            return null;
        }
    }
}
