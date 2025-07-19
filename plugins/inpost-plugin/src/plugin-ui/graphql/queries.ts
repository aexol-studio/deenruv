import { typedGql } from "../zeus/typedDocumentNode";
import { scalars } from "./scalars";
import { $ } from "../zeus";

const query = typedGql("query", { scalars });

export const GET_INPOST_CONFIG = query({
  getInpostConfig: {
    host: true,
    apiKey: true,
    geowidgetKey: true,
    inpostOrganization: true,
    service: true,
  },
});

export const GET_INPOST_ORGANIZATIONS = query({
  getInpostOrganizations: [
    { input: $("input", "GetInpostOrganizationsInput!") },
    { items: { id: true, name: true, services: true } },
  ],
});
