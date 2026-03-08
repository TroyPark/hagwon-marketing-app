// This module handles loading marketing solution data
// Currently uses hardcoded data from quote-calculator.ts
// To load from Excel, use the /api/excel endpoint

export const MARKETING_CATEGORIES = [
  { id: 'search_ad', name: '검색 광고', description: '검색 결과 상단 노출 광고' },
  { id: 'display_ad', name: '디스플레이 광고', description: '배너/영상 노출 광고' },
  { id: 'content', name: '콘텐츠 마케팅', description: '블로그/SNS 콘텐츠 운영' },
  { id: 'web', name: '웹 제작', description: '홈페이지/랜딩페이지 제작' },
  { id: 'consulting', name: '전략 컨설팅', description: '마케팅 전략 수립' },
];
