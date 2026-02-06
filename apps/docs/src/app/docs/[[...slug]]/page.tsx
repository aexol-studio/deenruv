import { redirect } from "next/navigation";
import { i18n } from "@/lib/i18n";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await props.params;
  const path = slug ? slug.join("/") : "";
  redirect(`/${i18n.defaultLanguage}/docs${path ? `/${path}` : ""}`);
}
