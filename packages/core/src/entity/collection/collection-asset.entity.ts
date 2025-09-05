import { type DeepPartial, type ID } from "@deenruv/common/src/shared-types";
import { type Relation, Column, Entity, Index, ManyToOne } from "typeorm";

import { OrderableAsset } from "../asset/orderable-asset.entity";

import { Collection } from "./collection.entity";

@Entity()
export class CollectionAsset extends OrderableAsset {
  constructor(input?: DeepPartial<CollectionAsset>) {
    super(input);
  }
  @Column()
  collectionId: ID;

  @Index()
  @ManyToOne((type) => Collection, (collection) => collection.assets, {
    onDelete: "CASCADE",
  })
  collection: Relation<Collection>;
}
