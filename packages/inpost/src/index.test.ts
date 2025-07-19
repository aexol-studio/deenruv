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
  INPOST_API_KEY:
    apiKey = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJkVzROZW9TeXk0OHpCOHg4emdZX2t5dFNiWHY3blZ0eFVGVFpzWV9TUFA4In0.eyJleHAiOjIwNjgyMTI4NTAsImlhdCI6MTc1Mjg1Mjg1MCwianRpIjoiOTMwZTgwMDktOWVlNS00ZDk3LWIyNGYtYTU4MjY0MDhjNmJlIiwiaXNzIjoiaHR0cHM6Ly9zYW5kYm94LWxvZ2luLmlucG9zdC5wbC9hdXRoL3JlYWxtcy9leHRlcm5hbCIsInN1YiI6ImY6N2ZiZjQxYmEtYTEzZC00MGQzLTk1ZjYtOThhMmIxYmFlNjdiOjhwX1FJamx6NVdMdFFJbFFhYXQ1c2ciLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzaGlweCIsInNlc3Npb25fc3RhdGUiOiIwZTQ1ZDk1YS04OGI3LTQ3NTUtOGRhZC01ZGNmNzQ0YTcwOWEiLCJzY29wZSI6Im9wZW5pZCBhcGk6YXBpcG9pbnRzIGFwaTpzaGlweCIsInNpZCI6IjBlNDVkOTVhLTg4YjctNDc1NS04ZGFkLTVkY2Y3NDRhNzA5YSIsImFsbG93ZWRfcmVmZXJyZXJzIjoiIiwidXVpZCI6IjYyMDA3YmMwLTI2YWUtNGVhMS1iMzAxLWNiMTI5YmJiZGFkMiIsImVtYWlsIjoiYWxla2I5OEB3cC5wbCJ9.fiA_978fXVdfYPCN11i_7c1KwnIkd9tmcUTiGnndaeG6mE6BNOdvfJOBjOzfGop7sR9kSaCLAyHuKq1SLQObjNhcq3IQO7dDzfuPdpYTY4HjzLZrVFG8xeMATO23Cq7LvchW_xyEeGbTir8qOx_AJvtrD4eWYvsv9qK-gI47tcmsYNUCed_ImLp0hOnNdZ1MQXXat2wF-zDy38nKOe0CfQ9QVEfiBS6Bh9nR5WKVtAXphGrxPJ8gs595t2bA2BGnr7XcIast7P8bzv2F9BI6xoiLobB0KKB_pSB065LyxgKD0el3VURCqvNZDsDCqUjax8lScbm3SvL1eIonx0470w",
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
        console.log("Waiting for shipment to be created...");
        await new Promise((resolve) => setTimeout(resolve, 500));
        shipment = await client.shipments().get(shipment.id).fetch();
      }

      shipment = await client
        .shipments()
        .get(shipment.id)
        .buy({ offer_id: shipment.offers[0].id });

      let found = shipment.transactions?.find(
        (t) => t.status === "success" && t.offer_id === shipment.offers?.[0].id,
      );

      while (!found) {
        console.log("Waiting for transaction to succeed...");
        await new Promise((resolve) => setTimeout(resolve, 500));
        shipment = await client.shipments().get(shipment.id).fetch();
        found = shipment.transactions?.find((t) => t.status === "success");
        if (!found) {
          await client
            .shipments()
            .get(shipment.id)
            .buy({ offer_id: shipment.offers[0].id });
        }
      }

      while (
        !shipment.status ||
        shipment.status === "created" ||
        shipment.status === "offer_selected"
      ) {
        console.log("Waiting for shipment to be ready...");
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
