import { Controller, Get } from '@nestjs/common';

@Controller('/api/v1/emoticon')
export class EmoticonController {
  @Get('list')
  getEmoticon() {
    return {
      code: 200,
      message: 'success',
      data: {
        collect_emoticon: [],
        sys_emoticon: [],
      },
    };
  }
}
