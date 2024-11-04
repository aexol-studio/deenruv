import React from "react";
import { Section } from "../../components/Section";
import { ComponentConfig } from "@measured/puck";
import { getClassNameFactory } from "../../getClassNameFactory";
import styles from "./styles.module.css";

const getClassName = getClassNameFactory("Stats", styles);

export type StatsProps = {
  items: {
    title: string;
    description: string;
  }[];
};

export const Stats: ComponentConfig<StatsProps> = {
  fields: {
    items: {
      type: "array",
      getItemSummary: (item, i) => item.title || `Feature #${i}`,
      defaultItemProps: {
        title: "Title",
        description: "Description",
      },
      arrayFields: {
        title: { type: "text" },
        description: { type: "text" },
      },
    },
  },
  defaultProps: {
    items: [
      {
        title: "Stat",
        description: "1,000",
      },
    ],
  },
  render: ({ items }) => {
    return (
      <Section className={getClassName()} maxWidth={"916px"}>
        <div className={getClassName("items")}>
          {items.map((item, i) => (
            <div key={i} className={getClassName("item")}>
              <div className={getClassName("label")}>{item.title}</div>
              <div className={getClassName("value")}>{item.description}</div>
            </div>
          ))}
        </div>
      </Section>
    );
  },
};
