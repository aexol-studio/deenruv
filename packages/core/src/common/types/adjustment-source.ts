import {
  Adjustment,
  AdjustmentType,
} from "@deenruv/common/lib/generated-types";
import { ID } from "@deenruv/common/lib/shared-types";

import { DeenruvEntity } from "../../entity/base/base.entity";

export type TestResult = boolean | object;

export abstract class AdjustmentSource extends DeenruvEntity {
  type: AdjustmentType;

  getSourceId(): string {
    return `${this.type}:${this.id}`;
  }

  static decodeSourceId(sourceId: string): { type: AdjustmentType; id: ID } {
    const [type, id] = sourceId.split(":");
    return {
      type: type as AdjustmentType,
      id: Number.isNaN(+id) ? id : +id,
    };
  }

  abstract test(...args: any[]): TestResult | Promise<TestResult>;
  abstract apply(
    ...args: any[]
  ): Adjustment | undefined | Promise<Adjustment | undefined>;
}
