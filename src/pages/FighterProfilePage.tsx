import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Target, TrendingUp, Calendar, Award, Clock, Zap } from 'lucide-react';
import Navigation from '../components/Navigation';
import AnalyticsChartContainer from '../components/AnalyticsChartContainer';
import { ufcDataService, type Fighter } from '../services/ufcDataService';

const FighterProfilePage: React.FC = () => {
  const { fighterId } = useParams<{ fighterId: string }>();
  const [fighter, setFighter] = useState<Fighter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFighterData = async () => {
      if (!fighterId) {
        setError('Fighter ID not provided');
        setIsLoading(false);
        return;
      }

      try {
        const fighterData = await ufcDataService.getFighterById(fighterId);
        if (!fighterData) {
          setError('Fighter not found');
          return;
        }
        setFighter(fighterData);
      } catch (error) {
        console.error('Error loading fighter data:', error);
        setError('Failed to load fighter data');
      } finally {
        setIsLoading(false);
      }
    };

    loadFighterData();
  }, [fighterId]);

  const generateStyleRadarChart = () => {
    if (!fighter) return null;
    
    const categories = ['Striking', 'Grappling', 'Power', 'Speed', 'Cardio', 'Defense', 'Clinche', 'Ground'];
    const data = [
      fighter.style.striking,
      fighter.style.grappling,
      fighter.style.power,
      fighter.style.speed,
      fighter.style.cardio,
      fighter.style.defense,
      fighter.style.clinche,
      fighter.style.ground
    ];

    return {
      backgroundColor: 'transparent',
      textStyle: { color: '#e4e4e7' },
      legend: { show: false },
      radar: {
        indicator: categories.map(cat => ({ name: cat, max: 10 })),
        axisName: { color: '#a1a1aa' },
        splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
        splitArea: { show: false },
        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
      },
      series: [{
        name: 'Fighting Style',
        type: 'radar' as const,
        data: [{
          value: data,
          name: fighter.name,
          itemStyle: { color: '#dc2626' },
          areaStyle: { color: 'rgba(220, 38, 38, 0.2)' }
        }]
      }]
    };
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'win':
        return <Award size={16} className="text-success-green" />;
      case 'loss':
        return <Target size={16} className="text-error-red" />;
      default:
        return <Clock size={16} className="text-warning-amber" />;
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'win':
        return 'text-success-green';
      case 'loss':
        return 'text-error-red';
      default:
        return 'text-warning-amber';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-pure-black">
        <Navigation />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-border-subtle border-t-red-primary rounded-full animate-spin mx-auto mb-4" />
              <p className="text-text-secondary">Loading fighter profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !fighter) {
    return (
      <div className="min-h-screen bg-bg-pure-black">
        <Navigation />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-6 py-24 text-center">
            <h1 className="text-page-headline text-text-white mb-4">Fighter Not Found</h1>
            <p className="text-body text-text-secondary mb-8">{error || 'The requested fighter could not be found.'}</p>
            <Link to="/fights" className="btn-primary">
              <ArrowLeft size={20} className="mr-2" />
              Back to Fights
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-pure-black">
      <Navigation />
      
      <div className="pt-16">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <nav className="flex items-center space-x-2 text-small text-text-secondary">
            <Link to="/" className="hover:text-text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-text-primary">{fighter.name}</span>
          </nav>
        </div>

        {/* Fighter Hero Section */}
        <section className="relative py-24 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0">
            <img 
              src={fighter.photo} 
              alt={fighter.name}
              className="w-full h-full object-cover opacity-20"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/fighter_silhouette.png';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-bg-pure-black via-bg-pure-black/80 to-red-primary/10" />
            <div className="absolute inset-0 octagon-pattern opacity-30" />
          </div>

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-12">
              {/* Fighter Image */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <img 
                    src={fighter.photo} 
                    alt={fighter.name}
                    className="w-64 h-64 rounded-full object-cover border-4 border-red-primary/30 shadow-glow-red-subtle"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/fighter_silhouette.png';
                    }}
                  />
                  {fighter.ranking && (
                    <div className="absolute -top-2 -right-2 w-12 h-12 bg-red-primary text-text-white rounded-full flex items-center justify-center font-bold text-lg shadow-glow-red-primary">
                      #{fighter.ranking}
                    </div>
                  )}
                </div>
              </div>

              {/* Fighter Info */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-hero text-text-white mb-2">
                  {fighter.name}
                </h1>
                {fighter.nickname && (
                  <p className="text-2xl text-text-secondary mb-4 font-italic">
                    "{fighter.nickname}"
                  </p>
                )}
                
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-primary">
                      {fighter.record.wins}-{fighter.record.losses}{fighter.record.draws > 0 ? `-${fighter.record.draws}` : ''}
                    </div>
                    <div className="text-small text-text-secondary">Record</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-text-white">
                      {fighter.division}
                    </div>
                    <div className="text-small text-text-secondary">Division</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-text-white">
                      {fighter.age}
                    </div>
                    <div className="text-small text-text-secondary">Age</div>
                  </div>
                  {fighter.predictionAccuracy && (
                    <div className="text-center">
                      <div className="text-3xl font-bold text-success-green">
                        {fighter.predictionAccuracy}%
                      </div>
                      <div className="text-small text-text-secondary">AI Accuracy</div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-small">
                  <div>
                    <div className="text-text-secondary">Height</div>
                    <div className="text-text-primary font-medium">{fighter.height}</div>
                  </div>
                  <div>
                    <div className="text-text-secondary">Weight</div>
                    <div className="text-text-primary font-medium">{fighter.weight}</div>
                  </div>
                  <div>
                    <div className="text-text-secondary">Reach</div>
                    <div className="text-text-primary font-medium">{fighter.reach}</div>
                  </div>
                  <div>
                    <div className="text-text-secondary">Stance</div>
                    <div className="text-text-primary font-medium">{fighter.stance}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Career Stats */}
              <div className="card-elevated">
                <h2 className="text-section-headline text-text-white mb-6">Career Statistics</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-bg-hover/30 rounded-lg border border-border-subtle">
                    <div className="text-2xl font-bold text-red-primary mb-1">{fighter.stats.kos}</div>
                    <div className="text-small text-text-secondary">KOs</div>
                  </div>
                  <div className="text-center p-4 bg-bg-hover/30 rounded-lg border border-border-subtle">
                    <div className="text-2xl font-bold text-red-primary mb-1">{fighter.stats.submissions}</div>
                    <div className="text-small text-text-secondary">Submissions</div>
                  </div>
                  <div className="text-center p-4 bg-bg-hover/30 rounded-lg border border-border-subtle">
                    <div className="text-2xl font-bold text-red-primary mb-1">{fighter.stats.decisions}</div>
                    <div className="text-small text-text-secondary">Decisions</div>
                  </div>
                  <div className="text-center p-4 bg-bg-hover/30 rounded-lg border border-border-subtle">
                    <div className="text-2xl font-bold text-red-primary mb-1">{fighter.stats.winsByFinish}</div>
                    <div className="text-small text-text-secondary">Finishes</div>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-body text-text-secondary">Striking Accuracy:</span>
                      <span className="text-body text-text-primary font-medium">{fighter.stats.strikingAccuracy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-body text-text-secondary">Takedown Accuracy:</span>
                      <span className="text-body text-text-primary font-medium">{fighter.stats.takedownAccuracy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-body text-text-secondary">Takedown Defense:</span>
                      <span className="text-body text-text-primary font-medium">{fighter.stats.takedownDefense}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-body text-text-secondary">Strikes Per Min:</span>
                      <span className="text-body text-text-primary font-medium">{fighter.stats.significantStrikesPerMin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-body text-text-secondary">Avg Fight Time:</span>
                      <span className="text-body text-text-primary font-medium">{fighter.stats.avgFightTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-body text-text-secondary">Finish Rate:</span>
                      <span className="text-body text-text-primary font-medium">
                        {((fighter.stats.winsByFinish / fighter.record.wins) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fighting Style Radar */}
              {generateStyleRadarChart() && (
                <AnalyticsChartContainer
                  title="Fighting Style Profile"
                  chartOptions={generateStyleRadarChart()!}
                  height="h-96"
                />
              )}

              {/* Recent Form */}
              <div className="card-elevated">
                <h2 className="text-section-headline text-text-white mb-6">Recent Fight History</h2>
                <div className="space-y-4">
                  {fighter.recentForm.map((fight, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-bg-hover/30 rounded-lg border border-border-subtle">
                      <div className="flex-shrink-0">
                        {getResultIcon(fight.result)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`text-body font-semibold ${getResultColor(fight.result)}`}>
                            {fight.result.toUpperCase()}
                          </span>
                          <span className="text-body text-text-secondary">vs</span>
                          <span className="text-body text-text-primary font-medium">{fight.opponent}</span>
                        </div>
                        <div className="text-small text-text-secondary">
                          {fight.method} • Round {fight.round} • {fight.time} • {new Date(fight.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Next Fight */}
              {fighter.nextFight && (
                <div className="card-elevated">
                  <h3 className="text-card-title text-text-white mb-4">Next Fight</h3>
                  <div className="text-center mb-4">
                    <div className="text-section-headline text-text-white mb-2">
                      {fighter.nextFight.opponent}
                    </div>
                    <div className="text-small text-text-secondary mb-2">
                      {new Date(fighter.nextFight.date).toLocaleDateString()}
                    </div>
                    <div className="text-small text-text-tertiary">
                      {fighter.nextFight.venue}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-small text-text-secondary">Win Probability:</span>
                      <span className="text-small text-text-primary font-medium">
                        {fighter.nextFight.prediction.winProbability}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-small text-text-secondary">AI Confidence:</span>
                      <span className="text-small text-red-primary font-medium">
                        {fighter.nextFight.prediction.confidence}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-small text-text-secondary">Predicted Method:</span>
                      <span className="text-small text-text-primary font-medium">
                        {fighter.nextFight.prediction.method}
                      </span>
                    </div>
                  </div>
                  
                  <Link 
                    to={`/fight/${fighter.nextFight.opponent.toLowerCase().replace(/\s+/g, '-')}`}
                    className="btn-primary w-full mt-4 text-sm"
                  >
                    View Fight Analysis
                  </Link>
                </div>
              )}

              {/* Quick Stats */}
              <div className="card-elevated">
                <h3 className="text-card-title text-text-white mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-body text-text-secondary">Total Fights:</span>
                    <span className="text-body text-text-primary font-medium">
                      {fighter.record.wins + fighter.record.losses + fighter.record.draws}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-body text-text-secondary">Win Rate:</span>
                    <span className="text-body text-success-green font-medium">
                      {((fighter.record.wins / (fighter.record.wins + fighter.record.losses)) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-body text-text-secondary">KO Rate:</span>
                    <span className="text-body text-text-primary font-medium">
                      {((fighter.stats.kos / fighter.record.wins) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-body text-text-secondary">Finish Rate:</span>
                    <span className="text-body text-text-primary font-medium">
                      {((fighter.stats.winsByFinish / fighter.record.wins) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Similar Fighters */}
              <div className="card-elevated">
                <h3 className="text-card-title text-text-white mb-4">Similar Fighters</h3>
                <p className="text-small text-text-secondary mb-4">
                  Fighters with similar fighting styles and statistics.
                </p>
                <div className="space-y-2">
                  <div className="text-small text-text-secondary">Coming Soon...</div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FighterProfilePage;