import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { Auth, GetUser, RawHeaders } from './decorators';
import { User } from './entities/user.entity';
import { UserRolesGuard } from './guards/user-roles/user-roles.guard';
import { RoleProtected } from './decorators/role-protected/role-protected.decorator';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-auth-status')
  // todo necesito perdir el token, de ahi puedo tomar el id
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkStatus(user);
  }
  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[],
  ) {
    console.log(request);
    return {
      ok: true,
      message: 'Chupalo',
      user,
      userEmail,
      rawHeaders,
    };
  }

  @Get('private2')
  // usando el RoleProtected, es como administro que tipo de usuario puede acceder a uno ruta
  @RoleProtected()
  @UseGuards(AuthGuard(), UserRolesGuard)
  testingRoute(@GetUser() user: User) {
    return {
      ok: 'Todo Listo',
      user,
    };
  }

  @Get('private3')
  // usando el RoleProtected, es como administro que tipo de usuario puede acceder a uno ruta
  @Auth(ValidRoles.admin)
  nuesvoTestingRoute(@GetUser() user: User) {
    return {
      ok: 'Todo Listo',
      user,
    };
  }
}
