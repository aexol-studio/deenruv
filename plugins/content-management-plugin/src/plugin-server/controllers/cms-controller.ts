import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { Ctx, RequestContext } from '@deenruv/core';
import { CMSService } from '../services/cms.service';
import { Response } from 'express';

@Controller('content-management-plugin/views')
export class CMSController {
    constructor(private CMSService: CMSService) {}

    @Get(':slug')
    getProject(@Ctx() ctx: RequestContext, @Param('slug') slug: string) {
        console.log('GETTING', slug);
        return this.CMSService.getEntry(ctx, slug);
    }

    @Post(':slug')
    async updateProject(
        @Ctx() ctx: RequestContext,
        @Param('slug') slug: string,
        @Res() res: Response,
        @Body()
        body: { data: { root: { props: object }; content: []; zones: object } },
    ) {
        console.log('SAVING', slug);
        await this.CMSService.upsertEntry(ctx, slug, {
            root: JSON.stringify(body.data.root),
            content: JSON.stringify(body.data.content),
            zones: JSON.stringify(body.data.zones),
        });
        res.status(HttpStatus.OK).send();
    }
}
