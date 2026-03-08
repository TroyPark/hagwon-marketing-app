import { NextResponse } from 'next/server';
import { SurveyAnswers } from '@/types';
import { getBudgetTier, calculateChannelPriority, generateInsights, predictKPI, generateActionPlan } from '@/lib/recommendation-engine';
import { calculateQuote } from '@/lib/quote-calculator';

export async function POST(request: Request) {
  try {
    const answers: SurveyAnswers = await request.json();

    const budgetTier = getBudgetTier(answers.Q11 || '50_100');
    const channelPriority = calculateChannelPriority(answers);
    const quote = calculateQuote(channelPriority, budgetTier);
    const expectedKPI = predictKPI(channelPriority, quote.totalAdBudget);
    const insights = generateInsights(answers, channelPriority);
    const actionPlan = generateActionPlan(channelPriority);

    return NextResponse.json({
      budgetTier,
      recommendedChannels: channelPriority,
      quote,
      expectedKPI,
      insights,
      actionPlan,
    });
  } catch (error) {
    console.error('Recommend API error:', error);
    return NextResponse.json({ error: 'Failed to generate recommendation' }, { status: 500 });
  }
}
