import 'server-only';
import 'reflect-metadata';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/server/api/prisma/prisma.service';

declare global {
  // eslint-disable-next-line no-var
  var __gellamillePrisma: PrismaService | undefined;
}

export const prisma =
  globalThis.__gellamillePrisma ??
  new PrismaService(new ConfigService(process.env));

if (process.env.NODE_ENV !== 'production') {
  globalThis.__gellamillePrisma = prisma;
}
