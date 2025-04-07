import { cn } from "@/lib/utils.js";
import React, { PropsWithChildren } from "react";

interface PageBlockProps {
  sidebar?: React.ReactNode;
  withoutPadding?: boolean;
  className?: string;
}

/**
 * A page block component that can be used to layout a page with a sidebar.
 *
 * @param {React.ReactNode} sidebar - The sidebar component.
 * @param {React.ReactNode} children - The children components.
 */
export const PageBlock: React.FC<PropsWithChildren<PageBlockProps>> = ({
  className,
  withoutPadding,
  children,
  sidebar,
}) => {
  return (
    <div
      className={cn(
        sidebar ? "grid grid-cols-[minmax(0,1fr)_400px] gap-4" : "w-full",
        withoutPadding ? "" : "p-4",
        className,
      )}
    >
      {children ? children : <div>Missing component</div>}
      {sidebar && <div className="flex flex-col gap-2">{sidebar}</div>}
    </div>
  );
};
