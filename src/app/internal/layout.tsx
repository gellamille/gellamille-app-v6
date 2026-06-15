import { redirect } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { getCurrentUser } from '@/server/auth';

export const dynamic='force-dynamic';

export default async function InternalLayout({children}:{children:React.ReactNode}){
  const user=await getCurrentUser();
  if(!user) redirect('/login');
  if(user.role!=='admin'&&user.role!=='staff') redirect('/partner/catalog');
  return <AppShell email={user.email}>{children}</AppShell>;
}
