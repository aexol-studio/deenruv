import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import { numberToWordsPL } from "./utils";
import { PROFormaType } from "../types";
import { s } from "./stylesheet";
import { createTableHeader, createTableRow } from "./pdf-creating-helpers";

Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
});
Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
});
Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
});

export const PROFormaPDF = ({ data }: { data: PROFormaType }) => {
  return (
    <Document>
      <Page style={{ ...s.body, ...s.page }} size="A4">
        <Image src={data.logo} style={s.logo} />
        <View
          style={{
            ...s.flex,
            paddingHorizontal: 35,
            alignItems: "flex-end",
            gap: 8,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {data.title}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              textDecoration: "underline",
              marginBottom: 2,
            }}
          >
            {data.number}
          </Text>
        </View>

        <View
          style={{
            ...s.smText,
            ...s.flex,
            paddingHorizontal: 35,
            gap: 8,
            marginTop: 20,
            marginBottom: 8,
          }}
        >
          <Text>{data.dateL}</Text>
          <Text>{data.date}</Text>
        </View>
        <View
          style={{
            ...s.flex,
            paddingHorizontal: 35,
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <View style={{ ...s.flexCol, width: "100%" }}>
            <Text
              style={{
                ...s.mdText,
                fontWeight: "medium",
              }}
            >
              {data.sellerL}
            </Text>
            <View style={{ ...s.flexCol, fontSize: 10 }}>
              {Object.values(data.seller).map((value, index) => (
                <Text key={index}>{value}</Text>
              ))}
            </View>
            <View style={{ ...s.flexCol, marginTop: 8, fontSize: 10 }}>
              {Object.entries(data.sellerAdditional).map(
                ([key, value], index) => (
                  <View key={index} style={{ ...s.flex }}>
                    <Text>{key}: </Text>
                    <Text>{value}</Text>
                  </View>
                ),
              )}
            </View>
            <View style={{ ...s.flexCol, fontSize: 10, marginTop: 8 }}>
              <View style={{ ...s.flex }}>
                <Text>{data.bank.bankL} </Text>
                <Text>{data.bank.bank}</Text>
              </View>
              <View style={{ ...s.flex }}>
                <Text>{data.bank.accountL} </Text>
                <Text>{data.bank?.account}</Text>
              </View>
            </View>
          </View>
          <View style={{ ...s.flexCol, width: "100%" }}>
            <Text style={{ fontWeight: "medium", ...s.mdText }}>
              {data.buyerL}
            </Text>
            <View style={{ ...s.flexCol, fontSize: 10 }}>
              {Object.values(data.buyer).map((value, index) => (
                <Text key={index}>{value}</Text>
              ))}
            </View>
          </View>
        </View>

        <View
          style={{
            margin: "24 0 12 0",
            padding: "12 8",
            backgroundColor: "lightgrey",
          }}
        >
          <View style={{ display: "flex", width: "auto" }}>
            {createTableHeader({ headings: data.headings })}
            <View
              style={{ height: 1, width: "100%", backgroundColor: "black" }}
            />
            {data.products.map((product, index) => {
              return createTableRow({
                index,
                body: [
                  product.name,
                  product.quantity.toString(),
                  `${product.unitPrice}`,
                  `${product.nettoPrice}`,
                  `${product.discount}`,
                  `${product.nettoAfterDiscountPrice}`,
                  `${product.vat}%`,
                  `${product.vatPrice}`,
                  `${product.bruttoPrice}`,
                ],
              });
            })}
            {createTableRow({
              index: data.products.length + 1,
              body: [
                `${data.totalQ} `,
                `${Number(data.totalQuantity)}`,
                "",
                "",
                "",
                "",
                "",
                "",
                "",
              ],
              alignText: "right",
            })}
            <View
              style={{ width: "100%", height: 1, backgroundColor: "black" }}
            />
            <View
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-end",
              }}
            >
              <View
                style={{
                  ...s.flexCol,
                  width: "27.5%",
                  margin: "8 0 0 0",
                  padding: "8 0 0 0",
                }}
              >
                <View style={{ ...s.flex, ...s.mdText }}>
                  <View style={{ width: "100%", paddingLeft: "4" }}>
                    <Text>{data.sumL}</Text>
                  </View>
                </View>
                <View
                  style={{
                    width: "100%",
                    backgroundColor: "black",
                    margin: "2 0",
                    height: 1,
                  }}
                />
                <View style={{ ...s.flex, ...s.mdText }}>
                  <View
                    style={{ width: "100%", textAlign: "center", fontSize: 10 }}
                  >
                    {/* <Text>{data.vat}%</Text> */}
                  </View>

                  <View
                    style={{ width: "100%", textAlign: "center", fontSize: 10 }}
                  >
                    <Text>{data.totalVat}</Text>
                  </View>
                  <View
                    style={{ width: "100%", textAlign: "center", fontSize: 10 }}
                  >
                    <Text>{data.totalBrutto}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View
          style={{
            ...s.flexCol,
            alignItems: "flex-end",
            paddingHorizontal: 35,
            gap: 8,
          }}
        >
          <View>
            <View style={{ ...s.flex, ...s.smText }}>
              <Text>{data.payment.methodL} </Text>
              <Text>{data.payment.method}</Text>
            </View>
          </View>
          <View>
            <Text style={{ ...s.price }}>
              {data.sumFullL} <Text>{data.totalBrutto} PLN</Text>
            </Text>
            {data.showTextPrice ? (
              <View style={s.smText}>
                <Text>{data.showTextPriceL}: </Text>
                <Text>{numberToWordsPL(Number(data.totalBrutto))}</Text>
              </View>
            ) : null}
          </View>
        </View>
        <View
          style={{
            ...s.flex,
            ...s.smText,
            width: "100%",
            justifyContent: "space-between",
            position: "absolute",
            marginTop: 96,
            bottom: 64,
            paddingHorizontal: 24,
            gap: 16,
          }}
          fixed
        >
          <View
            style={{
              ...s.flexCol,
              gap: 4,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={{ width: "100%", ...s.borderB }} />
            <Text>{data.bottomL}</Text>
          </View>
          <View
            style={{
              ...s.flexCol,
              gap: 4,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={{ width: "100%", ...s.borderB }} />
            <Text>{data.bottomR}</Text>
          </View>
        </View>

        <Text
          style={s.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};
