import { ConflictException, Injectable } from '@nestjs/common';
import type { AuthenticatedUser } from '@/contracts';
import { AuditService } from '../prisma/audit.service';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateOperatorDto } from './operators.dto';

@Injectable()
export class OperatorsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async list() {
    return this.prisma.operator.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, active: true },
    });
  }

  async create(dto: CreateOperatorDto, user: AuthenticatedUser, requestId: string) {
    const name = dto.name.trim().replace(/\s+/g, ' ');
    const matches = await this.prisma.$queryRaw<Array<{ id: bigint; active: boolean }>>`
      SELECT id, active
      FROM public.operators
      WHERE lower(trim(name)) = lower(${name})
      LIMIT 1
    `;

    const existing = matches[0];
    if (existing) {
      if (existing.active) {
        throw new ConflictException('Már létezik ilyen nevű felelős személy.');
      }
      const restored = await this.prisma.operator.update({
        where: { id: existing.id },
        data: { active: true, updatedAt: new Date(), version: { increment: 1 } },
      });
      await this.audit.write({
        actorUserId: user.id,
        action: 'operator.reactivate',
        entityType: 'operator',
        entityId: restored.id.toString(),
        afterData: restored,
        requestId,
      });
      return restored;
    }

    const created = await this.prisma.operator.create({
      data: { name, createdBy: user.id },
    });
    await this.audit.write({
      actorUserId: user.id,
      action: 'operator.create',
      entityType: 'operator',
      entityId: created.id.toString(),
      afterData: created,
      requestId,
    });
    return created;
  }
}
