import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ForbiddenException } from '@nestjs/common/exceptions';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<{ token: string }> {
    const user = await this.findByUsername(createUserDto.username);

    if (user)
      throw new ForbiddenException(
        'Ya existo un usuario con el nombre ' + createUserDto.username,
      );

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = new User();
    newUser.username = createUserDto.username;
    newUser.password = hashedPassword;
    await this.userRepository.save(newUser);

    const token = await jwt.sign(
      { username: newUser.username },
      process.env.JWT_SECRET,
    );

    return { token };
  }

  async login(loginUser: CreateUserDto): Promise<{ token: string }> {
    const user = await this.userRepository.findOneBy({
      username: loginUser.username,
    });

    if (!user) {
      throw new Error('Usuario o contraseña inválido');
    }

    const isValid = await bcrypt.compare(loginUser.password, user.password);

    if (!isValid) {
      throw new Error('Usuario o contraseña inválido');
    }

    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET);

    return { token };
  }

  async findByUsername(username: string): Promise<User> {
    return await this.userRepository.findOneBy({ username });
  }

  async findById(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }

  async incrementAttempts(userId: number): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });
    console.log(user);
    user.attempts++;
    await this.userRepository.save(user);
  }

  async incrementGames(userId: number): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });
    user.games++;
    await this.userRepository.save(user);
  }

  async incrementWins(userId: number): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });
    user.wins++;
    await this.userRepository.save(user);
  }

  async resetAttempts(): Promise<void> {
    const users = await this.userRepository.find();
    users.forEach(async (user) => {
      user.attempts = 0;
      await this.userRepository.save(user);
    });
  }

  async checkAttempts(userId: number): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ id: userId });
    console.log(user.attempts < 5);
    return user.attempts < 5;
  }

  async getUserStats(userId: number): Promise<{ games: number; wins: number }> {
    const user = await this.userRepository.findOneBy({ id: userId });

    return {
      games: user.games,
      wins: user.wins,
    };
  }

  async getTopPlayers(): Promise<{ username: string; wins: number }[]> {
    const players = await this.userRepository
      .createQueryBuilder()
      .orderBy('wins', 'DESC')
      .limit(10)
      .getMany();

    return players.map((player) => ({
      username: player.username,
      wins: player.wins,
    }));
  }
}
