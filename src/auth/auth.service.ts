import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { compare } from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthEntity } from './entity/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async singUp(userDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(userDto);
  }

  async login(credentials: LoginDto): Promise<AuthEntity> {
    let user: User;
    try {
      user = await this.usersService.findByEmail(credentials.email);
    } catch (error) {
      throw new ForbiddenException('Incorrect credentials');
    }

    if (await compare(credentials.password, user.password))
      return this.signToken(user.id, user.email);

    throw new ForbiddenException('Incorrect credentials');
  }

  async signToken(id: number, email: string): Promise<AuthEntity> {
    const payload = { sub: id, email };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('SECRET'),
    });

    return { accessToken: token };
  }
}
