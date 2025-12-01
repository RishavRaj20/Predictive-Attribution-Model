import { ChannelData } from './types';

export const INITIAL_CHANNELS: ChannelData[] = [
  {
    id: '1',
    name: 'Google Search Ads',
    spend: 15000,
    conversions: 450,
    revenue: 45000,
    cpa: 33.33,
    roas: 3.0,
  },
  {
    id: '2',
    name: 'Facebook / Instagram',
    spend: 12000,
    conversions: 320,
    revenue: 28800,
    cpa: 37.50,
    roas: 2.4,
  },
  {
    id: '3',
    name: 'LinkedIn Ads',
    spend: 8000,
    conversions: 90,
    revenue: 13500,
    cpa: 88.88,
    roas: 1.68,
  },
  {
    id: '4',
    name: 'YouTube',
    spend: 5000,
    conversions: 80,
    revenue: 6000,
    cpa: 62.50,
    roas: 1.2,
  },
  {
    id: '5',
    name: 'Email Marketing',
    spend: 2000,
    conversions: 150,
    revenue: 15000,
    cpa: 13.33,
    roas: 7.5,
  }
];

export const MODEL_NAME = "gemini-2.5-flash";
