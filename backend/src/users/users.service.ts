import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  create(dto: CreateUserDto) {
    const user = this.repo.create(dto);
    return this.repo.save(user);
  }

  async findAll(page = 1, limit = 10, search?: string) {
    const safeLimit = Math.min(Math.max(1, Number(limit)), 100);
    const safePage = Math.max(1, Number(page));
    const skip = (safePage - 1) * safeLimit;

    const where = search
      ? [
          { name: ILike(`%${search}%`) },
          { email: ILike(`%${search}%`) },
        ]
      : undefined;

    const [data, total] = await this.repo.findAndCount({
      where,
      skip,
      take: safeLimit,
      order: { id: 'ASC' },
    });

    return {
      data,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.max(1, Math.ceil(total / safeLimit)),
      search: search || '',
    };
  }

  async findOne(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.repo.delete(id);
    if (!result.affected) throw new NotFoundException('User not found');
    return { message: 'User deleted' };
  }
}
