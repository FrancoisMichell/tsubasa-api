import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/config/decorators';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/users.entity';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/signup')
  @ApiOkResponse({ type: User })
  addUser(@Body() user: CreateUserDto): Promise<User> {
    return this.authService.singUp(user);
  }

  @Public()
  @Post('/login')
  @ApiOkResponse({ type: AuthEntity })
  async login(@Body() credentials: LoginDto) {
    return this.authService.login(credentials);
  }
}
