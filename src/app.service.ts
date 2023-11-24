import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './users/dto/create-user.dto';
import { Users } from './users/entities/user.entity';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

@Injectable()
export class AppService extends TypeOrmCrudService<Users> {
  constructor(
    @InjectRepository(Users) public repo,
    @InjectRepository(Users) public model: Repository<Users>,
    @Inject('MAIL_SERVICE') private readonly sendMailClient: ClientProxy,
  ) {
    super(repo);
    this.sendMailClient.connect();
  }

  public async signup(data: CreateUserDto) {
    try {
      const { email, password, firstname, lastname, username } = data;
      const checkUser = await this.model.findBy({ email })[0];
      if (checkUser) {
        throw new HttpException('USER_EXISTS', HttpStatus.CONFLICT);
      }
      const newUser = new Users();
      newUser.verifyToken = this.generateRandomString(22).trim();
      newUser.email = data.email;
      newUser.password = password;
      newUser.role = false;
      newUser.isVerify = false;
      newUser.firstname = firstname;
      newUser.username = username;
      newUser.lastname = lastname;
      const user = await this.model.save(newUser);

      // this.tokenClient.send('token_create', JSON.stringify(user)),
      const res = await this.sendMailClient.send(
        'notifications',
        JSON.stringify({
          user,
          token: 'http://localhost:3020/users/verify/' + user.verifyToken,
        }),
      );
      console.log(
        'res',
        res.subscribe((res) => res),
      );
      delete user.password;

      return {
        user,
      };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async verification(token: string): Promise<any> {
    const user: Users = (
      await this.model.find({ where: [{ verifyToken: token }] })
    )[0];

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.isVerify) {
      throw new HttpException(
        'Vous avez déja véfifié votre compte',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user) {
      user.isVerify = true;
      await this.updateUserLow(user.id, user);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { username, password, verifyToken, isVerify, ...rest } = user;
      return {
        message: 'Vous venez de vérifier votre compte',
        userInfo: rest,
      };
    }
  }

  async updateUserLow(id, dto: CreateUserDto) {
    const user = await this.model.update({ id }, dto);

    return user;
  }

  generateRandomString(num) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result1 = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
      result1 += characters.charAt(
        Math.floor(Math.random() * charactersLength),
      );
    }

    return result1;
  }
}
