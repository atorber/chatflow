import { Module } from '@nestjs/common';
import { EmoticonController } from './emoticon.controller';
import { EmoticonsService } from './emoticons.service';

@Module({
  controllers: [EmoticonController],
  providers: [EmoticonsService],
})
export class EmoticonModule {}
