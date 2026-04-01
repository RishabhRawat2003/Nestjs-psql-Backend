import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
    @Get()
    check() {
        return {
            title: "NestJS Postgres API",
            message: 'Health check successful',
            status: 'ok',
            uptime: process.uptime(),
            timestamp: new Date()
        };
    }
}