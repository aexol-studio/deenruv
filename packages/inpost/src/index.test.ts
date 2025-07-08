import { describe, it } from "node:test";
import { doesNotReject, notEqual } from "node:assert";
import { Client, CountryCode } from "./index.js";
import { createWriteStream } from "fs";
import { tmpdir } from "node:os";
import { mkdtemp, rm } from "fs/promises";
import { join } from "node:path";
import { Writable } from "node:stream";

const {
  INPOST_HOST: host = "sandbox-api-shipx-pl.easypack24.net",
  INPOST_API_KEY: apiKey,
} = process.env as {
  INPOST_HOST: string;
  INPOST_API_KEY: string;
};

describe("inpost client tests", { skip: !apiKey }, () => {
  const client = new Client({ host, apiKey });
  it("lists organizations", () => doesNotReject(client.organizations().list()));
  it("fetches organization", () =>
    doesNotReject(
      client
        .organizations()
        .list()
        .then((orgs) => client.organizations().get(orgs.items[0].id).fetch()),
    ));
  it("fetches shipments", () =>
    doesNotReject(
      client
        .organizations()
        .list()
        .then((orgs) =>
          client.organizations().get(orgs.items[0].id).shipments().list(),
        ),
    ));
  it("test shipment flow", () =>
    doesNotReject(async () => {
      const orgs = await client.organizations().list();
      const org = orgs.items[0];
      // is not falsy
      notEqual(!!org, false);
      let shipment = await client
        .organizations()
        .get(org.id)
        .shipments()
        .create({
          receiver: {
            first_name: "Test",
            last_name: "Test",
            email: "email@example.org",
            phone: "321321321",
            address: {
              street: "Czerniakowska",
              building_number: "87A",
              city: "Warszawa",
              post_code: "00-718",
              country_code: CountryCode.pl,
            },
          },
          sender: {
            company_name: "Company_name",
            first_name: "Test",
            last_name: "Test",
            email: "email@example.com",
            phone: "888000000",
            address: {
              line1: "Cybernetyki 10",
              city: "Warszawa",
              post_code: "02-677",
              country_code: CountryCode.pl,
            },
          },
          parcels: [{ template: "small" }],
          service: "inpost_locker_standard",
          custom_attributes: {
            target_point: "KRA010",
          },
        });
      while (!shipment.status || shipment.status === "created") {
        await new Promise((resolve) => setTimeout(resolve, 500));
        shipment = await client.shipments().get(shipment.id).fetch();
      }
      shipment = await client
        .shipments()
        .get(shipment.id)
        .buy({ offer_id: shipment.offers[0].id });
      while (
        !shipment.status ||
        shipment.status === "created" ||
        shipment.status === "offer_selected"
      ) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        shipment = await client.shipments().get(shipment.id).fetch();
      }
      const tmp = await mkdtemp(join(tmpdir(), "test-inpost-label"));
      const label = await client.shipments().get(shipment.id).label();
      await label.pipeTo(
        Writable.toWeb(
          createWriteStream(join(tmp, "label.pdf")),
        ) as WritableStream<Uint8Array>,
      );
      await rm(tmp, { force: true, recursive: true });
    }));
});
