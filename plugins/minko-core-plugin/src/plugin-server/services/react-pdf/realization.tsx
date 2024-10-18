import React from 'react';
import { PDFProps } from '../types';
import { Page, Text, View, Document, Font, Image } from '@react-pdf/renderer';
import { s } from './stylesheet';
import { OrderLine as OrderLineType, Product } from '@deenruv/core';

Font.register({
    family: 'Roboto',
    src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
});
Font.register({
    family: 'Roboto',
    src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
});
Font.register({
    family: 'Roboto',
    src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
});

const allRealizationData = {
    colorL: 'Kolor kartki',
    orderL: 'Zamówienie',
    terminL: 'Ostateczny termin realizacji',
    SKUL: 'SKU:',
    deliveryL: 'Dostawa',
    paymentL: 'Płatność',
    additionalL: 'Inne',
};

const subPagesSymbolMapping: Record<number, string> = {
    1: 'a',
    2: 'b',
    3: 'c',
    4: 'd',
    5: 'e',
};

export function RealizationPDF({ options, order, user }: Omit<PDFProps, 'assets'>) {
    const payment = order.payments ? order.payments[0] : null;
    const postalCode = order.shippingAddress.postalCode ?? '';
    const city = order.shippingAddress.city ?? '';
    const hasCustomOptions = options.note.includes('#custom');

    const orderItems = (
        order.lines as (OrderLineType & {
            additionalAsset: { preview: string };
        })[]
    ).reduce(
        (acc, line) => {
            for (let i = 0; i < line.quantity; i++) {
                acc.push(line);
            }
            return acc;
        },
        [] as (OrderLineType & {
            additionalAsset: { preview: string };
        })[],
    );

    return (
        <Document>
            {orderItems.map((line, orderLineIndex) => (
                <Page break style={{ ...s.body, ...s.page, ...s.card }} size="A5" key={line.id}>
                    {hasCustomOptions && (
                        <View
                            style={{
                                ...s.flex,
                                gap: 4,
                                position: 'absolute',
                                top: 15,
                                left: 15,
                                fontSize: 10,
                                width: 150,
                            }}
                        >
                            <Text>NIESTANDARDOWE</Text>
                        </View>
                    )}
                    <View style={{ ...s.flex, justifyContent: 'space-between' }}>
                        <View>
                            {/* REMOVED AS MERCHANT WANTS */}
                            {/* <Text style={s.smText}>
                {allRealizationData.terminL} {options.finalPlannedAt}
              </Text> */}
                            <Text style={s.smText}>
                                {allRealizationData.orderL} {order.id}
                            </Text>
                            <View style={{ maxWidth: '50%' }}>
                                <Text style={s.smText} wrap>
                                    {allRealizationData.SKUL} {line.productVariant.sku}
                                </Text>
                            </View>
                        </View>
                        <View style={{ ...s.flex, marginBottom: 12 }}>
                            <Text
                                style={{
                                    ...s.smText,
                                    textAlign: 'right',
                                    position: 'relative',
                                    top: 4,
                                }}
                            >
                                {user?.firstName} {user?.lastName}
                            </Text>
                        </View>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <View>
                            <OrderLine
                                orderLine={line as any}
                                options={options}
                                payment={payment}
                                shipping={order.shippingMethod}
                                orderId={order.id}
                                postalCode={postalCode}
                                city={city}
                            />
                        </View>
                        <View break={true}>
                            <OrderLine
                                second
                                orderLine={line as any}
                                options={options}
                                payment={payment}
                                shipping={order.shippingMethod}
                                orderId={order.id}
                                postalCode={postalCode}
                                city={city}
                            />
                        </View>
                    </View>

                    <Text
                        style={s.pageNumber}
                        render={({ subPageNumber, subPageTotalPages }) => {
                            const totalPages = orderItems.length;
                            const currentPage = orderLineIndex + 1;
                            if (subPageTotalPages > 1) {
                                return `${currentPage}${subPagesSymbolMapping[subPageNumber]} / ${totalPages}`;
                            }
                            return `${currentPage} / ${totalPages}`;
                        }}
                        fixed
                    />
                </Page>
            ))}
        </Document>
    );
}
function OrderLine({
    second,
    orderLine,
    options,
    payment,
    shipping,
    orderId,
    postalCode,
    city,
}: {
    second?: boolean;
    orderLine: PDFProps['order']['lines'][number] & {
        options: Array<{ code: string; value: string }>;
        product: Product;
        additionalAsset: string;
    };
    options: PDFProps['options'];
    payment: PDFProps['order']['payments'][0] | null;
    shipping: PDFProps['order']['shippingMethod'];
    orderId: string | number;
    postalCode: string;
    city: string;
}) {
    const hasCustomOptions = options.note.includes('#custom');
    const customOptions = options.note
        ?.split('#custom')?.[1]
        ?.split(',')
        .filter(Boolean)
        .map(o => {
            const [code, value] = o.split(':');
            return { code: `${code}`, value };
        });

    return (
        <View
            style={{
                zIndex: 10,
                position: 'relative',
                ...s.borderT,
                ...s.borderB,
            }}
        >
            {!second && orderLine?.additionalAsset && (
                <Image
                    style={{
                        top: -50,
                        right: 55,
                        position: 'absolute',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 'auto',
                        maxWidth: '150px',
                        height: 90,
                        zIndex: 100,
                    }}
                    src={orderLine.additionalAsset}
                />
            )}
            <View style={s.flex}>
                <View
                    style={{
                        ...s.borderL,
                        ...s.flexCenter,
                        position: 'relative',
                        width: 18,
                    }}
                >
                    <Text
                        style={{
                            ...s.flex,
                            ...s.flexCenter,
                            ...s.mdText,
                            width: '100%',
                            textAlign: 'center',
                            transform: 'rotate(-90deg)',
                        }}
                    >
                        {options.plannedAt}
                    </Text>
                </View>
                <View
                    style={{
                        ...s.borderL,
                        width: 65,
                        padding: '4 8',
                        display: 'flex',
                        flexDirection: 'column',
                        textOverflow: 'ellipsis',
                        gap: 8,
                    }}
                >
                    <Text style={{ ...s.lgText, marginTop: 6 }}>{orderId}</Text>
                    <Text style={{ ...s.smText, marginTop: 4 }}>{city.toUpperCase()}</Text>
                    <Text style={{ ...s.smText }}>{postalCode}</Text>
                </View>
                <View style={{ ...s.borderL, width: '68%' }}>
                    <View style={{ marginTop: second ? 8 : 32, padding: '4 2' }}>
                        <Text style={s.mdText}>{orderLine.product.name}</Text>
                    </View>
                    {(hasCustomOptions ? customOptions : orderLine.options).map((option, i) => (
                        <View key={'custom option key' + i} style={{ ...s.borderT, ...s.smText, ...s.line }}>
                            <Text wrap>{option.code}</Text>
                            <Text wrap style={{ maxWidth: '80%' }}>
                                {option.value}
                            </Text>
                        </View>
                    ))}
                    {!hasCustomOptions && options.note ? (
                        <View style={{ ...s.borderT, ...s.smText, ...s.line }}>
                            <Text>{allRealizationData.additionalL}</Text>
                            <Text>{options.note}</Text>
                        </View>
                    ) : null}
                    <View style={{ ...s.borderT, ...s.emptySpace }} />
                </View>
                <View
                    style={{
                        ...s.borderL,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        position: 'relative',
                        width: 32,
                        gap: 4,
                    }}
                >
                    <View
                        style={{
                            position: 'absolute',
                            display: 'flex',
                            flexDirection: 'column',
                            transform: 'rotate(-90deg)',
                            left: -12,
                            top: 2,
                            width: 96,
                            height: 64,
                        }}
                    >
                        <Text style={{ ...s.smText }}> {shipping?.name || '-'}</Text>
                    </View>
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            transform: 'rotate(-90deg)',
                            position: 'absolute',
                            left: -16,
                            bottom: 38,
                            width: 128,
                            height: 64,
                        }}
                    >
                        <Text style={{ ...s.smText }}>{allRealizationData.paymentL}</Text>
                        <Text style={{ ...s.smText }}>{payment?.method || '-'}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}
