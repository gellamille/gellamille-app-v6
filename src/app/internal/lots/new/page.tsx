import { randomUUID } from 'node:crypto';
import Link from 'next/link';
import type { FlavorDto, LotDto, OperatorDto } from '@/contracts';
import { apiFetch } from '@/lib/api/server';
import { CreateLotForm } from './create-lot-form';

export const metadata = { title: 'Új LOT' };

export default async function NewLotPage() {
  const [flavors, operators, recent] = await Promise.all([
    apiFetch<FlavorDto[]>('/flavors'),
    apiFetch<OperatorDto[]>('/operators'),
    apiFetch<LotDto[]>('/lots/recent?limit=8'),
  ]);

  return (
    <>
      <header className="topbar">
        <div>
          <h1>Új LOT</h1>
          <div className="muted small">Gyártási tétel biztonságos, éves terméksorszámmal.</div>
        </div>
      </header>
      <div className="grid-2">
        <section className="card">
          <h2>Új gyártási tétel</h2>
          <CreateLotForm flavors={flavors} operators={operators} createKey={randomUUID()} operatorKey={randomUUID()} />
        </section>
        <section className="card">
          <h2>Utolsó aktív LOT-ok</h2>
          {recent.length ? (
            <div className="table-wrap">
              <table>
                <thead><tr><th>LOT</th><th>Termék</th><th>Db</th><th>Gyártás</th></tr></thead>
                <tbody>
                  {recent.map((lot) => (
                    <tr key={lot.id}>
                      <td><Link className="code" href={`/internal/lots/${lot.id}`}>{lot.lotNumber}</Link></td>
                      <td>{lot.flavorName} · {lot.sizeMl} ml</td>
                      <td>{lot.quantity.toLocaleString('hu-HU')}</td>
                      <td>{lot.productionDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <div className="empty">Még nincs aktív LOT.</div>}
        </section>
      </div>
    </>
  );
}
