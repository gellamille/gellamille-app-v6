import type { AnalyticsBucketDto, AnalyticsResponseDto } from '@/contracts';
import { apiFetch } from '@/lib/api/server';

export const metadata = { title: 'Elemzés' };

function today(): string {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

function presetDates(preset: string): { from: string; to: string } {
  const current = new Date(`${today()}T12:00:00`);
  const toIso = (date: Date) => new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);

  if (preset === 'today') return { from: today(), to: today() };

  if (preset === 'current_week') {
    const start = new Date(current);
    const weekday = start.getDay() || 7;
    start.setDate(start.getDate() - weekday + 1);
    return { from: toIso(start), to: today() };
  }

  if (preset === 'previous_week') {
    const start = new Date(current);
    const weekday = start.getDay() || 7;
    start.setDate(start.getDate() - weekday - 6);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return { from: toIso(start), to: toIso(end) };
  }

  if (preset === 'previous_month') {
    const start = new Date(current.getFullYear(), current.getMonth() - 1, 1);
    const end = new Date(current.getFullYear(), current.getMonth(), 0);
    return { from: toIso(start), to: toIso(end) };
  }

  if (preset === 'all') return { from: '', to: '' };

  return {
    from: `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-01`,
    to: today(),
  };
}

function SummaryTable({
  rows,
  label,
  formatter = (value) => value,
}: {
  rows: AnalyticsBucketDto[];
  label: string;
  formatter?: (value: string) => string;
}) {
  if (!rows.length) return <div className="empty">Nincs adat.</div>;
  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th>{label}</th><th>Aktív LOT</th><th>Darabszám</th><th>Sztornózott</th></tr></thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              <td>{formatter(row.key)}</td>
              <td>{row.activeLots.toLocaleString('hu-HU')}</td>
              <td>{row.units.toLocaleString('hu-HU')}</td>
              <td>{row.voidedLots.toLocaleString('hu-HU')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const preset = typeof params.preset === 'string' ? params.preset : 'current_month';
  const defaults = presetDates(preset);
  const from = typeof params.from === 'string' ? params.from : defaults.from;
  const to = typeof params.to === 'string' ? params.to : defaults.to;
  const query = new URLSearchParams();
  if (from) query.set('from', from);
  if (to) query.set('to', to);
  const data = await apiFetch<AnalyticsResponseDto>(`/analytics?${query.toString()}`);
  const maxUnits = Math.max(1, ...data.products.map((item) => item.units));

  return (
    <>
      <header className="topbar">
        <div>
          <h1>Elemzés</h1>
          <div className="muted small">Aktív termelés és sztornózott tételek szerveroldali összesítése.</div>
        </div>
      </header>

      <section className="card">
        <form className="toolbar" method="get">
          <div className="toolbar-group">
            <div>
              <label htmlFor="preset">Időszak</label>
              <select id="preset" name="preset" defaultValue={preset}>
                <option value="today">Ma</option>
                <option value="current_week">Aktuális hét</option>
                <option value="previous_week">Előző hét</option>
                <option value="current_month">Aktuális hónap</option>
                <option value="previous_month">Előző hónap</option>
                <option value="all">Teljes időszak</option>
                <option value="custom">Egyedi dátumtartomány</option>
              </select>
            </div>
            <div><label htmlFor="from">Kezdőnap</label><input id="from" name="from" type="date" defaultValue={from} /></div>
            <div><label htmlFor="to">Zárónap</label><input id="to" name="to" type="date" defaultValue={to} /></div>
            <button className="button button-secondary" type="submit">Frissítés</button>
          </div>
        </form>
      </section>

      <div className="grid-3 analytics-stats">
        <div className="stat"><div className="stat-label">Aktív LOT-ok</div><div className="stat-value">{data.summary.activeLots.toLocaleString('hu-HU')}</div></div>
        <div className="stat"><div className="stat-label">Legyártott darabszám</div><div className="stat-value">{data.summary.units.toLocaleString('hu-HU')}</div></div>
        <div className="stat"><div className="stat-label">Sztornózott LOT-ok</div><div className="stat-value">{data.summary.voidedLots.toLocaleString('hu-HU')}</div></div>
      </div>

      <div className="grid-2 analytics-grid">
        <section className="card"><h2>Napi bontás</h2><SummaryTable rows={data.daily} label="Dátum" /></section>
        <section className="card">
          <h2>Termékenkénti darabszám</h2>
          {data.products.length ? (
            <div className="progress-list">
              {data.products.map((product) => (
                <div className="progress-row" key={product.key}>
                  <div>{product.flavorName} · {product.sizeMl} ml</div>
                  <progress max={maxUnits} value={product.units} />
                  <strong>{product.units.toLocaleString('hu-HU')} db</strong>
                </div>
              ))}
            </div>
          ) : <div className="empty">Nincs adat.</div>}
        </section>
        <section className="card"><h2>Heti bontás</h2><SummaryTable rows={data.weekly} label="Hét kezdete" /></section>
        <section className="card"><h2>Havi bontás</h2><SummaryTable rows={data.monthly} label="Hónap" formatter={(value) => `${value.replace('-', '.')}.`} /></section>
        <section className="card full analytics-product-card">
          <h2>Termékenkénti összesítés</h2>
          {data.products.length ? (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Termék</th><th>Kiszerelés</th><th>Aktív LOT</th><th>Darabszám</th><th>Sztornózott</th></tr></thead>
                <tbody>
                  {data.products.map((product) => (
                    <tr key={product.key}>
                      <td>{product.flavorName}<div className="muted small">{product.flavorCode}</div></td>
                      <td>{product.sizeMl} ml</td>
                      <td>{product.activeLots.toLocaleString('hu-HU')}</td>
                      <td>{product.units.toLocaleString('hu-HU')}</td>
                      <td>{product.voidedLots.toLocaleString('hu-HU')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <div className="empty">Nincs adat.</div>}
        </section>
      </div>
    </>
  );
}
