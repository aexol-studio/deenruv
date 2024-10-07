// product-review.entity.ts
import { DeepPartial } from '@deenruv/common/lib/shared-types';
import { DeenruvEntity, DeenruvPlugin } from '@deenruv/core';
import { Column, Entity } from 'typeorm';

@Entity()
export class TestEntityA extends DeenruvEntity {
    constructor(input?: DeepPartial<TestEntityA>) {
        super(input);
    }

    @Column()
    textA: string;
}

@Entity()
export class TestEntityB extends DeenruvEntity {
    constructor(input?: DeepPartial<TestEntityA>) {
        super(input);
    }

    @Column()
    textB: string;
}

@DeenruvPlugin({
    entities: () => {
        return DynamicEntitiesPlugin.useEntity === 'A' ? [TestEntityA] : [TestEntityB];
    },
})
export class DynamicEntitiesPlugin {
    static useEntity: 'A' | 'B';
    static init(options: { useEntity: 'A' | 'B' }) {
        this.useEntity = options.useEntity;
        return this;
    }
}
