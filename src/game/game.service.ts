import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Word } from 'src/words/entities/word.entity';
import { WordsService } from 'src/words/words.service';
import { Repository } from 'typeorm';
import { CompareResponseDto, WordPoints } from './dto/compare-response.dto';
import { GameResult } from './entities/game-result.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameResult)
    private readonly gameResultRepository: Repository<GameResult>,
    private readonly userService: UserService,
    private readonly wordsService: WordsService,
  ) {}

  async compareWords(
    userWord: string,
    userId: number,
    selectedWord: Word,
  ): Promise<CompareResponseDto> {
    console.log(userWord, selectedWord.word);

    const user = await this.userService.findById(userId);

    if (!user)
      throw new ForbiddenException('No existe el usuario con el id ' + userId);

    if (userWord.length !== 5 || selectedWord.word.length !== 5) {
      throw new ForbiddenException('Ambas palabras deben de tener 5 letras');
    }

    await this.validateTime(Date.parse(selectedWord.updatedAt + ''));

    const lastGame = await this.getLastGameByUserId(userId);
    if (lastGame && lastGame?.selectedWord != selectedWord.word) {
      await this.userService.incrementGames(userId);
    }

    const hasWon = await this.didUserWin(userId, selectedWord.word);

    if (hasWon) throw new ForbiddenException('Ya has ganado con esta palabra');

    const attempts = await this.userService.checkAttempts(userId);

    if (!attempts) throw new ForbiddenException('No tienes mas oportunidades');

    const result = [];

    for (let i = 0; i < userWord.length; i++) {
      const userLetter = userWord[i].toLowerCase();
      const selectedLetter = selectedWord.word[i].toLowerCase();

      if (userLetter === selectedLetter) {
        result.push({ letter: userLetter, value: 1 });
      } else if (selectedWord.word.includes(userLetter)) {
        result.push({ letter: userLetter, value: 2 });
      } else {
        result.push({ letter: userLetter, value: 3 });
      }
    }

    await this.userService.incrementAttempts(userId);

    let win = false;
    if (result.every((r) => r.value === 1)) {
      win = true;
      await this.userService.incrementWins(userId);
      await this.wordsService.incrementHits(selectedWord.id);
    }

    await this.gameResultRepository.save({
      user,
      result,
      selectedWord: selectedWord.word,
      isWinner: win,
    });

    return {
      request_body: userWord.toUpperCase(),
      response: [result as WordPoints],
    };
  }

  async validateTime(wordActiveDateTime: number): Promise<void> {
    const now = Date.now();
    const elapsedTime = (now - wordActiveDateTime) / 60000;
    console.log('elapsed time', elapsedTime);
    if (elapsedTime >= 5) {
      await this.wordsService.selectNewWord();
      throw new ForbiddenException(
        'Se ha cambiado la palabra, intenta de nuevo',
      );
    }
  }

  async didUserWin(userId: number, selectedWord: string) {
    const results = await this.gameResultRepository.findBy({
      selectedWord,
      isWinner: true,
      user: { id: userId },
    });
    return results.length > 0;
  }

  async getLastGameByUserId(userId: number): Promise<GameResult> {
    const result = await this.gameResultRepository
      .createQueryBuilder()
      .where({ user: { id: userId } })
      .orderBy('created_at', 'DESC')
      .skip(0)
      .take(1)
      .getOne();

    return result;
  }
}
