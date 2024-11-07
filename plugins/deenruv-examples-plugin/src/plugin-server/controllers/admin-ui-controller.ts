import { Controller, Get, Res } from '@nestjs/common';

@Controller('admin-ui')
export class AdminUIController {
    constructor() {}

    @Get()
    async page(@Res() res: any) {
        res.send(`
            <html>
              <head>
                <title>Deenruv - Admin UI</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <script type="module" crossorigin src="http://localhost:9000/assets/assets/index.js"></script>
                <link rel="stylesheet" crossorigin href="http://localhost:9000/assets/assets/index.css">
              </head>
                <body>
                    <div id="root"></div>
                </body>
            </html>
          `);
    }
}
