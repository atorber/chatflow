import {
  Body,
  Controller,
  Request,
  Post,
  Get,
  // UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AppService } from './app.service';
// import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './modules/auth/auth.service';
// import { LocalAuthGuard } from './modules/auth/local-auth.guard';
import { Public } from './modules/auth/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('auth/login')
  async login(@Body() signInDto: Record<string, any>) {
    const access_token_res = this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );
    return {
      code: 200,
      message: 'success',
      data: {
        access_token: (await access_token_res).access_token,
        expires_in: 36000000,
        type: 'Bearer',
      },
    };
  }

  @Get('profile')
  getProfile(@Request() req: any) {
    const user = {
      code: 200,
      message: 'success',
      data: {
        avatar:
          'https://im.gzydong.com/public/media/image/avatar/20230530/f76a14ce98ca684752df742974f5473a_200x200.png',
        birthday: '2023-06-11',
        email: '837215079@qq.com',
        gender: 2,
        id: 2055,
        mobile: '13800138000',
        motto: '...',
        nickname: '老牛逼了',
      },
    };
    user.data.nickname = req.user.username;
    user.data.id = req.user.userId;
    return user;
  }

  @Public()
  @Get('auth/loginGet')
  async loginGet(@Query() query: any, @Request() req: any) {
    console.info(query);
    return this.authService.login(req.user);
  }
}
