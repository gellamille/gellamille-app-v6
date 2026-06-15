import { Injectable } from '@nestjs/common';
import { parseDateOnly } from '../common/utils/date.utils';
import { PrismaService } from '../prisma/prisma.service';
import type { AnalyticsQueryDto } from './analytics.dto';

interface BucketRow {
  key: string;
  active_lots: number;
  voided_lots: number;
  units: number;
}

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async get(query: AnalyticsQueryDto) {
    const from = query.from ? parseDateOnly(query.from) : null;
    const to = query.to ? parseDateOnly(query.to) : null;

    const [summaryRows, daily, weekly, monthly, productRows] = await Promise.all([
      this.prisma.$queryRaw<Array<{ active_lots: number; voided_lots: number; units: number }>>`
        SELECT
          COUNT(*) FILTER (WHERE status = 'active')::int AS active_lots,
          COUNT(*) FILTER (WHERE status = 'void')::int AS voided_lots,
          COALESCE(SUM(quantity) FILTER (WHERE status = 'active'), 0)::int AS units
        FROM public.lots
        WHERE (${from}::date IS NULL OR production_date >= ${from})
          AND (${to}::date IS NULL OR production_date <= ${to})
      `,
      this.prisma.$queryRaw<BucketRow[]>`
        SELECT
          to_char(production_date, 'YYYY-MM-DD') AS key,
          COUNT(*) FILTER (WHERE status = 'active')::int AS active_lots,
          COUNT(*) FILTER (WHERE status = 'void')::int AS voided_lots,
          COALESCE(SUM(quantity) FILTER (WHERE status = 'active'), 0)::int AS units
        FROM public.lots
        WHERE (${from}::date IS NULL OR production_date >= ${from})
          AND (${to}::date IS NULL OR production_date <= ${to})
        GROUP BY production_date
        ORDER BY production_date
      `,
      this.prisma.$queryRaw<BucketRow[]>`
        SELECT
          to_char(date_trunc('week', production_date), 'YYYY-MM-DD') AS key,
          COUNT(*) FILTER (WHERE status = 'active')::int AS active_lots,
          COUNT(*) FILTER (WHERE status = 'void')::int AS voided_lots,
          COALESCE(SUM(quantity) FILTER (WHERE status = 'active'), 0)::int AS units
        FROM public.lots
        WHERE (${from}::date IS NULL OR production_date >= ${from})
          AND (${to}::date IS NULL OR production_date <= ${to})
        GROUP BY date_trunc('week', production_date)
        ORDER BY date_trunc('week', production_date)
      `,
      this.prisma.$queryRaw<BucketRow[]>`
        SELECT
          to_char(date_trunc('month', production_date), 'YYYY-MM') AS key,
          COUNT(*) FILTER (WHERE status = 'active')::int AS active_lots,
          COUNT(*) FILTER (WHERE status = 'void')::int AS voided_lots,
          COALESCE(SUM(quantity) FILTER (WHERE status = 'active'), 0)::int AS units
        FROM public.lots
        WHERE (${from}::date IS NULL OR production_date >= ${from})
          AND (${to}::date IS NULL OR production_date <= ${to})
        GROUP BY date_trunc('month', production_date)
        ORDER BY date_trunc('month', production_date)
      `,
      this.prisma.$queryRaw<
        Array<BucketRow & { flavor_code: string; flavor_name: string; size_ml: number }>
      >`
        SELECT
          l.flavor_code || '|' || l.size_ml::text AS key,
          l.flavor_code,
          f.name AS flavor_name,
          l.size_ml,
          COUNT(*) FILTER (WHERE l.status = 'active')::int AS active_lots,
          COUNT(*) FILTER (WHERE l.status = 'void')::int AS voided_lots,
          COALESCE(SUM(l.quantity) FILTER (WHERE l.status = 'active'), 0)::int AS units
        FROM public.lots l
        JOIN public.flavors f ON f.code = l.flavor_code
        WHERE (${from}::date IS NULL OR l.production_date >= ${from})
          AND (${to}::date IS NULL OR l.production_date <= ${to})
        GROUP BY l.flavor_code, f.name, l.size_ml
        ORDER BY units DESC, f.name, l.size_ml
      `,
    ]);

    const mapBucket = (row: BucketRow) => ({
      key: row.key,
      activeLots: row.active_lots,
      voidedLots: row.voided_lots,
      units: row.units,
    });

    const summary = summaryRows[0] ?? { active_lots: 0, voided_lots: 0, units: 0 };
    return {
      summary: {
        activeLots: summary.active_lots,
        voidedLots: summary.voided_lots,
        units: summary.units,
      },
      daily: daily.map(mapBucket),
      weekly: weekly.map(mapBucket),
      monthly: monthly.map(mapBucket),
      products: productRows.map((row) => ({
        ...mapBucket(row),
        flavorCode: row.flavor_code,
        flavorName: row.flavor_name,
        sizeMl: row.size_ml,
      })),
    };
  }
}
