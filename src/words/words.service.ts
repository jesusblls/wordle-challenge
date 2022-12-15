import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository, Equal } from 'typeorm';
import { Word } from './entities/word.entity';

@Injectable()
export class WordsService {
  constructor(
    @InjectRepository(Word)
    private readonly wordRepository: Repository<Word>,
    private readonly userService: UserService,
  ) {}

  async selectNewWord(): Promise<Word> {
    await this.userService.resetAttempts();
    const wordSelected = await this.wordRepository.findOneBy({
      selected: true,
    });
    if (wordSelected) {
      wordSelected.selected = false;
      await this.wordRepository.save(wordSelected);
    }
    let words = await this.wordRepository.query(
      'SELECT * FROM word WHERE used = false and length(word) = 5',
    );

    console.log(words);

    if (words.length === 0) {
      words = await this.wordRepository.query(
        'SELECT * FROM word WHERE length(word) = 5',
      );
      words.forEach((word) => {
        word.used = false;
        word.hits = 0;
      });
      await this.wordRepository.save(words);

      words = words.filter((word) => !word.used);
    }

    const index = Math.floor(Math.random() * words.length);
    const selectedWord = words[index];

    selectedWord.used = true;
    selectedWord.selected = true;
    await this.wordRepository.save(selectedWord);

    return selectedWord;
  }

  async getSelectedWord(): Promise<Word> {
    return await this.wordRepository.findOne({
      where: {
        selected: true,
      },
    });
  }

  async getTopWords(): Promise<{ word: string; hits: number }[]> {
    const words = await this.wordRepository
      .createQueryBuilder()
      .orderBy('hits', 'DESC')
      .limit(10)
      .getMany();

    return words.map((word) => ({
      word: word.word,
      hits: word.hits,
    }));
  }

  async incrementHits(wordId: number): Promise<void> {
    const word = await this.wordRepository.findOneBy({ id: wordId });
    word.hits++;
    await this.wordRepository.save(word);
  }
}
