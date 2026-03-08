import { SurveyAnswers, BudgetTier, ChannelScore, KPIData, ActionPlanItem } from '@/types';

export function getBudgetTier(budgetAnswer: string): BudgetTier {
  const tiers: Record<string, BudgetTier> = {
    under_30: { tier: 'basic', min: 0, max: 30, label: '기본형' },
    '30_50': { tier: 'starter', min: 30, max: 50, label: '스타터' },
    '50_100': { tier: 'standard_low', min: 50, max: 100, label: '스탠다드 (소)' },
    '100_200': { tier: 'standard', min: 100, max: 200, label: '스탠다드' },
    '200_300': { tier: 'growth', min: 200, max: 300, label: '그로스' },
    '300_500': { tier: 'premium', min: 300, max: 500, label: '프리미엄' },
    over_500: { tier: 'enterprise', min: 500, max: 1000, label: '엔터프라이즈' },
  };
  return tiers[budgetAnswer] || tiers['50_100'];
}

const LOCATION_LABELS: Record<string, string> = {
  seoul_gangnam: '서울 강남/서초/송파',
  seoul_other: '서울',
  gyeonggi_major: '경기 주요 도시',
  gyeonggi_other: '경기',
  incheon: '인천',
  busan_daegu: '부산/대구',
  other_metro: '광역시',
  other_city: '지방',
};

const CATEGORY_LABELS: Record<string, string> = {
  math: '수학',
  english: '영어',
  korean: '국어/논술',
  science: '과학',
  coding: '코딩/IT',
  art: '미술/음악',
  sports: '체육/무용',
  language: '외국어',
  exam: '수능/입시',
  elementary: '초등 통합',
  kids: '유아/어린이',
  adult: '성인 교육',
  other: '기타',
};

const AGE_LABELS: Record<string, string> = {
  infant: '유아',
  elementary_low: '초등 저학년',
  elementary_high: '초등 고학년',
  middle: '중학생',
  high: '고등학생',
  adult: '성인/직장인',
};

export function calculateChannelPriority(answers: SurveyAnswers): ChannelScore[] {
  const scores: Record<string, number> = {
    naver_search_ad: 0,
    naver_place_ad: 0,
    meta_ad: 0,
    google_search: 0,
    google_display: 0,
    naver_blog_mgmt: 0,
    sns_mgmt: 0,
    homepage: 0,
    kakao_ad: 0,
    consulting: 0,
  };

  const goalWeights: Record<string, Record<string, number>> = {
    new_student: { naver_search_ad: 30, meta_ad: 20, naver_place_ad: 20 },
    brand_awareness: { meta_ad: 25, sns_mgmt: 25, naver_blog_mgmt: 20 },
    consultation: { naver_search_ad: 25, google_search: 20, homepage: 15 },
    local_domination: { naver_place_ad: 30, naver_search_ad: 25, naver_blog_mgmt: 15 },
    event: { meta_ad: 25, kakao_ad: 20, naver_search_ad: 15 },
    premium: { sns_mgmt: 25, naver_blog_mgmt: 20, google_display: 15 },
    retention: { kakao_ad: 25, sns_mgmt: 20 },
    online_class: { google_display: 20, meta_ad: 20, sns_mgmt: 15 },
  };

  const categoryWeights: Record<string, Record<string, number>> = {
    math: { naver_search_ad: 15, naver_place_ad: 10 },
    english: { naver_search_ad: 15, meta_ad: 10 },
    coding: { google_search: 15, sns_mgmt: 15 },
    art: { sns_mgmt: 20, meta_ad: 15 },
    exam: { naver_search_ad: 20, naver_blog_mgmt: 15 },
    kids: { meta_ad: 20, naver_place_ad: 15 },
    adult: { google_search: 20, meta_ad: 15 },
  };

  const problemSolutions: Record<string, Record<string, number>> = {
    no_knowledge: { consulting: 30 },
    no_time: { naver_search_ad: 10, meta_ad: 10 },
    no_effect: { consulting: 20, homepage: 15 },
    no_content: { sns_mgmt: 20, naver_blog_mgmt: 15 },
    no_budget: { naver_place_ad: 20, naver_search_ad: 10 },
  };

  // Apply goal weights
  answers.Q10?.forEach(goal => {
    const weights = goalWeights[goal] || {};
    Object.entries(weights).forEach(([ch, w]) => {
      scores[ch] = (scores[ch] || 0) + w;
    });
  });

  // Apply category weights
  const catWeight = categoryWeights[answers.Q1 || ''] || {};
  Object.entries(catWeight).forEach(([ch, w]) => {
    scores[ch] = (scores[ch] || 0) + w;
  });

  // Apply problem solutions
  const problem = answers.Q8 || '';
  const probWeight = problemSolutions[problem] || {};
  Object.entries(probWeight).forEach(([ch, w]) => {
    scores[ch] = (scores[ch] || 0) + w;
  });

  // Adjust for homepage need
  if (answers.Q14 === 'no_need' || answers.Q14 === 'yes_bad') {
    scores.homepage = (scores.homepage || 0) + 20;
  }

  // Sort by score desc
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([channel, score]) => ({ channel, score }));
}

export function generateInsights(answers: SurveyAnswers, channels: ChannelScore[]): Record<string, string> {
  const insights: Record<string, string> = {};
  const location = LOCATION_LABELS[answers.Q2 || ''] || '해당 지역';
  const subject = CATEGORY_LABELS[answers.Q1 || ''] || '학원';
  const targets = answers.Q3?.map(t => AGE_LABELS[t]).filter(Boolean).join(', ') || '학생';

  channels.slice(0, 5).forEach(({ channel }) => {
    switch (channel) {
      case 'naver_search_ad':
        insights[channel] = `${location} 지역에서 "${subject} 학원" 검색 시 상단 노출. 구매 의도가 높은 학부모가 직접 검색하는 채널로 즉각적인 상담 문의 증가 효과`;
        break;
      case 'naver_place_ad':
        insights[channel] = `${location} 네이버 지도에서 학원 검색 시 상단 표시. 위치 기반 노출로 도보권 학부모에게 직접 도달하는 가장 효율적인 채널`;
        break;
      case 'meta_ad':
        insights[channel] = `${targets} 학부모를 정밀 타겟팅. 지역 반경 3~5km 내 관심 학부모에게 직접 도달하여 브랜드 인지도와 상담 문의를 동시에 높임`;
        break;
      case 'google_search':
        insights[channel] = `구글에서 ${subject} 관련 키워드 검색 시 상단 노출. 네이버 대비 클릭비용이 저렴하고 성인/직장인 타겟에 특히 효과적`;
        break;
      case 'google_display':
        insights[channel] = `유튜브 및 구글 파트너 사이트에 배너/영상 광고 노출. 브랜드 인지도 향상과 리타겟팅으로 잠재 학부모의 재방문 유도`;
        break;
      case 'naver_blog_mgmt':
      case 'naver_blog':
        insights[channel] = `월 4~8건 최적화 블로그 포스팅으로 장기 SEO 효과. "${location} ${subject} 학원 추천" 등의 키워드로 검색 상위 노출 확보`;
        break;
      case 'sns_mgmt':
        insights[channel] = `인스타그램 월 12~16포스팅으로 학원 일상/성과/이벤트 콘텐츠 운영. ${targets} 부모들의 팔로워 확보 및 바이럴 효과`;
        break;
      case 'kakao_ad':
        insights[channel] = `카카오 타임라인 및 채널을 통해 30~50대 학부모에게 직접 도달. 친숙한 카카오 환경에서 높은 클릭률 기대`;
        break;
      case 'homepage':
        insights[channel] = `전환율 최적화 랜딩페이지로 광고 효율 극대화. 상담 신청/전화 유도 특화 설계로 광고비 대비 ROI 향상`;
        break;
      case 'consulting':
        insights[channel] = `현황 분석 + 경쟁사 조사 + 채널별 전략 수립. 마케팅 방향 재설계를 통해 이전 광고 실패 원인 파악 및 개선`;
        break;
      default:
        insights[channel] = `학원 특성에 맞는 맞춤 마케팅 솔루션으로 신규 원생 모집 효율 향상`;
    }
  });

  return insights;
}

export function predictKPI(channels: ChannelScore[], totalAdBudget: number): KPIData {
  let monthlyClicks = 0;
  let monthlyImpressions = 0;
  const channelKPIs: KPIData['channelKPIs'] = [];

  const kpiMap: Record<string, { ctr: string; cpc: string; conversionRate: string; impressionMultiplier: number; clicksPerWon: number }> = {
    naver_search_ad: { ctr: '3~6%', cpc: '500~1,500원', conversionRate: '3~8%', impressionMultiplier: 50, clicksPerWon: 0.001 },
    naver_place_ad: { ctr: '2~5%', cpc: '300~800원', conversionRate: '5~12%', impressionMultiplier: 80, clicksPerWon: 0.002 },
    meta_ad: { ctr: '1~3%', cpc: '200~600원', conversionRate: '1~4%', impressionMultiplier: 200, clicksPerWon: 0.003 },
    google_search: { ctr: '2~5%', cpc: '400~1,200원', conversionRate: '2~6%', impressionMultiplier: 60, clicksPerWon: 0.0012 },
    google_display: { ctr: '0.5~2%', cpc: '100~400원', conversionRate: '0.5~2%', impressionMultiplier: 500, clicksPerWon: 0.005 },
    kakao_ad: { ctr: '1~3%', cpc: '200~500원', conversionRate: '1~3%', impressionMultiplier: 150, clicksPerWon: 0.003 },
  };

  const channelNames: Record<string, string> = {
    naver_search_ad: '네이버 검색광고',
    naver_place_ad: '네이버 플레이스',
    meta_ad: '메타 광고',
    google_search: '구글 검색광고',
    google_display: '구글 디스플레이',
    kakao_ad: '카카오 광고',
    naver_blog_mgmt: '네이버 블로그',
    sns_mgmt: 'SNS 운영',
    homepage: '랜딩페이지',
    consulting: '컨설팅',
  };

  channels.slice(0, 5).forEach(({ channel }) => {
    const kpi = kpiMap[channel];
    if (kpi) {
      const perChannelBudget = totalAdBudget / Math.min(channels.length, 4);
      const clicks = Math.round(perChannelBudget * kpi.clicksPerWon);
      const impressions = Math.round(clicks * kpi.impressionMultiplier);
      monthlyClicks += clicks;
      monthlyImpressions += impressions;
      channelKPIs.push({
        channel,
        channelName: channelNames[channel] || channel,
        ctr: kpi.ctr,
        cpc: kpi.cpc,
        conversionRate: kpi.conversionRate,
        estimatedClicks: clicks,
      });
    } else {
      channelKPIs.push({
        channel,
        channelName: channelNames[channel] || channel,
        ctr: '-',
        cpc: '-',
        conversionRate: '-',
        estimatedClicks: 0,
      });
    }
  });

  const monthlyConsultations = Math.round(monthlyClicks * 0.05);
  const monthlyNewStudents = Math.round(monthlyConsultations * 0.3);

  return { monthlyClicks, monthlyImpressions, monthlyConsultations, monthlyNewStudents, channelKPIs };
}

export function generateActionPlan(channels: ChannelScore[]): ActionPlanItem[] {
  const topChannels = channels.slice(0, 3).map(c => c.channel);
  const channelNames: Record<string, string> = {
    naver_search_ad: '네이버 검색광고',
    naver_place_ad: '네이버 플레이스',
    meta_ad: '메타(페이스북/인스타) 광고',
    google_search: '구글 검색광고',
    google_display: '구글 디스플레이 광고',
    naver_blog_mgmt: '네이버 블로그',
    sns_mgmt: 'SNS 운영',
    homepage: '랜딩페이지',
    kakao_ad: '카카오 광고',
    consulting: '마케팅 컨설팅',
  };

  return [
    {
      week: '1주차',
      title: '계정 세팅 및 기반 작업',
      tasks: [
        '광고 계정 개설 및 권한 설정',
        ...topChannels.map(ch => `${channelNames[ch] || ch} 초기 세팅`),
        '타겟 키워드 리서치 및 광고 소재 준비',
        '네이버 플레이스/구글 비즈니스 최적화',
      ],
    },
    {
      week: '2주차',
      title: '첫 광고 집행 시작',
      tasks: [
        '소규모 테스트 캠페인 런칭 (예산 20% 투입)',
        '클릭률/전환율 초기 데이터 수집',
        '랜딩페이지 A/B 테스트 시작',
        '콘텐츠 첫 게시 (블로그/SNS)',
      ],
    },
    {
      week: '3~4주차',
      title: '최적화 및 본격 집행',
      tasks: [
        '성과 데이터 기반 키워드/소재 최적화',
        '전체 예산 100% 집행',
        '주간 성과 리포트 분석',
        '효과 없는 키워드 제거 및 고효율 키워드 예산 증대',
      ],
    },
    {
      week: '2~3개월',
      title: '본격 성과 측정',
      tasks: [
        '월별 KPI 달성률 측정 (클릭수, 상담수, 등록수)',
        '채널별 ROI 분석 및 예산 재배분',
        '계절/시즌 광고 전략 수립',
        '장기 브랜딩 전략 고도화',
      ],
    },
  ];
}
