'use server';

import { redirect } from 'next/navigation';
import type { ActionState } from '@/lib/action-state';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { prisma } from '@/server/prisma';

export async function loginAction(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const email=String(formData.get('email')??'').trim();
  const password=String(formData.get('password')??'');
  if(!email||!password) return {ok:false,message:'Az e-mail-cím és a jelszó kötelező.'};

  const supabase=await createSupabaseServerClient();
  const {data,error}=await supabase.auth.signInWithPassword({email,password});
  if(error||!data.user) return {ok:false,message:'Sikertelen belépés. Ellenőrizd az adatokat.'};

  const profile=await prisma.appUser.findUnique({where:{userId:data.user.id}});
  if(!profile?.active){ await supabase.auth.signOut(); return {ok:false,message:'Ehhez a fiókhoz nincs aktív hozzáférés.'}; }
  if(profile.role==='partner') redirect('/partner/catalog');
  redirect('/internal/lots/new');
}
