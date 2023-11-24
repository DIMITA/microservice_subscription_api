import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from './users/dto/create-user.dto';

@Controller('/users')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('')
  create(@Body() createUserDto: CreateUserDto) {
    return this.appService.signup(createUserDto);
  }

  @Get('/verify/:token')
  findOne(@Param('token') token: string) {
    return this.appService.verification(token);
  }

  @Get()
  getUsers() {
    return this.appService.model.find();
  }
}
