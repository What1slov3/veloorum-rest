import { Module } from '@nestjs/common';
import { PushService } from './push.service';
import { PushController } from './push.controller';

@Module({
  providers: [PushService],
  controllers: [PushController]
})
export class PushModule {}
