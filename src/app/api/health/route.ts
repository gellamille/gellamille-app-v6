import { NextResponse } from 'next/server';
import { prisma } from '@/server/prisma';

export async function GET(){
  await prisma.$queryRaw`SELECT 1`;
  return NextResponse.json({status:'ok',service:'gellamille-app',timestamp:new Date().toISOString()});
}
