import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GameService } from './game.service';

import { WordsService } from 'src/words/words.service';
import { GameDto } from './dto/game.dto';

@Controller('game')
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly wordsService: WordsService,
  ) {}

  @Post('compare')
  async compare(@Body() body: GameDto) {
    let selectedWord = await this.wordsService.getSelectedWord();
    if (!selectedWord) {
      selectedWord = await this.wordsService.selectNewWord();
    }
    return await this.gameService.compareWords(
      body.userWord,
      body.userId,
      selectedWord,
    );
  }
}
