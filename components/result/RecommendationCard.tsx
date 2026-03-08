'use client';

import { ChannelScore, QuoteItem } from '@/types';

interface RecommendationCardProps {
  channel: ChannelScore;
  rank: number;
  insight: string;
  quoteItem?: QuoteItem;
  topScore: number;
}

const CHANNEL_NAMES: Record<string, string> = {
  naver_search_ad: '네이버 검색광고',
  naver_place_ad: '네이버 플레이스',
  meta_ad: '메타 광고',
  google_search: '구글 검색광고',
  google_display: '구글 디스플레이',
  naver_blog_mgmt: '네이버 블로그',
  sns_mgmt: 'SNS 운영',
  homepage: '랜딩페이지',
  kakao_ad: '카카오 광고',
  consulting: '마케팅 컨설팅',
};

function formatKRW(n: number) {
  if (n === 0) return '-';
  if (n >= 10000) return `${(n / 10000).toFixed(0)}만원`;
  return `${n.toLocaleString()}원`;
}

export default function RecommendationCard({ channel, rank, insight, quoteItem, topScore }: RecommendationCardProps) {
  const rankColors = ['bg-yellow-400', 'bg-gray-400', 'bg-amber-600'];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 ${rankColors[rank] || 'bg-blue-500'}`}>
          {rank + 1}
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-bold text-[#0F3460]">{CHANNEL_NAMES[channel.channel] || channel.channel}</h4>
          <p className="text-gray-600 text-sm mt-1">{insight}</p>
          <div className="mt-3">
            <div className="text-xs text-gray-500 mb-1">우선순위 점수</div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-[#0F3460] rounded-full"
                style={{ width: `${Math.min(100, (channel.score / topScore) * 100)}%` }}
              />
            </div>
          </div>
          {quoteItem && (
            <div className="mt-3 flex gap-4 text-sm">
              <span className="text-gray-500">관리비: <strong>{formatKRW(quoteItem.managementFee)}</strong></span>
              <span className="text-gray-500">광고비: <strong>{formatKRW(quoteItem.recommendedAdBudget)}</strong></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
