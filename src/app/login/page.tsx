import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/server/auth';
import { LoginForm } from './login-form';

export const metadata = { title: 'Belépés' };

export default async function LoginPage() {
  const user=await getCurrentUser();
  if(user?.role==='partner') redirect('/partner/catalog');
  if(user) redirect('/internal/lots/new');
  return (
    <main className="login-shell">
      <section className="card login-card">
        <div className="brand login-brand">
          <img src="/icon-192.png" width={54} height={54} alt="Gellamille" />
          <div>
            <div className="brand-title">Gellamille</div>
            <div className="brand-subtitle">Belső és partneri rendszer</div>
          </div>
        </div>
        <h2>Belépés</h2>
        <LoginForm />
      </section>
    </main>
  );
}
