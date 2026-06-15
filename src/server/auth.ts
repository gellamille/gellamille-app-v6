import 'server-only';
import { cache } from 'react';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import type { AppRole, AuthenticatedUser } from '@/contracts';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { prisma } from './prisma';

export const getCurrentUser = cache(async (): Promise<AuthenticatedUser | null> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  const profile = await prisma.appUser.findUnique({
    where: { userId: data.user.id },
  });
  if (!profile?.active) return null;

  return {
    id: profile.userId,
    email: profile.email ?? data.user.email ?? null,
    role: profile.role as AppRole,
    partnerId: profile.partnerId?.toString() ?? null,
  };
});

export async function requireUser(roles?: AppRole[]): Promise<AuthenticatedUser> {
  const user = await getCurrentUser();
  if (!user) throw new UnauthorizedException('Bejelentkezés szükséges.');
  if (roles && !roles.includes(user.role)) {
    throw new ForbiddenException('Ehhez a művelethez nincs jogosultságod.');
  }
  return user;
}
