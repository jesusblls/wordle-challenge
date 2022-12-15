import { GameResult } from 'src/game/entities/game-result.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 150, unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ type: 'bigint', default: 0 })
  attempts: number;

  @Column({ type: 'bigint', default: 0 })
  games: number;

  @Column({ type: 'bigint', default: 0 })
  wins: number;

  @OneToMany(() => GameResult, (gameResult) => gameResult.user)
  gameResults: GameResult[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
