import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/server/auth';

export const dynamic='force-dynamic';

export default async function HomePage(){
  const user=await getCurrentUser();
  if(!user) redirect('/login');
  if(user.role==='partner') redirect('/partner/catalog');
  redirect('/internal/lots/new');
}
