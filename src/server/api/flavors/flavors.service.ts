import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FlavorsService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    return this.prisma.flavor.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
      select: { code: true, name: true, active: true },
    });
  }
}
