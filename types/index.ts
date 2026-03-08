export interface SurveyOption {
  value: string;
  label: string;
  has_input?: boolean;
}

export interface SurveyQuestion {
  id: string;
  type: 'single_choice' | 'multiple_choice' | 'text';
  required: boolean;
  question: string;
  options?: SurveyOption[];
  multiple?: boolean;
  placeholder?: string;
}

export interface SurveySection {
  id: string;
  title: string;
  description?: string;
  questions: SurveyQuestion[];
}

export interface SurveyAnswers {
  Q1?: string;
  Q2?: string;
  Q3?: string[];
  Q4?: string;
  Q5?: string;
  Q6?: string[];
  Q7?: string;
  Q8?: string;
  Q9?: string;
  Q10?: string[];
  Q11?: string;
  Q12?: string[];
  Q13?: string;
  Q14?: string;
  Q15?: string;
  Q16?: string;
}

export interface BudgetTier {
  tier: string;
  min: number;
  max: number;
  label: string;
}

export interface QuoteItem {
  id: string;
  category: string;
  serviceName: string;
  description: string;
  managementFee: number;
  recommendedAdBudget: number;
  minAdBudget: number;
  isRequired: boolean;
  isOneTime: boolean;
  setupFee?: number;
}

export interface ChannelScore {
  channel: string;
  score: number;
}

export interface QuoteResult {
  items: QuoteItem[];
  totalManagementFee: number;
  totalAdBudget: number;
  totalSetupFee: number;
  monthlyTotal: number;
}

export interface KPIData {
  monthlyClicks: number;
  monthlyImpressions: number;
  monthlyConsultations: number;
  monthlyNewStudents: number;
  channelKPIs: ChannelKPI[];
}

export interface ChannelKPI {
  channel: string;
  channelName: string;
  ctr: string;
  cpc: string;
  conversionRate: string;
  estimatedClicks: number;
}

export interface RecommendationResult {
  budgetTier: BudgetTier;
  recommendedChannels: ChannelScore[];
  quote: QuoteResult;
  expectedKPI: KPIData;
  insights: Record<string, string>;
  actionPlan: ActionPlanItem[];
}

export interface ActionPlanItem {
  week: string;
  title: string;
  tasks: string[];
}
