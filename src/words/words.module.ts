import { Module } from '@nestjs/common';
import { WordsService } from './words.service';
import { WordsController } from './words.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Word } from './entities/word.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [WordsController],
  imports: [TypeOrmModule.forFeature([Word]), UserModule],
  providers: [WordsService],
  exports: [WordsService],
})
export class WordsModule {}
