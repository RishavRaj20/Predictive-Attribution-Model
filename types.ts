// Channel Data Types
export interface ChannelData {
  id: string;
  name: string;
  spend: number;
  conversions: number;
  revenue: number;
  cpa: number; // Cost Per Acquisition
  roas: number; // Return on Ad Spend
  saturationPoint?: number; // Estimated spend level where diminishing returns hit hard
}

// Optimization Types
export interface OptimizationSuggestion {
  channelName: string;
  currentSpend: number;
  recommendedSpend: number;
  predictedConversions: number;
  predictedRevenue: number;
  reasoning: string;
  action: 'increase' | 'decrease' | 'maintain';
}

export interface PredictionResult {
  totalBudget: number;
  suggestions: OptimizationSuggestion[];
  projectedTotalConversions: number;
  projectedTotalRevenue: number;
  summaryAnalysis: string;
}

// Charting Types
export interface DiminishingReturnPoint {
  spend: number;
  conversions: number;
  channel: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
