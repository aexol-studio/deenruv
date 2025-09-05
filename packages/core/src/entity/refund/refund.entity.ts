import { type DeepPartial, type ID } from "@deenruv/common/shared-types";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  type Relation,
} from "typeorm";

import type { PaymentMetadata } from "../../common/types/common-types";
import type { RefundState } from "../../service/helpers/refund-state-machine/refund-state";
import { DeenruvEntity } from "../base/base.entity";
import { EntityId } from "../entity-id.decorator";
import { Money } from "../money.decorator";
import { RefundLine } from "../order-line-reference/refund-line.entity";
import { Payment } from "../payment/payment.entity";

/**
 * @description A refund the belongs to an order
 *
 * @docsCategory entities
 */
@Entity()
export class Refund extends DeenruvEntity {
  constructor(input?: DeepPartial<Refund>) {
    super(input);
  }

  /**
   * @deprecated Since v2.2, the `items` field will not be used by default. Instead, the `total` field
   * alone will be used to determine the refund amount.
   */
  @Money() items: number;

  /**
   * @deprecated Since v2.2, the `shipping` field will not be used by default. Instead, the `total` field
   * alone will be used to determine the refund amount.
   */
  @Money() shipping: number;

  /**
   * @deprecated Since v2.2, the `adjustment` field will not be used by default. Instead, the `total` field
   * alone will be used to determine the refund amount.
   */
  @Money() adjustment: number;

  @Money() total: number;

  @Column() method: string;

  @Column({ nullable: true }) reason: string;

  @Column("varchar") state: RefundState;

  @Column({ nullable: true }) transactionId: string;

  @OneToMany((type) => RefundLine, (line) => line.refund)
  @JoinTable()
  lines: RefundLine[];

  @Index()
  @ManyToOne((type) => Payment, (payment) => payment.refunds)
  @JoinColumn()
  payment: Relation<Payment>;

  @EntityId()
  paymentId: ID;

  @Column("simple-json") metadata: PaymentMetadata;
}
