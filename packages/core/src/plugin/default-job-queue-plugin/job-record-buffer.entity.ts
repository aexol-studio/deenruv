import { DeepPartial } from "@deenruv/common/lib/shared-types";
import { Column, Entity } from "typeorm";

import { DeenruvEntity } from "../../entity/base/base.entity";
import { JobConfig } from "../../job-queue/types";

@Entity()
export class JobRecordBuffer extends DeenruvEntity {
  constructor(input: DeepPartial<JobRecordBuffer>) {
    super(input);
  }

  @Column()
  bufferId: string;

  @Column("simple-json")
  job: JobConfig<any>;
}
