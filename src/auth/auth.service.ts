import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

// todo necesito importar el AuthModule, en todos los modulos que necesito la autentificacion

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<any> {
    try {
      // mediante desextructuracion sacamos el valor del password
      const { password, ...userData } = createUserDto;
      // luego incertamos el password al create el USer, pero lo pasamos por el hashSync para encriptarla
      const user = await this.userModel.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      return { ...user, token: this.getJwToken({ id: user.id }) };
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
      }
      console.log(error);
    }
  }

  async checkStatus(user: User): Promise<any> {
    const userDb = await this.userModel.findById({ _id: user._id });
    if (!userDb) throw new UnauthorizedException('Credetials are not valid');
    const { id, password, email, fullName } = userDb;
    return {
      id,
      fullName,
      password,
      email,
      token: this.getJwToken({ id: userDb.id }),
    };
  }
  // metodo para hacer el login del usuario
  async login(loginUserDto: LoginUserDto) {
    // tomamos los datos del login
    const { password, email } = loginUserDto;
    // buscamos el user
    const user = await this.userModel.findOne({ email });
    // si el user no se encuentra, el email no es valido
    if (!user) {
      throw new UnauthorizedException('Credentials are not valid (email)');
    }
    // si la contraseña no es correcta, contraseña invalida
    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credentials are not valid (password)');
    }
    // retornamos un string, aun no necestio retorna el user
    // todo aca estamos retornando solamente el email y el token del usuario, si es necesario traer mas data
    return { email: user.email, token: this.getJwToken({ id: user.id }) };
  }

  private getJwToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
