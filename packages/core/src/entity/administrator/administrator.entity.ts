import { type DeepPartial } from "@deenruv/common/shared-types";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { SoftDeletable } from "../../common/types/common-types";
import { HasCustomFields } from "../../config/custom-field/custom-field-types";
import { DeenruvEntity } from "../base/base.entity";
import { CustomAdministratorFields } from "../custom-entity-fields";
import { User } from "../user/user.entity";

/**
 * @description
 * An administrative user who has access to the Admin UI and Admin API. The
 * specific permissions of the Administrator are determined by the assigned
 * {@link Role}s.
 *
 * @docsCategory entities
 */
@Entity()
export class Administrator
  extends DeenruvEntity
  implements SoftDeletable, HasCustomFields
{
  constructor(input?: DeepPartial<Administrator>) {
    super(input);
  }

  @Column({ type: Date, nullable: true })
  deletedAt: Date | null;

  @Column() firstName: string;

  @Column() lastName: string;

  @Column({ unique: true })
  emailAddress: string;

  @OneToOne((type) => User)
  @JoinColumn()
  user: User;

  @Column((type) => CustomAdministratorFields)
  customFields: CustomAdministratorFields;
}
