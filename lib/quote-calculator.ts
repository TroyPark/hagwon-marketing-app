import { QuoteItem, QuoteResult, ChannelScore, BudgetTier } from '@/types';

export const CHANNEL_QUOTES: Record<string, QuoteItem> = {
  naver_search_ad: {
    id: 'naver_search_ad',
    category: '네이버 광고',
    serviceName: '네이버 검색광고 (파워링크)',
    description: '지역 키워드 기반 검색 상단 노출. 높은 구매 의도 키워드 타겟',
    managementFee: 200000,
    recommendedAdBudget: 300000,
    minAdBudget: 100000,
    isRequired: false,
    isOneTime: false,
    setupFee: 150000,
  },
  naver_place_ad: {
    id: 'naver_place_ad',
    category: '네이버 광고',
    serviceName: '네이버 플레이스 광고',
    description: '네이버 지도 상단 노출. 위치 기반 학부모 접근성 극대화',
    managementFee: 150000,
    recommendedAdBudget: 200000,
    minAdBudget: 100000,
    isRequired: false,
    isOneTime: false,
    setupFee: 0,
  },
  google_search: {
    id: 'google_search',
    category: '구글 광고',
    serviceName: '구글 검색광고',
    description: '구글에서 교육 키워드 검색 시 상단 노출. 클릭비용 저렴하고 효율 우수',
    managementFee: 200000,
    recommendedAdBudget: 250000,
    minAdBudget: 100000,
    isRequired: false,
    isOneTime: false,
    setupFee: 150000,
  },
  google_display: {
    id: 'google_display',
    category: '구글 광고',
    serviceName: '구글 디스플레이/유튜브 광고',
    description: '유튜브 및 구글 파트너 사이트 배너/영상 광고. 브랜드 인지도 및 리타겟팅 특화',
    managementFee: 250000,
    recommendedAdBudget: 300000,
    minAdBudget: 150000,
    isRequired: false,
    isOneTime: false,
    setupFee: 150000,
  },
  meta_ad: {
    id: 'meta_ad',
    category: '메타 광고',
    serviceName: '메타 광고 (Facebook/Instagram)',
    description: '학부모·학생 정밀 타겟팅. 관심사·연령·지역별 타겟 설정으로 잠재 학생 직접 도달',
    managementFee: 250000,
    recommendedAdBudget: 300000,
    minAdBudget: 150000,
    isRequired: false,
    isOneTime: false,
    setupFee: 150000,
  },
  naver_blog: {
    id: 'naver_blog',
    category: '콘텐츠 마케팅',
    serviceName: '네이버 블로그 운영 대행',
    description: '월 4~8건 최적화 포스팅. 장기 SEO 효과로 검색 상위 노출 및 학원 신뢰도 향상',
    managementFee: 300000,
    recommendedAdBudget: 0,
    minAdBudget: 0,
    isRequired: false,
    isOneTime: false,
    setupFee: 0,
  },
  sns_mgmt: {
    id: 'sns_mgmt',
    category: '콘텐츠 마케팅',
    serviceName: '인스타그램 SNS 운영 대행',
    description: '월 12~16포스팅 + 스토리 운영. 학원 일상/성과/이벤트 콘텐츠로 팔로워 확보',
    managementFee: 350000,
    recommendedAdBudget: 0,
    minAdBudget: 0,
    isRequired: false,
    isOneTime: false,
    setupFee: 0,
  },
  homepage: {
    id: 'homepage',
    category: '웹 제작',
    serviceName: '학원 랜딩페이지 제작',
    description: '광고 효율을 극대화하는 전환율 최적화 랜딩페이지. 상담 신청/전화 유도 특화',
    managementFee: 0,
    recommendedAdBudget: 0,
    minAdBudget: 0,
    isRequired: false,
    isOneTime: true,
    setupFee: 800000,
  },
  kakao_ad: {
    id: 'kakao_ad',
    category: '카카오 광고',
    serviceName: '카카오 광고 (모먼츠/채널)',
    description: '카카오 타임라인 배너광고 + 카카오톡 채널 운영. 30~50대 학부모 접근에 효과적',
    managementFee: 150000,
    recommendedAdBudget: 200000,
    minAdBudget: 100000,
    isRequired: false,
    isOneTime: false,
    setupFee: 0,
  },
  consulting: {
    id: 'consulting',
    category: '컨설팅',
    serviceName: '마케팅 진단 컨설팅',
    description: '현황 분석 + 경쟁사 조사 + 채널별 전략 수립. 마케팅 방향이 불명확한 경우 우선 권장',
    managementFee: 0,
    recommendedAdBudget: 0,
    minAdBudget: 0,
    isRequired: false,
    isOneTime: true,
    setupFee: 300000,
  },
  naver_blog_mgmt: {
    id: 'naver_blog_mgmt',
    category: '콘텐츠 마케팅',
    serviceName: '네이버 블로그 운영 대행',
    description: '월 4~8건 최적화 포스팅. 장기 SEO 효과로 검색 상위 노출 및 학원 신뢰도 향상',
    managementFee: 300000,
    recommendedAdBudget: 0,
    minAdBudget: 0,
    isRequired: false,
    isOneTime: false,
    setupFee: 0,
  },
};

export function calculateQuote(channels: ChannelScore[], budgetTier: BudgetTier): QuoteResult {
  const items: QuoteItem[] = [];
  const topChannels = channels.slice(0, 4).map(c => c.channel);

  let totalManagementFee = 0;
  let totalAdBudget = 0;
  let totalSetupFee = 0;

  for (const channelId of topChannels) {
    const quote = CHANNEL_QUOTES[channelId];
    if (!quote) continue;
    items.push(quote);
    totalManagementFee += quote.managementFee;
    totalAdBudget += quote.recommendedAdBudget;
    totalSetupFee += quote.setupFee || 0;
  }

  // Budget adjustment: if total exceeds budget tier max * 10000, trim
  const budgetMax = budgetTier.max * 10000;
  const currentTotal = totalManagementFee + totalAdBudget;
  if (budgetMax > 0 && currentTotal > budgetMax && items.length > 1) {
    // Remove last item if over budget
    const removed = items.pop();
    if (removed) {
      totalManagementFee -= removed.managementFee;
      totalAdBudget -= removed.recommendedAdBudget;
      totalSetupFee -= removed.setupFee || 0;
    }
  }

  return {
    items,
    totalManagementFee,
    totalAdBudget,
    totalSetupFee,
    monthlyTotal: totalManagementFee + totalAdBudget,
  };
}
