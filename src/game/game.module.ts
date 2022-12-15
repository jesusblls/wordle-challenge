import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameResult } from './entities/game-result.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { WordsModule } from 'src/words/words.module';

@Module({
  controllers: [GameController],
  imports: [TypeOrmModule.forFeature([GameResult]), UserModule, WordsModule],
  providers: [GameService],
})
export class GameModule {}
