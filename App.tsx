import React, { useState, useMemo } from 'react';
import { ChannelData } from './types';
import { INITIAL_CHANNELS } from './constants';
import { ChannelTable } from './components/ChannelTable';
import { StatCard } from './components/StatCard';
import { OptimizationPanel } from './components/OptimizationPanel';
import { DiminishingReturnsChart } from './components/DiminishingReturnsChart';

const App: React.FC = () => {
  const [channels, setChannels] = useState<ChannelData[]>(INITIAL_CHANNELS);

  const handleUpdateChannel = (updated: ChannelData) => {
    setChannels(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  // Aggregate Metrics
  const totalSpend = useMemo(() => channels.reduce((sum, c) => sum + c.spend, 0), [channels]);
  const totalRevenue = useMemo(() => channels.reduce((sum, c) => sum + c.revenue, 0), [channels]);
  const totalConversions = useMemo(() => channels.reduce((sum, c) => sum + c.conversions, 0), [channels]);
  const blendedROAS = totalSpend > 0 ? totalRevenue / totalSpend : 0;
  const blendedCPA = totalConversions > 0 ? totalSpend / totalConversions : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              Nexus Attribution
            </h1>
          </div>
          <div className="text-sm text-slate-500">
            AI-Powered Marketing Intelligence
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Spend" 
            value={`$${totalSpend.toLocaleString()}`} 
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard 
            title="Total Revenue" 
            value={`$${totalRevenue.toLocaleString()}`} 
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
          />
          <StatCard 
            title="Blended ROAS" 
            value={`${blendedROAS.toFixed(2)}x`} 
            trend={blendedROAS > 2.5 ? 'up' : 'neutral'}
            subValue={blendedROAS > 2.5 ? "Healthy" : "Needs Optimization"}
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
          />
          <StatCard 
            title="Blended CPA" 
            value={`$${blendedCPA.toFixed(2)}`} 
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
          />
        </div>

        {/* Input & Visuals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Channel Performance Data</h2>
              <span className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">Editable</span>
            </div>
            <ChannelTable data={channels} onUpdate={handleUpdateChannel} />
          </div>
          
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Efficiency Analysis</h2>
            <DiminishingReturnsChart data={channels} />
          </div>
        </div>

        {/* AI Optimization Section */}
        <section className="pt-8 border-t border-slate-200">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Predictive Modeling</h2>
            <p className="text-slate-500">Use Gemini AI to analyze diminishing returns and optimize budget allocation.</p>
          </div>
          <OptimizationPanel currentData={channels} />
        </section>

      </main>
    </div>
  );
};

export default App;
