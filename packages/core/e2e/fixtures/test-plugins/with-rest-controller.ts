import { Controller, Get } from '@nestjs/common';
import { Permission } from '@deenruv/common/lib/generated-shop-types';
import { Allow, InternalServerError, DeenruvPlugin } from '@deenruv/core';

@Controller('test')
export class TestController {
    @Get('public')
    publicRoute() {
        return 'success';
    }

    @Allow(Permission.Authenticated)
    @Get('restricted')
    restrictedRoute() {
        return 'success';
    }

    @Get('bad')
    badRoute() {
        throw new InternalServerError('uh oh!');
    }
}

@DeenruvPlugin({
    controllers: [TestController],
})
export class TestRestPlugin {}
