import { redirect } from "next/navigation";
import { i18n } from "@/lib/i18n";
import type { ReactNode } from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Layout({ children }: { children: ReactNode }) {
  redirect(`/${i18n.defaultLanguage}/docs`);
}
