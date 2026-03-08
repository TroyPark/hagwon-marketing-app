'use client';

import { QuoteResult } from '@/types';

interface QuoteTableProps {
  quote: QuoteResult;
  adBudgetMultiplier: number;
}

function formatKRW(n: number) {
  if (n === 0) return '-';
  if (n >= 10000) return `${(n / 10000).toFixed(0)}만원`;
  return `${n.toLocaleString()}원`;
}

export default function QuoteTable({ quote, adBudgetMultiplier }: QuoteTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
      <table className="w-full text-sm">
        <thead className="bg-[#0F3460] text-white">
          <tr>
            <th className="text-left px-4 py-3">서비스</th>
            <th className="text-right px-4 py-3">관리비</th>
            <th className="text-right px-4 py-3">광고비(추천)</th>
            <th className="text-right px-4 py-3">세팅비(1회)</th>
            <th className="text-right px-4 py-3">월 합계</th>
          </tr>
        </thead>
        <tbody>
          {quote.items.map((item, i) => (
            <tr key={item.id} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="px-4 py-3">
                <div className="font-medium">{item.serviceName}</div>
                <div className="text-xs text-gray-500">{item.description.substring(0, 40)}...</div>
              </td>
              <td className="text-right px-4 py-3">{formatKRW(item.managementFee)}</td>
              <td className="text-right px-4 py-3">{formatKRW(Math.round(item.recommendedAdBudget * adBudgetMultiplier))}</td>
              <td className="text-right px-4 py-3 text-gray-500">{formatKRW(item.setupFee || 0)}</td>
              <td className="text-right px-4 py-3 font-bold">
                {formatKRW(item.managementFee + Math.round(item.recommendedAdBudget * adBudgetMultiplier))}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-[#0F3460] text-white font-bold">
            <td className="px-4 py-3">합계</td>
            <td className="text-right px-4 py-3">{formatKRW(quote.totalManagementFee)}</td>
            <td className="text-right px-4 py-3">{formatKRW(Math.round(quote.totalAdBudget * adBudgetMultiplier))}</td>
            <td className="text-right px-4 py-3">{formatKRW(quote.totalSetupFee)}</td>
            <td className="text-right px-4 py-3 text-[#E94560]">
              {formatKRW(quote.totalManagementFee + Math.round(quote.totalAdBudget * adBudgetMultiplier))}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
