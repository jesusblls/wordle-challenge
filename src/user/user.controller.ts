import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUser: CreateUserDto) {
    return this.userService.login(loginUser);
  }

  @Get('top')
  async top() {
    return await this.userService.getTopPlayers();
  }

  @Get('stats')
  async stats(@Query() query: QueryUserDto) {
    return await this.userService.getUserStats(+query.userId);
  }
}
