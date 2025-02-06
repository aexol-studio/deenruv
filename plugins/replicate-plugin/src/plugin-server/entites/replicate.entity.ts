import { DeenruvEntity } from '@deenruv/core';
import { Entity, Column } from 'typeorm';
import type { DeepPartial } from '@deenruv/core';
import 'reflect-metadata';

@Entity()
export class ReplicateEntity extends DeenruvEntity {
    constructor(input?: DeepPartial<ReplicateEntity>) {
        super(input);
    }

    @Column({ nullable: true, type: 'varchar', length: 255 })
    prediction_id: string;
}
