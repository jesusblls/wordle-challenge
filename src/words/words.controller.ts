import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WordsService } from './words.service';
import { CompareUserWordDto } from './dto/compare-user-word.dto';
import { UserService } from 'src/user/user.service';

@Controller('words')
export class WordsController {
  constructor(
    private readonly wordsService: WordsService,
    private readonly userService: UserService,
  ) {}
}
