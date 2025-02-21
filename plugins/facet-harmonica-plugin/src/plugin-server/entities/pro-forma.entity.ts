import { DeepPartial } from '@deenruv/common/lib/shared-types';
import { DeenruvEntity } from '@deenruv/core';
import { Column, Entity } from 'typeorm';

@Entity()
export class ProFormaEntity extends DeenruvEntity {
    constructor(input?: DeepPartial<ProFormaEntity>) {
        super(input);
    }

    @Column()
    proformaID: string;

    @Column()
    key: string;

    @Column()
    customerID: string;

    @Column()
    orderID: string;
}
