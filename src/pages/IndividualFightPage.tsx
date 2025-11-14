import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Target, TrendingUp, Clock } from 'lucide-react';
import Navigation from '../components/Navigation';
import WinProbabilityDisplay from '../components/WinProbabilityDisplay';
import FighterComparisonTable from '../components/FighterComparisonTable';
import AnalyticsChartContainer from '../components/AnalyticsChartContainer';
import { ufcDataService, type UpcomingFight, type Fighter } from '../services/ufcDataService';

const IndividualFightPage: React.FC = () => {
  const { fightId } = useParams<{ fightId: string }>();
  const [fight, setFight] = useState<UpcomingFight | null>(null);
  const [fighterA, setFighterA] = useState<Fighter | null>(null);
  const [fighterB, setFighterB] = useState<Fighter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFightData = async () => {
      if (!fightId) {
        setError('Fight ID not provided');
        setIsLoading(false);
        return;
      }

      try {
        const [fightData, fighterAData, fighterBData] = await Promise.all([
          ufcDataService.getFightById(fightId),
          ufcDataService.getFighterById(`john-doe`),
          ufcDataService.getFighterById(`michael-thompson`)
        ]);

        if (!fightData) {
          setError('Fight not found');
          return;
        }

        setFight(fightData);
        
        // For demo purposes, use the mock fighters based on the fight data
        if (fightData.fighters.fighterA.id === 'john-doe') {
          setFighterA(fighterAData);
          setFighterB(fighterBData);
        } else {
          setFighterA(fighterBData);
          setFighterB(fighterAData);
        }
      } catch (error) {
        console.error('Error loading fight data:', error);
        setError('Failed to load fight data');
      } finally {
        setIsLoading(false);
      }
    };

    loadFightData();
  }, [fightId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 80) return { level: 'High', color: 'success-green' };
    if (confidence >= 65) return { level: 'Medium', color: 'warning-amber' };
    return { level: 'Low', color: 'text-secondary' };
  };

  const getPredictionFactors = () => {
    if (!fight) return [];
    
    return fight.factors.map(factor => ({
      name: factor.name,
      winner: factor.winner === 'fighterA' ? fight.fighters.fighterA.name : fight.fighters.fighterB.name,
      score: factor.score,
      percentage: (factor.score / 10) * 100
    }));
  };

  const generateWinProbabilityChart = () => {
    if (!fight) return null;
    
    // Generate sample probability data over time
    const data = [];
    const rounds = 5;
    for (let round = 1; round <= rounds; round++) {
      const probability = round <= fight.prediction.round 
        ? fight.prediction.winProbability + (Math.random() - 0.5) * 10
        : fight.prediction.winProbability;
      data.push({
        round: `Round ${round}`,
        probability: Math.max(0, Math.min(100, probability))
      });
    }

    return {
      backgroundColor: 'transparent',
      textStyle: { color: '#e4e4e7' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category' as const,
        data: data.map(d => d.round),
        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
        axisLabel: { color: '#71717a' }
      },
      yAxis: {
        type: 'value' as const,
        min: 0,
        max: 100,
        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
        axisLabel: { color: '#71717a', formatter: '{value}%' },
        splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
      },
      series: [{
        name: 'Win Probability',
        type: 'line' as const,
        data: data.map(d => d.probability),
        smooth: true,
        lineStyle: { color: '#dc2626', width: 3 },
        itemStyle: { color: '#dc2626', borderColor: '#ffffff', borderWidth: 2 },
        areaStyle: {
          color: {
            type: 'linear' as const,
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(220, 38, 38, 0.3)' },
              { offset: 1, color: 'rgba(220, 38, 38, 0.05)' }
            ]
          }
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
              <p className="text-text-secondary">Loading fight analysis...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !fight) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-6 py-24 text-center">
            <h1 className="text-page-headline text-text-white mb-4">Fight Not Found</h1>
            <p className="text-body text-text-secondary mb-8">{error || 'The requested fight could not be found.'}</p>
            <Link to="/fights" className="btn-primary">
              <ArrowLeft size={20} className="mr-2" />
              Back to Fights
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const confidence = getConfidenceLevel(fight.prediction.confidence);

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-16">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <nav className="flex items-center space-x-2 text-small text-text-secondary">
            <Link to="/" className="hover:text-text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/fights" className="hover:text-text-primary transition-colors">Fight Analytics</Link>
            <span>/</span>
            <span className="text-text-primary">{fight.fighters.fighterA.name} vs {fight.fighters.fighterB.name}</span>
          </nav>
        </div>

        {/* Fight Header */}
        <section className="py-12 border-b border-border-subtle">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-page-headline text-text-white mb-4">
                {fight.fighters.fighterA.name} vs {fight.fighters.fighterB.name}
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-6 text-small text-text-secondary">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} />
                  <span>{formatDate(fight.date)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin size={16} />
                  <span>{fight.venue}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target size={16} />
                  <span>{fight.weightClass}</span>
                </div>
                {fight.mainEvent && (
                  <div className="flex items-center space-x-2">
                    <TrendingUp size={16} className="text-red-primary" />
                    <span className="text-red-primary">Main Event</span>
                  </div>
                )}
              </div>
            </div>

            {/* Win Probability Display */}
            <div className="max-w-4xl mx-auto">
              <WinProbabilityDisplay
                fighterA={fight.fighters.fighterA}
                fighterB={fight.fighters.fighterB}
                winProbability={fight.prediction.winProbability}
                size="xl"
                showLabels={true}
              />
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* AI Prediction Summary */}
              <div className="card-elevated">
                <h2 className="text-section-headline text-text-white mb-6">AI Prediction Summary</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-bg-hover/50 rounded-lg border border-border-subtle">
                    <div className="text-2xl font-bold text-red-primary mb-1">
                      {fight.prediction.winProbability}%
                    </div>
                    <div className="text-small text-text-secondary">Win Probability</div>
                    <div className="text-tiny text-text-tertiary mt-1">
                      {fight.prediction.winProbability >= 50 ? 'Favored' : 'Underdog'}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-bg-hover/50 rounded-lg border border-border-subtle">
                    <div className="text-2xl font-bold text-text-white mb-1">
                      {fight.prediction.confidence}%
                    </div>
                    <div className="text-small text-text-secondary">AI Confidence</div>
                    <div className={`text-tiny mt-1 ${confidence.color}`}>
                      {confidence.level}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-bg-hover/50 rounded-lg border border-border-subtle">
                    <div className="text-2xl font-bold text-text-white mb-1">
                      {fight.prediction.method}
                    </div>
                    <div className="text-small text-text-secondary">Method</div>
                    <div className="text-tiny text-text-tertiary mt-1">
                      Round {fight.prediction.round}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-bg-near-black rounded-lg border border-border-subtle">
                  <h3 className="text-card-title text-text-white mb-3">AI Insight</h3>
                  <p className="text-body text-text-secondary leading-relaxed">
                    {fight.prediction.aiInsight}
                  </p>
                </div>
              </div>

              {/* Win Probability Over Time */}
              {generateWinProbabilityChart() && (
                <AnalyticsChartContainer
                  title="Win Probability Evolution"
                  chartOptions={generateWinProbabilityChart()!}
                  height="h-80"
                />
              )}

              {/* Fighting Style Comparison */}
              {fighterA && fighterB && (
                <FighterComparisonTable
                  fighterA={fighterA}
                  fighterB={fighterB}
                  stats={[
                    { key: 'strikingAccuracy', label: 'Striking Accuracy', format: 'percentage', higherIsBetter: true },
                    { key: 'takedownAccuracy', label: 'Takedown Accuracy', format: 'percentage', higherIsBetter: true },
                    { key: 'takedownDefense', label: 'Takedown Defense', format: 'percentage', higherIsBetter: true },
                    { key: 'significantStrikesPerMin', label: 'Strikes Per Min', format: 'number', higherIsBetter: true },
                    { key: 'avgFightTime', label: 'Avg Fight Time', format: 'time', higherIsBetter: false },
                    { key: 'winsByFinish', label: 'Wins by Finish', format: 'number', higherIsBetter: true }
                  ]}
                />
              )}

              {/* Key Fight Factors */}
              <div className="card-elevated">
                <h2 className="text-section-headline text-text-white mb-6">Key Fight Factors</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getPredictionFactors().map((factor, index) => (
                    <div key={index} className="p-4 bg-bg-hover/30 rounded-lg border border-border-subtle">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-body font-medium text-text-primary">{factor.name}</span>
                        <span className="text-small font-semibold text-red-primary">
                          {factor.score}/10
                        </span>
                      </div>
                      <div className="win-probability-bar h-2 mb-2">
                        <div 
                          className="win-probability-fill h-full"
                          style={{ width: `${factor.percentage}%` }}
                        />
                      </div>
                      <div className="text-small text-text-secondary">
                        Advantage: <span className="text-text-primary font-medium">{factor.winner}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Quick Stats */}
              <div className="card-elevated">
                <h3 className="text-card-title text-text-white mb-4">Fight Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-body text-text-secondary">Event:</span>
                    <span className="text-body text-text-primary font-medium">{fight.event || fight.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-body text-text-secondary">Date:</span>
                    <span className="text-body text-text-primary font-medium">
                      {new Date(fight.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-body text-text-secondary">Venue:</span>
                    <span className="text-body text-text-primary font-medium">{fight.venue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-body text-text-secondary">Status:</span>
                    <span className="text-body text-success-green font-medium capitalize">{fight.status}</span>
                  </div>
                </div>
              </div>

              {/* Fighter Quick Links */}
              <div className="card-elevated">
                <h3 className="text-card-title text-text-white mb-4">Fighter Profiles</h3>
                <div className="space-y-3">
                  <Link 
                    to={`/fighter/${fight.fighters.fighterA.id}`}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-bg-hover transition-colors group"
                  >
                    <img 
                      src={fight.fighters.fighterA.photo || '/images/fighter-silhouette.png'} 
                      alt={fight.fighters.fighterA.name}
                      className="w-10 h-10 rounded-full object-cover border border-border-subtle"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/fighter-silhouette.png';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-body font-medium text-text-primary group-hover:text-red-primary transition-colors">
                        {fight.fighters.fighterA.name}
                      </div>
                      <div className="text-small text-text-secondary">
                        #{fight.fighters.fighterA.rank} • {fight.fighters.fighterA.record}
                      </div>
                    </div>
                  </Link>
                  <Link 
                    to={`/fighter/${fight.fighters.fighterB.id}`}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-bg-hover transition-colors group"
                  >
                    <img 
                      src={fight.fighters.fighterB.photo || '/images/fighter-silhouette.png'} 
                      alt={fight.fighters.fighterB.name}
                      className="w-10 h-10 rounded-full object-cover border border-border-subtle"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/fighter-silhouette.png';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-body font-medium text-text-primary group-hover:text-red-primary transition-colors">
                        {fight.fighters.fighterB.name}
                      </div>
                      <div className="text-small text-text-secondary">
                        #{fight.fighters.fighterB.rank} • {fight.fighters.fighterB.record}
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Similar Fights */}
              <div className="card-elevated">
                <h3 className="text-card-title text-text-white mb-4">Similar Matchups</h3>
                <p className="text-small text-text-secondary">
                  Find fights with similar fighting styles and matchup dynamics.
                </p>
                <Link to="/fights" className="btn-ghost w-full mt-4 text-sm">
                  Explore More Fights
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualFightPage;