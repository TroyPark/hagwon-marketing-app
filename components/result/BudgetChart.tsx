'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { QuoteItem } from '@/types';

interface BudgetChartProps {
  items: QuoteItem[];
  adBudgetMultiplier: number;
}

const CHART_COLORS = ['#0F3460', '#E94560', '#533483', '#06D6A0', '#FFB703', '#FB8500'];

function formatKRW(n: number) {
  if (n === 0) return '-';
  if (n >= 10000) return `${(n / 10000).toFixed(0)}만원`;
  return `${n.toLocaleString()}원`;
}

export default function BudgetChart({ items, adBudgetMultiplier }: BudgetChartProps) {
  const pieData = items
    .filter(item => item.managementFee + (item.recommendedAdBudget * adBudgetMultiplier) > 0)
    .map(item => ({
      name: item.serviceName.length > 10 ? item.serviceName.substring(0, 10) + '...' : item.serviceName,
      value: item.managementFee + Math.round(item.recommendedAdBudget * adBudgetMultiplier),
    }));

  if (pieData.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
      <h4 className="font-bold text-[#0F3460] mb-4">예산 배분 현황</h4>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {pieData.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v: number) => formatKRW(v)} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
