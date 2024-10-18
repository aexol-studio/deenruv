import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { s } from "./stylesheet";

export const createTableHeader = ({ headings }: { headings: string[] }) => {
  return (
    <View style={s.flex} fixed>
      {headings.map((heading, index) => (
        <View
          key={heading}
          style={
            index === 0 ? { width: "25%", minWidth: "25%" } : { width: "100%" }
          }
        >
          <Text
            style={{
              textAlign: "center",
              margin: 4,
              fontSize: 8,
              fontWeight: "bold",
            }}
          >
            {heading}
          </Text>
        </View>
      ))}
    </View>
  );
};

export const createTableRow = ({
  index,
  alignText,
  body,
}: {
  index: number;
  body: string[];
  alignText?: "right" | "center";
}) => {
  const minWidth = alignText === "right" ? "21%" : "25%";
  return (
    <View
      key={index}
      style={{
        flexDirection: "row",
      }}
    >
      {body.map((cell, index) => (
        <View
          key={cell}
          style={index === 0 ? { width: "25%", minWidth } : { width: "100%" }}
        >
          <Text
            style={{
              textAlign: alignText ?? "center",
              margin: 5,
              fontSize: 10,
            }}
          >
            {cell}
          </Text>
        </View>
      ))}
    </View>
  );
};
