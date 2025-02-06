import { Body, Controller, Get, Inject, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { ReplicateService } from '../services/replicate.service';
import { Allow, Ctx, Permission, RequestContext } from '@deenruv/core';
import { Args } from '@nestjs/graphql';
import { PredictionType } from '../graphql/generated-admin-types.js';

@Controller('api/replicate')
export class ReplicateController {
    constructor(@Inject(ReplicateService) private replicateService: ReplicateService) {}

    @Get('training/start')
    async synchronize(
        @Res() res: Response,
        @Ctx() ctx: RequestContext,
        @Args() { input }: { input: { numLastOrder: number; startDate: string; endDate: string } },
    ) {
        await this.replicateService.modelTrainingJob(ctx, input);
        return res.send('Job started  - model training started');
    }

    @Get('order/export')
    async exportOrder(
        @Res() res: Response,
        @Ctx() ctx: RequestContext,
        @Body()
        input: {
            numLastOrder: number;
            startDate: string;
            endDate: string;
            predictType: PredictionType;
            showMetrics: boolean;
        },
    ) {
        const prediction_id = await this.replicateService.orderExportJob(ctx, input);
        return res.send(prediction_id);
    }
}
