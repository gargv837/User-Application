import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const last = await this.prisma.customer.findFirst({
      orderBy: { userid: 'desc' },
      select: { userid: true },
    });
  
    const nextUserId = last ? last.userid + 1 : 1;
  
    return this.prisma.customer.create({
      data: {
        ...dto,
        userid: nextUserId,
      },
    });
  }

  async findAll(page?: number, limit?: number, search?: string) {
    const trimmedSearch = search?.trim();
    const orConditions: Array<Record<string, unknown>> = [];
  
    if (trimmedSearch) {
      orConditions.push({
        phonenumber: { contains: trimmedSearch, mode: 'insensitive' },
      });
  
      const idSearch = Number(trimmedSearch);
      if (!Number.isNaN(idSearch)) {
        orConditions.push({ id: idSearch });
      }
    }
  
    const where = orConditions.length ? { OR: orConditions } : undefined;

    if (!page && !limit) {
      const data = await this.prisma.customer.findMany({
        where,
        orderBy: { id: 'desc' },
      });
  
      return {
        data,
        total: data.length,
        page: null,
        limit: null,
        totalPages: 1,
        search: search || '',
      };
    }
  
    const safeLimit = Math.min(Math.max(1, Number(limit)), 100);
    const safePage = Math.max(1, Number(page));
    const skip = (safePage - 1) * safeLimit;
  
    const [data, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip,
        take: safeLimit,
        orderBy: { id: 'desc' },
      }),
      this.prisma.customer.count({ where }),
    ]);
  
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
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.prisma.customer.update({
      where: { id },
      data: dto,
    });
    return this.findOne(id);
  }

  async remove(id: number) {
    try {
      await this.prisma.customer.delete({
        where: { id },
      });
      return { message: 'Customer deleted' };
    } catch (error) {
      throw new NotFoundException('Customer not found');
    }
  }
}
