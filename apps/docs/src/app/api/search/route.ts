import { source } from "@/lib/source";
import { createFromSource } from "fumadocs-core/search/server";

const server = createFromSource(source, {
  localeMap: {
    // Polish ("pl") is not supported by Orama — fall back to English tokenizer
    // to avoid "Language 'pl' is not supported" build/runtime errors.
    // https://docs.orama.com/docs/orama-js/supported-languages
    en: { language: "english" },
    pl: { language: "english" },
  },
});

export const { GET } = server;
