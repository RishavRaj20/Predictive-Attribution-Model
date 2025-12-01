import React, { useState } from 'react';
import { ChannelData, LoadingState, PredictionResult } from '../types';
import { generateAttributionAnalysis } from '../services/geminiService';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell 
} from 'recharts';

interface OptimizationPanelProps {
  currentData: ChannelData[];
}

export const OptimizationPanel: React.FC<OptimizationPanelProps> = ({ currentData }) => {
  const [targetBudget, setTargetBudget] = useState<number>(
    currentData.reduce((acc, curr) => acc + curr.spend, 0)
  );
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleOptimize = async () => {
    setStatus(LoadingState.LOADING);
    setErrorMsg("");
    try {
      const result = await generateAttributionAnalysis(currentData, targetBudget);
      setPrediction(result);
      setStatus(LoadingState.SUCCESS);
    } catch (e) {
      console.error(e);
      setStatus(LoadingState.ERROR);
      setErrorMsg("Failed to generate insights. Ensure API Key is valid.");
    }
  };

  // Prepare data for the chart comparing Current vs Recommended
  const chartData = prediction?.suggestions.map(s => ({
    name: s.channelName,
    Current: s.currentSpend,
    Recommended: s.recommendedSpend,
  })) || [];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-4">AI Budget Optimizer</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="w-full sm:w-1/3">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Target Monthly Budget ($)
            </label>
            <input
              type="number"
              value={targetBudget}
              onChange={(e) => setTargetBudget(Number(e.target.value))}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <button
            onClick={handleOptimize}
            disabled={status === LoadingState.LOADING}
            className={`px-6 py-2 rounded-lg font-medium text-white transition-all shadow-md
              ${status === LoadingState.LOADING 
                ? 'bg-indigo-300 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'}`}
          >
            {status === LoadingState.LOADING ? 'Analyzing Model...' : 'Run Prediction Model'}
          </button>
        </div>
        
        {errorMsg && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {errorMsg}
          </div>
        )}
      </div>

      {prediction && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          {/* Chart Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 min-h-[400px]">
            <h3 className="text-md font-semibold text-slate-700 mb-4">Spend Allocation Shift</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" fontSize={12} tick={{fill: '#64748b'}} />
                <YAxis fontSize={12} tick={{fill: '#64748b'}} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                />
                <Legend />
                <Bar dataKey="Current" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Recommended" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
              <h4 className="text-sm font-bold text-indigo-900">Analysis Summary</h4>
              <p className="text-sm text-indigo-700 mt-1 leading-relaxed">
                {prediction.summaryAnalysis}
              </p>
            </div>
          </div>

          {/* Recommendations List */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 max-h-[400px] overflow-y-auto">
            <h3 className="text-md font-semibold text-slate-700 mb-4">Channel Recommendations</h3>
            <div className="space-y-4">
              {prediction.suggestions.map((s) => (
                <div key={s.channelName} className="p-4 rounded-lg border border-slate-100 hover:border-indigo-100 transition-colors bg-slate-50">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-slate-800">{s.channelName}</span>
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                      s.action === 'increase' ? 'bg-green-100 text-green-700' :
                      s.action === 'decrease' ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {s.action} Spend
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                    <div>
                      <span className="text-slate-500 block">Recommended</span>
                      <span className="font-medium text-slate-800">${s.recommendedSpend.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Diff</span>
                      <span className={`font-medium ${s.recommendedSpend > s.currentSpend ? 'text-green-600' : 'text-red-600'}`}>
                        {s.recommendedSpend > s.currentSpend ? '+' : ''}
                        ${(s.recommendedSpend - s.currentSpend).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 italic border-t border-slate-200 pt-2">
                    "{s.reasoning}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
