'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { KPIData } from '@/types';

interface KPIExpectedProps {
  kpiData: KPIData;
}

export default function KPIExpected({ kpiData }: KPIExpectedProps) {
  const trendData = [1, 2, 3].map(month => ({
    month: `${month}개월`,
    클릭수: Math.round(kpiData.monthlyClicks * month * (0.7 + month * 0.1)),
    상담문의: Math.round(kpiData.monthlyConsultations * month * (0.6 + month * 0.15)),
    신규등록: Math.round(kpiData.monthlyNewStudents * month * (0.5 + month * 0.2)),
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: '예상 월 클릭수', value: `${kpiData.monthlyClicks.toLocaleString()}회`, icon: '👆' },
          { label: '예상 월 노출수', value: `${kpiData.monthlyImpressions.toLocaleString()}회`, icon: '👁️' },
          { label: '예상 상담 문의', value: `${kpiData.monthlyConsultations}건`, icon: '📞' },
          { label: '예상 신규 등록', value: `${kpiData.monthlyNewStudents}명`, icon: '🎓' },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <div className="text-2xl mb-2">{item.icon}</div>
            <div className="text-xs text-gray-500 mb-1">{item.label}</div>
            <div className="text-xl font-bold text-[#0F3460]">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h4 className="font-bold text-[#0F3460] mb-4">3개월 누적 성과 예측</h4>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="클릭수" stroke="#0F3460" strokeWidth={2} />
            <Line type="monotone" dataKey="상담문의" stroke="#E94560" strokeWidth={2} />
            <Line type="monotone" dataKey="신규등록" stroke="#06D6A0" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
