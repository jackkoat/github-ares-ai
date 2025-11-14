import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Award, Target, BarChart3, Calendar, CheckCircle, XCircle } from 'lucide-react';
import Navigation from '../components/Navigation';
import AnalyticsChartContainer from '../components/AnalyticsChartContainer';
import { ufcDataService, type AccuracyStats } from '../services/ufcDataService';

const AccuracyTrackerPage: React.FC = () => {
  const [accuracyStats, setAccuracyStats] = useState<AccuracyStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await ufcDataService.getAccuracyStats();
        setAccuracyStats(data);
      } catch (error) {
        console.error('Error loading accuracy data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const formatAccuracyChart = (stats: AccuracyStats) => {
    return ufcDataService.generateAccuracyChart(stats);
  };

  const formatDivisionChart = (stats: AccuracyStats) => {
    return {
      backgroundColor: 'transparent',
      textStyle: { color: '#e4e4e7' },
      grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
      xAxis: {
        type: 'category' as const,
        data: stats.byDivision.map(d => d.division.replace('Women\'s ', '')),
        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
        axisLabel: { color: '#71717a', rotate: 45, fontSize: 10 }
      },
      yAxis: {
        type: 'value' as const,
        min: 70,
        max: 100,
        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
        axisLabel: { color: '#71717a', formatter: '{value}%' },
        splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
      },
      series: [{
        name: 'Accuracy',
        type: 'bar' as const,
        data: stats.byDivision.map(d => d.accuracy),
        itemStyle: {
          color: {
            type: 'linear' as const,
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#dc2626' },
              { offset: 1, color: '#991b1b' }
            ]
          }
        },
        emphasis: {
          itemStyle: {
            color: '#ef4444'
          }
        }
      }]
    };
  };

  const formatMethodChart = (stats: AccuracyStats) => {
    return {
      backgroundColor: 'transparent',
      textStyle: { color: '#e4e4e7' },
      series: [{
        name: 'Method Breakdown',
        type: 'pie' as const,
        radius: ['40%', '70%'],
        center: ['50%', '50%'],
        data: stats.byMethod.map(m => ({
          value: m.accuracy,
          name: m.method,
          itemStyle: { color: m.method === 'KO/TKO' ? '#dc2626' : m.method === 'Submission' ? '#22c55e' : '#f59e0b' }
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          color: '#e4e4e7',
          formatter: '{b}: {c}%\n({d}%)'
        }
      }]
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-border-subtle border-t-red-primary rounded-full animate-spin mx-auto mb-4" />
              <p className="text-text-secondary">Loading accuracy data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!accuracyStats) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-6 py-24 text-center">
            <h1 className="text-page-headline text-text-white mb-4">Data Unavailable</h1>
            <p className="text-body text-text-secondary">Unable to load accuracy statistics.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-16">
        {/* Hero Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h1 className="text-hero text-text-white mb-6">
              AI Prediction Accuracy
            </h1>
            <p className="text-body-large text-text-secondary max-w-2xl mx-auto mb-12">
              Track our AI model's performance over time with transparent accuracy metrics 
              and detailed analysis across all weight classes and fight outcomes.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8 p-8 bg-bg-elevated/80 backdrop-blur-sm rounded-2xl border border-border-subtle shadow-glow-card">
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-red-primary mb-2 text-center">
                  {accuracyStats.overall.accuracy}%
                </div>
                <div className="text-small text-text-secondary text-center">Overall Accuracy</div>
              </div>
              <div className="w-px h-16 bg-border-subtle" />
              <div className="text-center">
                <div className="text-5xl font-bold text-text-white mb-2">
                  {accuracyStats.overall.totalPredictions.toLocaleString()}
                </div>
                <div className="text-small text-text-secondary">Total Predictions</div>
              </div>
              <div className="w-px h-16 bg-border-subtle" />
              <div className="text-center">
                <div className="text-5xl font-bold text-success-green mb-2">
                  {accuracyStats.overall.correctPredictions.toLocaleString()}
                </div>
                <div className="text-small text-text-secondary">Correct Predictions</div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Performance Metrics */}
            <div className="card-elevated">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp size={24} className="text-red-primary" />
                <h3 className="text-card-title text-text-white">Recent Performance</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-body text-text-secondary">Current Streak:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-success-green">
                      {accuracyStats.overall.recentStreak}
                    </span>
                    <span className="text-small text-text-secondary">wins</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-body text-text-secondary">Avg Confidence:</span>
                  <span className="text-2xl font-bold text-text-white">
                    {accuracyStats.overall.confidenceAverage}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-body text-text-secondary">Last Updated:</span>
                  <span className="text-small text-text-tertiary">
                    {new Date(accuracyStats.overall.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Top Performing Division */}
            <div className="card-elevated">
              <div className="flex items-center space-x-3 mb-4">
                <Award size={24} className="text-red-primary" />
                <h3 className="text-card-title text-text-white">Best Division</h3>
              </div>
              {(() => {
                const bestDivision = accuracyStats.byDivision.reduce((prev, current) => 
                  prev.accuracy > current.accuracy ? prev : current
                );
                return (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-primary mb-2">
                      {bestDivision.accuracy}%
                    </div>
                    <div className="text-body font-semibold text-text-white mb-1">
                      {bestDivision.division}
                    </div>
                    <div className="text-small text-text-secondary">
                      {bestDivision.correctPredictions} of {bestDivision.totalPredictions} correct
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Method Performance */}
            <div className="card-elevated">
              <div className="flex items-center space-x-3 mb-4">
                <Target size={24} className="text-red-primary" />
                <h3 className="text-card-title text-text-white">Method Performance</h3>
              </div>
              <div className="space-y-3">
                {accuracyStats.byMethod.map((method, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-body text-text-secondary">{method.method}:</span>
                    <span className="text-lg font-semibold text-text-white">
                      {method.accuracy}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
            {/* Accuracy Over Time */}
            <AnalyticsChartContainer
              title="Monthly Accuracy Trend"
              chartOptions={formatAccuracyChart(accuracyStats)}
              height="h-96"
            />

            {/* Division Breakdown */}
            <AnalyticsChartContainer
              title="Accuracy by Weight Class"
              chartOptions={formatDivisionChart(accuracyStats)}
              height="h-96"
            />
          </div>

          {/* Method Breakdown */}
          <div className="mb-12">
            <AnalyticsChartContainer
              title="Performance by Finish Method"
              chartOptions={formatMethodChart(accuracyStats)}
              height="h-80"
            />
          </div>

          {/* Recent Results Table */}
          <div className="card-elevated">
            <h2 className="text-section-headline text-text-white mb-6">Recent Prediction Results</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-subtle">
                    <th className="text-left py-4 px-4 text-body font-semibold text-text-primary">Fight</th>
                    <th className="text-left py-4 px-4 text-body font-semibold text-text-primary">Date</th>
                    <th className="text-left py-4 px-4 text-body font-semibold text-text-primary">Predicted</th>
                    <th className="text-left py-4 px-4 text-body font-semibold text-text-primary">Actual</th>
                    <th className="text-center py-4 px-4 text-body font-semibold text-text-primary">Confidence</th>
                    <th className="text-center py-4 px-4 text-body font-semibold text-text-primary">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {accuracyStats.recentResults.map((result, index) => (
                    <tr 
                      key={result.id} 
                      className={`border-b border-border-subtle/50 last:border-b-0 ${
                        index % 2 === 0 ? 'bg-transparent' : 'bg-bg-hover/20'
                      }`}
                    >
                      <td className="py-4 px-4">
                        <span className="text-body text-text-primary font-medium">
                          {result.fight}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-small text-text-secondary">
                          {new Date(result.date).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-small">
                          <div className="text-text-primary font-medium">{result.predicted.winner}</div>
                          <div className="text-text-secondary">{result.predicted.method}, R{result.predicted.round}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-small">
                          <div className="text-text-primary font-medium">{result.actual.winner}</div>
                          <div className="text-text-secondary">{result.actual.method}, R{result.actual.round}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-small text-text-secondary font-mono">
                          {result.predicted.confidence}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {result.accuracy === 100 ? (
                          <div className="flex items-center justify-center">
                            <CheckCircle size={20} className="text-success-green" />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <XCircle size={20} className="text-error-red" />
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA Section */}
          <section className="py-16 rounded-2xl border border-border-subtle">
            <div className="text-center">
              <h2 className="text-section-headline text-text-white mb-4">
                Want More Detailed Analysis?
              </h2>
              <p className="text-body text-text-secondary mb-8 max-w-2xl mx-auto">
                Get access to premium predictions, early fight analysis, and detailed 
                AI insights for professional fight analysis and betting.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link to="/fights" className="btn-primary flex items-center">
                  <BarChart3 size={20} className="mr-2" />
                  View Live Predictions
                </Link>
                <button className="btn-ghost flex items-center">
                  Start Premium Trial
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AccuracyTrackerPage;