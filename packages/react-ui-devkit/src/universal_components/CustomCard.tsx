import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/atoms/accordion.js";
import { Card, CardContent, CardFooter } from "@/components/atoms/card.js";
import { CustomCardHeader } from "./CustomCardHeader.js";
import { cn } from "@/lib/utils.js";
import React, {
  cloneElement,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

export type TailwindColor =
  | "slate"
  | "gray"
  | "zinc"
  | "neutral"
  | "stone"
  | "red"
  | "orange"
  | "amber"
  | "yellow"
  | "lime"
  | "green"
  | "emerald"
  | "teal"
  | "cyan"
  | "sky"
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "fuchsia"
  | "pink"
  | "rose";

export type CardVariant = "group";

const borderColorClassName: Record<TailwindColor, string> = {
  slate: "border-l-slate-500 dark:border-l-slate-300",
  gray: "border-l-gray-500 dark:border-l-gray-300",
  zinc: "border-l-zinc-500 dark:border-l-zinc-300",
  neutral: "border-l-neutral-500 dark:border-l-neutral-300",
  stone: "border-l-stone-500 dark:border-l-stone-300",
  red: "border-l-red-500 dark:border-l-red-300",
  orange: "border-l-orange-500 dark:border-l-orange-300",
  amber: "border-l-amber-500 dark:border-l-amber-300",
  yellow: "border-l-yellow-500 dark:border-l-yellow-300",
  lime: "border-l-lime-500 dark:border-l-lime-300",
  green: "border-l-green-500 dark:border-l-green-300",
  emerald: "border-l-emerald-500 dark:border-l-emerald-300",
  teal: "border-l-teal-500 dark:border-l-teal-300",
  cyan: "border-l-cyan-500 dark:border-l-cyan-300",
  sky: "border-l-sky-500 dark:border-l-sky-300",
  blue: "border-l-blue-500 dark:border-l-blue-300",
  indigo: "border-l-indigo-500 dark:border-l-indigo-300",
  violet: "border-l-violet-500 dark:border-l-violet-300",
  purple: "border-l-purple-500 dark:border-l-purple-300",
  fuchsia: "border-l-fuchsia-500 dark:border-l-fuchsia-300",
  pink: "border-l-pink-500 dark:border-l-pink-300",
  rose: "border-l-rose-500 dark:border-l-rose-300",
};

interface OrderCardTitleProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  upperRight?: ReactNode;
  bottomRight?: ReactNode;
  color?: TailwindColor;
  wrapperClassName?: string;
  collapsed?: boolean;
  notCollapsible?: boolean;
  variant?: "group";
}

export const CustomCard: React.FC<PropsWithChildren<OrderCardTitleProps>> = ({
  children,
  icon,
  description,
  title,
  upperRight,
  bottomRight,
  color,
  wrapperClassName,
  collapsed,
  notCollapsible,
  variant,
}) => {
  const textColor = "";
  const borderColor = color ? `border-l-4 ${borderColorClassName[color]}` : "";
  const baseClasses = "h-5 w-5";
  const defaultOpen = collapsed ? undefined : title;

  const iconWithClassName =
    icon && typeof icon === "object" && "type" in icon
      ? cloneElement(icon as ReactElement<{ className?: string }>, {
          className: `${baseClasses} ${textColor}`,
        })
      : icon;

  const [openItem, setOpenItem] = useState(defaultOpen);
  const [pendingValue, setPendingValue] = useState(defaultOpen);
  const [collapsing, setCollapsing] = useState(false);
  const [expanding, setExpanding] = useState(false);
  const collapseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleValueChange = (value: string | undefined) => {
    if (collapseTimeout.current) clearTimeout(collapseTimeout.current);

    const isCollapsing = Boolean(openItem && !value);
    const isExpanding = Boolean(!openItem && value);

    setCollapsing(isCollapsing);
    setExpanding(isExpanding);
    setPendingValue(value);

    collapseTimeout.current = setTimeout(() => {
      setOpenItem(value);
      setCollapsing(false);
      setExpanding(false);
    }, 250);
  };

  useEffect(() => {
    return () => {
      if (collapseTimeout.current) clearTimeout(collapseTimeout.current);
    };
  }, []);

  const HeaderJSX = (
    <CustomCardHeader
      {...{ description, title }}
      icon={iconWithClassName}
      isCollapsed={!openItem}
      fullWidth={notCollapsible}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="cursor-auto hover:no-underline"
      >
        {upperRight}
      </div>
    </CustomCardHeader>
  );

  return (
    <Accordion
      type="single"
      collapsible
      className={cn("w-full", wrapperClassName)}
      defaultValue={defaultOpen}
      value={pendingValue}
      onValueChange={handleValueChange}
    >
      <AccordionItem value={title} className="h-full border-none">
        <Card
          className={cn(
            "h-full transition-colors duration-200 hover:border-primary/20",
            variant === "group" &&
              "border-[1.5px] border-dashed bg-transparent shadow-none",
            borderColor,
            collapsing || expanding ? "overflow-hidden" : "overflow-visible",
          )}
        >
          {notCollapsible ? (
            HeaderJSX
          ) : (
            <AccordionTrigger
              className={cn("w-full p-0 pr-5 hover:no-underline")}
            >
              {HeaderJSX}
            </AccordionTrigger>
          )}
          <AccordionContent
            className="pb-0"
            wrapperClassName="overflow-visible"
          >
            <CardContent>{children}</CardContent>
            {bottomRight && (
              <CardFooter className="justify-end">{bottomRight}</CardFooter>
            )}
          </AccordionContent>
        </Card>
      </AccordionItem>
    </Accordion>
  );
};
