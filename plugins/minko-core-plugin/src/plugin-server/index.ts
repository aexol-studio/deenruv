import {
    Asset,
    CustomerService,
    EventBus,
    LanguageCode,
    OrderProcess,
    PluginCommonModule,
    ProductVariant,
    RequestContext,
    TransactionalConnection,
    Ctx,
    PromotionService,
    PromotionItemAction,
    PromotionCondition,
    Promotion,
    Order,
    Product,
    Permission,
    Allow,
    Collection,
    CustomerGroup,
    DeenruvPlugin,
} from '@deenruv/core';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import path from 'path';
import { PDFService } from './services/pdf.service';
import { AdminExtension, ShopExtension } from './extensions/pdf.extension';
import { AdminResolver } from './api/admin.resolver';
import { StorageService } from './services/storage.service';
import { OrderRegisterService } from './services/order-register.service';
import { PLUGIN_INIT_OPTIONS } from './consts';
import { OrderRealizationEntity } from './entities/order-realization.entity';
import { ProFormaEntity } from './entities/pro-forma.entity';
import { ShopOrderResolver } from './api/shop-order.resolver';
import { AdminOrderResolver } from './api/admin-order.resolver';
import type { S3Client } from '@aws-sdk/client-s3';

export interface MinkoCoreConfiguration {
    bucket: string;
    expiresIn: number;
    s3Client: S3Client;
}

const IS_DEV = process.env.APP_ENV === 'dev';
const OMNIBUS_TIME = Number(process.env.OMNIBUS_TIME ?? 720);
const DATABASE_TIME_OFFSET = IS_DEV ? 1000 * 60 * 60 * 1 : 0; // 1 hour (time difference between server and local)
const timeToLive = IS_DEV ? 1000 * 60 * 5 + DATABASE_TIME_OFFSET : 1000 * 60 * 60 * OMNIBUS_TIME; // 30 days
@Resolver('ProductVariant')
export class ProductVariantCustomResolver {
    constructor(
        private customerService: CustomerService,
        private connection: TransactionalConnection,
    ) {}

    @ResolveField('discountedPrice')
    async discountedPrice(
        @Ctx() ctx: RequestContext,
        @Parent() productVariant: ProductVariant,
    ): Promise<{
        value: number;
        metadata: {
            price: number;
            name: string;
            description: string;
            isCustomerGroup: boolean;
        }[];
    } | null> {
        const userID = ctx.session?.user?.id;
        const date = new Date(new Date().getTime() - timeToLive);

        const activePromotions = await this.connection
            .getRepository(ctx, Promotion)
            .createQueryBuilder('promotion')
            .leftJoin('promotion.channels', 'channel')
            .leftJoinAndSelect('promotion.translations', 'translation')
            .where('channel.id = :channelId', { channelId: ctx.channelId })
            .andWhere('promotion.enabled = :enabled', { enabled: true })
            .andWhere('promotion.deletedAt IS NULL')
            .andWhere('(promotion.endsAt IS NULL OR promotion.endsAt > :date)', {
                date,
            })
            .andWhere('(promotion.startsAt IS NULL OR promotion.startsAt < :date)', {
                date,
            })
            .orderBy('promotion.priorityScore', 'ASC')
            .getMany();
        if (!activePromotions || activePromotions.length === 0) return null;

        const customer = !!userID ? await this.customerService.findOneByUserId(ctx, userID) : null;

        const customerGroups = !!customer
            ? await this.customerService.getCustomerGroups(ctx, customer.id)
            : null;

        const order = !!ctx.session?.activeOrderId
            ? await this.connection
                  .getRepository(ctx, Order)
                  .createQueryBuilder('order')
                  .select('order.subTotal')
                  .addSelect('order.subTotalWithTax')
                  .where('order.id = :orderId', { orderId: ctx.session?.activeOrderId })
                  .getOne()
            : null;

        const product = await this.connection
            .getRepository(ctx, Product)
            .createQueryBuilder('product')
            .select('product.customFields.discountBy')
            .where('product.id = :productId', {
                productId: productVariant.productId,
            })
            .getOne();

        const variantCollections = this.connection
            .getRepository(ctx, Collection)
            .createQueryBuilder('collection')
            .leftJoin('collection.productVariants', 'variant')
            .where('variant.product = :productId', {
                productId: productVariant.productId,
            })
            .orderBy('collection.id', 'ASC')
            .andWhere('collection.isPrivate = :isPrivate', { isPrivate: false })
            .select('collection.id');

        const result = await variantCollections.getMany();

        const discountBy = product?.customFields?.discountBy ?? 0;

        const appliedPromotions: {
            price: number;
            name: string;
            description: string;
            isCustomerGroup: boolean;
        }[] = [];
        const basePrice = productVariant.priceWithTax;

        const isCurrentCustomerInActivePromotionGroup = activePromotions.reduce((acc, promo) => {
            const isCustomerGroup = promo.conditions.reduce((acc, condition) => {
                if (condition.code === 'customer_group' && !!userID && !!customerGroups) {
                    const customerGroupId = condition.args[0].value;
                    return customerGroups.some(group => group.id == customerGroupId);
                }
                return acc;
            }, false);
            return isCustomerGroup || acc;
        }, false);

        const price = activePromotions.reduce((mainAcc, promotion) => {
            let isCustomerGroup = false;

            const shouldBeApplied = promotion.conditions.reduce((acc, condition) => {
                if (condition.code === 'all_products' && !isCurrentCustomerInActivePromotionGroup) {
                    return true;
                }
                if (
                    condition.code === 'minimum_order_amount' &&
                    !!order &&
                    !isCurrentCustomerInActivePromotionGroup
                ) {
                    const [amount, taxInclusive] = condition.args;
                    if (taxInclusive.value === 'true') {
                        return order.subTotalWithTax >= Number(amount.value) * 100;
                    }
                    return order.subTotal >= Number(amount.value) * 100;
                }

                if (condition.code === 'customer_group' && !!userID && !!customerGroups) {
                    isCustomerGroup = true;
                    const customerGroupId = condition.args[0].value;
                    return customerGroups.some(group => group.id == customerGroupId);
                }
                //TODO ADD MORE CONDITIONS
                //buy x get y etc
                return acc;
            }, false);

            if (shouldBeApplied) {
                let value = 0;
                mainAcc = promotion.actions.reduce((acc, action) => {
                    if (action.code === 'line_fixed_discountBy') {
                        value = discountBy;

                        acc = acc - discountBy;
                        return acc;
                    }
                    if (action.code === 'line_percentage_discount') {
                        const [discount, minValue] = action.args;
                        if (minValue && Number(minValue.value ?? 0) * 100 > mainAcc) {
                            return acc;
                        }
                        acc = acc - Math.floor(basePrice * (Number(discount.value) / 100));
                        value = Math.floor(basePrice * (Number(discount.value) / 100));

                        return acc;
                    }
                    if (action.code === 'line_percentage_discount_full_price' && mainAcc === basePrice) {
                        const [discount, minValue] = action.args;
                        if (minValue && Number(minValue.value ?? 0) * 100 > mainAcc) {
                            return acc;
                        }
                        acc = acc - Math.floor(basePrice * (Number(discount.value) / 100));
                        value = Math.floor(basePrice * (Number(discount.value) / 100));

                        return acc;
                    }
                    if (action.code === 'line_fixed_discount') {
                        const [discount, minValue] = action.args;
                        if (minValue && Number(minValue.value ?? 0) * 100 > mainAcc) {
                            return acc;
                        }
                        acc = acc - Number(discount.value) * 100;
                        value = Number(discount.value) * 100;
                        return acc;
                    }
                    if (action.code === 'line_fixed_discount_full_price' && mainAcc === basePrice) {
                        const [discount, minValue] = action.args;
                        if (minValue && Number(minValue.value ?? 0) * 100 > mainAcc) {
                            return acc;
                        }
                        acc = acc - Number(discount.value) * 100;
                        value = Number(discount.value) * 100;
                        return acc;
                    }
                    if (action.code === 'all_collections') {
                        const isProductSelectedInCollections =
                            !!action.args[0] &&
                            result.some(collection => {
                                const collectionsIdsArray = (
                                    typeof action.args[0].value === 'string'
                                        ? JSON.parse(action.args[0].value)
                                        : action.args[0].value
                                ).map((x: { id: number }) => x.id.toString());

                                return collectionsIdsArray.includes(collection.id.toString());
                            });
                        if (isProductSelectedInCollections && !isCurrentCustomerInActivePromotionGroup) {
                            const discount = Math.floor(basePrice * (Number(action.args[1].value) / 100));
                            acc = acc - discount;
                            value = discount;
                            return acc;
                        }
                    }
                    //TODO ADD MORE ACTIONS
                    return acc;
                }, mainAcc);

                const translation = promotion.translations.find(x => x.languageCode === ctx.languageCode);
                const name = translation?.name ?? '';
                const description = translation?.description ?? '';
                const meta = {
                    price: value,
                    name,
                    description,
                    isCustomerGroup,
                };
                appliedPromotions.push(meta);
                return mainAcc;
            }
            return mainAcc;
        }, productVariant.priceWithTax);

        const securePrice = price < 0 ? 1 : price;

        const metadata = appliedPromotions.filter(x => x.price !== 0);
        return { value: securePrice, metadata };
    }

    @ResolveField('groupDiscountedPrice')
    async groupDiscountedPrice(@Ctx() ctx: RequestContext, @Parent() productVariant: ProductVariant) {
        return null;
        // const userID = ctx.session?.user?.id;

        // const customer = !!userID
        //   ? await this.customerService.findOneByUserId(ctx, userID)
        //   : null;

        // const customerGroups = !!customer
        //   ? await this.customerService.getCustomerGroups(ctx, customer.id)
        //   : null;

        // if (!customerGroups || customerGroups.length === 0) return null;

        // const highestDiscountGroup = customerGroups.reduce((prev, current) =>
        //   prev.customFields.discount > current.customFields.discount
        //     ? prev
        //     : current
        // );

        // if (!highestDiscountGroup.customFields.discount) return null;

        // const product = await this.connection
        //   .getRepository(ctx, Product)
        //   .createQueryBuilder("product")
        //   .select("product.customFields.discountBy")
        //   .where("product.id = :productId", {
        //     productId: productVariant.productId,
        //   })
        //   .getOne();

        // const discountBy = product?.customFields?.discountBy ?? 0;

        // // const discount = highestDiscountGroup.customFields.discount;
        // const taxFreePrices = highestDiscountGroup.customFields.taxFreePrices;
        // // const combineDiscounts = highestDiscountGroup.customFields.combineDiscounts;
        // const priceReduction = combineDiscounts ? discountBy : 0;
        // const basePrice =
        //   (taxFreePrices ? productVariant.price : productVariant.priceWithTax) -
        //   priceReduction;
        // return Math.ceil(basePrice - (basePrice * discount) / 100);
    }
}
// export class DiscountByStrategy implements OrderItemPriceCalculationStrategy {
//   private connection: TransactionalConnection;
//   private productService: ProductService;
//   private customerService: CustomerService;
//   init(injector: Injector) {
//     this.connection = injector.get(TransactionalConnection);
//     this.productService = injector.get(ProductService);
//     this.customerService = injector.get(CustomerService);
//   }

//   async calculateUnitPrice(
//     ctx: RequestContext,
//     productVariant: ProductVariant
//   ) {
//     const userID = ctx.session?.user?.id;

//     const { listPriceIncludesTax: priceIncludesTax, productId } =
//       productVariant;

//     const product = await this.productService.findOne(ctx, productId);

//     const discountBy = 0;

//     if (userID) {
//       const customer = await this.customerService.findOneByUserId(ctx, userID);
//       if (customer) {
//         const customerGroups = await this.customerService.getCustomerGroups(
//           ctx,
//           customer.id
//         );
//         if (customerGroups && customerGroups.length) {
//           const highestDiscountGroup = customerGroups.reduce((prev, current) =>
//             prev.customFields.discount > current.customFields.discount
//               ? prev
//               : current
//           );
//           if (highestDiscountGroup.customFields.discount) {
//             const discount = highestDiscountGroup.customFields.discount;
//             const combineDiscounts =
//               highestDiscountGroup.customFields.combineDiscounts;
//             const taxFreePrices =
//               highestDiscountGroup.customFields.taxFreePrices;

//             const priceReduction = combineDiscounts ? discountBy : 0;
//             const basePrice =
//               (taxFreePrices
//                 ? productVariant.price
//                 : productVariant.priceWithTax) - priceReduction;

//             const discount_amount = (basePrice * discount) / 100;

//             return {
//               price: Math.ceil(basePrice - discount_amount),
//               priceIncludesTax,
//             };
//           }
//         }
//       }
//     }

//     return {
//       price: productVariant.priceWithTax - discountBy,
//       priceIncludesTax,
//     };
//   }
// }

export const lineItemFixedAmount = new PromotionItemAction({
    code: 'line_fixed_discount',
    description: [
        {
            languageCode: LanguageCode.en,
            value: 'Discount ALL products by fixed amount',
        },
        {
            languageCode: LanguageCode.pl,
            value: 'Zniżka na wszystkie produkty o stałą kwotę',
        },
    ],
    args: {
        discount: {
            type: 'int',
            ui: {
                component: 'number-form-input',
                prefix: 'PLN',
            },
        },
        [`💰 Dla Produktów z Minimalną Ceną Powyżej`]: {
            type: 'int',
            ui: {
                component: 'number-form-input',
                prefix: 'PLN',
            },
        },
    },

    execute(ctx, item, args) {
        if (item.linePriceWithTax < args[`💰 Dla Produktów z Minimalną Ceną Powyżej`] * 100) {
            return 0;
        }
        return -args.discount * 100 ?? 0;
    },
});

export const lineItemDiscountBy = new PromotionItemAction({
    code: 'line_fixed_discountBy',
    description: [
        {
            languageCode: LanguageCode.en,
            value: '(INTERNAL USE ONLY) Discount ALL products with discounted price',
        },
        {
            languageCode: LanguageCode.pl,
            value: '(DO UZYTKU WEWNETRZNEGO) Zniżka na produkty z obniżoną ceną',
        },
    ],
    args: {
        internalCode: {
            type: 'string',
        },
    },

    execute(ctx, item, args) {
        //TODO use internal code to make conditions
        const discountBy = Number(item.customFields.discountBy) ?? 0;
        if (isNaN(discountBy)) return 0;
        return -discountBy ?? 0;
    },
});

export const lineItemPercentage = new PromotionItemAction({
    code: 'line_percentage_discount',
    description: [
        {
            languageCode: LanguageCode.en,
            value: 'Discount ALL products by {discount} %',
        },
        {
            languageCode: LanguageCode.pl,
            value: 'Zniżka na wszystkie produkty o {discount} %',
        },
    ],
    args: {
        discount: {
            type: 'int',
            ui: {
                component: 'number-form-input',
                suffix: '%',
            },
        },
        [`💰 Dla Produktów z Minimalną Ceną Powyżej`]: {
            type: 'int',
            ui: {
                component: 'number-form-input',
                prefix: 'PLN',
            },
        },
    },

    execute(ctx, item, args) {
        if (item.linePriceWithTax < args[`💰 Dla Produktów z Minimalną Ceną Powyżej`] * 100) {
            return 0;
        }
        const discount = Math.floor(item.unitPriceWithTax * (args.discount / 100));
        return -discount;
    },
});

export const lineItemFixedAmountFullPrice = new PromotionItemAction({
    code: 'line_fixed_discount_full_price',
    priorityValue: 89,
    description: [
        {
            languageCode: LanguageCode.en,
            value: 'Discount ALL (regular price only) products by fixed amount',
        },
        {
            languageCode: LanguageCode.pl,
            value: 'Zniżka na wszystkie produkty (tylko w podstawowej cenie) o stałą kwotę',
        },
    ],
    args: {
        discount: {
            type: 'int',
            ui: {
                component: 'number-form-input',
                prefix: 'PLN',
            },
        },
        [`💰 Dla Produktów z Minimalną Ceną Powyżej`]: {
            type: 'int',
            ui: {
                component: 'number-form-input',
                prefix: 'PLN',
            },
        },
    },

    execute(ctx, item, args) {
        if (
            item.discounts.length > 0 ||
            item.linePriceWithTax < args[`💰 Dla Produktów z Minimalną Ceną Powyżej`] * 100
        ) {
            return 0;
        }
        return -args.discount * 100 ?? 0;
    },
});

export const lineItemPercentageFullPrice = new PromotionItemAction({
    code: 'line_percentage_discount_full_price',
    priorityValue: 89,
    description: [
        {
            languageCode: LanguageCode.en,
            value: 'Discount ALL (regular price only) products by {discount} %',
        },
        {
            languageCode: LanguageCode.pl,
            value: 'Zniżka na wszystkie produkty (tylko w podstawowej cenie) o {discount} %',
        },
    ],
    args: {
        discount: {
            type: 'int',
            ui: { component: 'number-form-input', suffix: '%' },
        },
        [`💰 Dla Produktów z Minimalną Ceną Powyżej`]: {
            type: 'int',
            ui: {
                component: 'number-form-input',
                prefix: 'PLN',
            },
        },
    },
    execute(ctx, item, args) {
        if (
            item.discounts.length > 0 ||
            item.linePriceWithTax < args[`💰 Dla Produktów z Minimalną Ceną Powyżej`] * 100
        ) {
            return 0;
        }
        const discount = Math.floor(item.unitPriceWithTax * (args.discount / 100));
        return -discount;
    },
});

let connection: TransactionalConnection;
export const collectionsPercentage = new PromotionItemAction({
    code: 'all_collections',
    description: [
        {
            languageCode: LanguageCode.en,
            value: 'Applies to selected collections',
        },
        {
            languageCode: LanguageCode.pl,
            value: 'Dla wybranych kolekcji',
        },
    ],
    args: {
        collectionsID: {
            type: 'string',
            ui: { component: 'collection-selector-form-input' },
            label: [
                { languageCode: LanguageCode.en, value: 'Collections' },
                { languageCode: LanguageCode.pl, value: 'Kolekcje' },
            ],
        },
        ['Zniżka']: {
            type: 'int',
            ui: { component: 'number-form-input', suffix: '%' },
        },
    },
    init: injector => {
        connection = injector.get(TransactionalConnection);
    },
    async execute(ctx, item, args) {
        if (args.collectionsID) {
            try {
                const collections = JSON.parse(args.collectionsID);
                const collectionsID = collections.map((x: { id: string }) => x.id);

                const allCollectionVariants = await Promise.all(
                    collectionsID.map((id: string) =>
                        connection.getRepository(ctx, ProductVariant).find({
                            where: { collections: { id } },
                            select: ['id'],
                        }),
                    ),
                );
                const variantsIds = allCollectionVariants.flat().map(x => x.id);

                if (variantsIds.includes(item.productVariantId)) {
                    const discount = Math.floor(item.unitPriceWithTax * (args['Zniżka'] / 100));
                    return -discount;
                }

                return 0;
            } catch {
                return 0;
            }
        }
        return 0;
    },
});

export const productSimplePercentage = new PromotionItemAction({
    code: 'product_simple_percentage_discount',
    description: [
        {
            languageCode: LanguageCode.en,
            value: 'Applies to selected products (te be used with CODE)',
        },
        {
            languageCode: LanguageCode.pl,
            value: 'Zniżka na wybrane produkty (do użycia z KODEM)',
        },
    ],
    args: {
        productIds: {
            type: 'ID',
            list: true,
            ui: {
                component: 'product-multi-form-input',
                selectionMode: 'product',
            },
            label: [
                { languageCode: LanguageCode.en, value: 'Products' },
                { languageCode: LanguageCode.pl, value: 'Produkty' },
            ],
        },
        ['Zniżka']: {
            type: 'int',
            ui: { component: 'number-form-input', suffix: '%' },
        },
    },
    async execute(ctx, item, args) {
        if (args.productIds) {
            try {
                if (args.productIds.includes(item.productVariant.productId)) {
                    const discount = Math.floor(item.unitPriceWithTax * (args['Zniżka'] / 100));
                    return -discount;
                }
                return 0;
            } catch {
                return 0;
            }
        }

        return 0;
    },
});

export const allProductsCondition = new PromotionCondition({
    code: 'all_products',
    priorityValue: 99,
    description: [
        {
            languageCode: LanguageCode.en,
            value: 'Applies to all products',
        },
        {
            languageCode: LanguageCode.pl,
            value: 'Dotyczy wszystkich produktów',
        },
    ],
    args: {},
    init: injector => {
        connection = injector.get(TransactionalConnection);
    },
    async check(ctx, order, args) {
        const activeUserId = ctx.activeUserId;

        const customerGroups = !!activeUserId
            ? await connection.getRepository(ctx, CustomerGroup).find({
                  where: { customers: { user: { id: activeUserId } } },
                  relations: ['customers'],
              })
            : null;

        const date = new Date(new Date().getTime() - timeToLive);

        const activePromotions = await connection
            .getRepository(ctx, Promotion)
            .createQueryBuilder('promotion')
            .leftJoin('promotion.channels', 'channel')
            .leftJoinAndSelect('promotion.translations', 'translation')
            .where('channel.id = :channelId', { channelId: ctx.channelId })
            .andWhere('promotion.enabled = :enabled', { enabled: true })
            .andWhere('promotion.deletedAt IS NULL')
            .andWhere('(promotion.endsAt IS NULL OR promotion.endsAt > :date)', {
                date,
            })
            .andWhere('(promotion.startsAt IS NULL OR promotion.startsAt < :date)', {
                date,
            })
            .orderBy('promotion.priorityScore', 'ASC')
            .getMany();

        const isCurrentCustomerInActivePromotionGroup = activePromotions?.reduce((acc, promo) => {
            const isCustomerGroup = promo.conditions.reduce((acc, condition) => {
                if (condition.code === 'customer_group' && !!ctx.activeUserId && !!customerGroups) {
                    const customerGroupId = condition.args[0].value;
                    return customerGroups.some(group => group.id == customerGroupId);
                }
                return acc;
            }, false);
            return isCustomerGroup || acc;
        }, false);

        if (isCurrentCustomerInActivePromotionGroup) return false;

        return true;
    },
});

const inRealizationProcess: OrderProcess<'InRealization'> = {
    transitions: {
        PaymentSettled: {
            to: ['InRealization', 'Cancelled', 'Modifying', 'ArrangingAdditionalPayment'],
            mergeStrategy: 'replace',
        },
        InRealization: {
            to: [
                'PartiallyDelivered',
                'Delivered',
                'PartiallyShipped',
                'Shipped',
                'Cancelled',
                'Modifying',
                'ArrangingAdditionalPayment',
            ],
        },
    },
    onTransitionStart: async (from, to, { ctx, order }) => {},
};

const empty = {
    label: [
        { languageCode: LanguageCode.en, value: '' },
        { languageCode: LanguageCode.pl, value: '' },
    ],
    description: [
        { languageCode: LanguageCode.en, value: '' },
        { languageCode: LanguageCode.pl, value: '' },
    ],
};

@Resolver('SearchResult')
export class SearchResultResolver {
    constructor(
        private connection: TransactionalConnection,
        private customerService: CustomerService,
    ) {}

    @ResolveField()
    @Allow(Permission.Public)
    async discountedPrice(
        @Ctx() ctx: RequestContext,
        @Parent() search: any,
    ): Promise<{
        value: number;
        metadata: {
            price: number;
            name: string;
            description: string;
            isCustomerGroup: boolean;
        }[];
    } | null> {
        try {
            const userID = ctx.session?.user?.id;
            const date = new Date(new Date().getTime() - timeToLive);

            const activePromotions = await this.connection
                .getRepository(ctx, Promotion)
                .createQueryBuilder('promotion')
                .leftJoin('promotion.channels', 'channel')
                .leftJoinAndSelect('promotion.translations', 'translation')
                .where('channel.id = :channelId', { channelId: ctx.channelId })
                .andWhere('promotion.enabled = :enabled', { enabled: true })
                .andWhere('promotion.deletedAt IS NULL')
                .andWhere('(promotion.endsAt IS NULL OR promotion.endsAt > :date)', {
                    date,
                })
                .andWhere('(promotion.startsAt IS NULL OR promotion.startsAt < :date)', { date })
                .orderBy('promotion.priorityScore', 'ASC')
                .getMany();
            if (!activePromotions || activePromotions.length === 0) return null;

            const customer = !!userID ? await this.customerService.findOneByUserId(ctx, userID) : null;

            const customerGroups = !!customer
                ? await this.customerService.getCustomerGroups(ctx, customer.id)
                : null;

            const order = !!ctx.session?.activeOrderId
                ? await this.connection
                      .getRepository(ctx, Order)
                      .createQueryBuilder('order')
                      .select('order.subTotal')
                      .addSelect('order.subTotalWithTax')
                      .where('order.id = :orderId', {
                          orderId: ctx.session?.activeOrderId,
                      })
                      .getOne()
                : null;

            const product = await this.connection
                .getRepository(ctx, Product)
                .createQueryBuilder('product')
                .select('product.customFields.discountBy')
                .where('product.id = :productId', {
                    productId: search.productId,
                })
                .getOne();

            const variantCollections = this.connection
                .getRepository(ctx, Collection)
                .createQueryBuilder('collection')
                .leftJoin('collection.productVariants', 'variant')
                .where('variant.product = :productId', {
                    productId: search.productId,
                })
                .orderBy('collection.id', 'ASC')
                .andWhere('collection.isPrivate = :isPrivate', { isPrivate: false })
                .select('collection.id');

            const result = await variantCollections.getMany();

            const discountBy = product?.customFields?.discountBy ?? 0;

            const appliedPromotions: {
                price: number;
                name: string;
                description: string;
                isCustomerGroup: boolean;
            }[] = [];
            const basePrice =
                'min' in search.priceWithTax ? search.priceWithTax.min : search.priceWithTax.value;

            const isCurrentCustomerInActivePromotionGroup = activePromotions.reduce((acc, promo) => {
                const isCustomerGroup = promo.conditions.reduce((acc, condition) => {
                    if (condition.code === 'customer_group' && !!userID && !!customerGroups) {
                        const customerGroupId = condition.args[0].value;
                        return customerGroups.some(group => group.id == customerGroupId);
                    }
                    return acc;
                }, false);
                return isCustomerGroup || acc;
            }, false);

            const price = activePromotions.reduce((mainAcc, promotion) => {
                let isCustomerGroup = false;

                const shouldBeApplied = promotion.conditions.reduce((acc, condition) => {
                    if (condition.code === 'all_products' && !isCurrentCustomerInActivePromotionGroup) {
                        return true;
                    }
                    if (
                        condition.code === 'minimum_order_amount' &&
                        !!order &&
                        !isCurrentCustomerInActivePromotionGroup
                    ) {
                        const [amount, taxInclusive] = condition.args;
                        if (taxInclusive.value === 'true') {
                            return order.subTotalWithTax >= Number(amount.value) * 100;
                        }
                        return order.subTotal >= Number(amount.value) * 100;
                    }

                    if (condition.code === 'customer_group' && !!userID && !!customerGroups) {
                        isCustomerGroup = true;
                        const customerGroupId = condition.args[0].value;
                        return customerGroups.some(group => group.id == customerGroupId);
                    }
                    //TODO ADD MORE CONDITIONS
                    //buy x get y etc
                    return acc;
                }, false);
                if (shouldBeApplied) {
                    let value = 0;
                    mainAcc = promotion.actions.reduce((acc, action) => {
                        if (action.code === 'line_fixed_discountBy') {
                            value = discountBy;

                            acc = acc - discountBy;
                            return acc;
                        }
                        if (action.code === 'line_percentage_discount') {
                            const [discount, minValue] = action.args;
                            if (minValue && Number(minValue.value ?? 0) * 100 > mainAcc) {
                                return acc;
                            }
                            acc = acc - Math.floor(basePrice * (Number(discount.value) / 100));
                            value = Math.floor(basePrice * (Number(discount.value) / 100));

                            return acc;
                        }
                        if (action.code === 'line_percentage_discount_full_price' && mainAcc === basePrice) {
                            const [discount, minValue] = action.args;
                            if (minValue && Number(minValue.value ?? 0) * 100 > mainAcc) {
                                return acc;
                            }
                            acc = acc - Math.floor(basePrice * (Number(discount.value) / 100));
                            value = Math.floor(basePrice * (Number(discount.value) / 100));

                            return acc;
                        }
                        if (action.code === 'line_fixed_discount') {
                            const [discount, minValue] = action.args;
                            if (minValue && Number(minValue.value ?? 0) * 100 > mainAcc) {
                                return acc;
                            }
                            acc = acc - Number(discount.value) * 100;
                            value = Number(discount.value) * 100;
                            return acc;
                        }
                        if (action.code === 'line_fixed_discount_full_price' && mainAcc === basePrice) {
                            const [discount, minValue] = action.args;
                            if (minValue && Number(minValue.value ?? 0) * 100 > mainAcc) {
                                return acc;
                            }
                            acc = acc - Number(discount.value) * 100;
                            value = Number(discount.value) * 100;
                            return acc;
                        }
                        if (action.code === 'all_collections') {
                            const isProductSelectedInCollections =
                                !!action.args[0] &&
                                result.some(collection => {
                                    const collectionsIdsArray = (
                                        typeof action.args[0].value === 'string'
                                            ? JSON.parse(action.args[0].value)
                                            : action.args[0].value
                                    ).map((x: { id: number }) => x.id.toString());

                                    return collectionsIdsArray.includes(collection.id.toString());
                                });
                            if (isProductSelectedInCollections && !isCurrentCustomerInActivePromotionGroup) {
                                const discount = Math.floor(basePrice * (Number(action.args[1].value) / 100));
                                acc = acc - discount;
                                value = discount;
                                return acc;
                            }
                        }
                        //TODO ADD MORE ACTIONS
                        return acc;
                    }, mainAcc);

                    const translation = promotion.translations.find(x => x.languageCode === ctx.languageCode);
                    const name = translation?.name ?? '';
                    const description = translation?.description ?? '';
                    const meta = {
                        price: value,
                        name,
                        description,
                        isCustomerGroup,
                    };
                    appliedPromotions.push(meta);
                    return mainAcc;
                }
                return mainAcc;
            }, basePrice);
            const securePrice = price < 0 ? 1 : price;
            const metadata = appliedPromotions.filter(x => x.price !== 0);
            return { value: securePrice, metadata };
        } catch (e) {
            return null;
        }
    }
}

@DeenruvPlugin({
    compatibility: '^2.0.0',
    imports: [PluginCommonModule],
    providers: [
        OrderRegisterService,
        PDFService,
        StorageService,
        PromotionService,
        {
            provide: PLUGIN_INIT_OPTIONS,
            useFactory: () => MinkoCorePlugin.config,
        },
    ],
    entities: [OrderRealizationEntity, ProFormaEntity],

    shopApiExtensions: {
        schema: ShopExtension,
        resolvers: [ShopOrderResolver, ProductVariantCustomResolver, SearchResultResolver],
    },
    adminApiExtensions: {
        schema: AdminExtension,
        resolvers: [AdminResolver, AdminOrderResolver],
    },

    configuration: config => {
        // config.orderOptions.orderItemPriceCalculationStrategy =
        //   new DiscountByStrategy();
        config.orderOptions.process.push(inRealizationProcess);

        config.promotionOptions.promotionConditions.push(allProductsCondition);
        config.promotionOptions.promotionActions.push(collectionsPercentage);
        config.promotionOptions.promotionActions.push(productSimplePercentage);
        config.promotionOptions.promotionActions.push(lineItemFixedAmount);
        config.promotionOptions.promotionActions.push(lineItemPercentage);
        config.promotionOptions.promotionActions.push(lineItemFixedAmountFullPrice);
        config.promotionOptions.promotionActions.push(lineItemPercentageFullPrice);
        config.promotionOptions.promotionActions.push(lineItemDiscountBy);

        //ALLOWS TO MAKE CUSTOM (OPTIONS & FACETS) ORDER ON PDP
        config.customFields.Product.push({
            name: 'optionsOrder',
            type: 'text',
            // list: true,
            ui: { component: 'mocked-product-options-order' },
            ...empty,
        });
        //ALLOWS TO MAKE CUSTOM (OPTIONS & FACETS) ORDER ON PDP

        config.customFields.Product.push(
            {
                name: 'sizes',
                type: 'localeText',
                defaultValue: '',
                ui: { tab: 'Wymiary', component: 'additional-description-input' },
                ...empty,
            },
            {
                name: 'finish',
                type: 'localeText',
                defaultValue: '',
                ui: { tab: 'Wyposażenie', component: 'additional-description-input' },
                ...empty,
            },
            {
                name: 'materials',
                type: 'localeText',
                defaultValue: '',
                ui: {
                    tab: 'Kolory i wykończenie',
                    component: 'additional-description-input',
                },
                ...empty,
            },
            {
                name: 'payment',
                type: 'localeText',
                defaultValue: '',
                ui: { tab: 'Płatność', component: 'additional-description-input' },
                ...empty,
            },
            {
                name: 'delivery',
                type: 'localeText',
                defaultValue: '',
                ui: {
                    tab: 'Dostawa i użytkowanie',
                    component: 'additional-description-input',
                },
                ...empty,
            },
            {
                name: 'realization',
                type: 'localeText',
                defaultValue: '',
                ui: {
                    tab: 'Termin realizacji',
                    component: 'additional-description-input',
                },
                ...empty,
            },
            {
                name: 'mainProductImage',
                type: 'relation',
                graphQLType: 'Asset',
                entity: Asset,
                public: true,
                nullable: true,
                eager: true,
                label: [{ languageCode: LanguageCode.en, value: 'Main Product Image' }],
                description: [
                    {
                        languageCode: LanguageCode.en,
                        value: 'Recommended size: 1200x630px',
                    },
                ],
            },
            {
                name: 'hoverProductImage',
                type: 'relation',
                graphQLType: 'Asset',
                entity: Asset,
                public: true,
                eager: true,
                nullable: true,
                label: [{ languageCode: LanguageCode.en, value: 'Hover Product Image' }],
                description: [
                    {
                        languageCode: LanguageCode.en,
                        value: 'Recommended size: 1200x630px',
                    },
                ],
            },
        );
        //ADD CUSTOM FIELDS TO PRODUCT (SIZES, DELIVERY, REALIZATION, MATERIALS, FINISH) DESCRIPTION

        //ALLOWS TO MAKE CUSTOM (OPTIONS & FACETS) ORDER ON PDP

        //CUSTOMER GROUP
        config.customFields.CustomerGroup
            .push
            // {
            //   name: "discount",
            //   type: "int",
            //   ui: { component: "number-form-input" },
            //   min: 0,
            //   max: 100,
            //   label: [
            //     { languageCode: LanguageCode.en, value: "Discount %" },
            //     { languageCode: LanguageCode.pl, value: "Zniżka %" },
            //   ],
            //   description: [
            //     {
            //       languageCode: LanguageCode.en,
            //       value:
            //         "Discount % calculated from Price with TAX or without TAX depending on the setting of the Prices Without TAX field",
            //     },
            //     {
            //       languageCode: LanguageCode.pl,
            //       value:
            //         "Zniżka % liczona od Ceny z Vat lub bez Vat w zależnosci od ustawienia pola: Ceny Bez Vat",
            //     },
            //   ],
            // },
            // {
            //   name: "taxFreePrices",
            //   type: "boolean",
            //   ui: { component: "boolean-form-input" },
            //   label: [
            //     { languageCode: LanguageCode.en, value: "Prices Without TAX" },
            //     { languageCode: LanguageCode.pl, value: "Ceny Bez VAT" },
            //   ],
            //   description: [
            //     {
            //       languageCode: LanguageCode.en,
            //       value: "Display All Prices Without TAX for this group",
            //     },
            //     {
            //       languageCode: LanguageCode.pl,
            //       value: "Wyświetl Wszystkie Ceny Bez VAT dla tej grupy",
            //     },
            //   ],
            // }
            // {
            //   name: "combineDiscounts",
            //   type: "boolean",
            //   ui: { component: "boolean-form-input" },
            //   label: [
            //     { languageCode: LanguageCode.en, value: "Combine Discounts" },
            //     { languageCode: LanguageCode.pl, value: "Łącz zniżki" },
            //   ],
            //   description: [
            //     {
            //       languageCode: LanguageCode.en,
            //       value: "Allow to combine group's discounts with other discounts",
            //     },
            //     {
            //       languageCode: LanguageCode.pl,
            //       value: "Pozwól na łączenie zniżki grupy z innych zniżkami",
            //     },
            //   ],
            // }
            ();
        //CUSTOMER GROUP

        //PRODUCT DISCOUNT
        config.customFields.Product.push({
            name: 'discountBy',
            type: 'int',
            nullable: true,
            defaultValue: 0,
            ui: { component: 'order-line-custom-field-input' },
            label: [
                { languageCode: LanguageCode.en, value: 'Discount by' },
                { languageCode: LanguageCode.pl, value: 'Obniż cenę o' },
            ],
            description: [
                { languageCode: LanguageCode.en, value: 'Discount by' },
                { languageCode: LanguageCode.pl, value: 'Obniż cenę o' },
            ],
        });
        //PRODUCT DISCOUNT

        config.customFields.OrderLine.push(
            {
                name: 'attributes',
                type: 'text',
                label: [
                    { languageCode: LanguageCode.en, value: 'Attributes' },
                    { languageCode: LanguageCode.pl, value: 'Atrybuty' },
                ],
                description: [
                    { languageCode: LanguageCode.en, value: 'Attributes' },
                    { languageCode: LanguageCode.pl, value: 'Atrybuty' },
                ],
                nullable: true,
                ui: { component: 'attributes-input' },
            },
            {
                name: 'discountBy',
                type: 'int',
                label: [
                    { languageCode: LanguageCode.en, value: 'Discount' },
                    { languageCode: LanguageCode.pl, value: 'Znizka' },
                ],
                description: [
                    { languageCode: LanguageCode.en, value: 'Discount amount' },
                    { languageCode: LanguageCode.pl, value: 'Wartość Znizki' },
                ],
                ui: { component: 'order-line-custom-field-input' },
                nullable: true,
            },
            {
                name: 'selectedImage',
                type: 'relation',
                entity: Asset,
                nullable: true,
                ui: { component: 'selected-image-input' },
                label: [
                    { languageCode: LanguageCode.en, value: 'Selected image' },
                    { languageCode: LanguageCode.pl, value: 'Wybrany obrazek' },
                ],
                description: [
                    { languageCode: LanguageCode.en, value: 'Selected image' },
                    { languageCode: LanguageCode.pl, value: 'Wybrany obrazek' },
                ],
            },
        );

        config.customFields.ProductOption.push(
            {
                name: 'image',
                label: [
                    { languageCode: LanguageCode.en, value: 'Image' },
                    { languageCode: LanguageCode.pl, value: 'Obrazek' },
                ],
                description: [
                    { languageCode: LanguageCode.en, value: 'Image for facet value' },
                    {
                        languageCode: LanguageCode.pl,
                        value: 'Obrazek dla wartości atrybutu',
                    },
                ],
                type: 'relation',
                entity: Asset,
                nullable: true,
            },
            {
                name: 'hexColor',
                label: [
                    { languageCode: LanguageCode.en, value: 'Color' },
                    { languageCode: LanguageCode.pl, value: 'Kolor' },
                ],
                description: [
                    {
                        languageCode: LanguageCode.en,
                        value: 'Color for facet value (hex)',
                    },
                    {
                        languageCode: LanguageCode.pl,
                        value: 'Kolor dla wartości atrybutu (hex)',
                    },
                ],
                type: 'string',
                defaultValue: '---',
                nullable: true,
                ui: { component: 'color-picker-input' },
            },
            {
                name: 'isNew',
                label: [
                    { languageCode: LanguageCode.en, value: 'New' },
                    { languageCode: LanguageCode.pl, value: 'Nowy' },
                ],
                description: [
                    { languageCode: LanguageCode.en, value: 'Set as new' },
                    { languageCode: LanguageCode.pl, value: 'Ustaw jako nowy' },
                ],
                type: 'boolean',
                defaultValue: false,
                ui: { component: 'boolean-form-input' },
            },
            {
                name: 'isHidden',
                label: [
                    { languageCode: LanguageCode.en, value: 'Hidden' },
                    { languageCode: LanguageCode.pl, value: 'Ukryty' },
                ],
                description: [
                    { languageCode: LanguageCode.en, value: 'Set as hidden' },
                    { languageCode: LanguageCode.pl, value: 'Ukryj' },
                ],
                type: 'boolean',
                defaultValue: false,
                ui: { component: 'boolean-form-input' },
            },
        );

        config.customFields.Facet.push(
            {
                name: 'usedForColors',
                type: 'boolean',
                ui: { component: 'boolean-form-input' },
                defaultValue: false,
                label: [
                    { languageCode: LanguageCode.en, value: 'Used for colors' },
                    { languageCode: LanguageCode.pl, value: 'Używany dla kolorów' },
                ],
                description: [
                    { languageCode: LanguageCode.en, value: 'Use this facet for colors' },
                    {
                        languageCode: LanguageCode.pl,
                        value: 'Użyj tego atrybutu dla facetów które są kolorami',
                    },
                ],
            },
            // TODO: COMEBACK TO THIS
            // {
            //   name: "multiSelect",
            //   type: "boolean",
            //   ui: { component: "boolean-form-input" },
            //   defaultValue: false,
            //   label: [
            //     {
            //       languageCode: LanguageCode.en,
            //       value: "Used for multiselect add to cart ",
            //     },
            //     {
            //       languageCode: LanguageCode.pl,
            //       value: "Używany dla dodawania wielu wariantów do koszyka",
            //     },
            //   ],
            //   description: [
            //     {
            //       languageCode: LanguageCode.en,
            //       value: "Use this facet for multiselect variant",
            //     },
            //     {
            //       languageCode: LanguageCode.pl,
            //       value: "Użyj tego atrybutu dla facetów wielokrotnego wyboru",
            //     },
            //   ],
            // },
            {
                name: 'usedForProductCreations',
                type: 'boolean',
                ui: { component: 'product-creations-input' },
                defaultValue: false,
                label: [
                    { languageCode: LanguageCode.en, value: '' },
                    { languageCode: LanguageCode.pl, value: '' },
                ],
                description: [
                    { languageCode: LanguageCode.en, value: '' },
                    { languageCode: LanguageCode.pl, value: '' },
                ],
            },
            {
                name: 'colorsCollection',
                type: 'boolean',
                ui: { component: 'boolean-form-input' },
                defaultValue: false,
                label: [
                    {
                        languageCode: LanguageCode.en,
                        value: 'Used when creating colors collection',
                    },
                    {
                        languageCode: LanguageCode.pl,
                        value: 'Używany przy tworzeniu kolekcji kolorów',
                    },
                ],
                description: [
                    {
                        languageCode: LanguageCode.en,
                        value: 'Use this facet when creating colors collection',
                    },
                    {
                        languageCode: LanguageCode.pl,
                        value: 'Użyj tego atrybutu przy tworzeniu kolekcji kolorów',
                    },
                ],
            },
        );

        config.customFields.FacetValue.push(
            {
                name: 'image',
                label: [
                    { languageCode: LanguageCode.en, value: 'Image' },
                    { languageCode: LanguageCode.pl, value: 'Obrazek' },
                ],
                description: [
                    { languageCode: LanguageCode.en, value: 'Image for facet value' },
                    {
                        languageCode: LanguageCode.pl,
                        value: 'Obrazek dla wartości atrybutu',
                    },
                ],
                type: 'relation',
                entity: Asset,
                nullable: true,
            },
            {
                name: 'hexColor',
                label: [
                    { languageCode: LanguageCode.en, value: 'Color' },
                    { languageCode: LanguageCode.pl, value: 'Kolor' },
                ],
                description: [
                    {
                        languageCode: LanguageCode.en,
                        value: 'Color for facet value (hex)',
                    },
                    {
                        languageCode: LanguageCode.pl,
                        value: 'Kolor dla wartości atrybutu (hex)',
                    },
                ],
                type: 'string',
                defaultValue: '---',
                nullable: true,
                ui: { component: 'color-picker-input' },
            },
            {
                name: 'isNew',
                label: [
                    { languageCode: LanguageCode.en, value: 'New' },
                    { languageCode: LanguageCode.pl, value: 'Nowy' },
                ],
                description: [
                    { languageCode: LanguageCode.en, value: 'Set as new' },
                    { languageCode: LanguageCode.pl, value: 'Ustaw jako nowy' },
                ],
                type: 'boolean',
                defaultValue: false,
                ui: { component: 'boolean-form-input' },
            },
            {
                name: 'isHidden',
                label: [
                    { languageCode: LanguageCode.en, value: 'Hidden' },
                    { languageCode: LanguageCode.pl, value: 'Ukryty' },
                ],
                description: [
                    { languageCode: LanguageCode.en, value: 'Set as hidden' },
                    { languageCode: LanguageCode.pl, value: 'Ukryj' },
                ],
                type: 'boolean',
                defaultValue: false,
                ui: { component: 'boolean-form-input' },
            },
        );
        return config;
    },
})
export class MinkoCorePlugin {
    static config: MinkoCoreConfiguration;

    static init(config: MinkoCoreConfiguration) {
        this.config = config;
        return this;
    }
}
