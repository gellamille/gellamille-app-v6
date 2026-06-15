import { redirect } from 'next/navigation';
import type { PartnerPortalBootstrapDto } from '@/contracts';
import { PartnerShell } from '@/components/partner-shell';
import { ApiError, apiFetch } from '@/lib/api/server';
import { getCurrentUser } from '@/server/auth';

export const dynamic='force-dynamic';

export default async function PartnerLayout({children}:{children:React.ReactNode}){
  const user=await getCurrentUser();
  if(!user) redirect('/login');
  if(user.role!=='partner') redirect('/internal/lots/new');
  let bootstrap:PartnerPortalBootstrapDto;
  try{ bootstrap=await apiFetch<PartnerPortalBootstrapDto>('/partner-portal/bootstrap'); }
  catch(error){ if(error instanceof ApiError&&error.status===403) redirect('/access-denied'); throw error; }
  return <PartnerShell email={user.email} partnerName={bootstrap.profile.partnerName}>{children}</PartnerShell>;
}
