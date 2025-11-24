import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Pool } from 'pg';
import QueryStream from 'pg-query-stream';
import { Response } from 'express';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { format } from '@fast-csv/format';

const pipelineAsync = promisify(pipeline);

@Injectable()
export class UsersService {
  private pool: Pool;

  constructor(private prisma: PrismaService) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined');
    }

    this.pool = new Pool({ connectionString });
  }

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

    if (trimmedSearch && trimmedSearch.length > 0) {
      // Search by phone number (case-insensitive partial match)
      orConditions.push({
        phonenumber: { contains: trimmedSearch, mode: 'insensitive' },
      });

      // Search by ID only if the search term is short enough to be a reasonable ID
      // (IDs are typically small integers, phone numbers are 7-15 digits)
      const digitsOnly = trimmedSearch.replace(/[^0-9]/g, '');
      if (digitsOnly && digitsOnly.length > 0 && digitsOnly.length <= 6) {
        const numericSearch = Number(digitsOnly);
        if (!Number.isNaN(numericSearch) && numericSearch > 0) {
          orConditions.push({ id: numericSearch });
        }
      }
    }

    const where = orConditions.length > 0 ? { OR: orConditions } : undefined;

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

  async streamExport(res: Response) {
    const client = await this.pool.connect();
    let released = false;

    const releaseClient = () => {
      if (!released) {
        released = true;
        try {
          client.release();
        } catch {}
      }
    };

    try {
      const query = new QueryStream(
        `SELECT id, userid, phonenumber FROM "customers" ORDER BY id ASC`
      );

      const dbStream = client.query(query);
      const csvStream = format({ headers: true });

      res.set({
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="customers.csv"',
        'Cache-Control': 'no-store, no-transform',
        'Transfer-Encoding': 'chunked',
        'Access-Control-Expose-Headers': 'Content-Disposition',
      });      

      try {
        res.flushHeaders?.();
      } catch {}

      const cleanup = () => {
        try {
          dbStream.destroy();
        } catch {}
        try {
          csvStream.destroy();
        } catch {}
        releaseClient();
      };

      res.on('close', cleanup);
      res.on('finish', cleanup);
      res.on('error', cleanup);

      await pipelineAsync(dbStream, csvStream, res);

      releaseClient();
    } catch (error) {
      console.error('CSV Export Failed:', error);

      releaseClient();

      if (!res.headersSent) {
        throw new InternalServerErrorException('Failed to export CSV');
      }

      if (!res.writableEnded) res.end();
    }
  }
}
