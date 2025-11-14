import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Target, TrendingUp, Award, Clock, ArrowRight, Calendar, MapPin, Trophy } from 'lucide-react';
import Navigation from '../components/Navigation';
import PredictionCard from '../components/PredictionCard';
import AnalyticsChartContainer from '../components/AnalyticsChartContainer';
import { ufcDataService, type UpcomingFight, type AccuracyStats } from '../services/ufcDataService';

const HomePage: React.FC = () => {
  const [upcomingFights, setUpcomingFights] = useState<UpcomingFight[]>([]);
  const [ufc322Fights, setUfc322Fights] = useState<UpcomingFight[]>([]);
  const [accuracyStats, setAccuracyStats] = useState<AccuracyStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeToUFC322, setTimeToUFC322] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fightsData, accuracyData] = await Promise.all([
          ufcDataService.getUpcomingFights(),
          ufcDataService.getAccuracyStats()
        ]);
        
        // Get UFC 322 fights (first 6 fights)
        const ufc322 = fightsData.upcomingFights.filter(fight => 
          fight.event.includes('UFC 322')
        );
        setUfc322Fights(ufc322);
        
        // Get other upcoming fights (after UFC 322)
        const otherFights = fightsData.upcomingFights.filter(fight => 
          !fight.event.includes('UFC 322')
        );
        setUpcomingFights(otherFights.slice(0, 3)); // Show next 3 non-UFC 322 fights
        setAccuracyStats(accuracyData);
      } catch (error) {
        console.error('Error loading homepage data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Countdown timer for UFC 322
  useEffect(() => {
    const timer = setInterval(() => {
      const targetDate = new Date('2025-11-15T19:00:00').getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeToUFC322({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatAccuracyChart = (stats: AccuracyStats) => {
    return ufcDataService.generateAccuracyChart(stats);
  };

  const getUFC322FightCards = () => {
    const mainEvent = ufc322Fights.find(fight => fight.id === 'ufc-322');
    const coMain = ufc322Fights.find(fight => fight.id === 'ufc-322-comain');
    const otherFights = ufc322Fights.filter(fight => 
      fight.id !== 'ufc-322' && fight.id !== 'ufc-322-comain'
    );
    
    return { mainEvent, coMain, otherFights };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-pure-black">
        <Navigation />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-border-subtle border-t-red-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-text-secondary">Loading fight predictions...</p>
          </div>
        </div>
      </div>
    );
  }

  const { mainEvent, coMain, otherFights } = getUFC322FightCards();

  return (
    <div className="min-h-screen bg-bg-pure-black">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img 
            src="/images/ufc_octagon_hero.png" 
            alt="UFC Octagon"
            className="w-full h-full object-cover opacity-20"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-bg-pure-black via-bg-pure-black/80 to-red-primary/10" />
          <div className="absolute inset-0 octagon-pattern opacity-30" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="text-center">
            <h1 className="text-hero text-text-white mb-6">
              UFC AI Fight Predictions
            </h1>
            <p className="text-body-large text-text-secondary max-w-3xl mx-auto mb-8">
              ARES AI delivers world-class UFC fight predictions using advanced machine learning, fighter analytics, and probability modeling.
            </p>
            
            {accuracyStats && (
              <div className="inline-flex items-center space-x-8 mb-12 p-6 bg-bg-elevated/80 backdrop-blur-sm rounded-xl border border-border-subtle">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-primary mb-1">
                    {accuracyStats.overall.accuracy}%
                  </div>
                  <div className="text-small text-text-secondary">AI Accuracy</div>
                </div>
                <div className="w-px h-12 bg-border-subtle" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-text-white mb-1">
                    {accuracyStats.overall.totalPredictions.toLocaleString()}
                  </div>
                  <div className="text-small text-text-secondary">Total Predictions</div>
                </div>
                <div className="w-px h-12 bg-border-subtle" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-success-green mb-1">
                    {accuracyStats.overall.recentStreak}
                  </div>
                  <div className="text-small text-text-secondary">Current Streak</div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/fights" className="btn-primary flex items-center justify-center">
                <Target size={20} className="mr-2" />
                View Live Predictions
              </Link>
              <Link to="/accuracy" className="btn-ghost flex items-center justify-center">
                <Award size={20} className="mr-2" />
                Track AI Performance
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* UFC 322 Featured Event Section */}
      {mainEvent && (
        <section className="py-24 bg-gradient-to-br from-red-primary/20 to-bg-near-black">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 mb-4 px-4 py-2 bg-red-primary/20 rounded-full border border-red-primary/30">
                <Trophy size={16} className="text-red-primary" />
                <span className="text-small font-semibold text-red-primary uppercase tracking-wider">
                  Featured Event
                </span>
              </div>
              <h2 className="text-hero text-text-white mb-4">
                UFC 322: Della Maddalena vs Makhachev
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-text-secondary mb-8">
                <div className="flex items-center space-x-2">
                  <Calendar size={18} />
                  <span className="text-body">November 15, 2025</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin size={18} />
                  <span className="text-body">Madison Square Garden, New York</span>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="mb-12">
                <p className="text-body text-text-secondary mb-6">Countdown to Fight Night</p>
                <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
                  {[
                    { label: 'Days', value: timeToUFC322.days },
                    { label: 'Hours', value: timeToUFC322.hours },
                    { label: 'Minutes', value: timeToUFC322.minutes },
                    { label: 'Seconds', value: timeToUFC322.seconds }
                  ].map((item, index) => (
                    <div key={index} className="bg-bg-elevated/80 backdrop-blur-sm rounded-lg p-4 border border-border-subtle">
                      <div className="text-2xl font-bold text-red-primary mb-1">{item.value}</div>
                      <div className="text-small text-text-secondary">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* UFC 322 Fight Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Main Event */}
              {mainEvent && (
                <div className="lg:col-span-2">
                  <div className="bg-bg-elevated rounded-xl p-8 border border-red-primary/30">
                    <div className="text-center mb-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-primary/20 text-red-primary border border-red-primary/30 mb-4">
                        <Trophy size={12} className="mr-1" />
                        Main Event
                      </span>
                      <h3 className="text-2xl font-bold text-text-white mb-2">{mainEvent.event}</h3>
                      <p className="text-body text-text-secondary mb-4">Welterweight Championship</p>
                    </div>
                    <PredictionCard
                      fightId={mainEvent.id}
                      eventName={mainEvent.event}
                      date={mainEvent.date}
                      venue={mainEvent.venue}
                      fighterA={mainEvent.fighters.fighterA}
                      fighterB={mainEvent.fighters.fighterB}
                      weightClass={mainEvent.weightClass}
                      prediction={mainEvent.prediction}
                      aiInsight={mainEvent.prediction.aiInsight}
                      isMainEvent={true}
                      status={mainEvent.status}
                      className="bg-bg-near-black"
                    />
                  </div>
                </div>
              )}

              {/* Co-Main Event */}
              {coMain && (
                <div>
                  <div className="bg-bg-elevated rounded-xl p-6 border border-border-subtle">
                    <div className="text-center mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-500 border border-amber-500/30 mb-3">
                        <TrendingUp size={12} className="mr-1" />
                        Co-Main Event
                      </span>
                      <h3 className="text-xl font-bold text-text-white mb-2">{coMain.event}</h3>
                      <p className="text-small text-text-secondary mb-3">Lightweight Championship</p>
                    </div>
                    <PredictionCard
                      fightId={coMain.id}
                      eventName={coMain.event}
                      date={coMain.date}
                      venue={coMain.venue}
                      fighterA={coMain.fighters.fighterA}
                      fighterB={coMain.fighters.fighterB}
                      weightClass={coMain.weightClass}
                      prediction={coMain.prediction}
                      aiInsight={coMain.prediction.aiInsight}
                      isMainEvent={false}
                      status={coMain.status}
                      className="bg-bg-near-black"
                    />
                  </div>
                </div>
              )}

              {/* Other Championship Fights */}
              {otherFights.slice(0, 2).map((fight) => (
                <div key={fight.id}>
                  <div className="bg-bg-elevated rounded-xl p-6 border border-border-subtle">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-bold text-text-white mb-2">{fight.event}</h3>
                      <p className="text-small text-text-secondary mb-3">{fight.weightClass}</p>
                    </div>
                    <PredictionCard
                      fightId={fight.id}
                      eventName={fight.event}
                      date={fight.date}
                      venue={fight.venue}
                      fighterA={fight.fighters.fighterA}
                      fighterB={fight.fighters.fighterB}
                      weightClass={fight.weightClass}
                      prediction={fight.prediction}
                      aiInsight={fight.prediction.aiInsight}
                      isMainEvent={false}
                      status={fight.status}
                      className="bg-bg-near-black"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* UFC 322 Analysis Summary */}
            <div className="bg-bg-elevated rounded-xl p-8 border border-border-subtle">
              <h3 className="text-section-headline text-text-white mb-6 text-center">UFC 322 Event Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Trophy size={32} className="text-red-primary mx-auto mb-3" />
                  <h4 className="text-card-title text-text-white mb-2">Double Championship</h4>
                  <p className="text-small text-text-secondary">Two title fights headline this historic MSG event</p>
                </div>
                <div className="text-center">
                  <Target size={32} className="text-red-primary mx-auto mb-3" />
                  <h4 className="text-card-title text-text-white mb-2">High Accuracy Predictions</h4>
                  <p className="text-small text-text-secondary">89.7% AI accuracy across all UFC 322 matchups</p>
                </div>
                <div className="text-center">
                  <TrendingUp size={32} className="text-red-primary mx-auto mb-3" />
                  <h4 className="text-card-title text-text-white mb-2">Major Storylines</h4>
                  <p className="text-small text-text-secondary">JDM's first defense vs Makhachev's weight jump</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Other Upcoming Fights Section */}
      <section className="py-24 bg-bg-near-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-page-headline text-text-white mb-4">
              Other Upcoming Events
            </h2>
            <p className="text-body text-text-secondary max-w-2xl mx-auto">
              AI-powered predictions for additional major UFC events with detailed analysis and confidence metrics.
            </p>
          </div>

          {upcomingFights.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
              {upcomingFights.map((fight) => (
                <PredictionCard
                  key={fight.id}
                  fightId={fight.id}
                  eventName={fight.event || fight.title || 'UFC Event'}
                  date={fight.date}
                  venue={fight.venue}
                  fighterA={fight.fighters.fighterA}
                  fighterB={fight.fighters.fighterB}
                  weightClass={fight.weightClass}
                  prediction={fight.prediction}
                  aiInsight={fight.prediction.aiInsight}
                  isMainEvent={fight.mainEvent}
                  status={fight.status}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Clock size={48} className="text-text-tertiary mx-auto mb-4" />
              <h3 className="text-section-headline text-text-secondary mb-2">No Additional Upcoming Fights</h3>
              <p className="text-body text-text-tertiary">UFC 322 is the next major event. Check back for updates.</p>
            </div>
          )}

          <div className="text-center">
            <Link to="/fights" className="btn-ghost">
              View All Predictions
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Analytics Section */}
      {accuracyStats && (
        <section className="py-24 bg-bg-elevated">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-page-headline text-text-white mb-4">
                AI Performance Analytics
              </h2>
              <p className="text-body text-text-secondary max-w-2xl mx-auto">
                Track our AI model's performance over time with detailed accuracy metrics and confidence calibration.
              </p>
            </div>

            <AnalyticsChartContainer
              title="Monthly Accuracy Trend"
              chartOptions={formatAccuracyChart(accuracyStats)}
              height="h-96"
            />

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-bg-near-black rounded-lg border border-border-subtle">
                <TrendingUp size={32} className="text-red-primary mx-auto mb-3" />
                <h3 className="text-section-headline text-text-white mb-2">Real-time Updates</h3>
                <p className="text-body text-text-secondary">
                  Predictions updated as new data becomes available from training camps and weigh-ins.
                </p>
              </div>
              <div className="text-center p-6 bg-bg-near-black rounded-lg border border-border-subtle">
                <Target size={32} className="text-red-primary mx-auto mb-3" />
                <h3 className="text-section-headline text-text-white mb-2">Advanced Algorithms</h3>
                <p className="text-body text-text-secondary">
                  Machine learning models trained on thousands of fight data points and historical performance.
                </p>
              </div>
              <div className="text-center p-6 bg-bg-near-black rounded-lg border border-border-subtle">
                <Award size={32} className="text-red-primary mx-auto mb-3" />
                <h3 className="text-section-headline text-text-white mb-2">Proven Results</h3>
                <p className="text-body text-text-secondary">
                  Consistently high accuracy rates across all weight classes and fight outcomes.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-bg-pure-black to-red-primary/10">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-page-headline text-text-white mb-6">
            Get Premium Predictions
          </h2>
          <p className="text-body-large text-text-secondary mb-8 max-w-2xl mx-auto">
            Unlock exclusive AI insights, early access to predictions, and detailed fight analysis 
            for serious fight fans and professionals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button className="btn-primary text-lg px-8 py-4">
              Start Free Trial
            </button>
            <Link to="/accuracy" className="btn-ghost text-lg px-8 py-4">
              View Performance
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;