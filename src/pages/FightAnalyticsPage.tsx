import React, { useEffect, useState } from 'react';
import { Calendar, Filter, Search, TrendingUp, Clock } from 'lucide-react';
import Navigation from '../components/Navigation';
import PredictionCard from '../components/PredictionCard';
import { ufcDataService, type UpcomingFight } from '../services/ufcDataService';

const FightAnalyticsPage: React.FC = () => {
  const [upcomingFights, setUpcomingFights] = useState<UpcomingFight[]>([]);
  const [filteredFights, setFilteredFights] = useState<UpcomingFight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const { upcomingFights } = await ufcDataService.getUpcomingFights();
        setUpcomingFights(upcomingFights);
        setFilteredFights(upcomingFights);
      } catch (error) {
        console.error('Error loading fight data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    let filtered = upcomingFights;

    // Apply filter
    switch (activeFilter) {
      case 'main-event':
        filtered = filtered.filter(fight => fight.mainEvent);
        break;
      case 'heavyweight':
        filtered = filtered.filter(fight => fight.weightClass.toLowerCase().includes('heavyweight'));
        break;
      case 'welterweight':
        filtered = filtered.filter(fight => fight.weightClass.toLowerCase().includes('welterweight'));
        break;
      case 'bantamweight':
        filtered = filtered.filter(fight => fight.weightClass.toLowerCase().includes('bantamweight'));
        break;
    }

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(fight =>
        fight.fighters.fighterA.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fight.fighters.fighterB.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fight.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fight.weightClass.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredFights(filtered);
  }, [upcomingFights, activeFilter, searchQuery]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getUpcomingWeeks = () => {
    const now = new Date();
    const oneWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const twoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    
    return {
      thisWeek: upcomingFights.filter(fight => new Date(fight.date) <= oneWeek).length,
      nextWeek: upcomingFights.filter(fight => {
        const fightDate = new Date(fight.date);
        return fightDate > oneWeek && fightDate <= twoWeeks;
      }).length,
      later: upcomingFights.filter(fight => new Date(fight.date) > twoWeeks).length
    };
  };

  const stats = getUpcomingWeeks();

  const filterTabs = [
    { id: 'all', label: 'All Fights', count: upcomingFights.length },
    { id: 'main-event', label: 'Main Events', count: upcomingFights.filter(f => f.mainEvent).length },
    { id: 'heavyweight', label: 'Heavyweight', count: upcomingFights.filter(f => f.weightClass.toLowerCase().includes('heavyweight')).length },
    { id: 'welterweight', label: 'Welterweight', count: upcomingFights.filter(f => f.weightClass.toLowerCase().includes('welterweight')).length },
    { id: 'bantamweight', label: 'Bantamweight', count: upcomingFights.filter(f => f.weightClass.toLowerCase().includes('bantamweight')).length },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-border-subtle border-t-red-primary rounded-full animate-spin mx-auto mb-4" />
              <p className="text-text-secondary">Loading fight analytics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-16">
        {/* Page Header */}
        <section className="py-12 border-b border-border-subtle">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-page-headline text-text-white mb-4">
                UFC Fight Analytics
              </h1>
              <p className="text-body text-text-secondary max-w-2xl mx-auto">
                Comprehensive AI-powered predictions for all upcoming UFC events with detailed analysis and confidence metrics.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-bg-near-black p-6 rounded-lg border border-border-subtle">
                <div className="flex items-center space-x-3 mb-2">
                  <Calendar size={20} className="text-red-primary" />
                  <span className="text-small text-text-secondary uppercase tracking-wider">This Week</span>
                </div>
                <div className="text-2xl font-bold text-text-white">{stats.thisWeek}</div>
              </div>
              <div className="bg-bg-near-black p-6 rounded-lg border border-border-subtle">
                <div className="flex items-center space-x-3 mb-2">
                  <TrendingUp size={20} className="text-red-primary" />
                  <span className="text-small text-text-secondary uppercase tracking-wider">Next Week</span>
                </div>
                <div className="text-2xl font-bold text-text-white">{stats.nextWeek}</div>
              </div>
              <div className="bg-bg-near-black p-6 rounded-lg border border-border-subtle">
                <div className="flex items-center space-x-3 mb-2">
                  <Clock size={20} className="text-red-primary" />
                  <span className="text-small text-text-secondary uppercase tracking-wider">Later</span>
                </div>
                <div className="text-2xl font-bold text-text-white">{stats.later}</div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">
              {/* Search and Filter Controls */}
              <div className="mb-8">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" />
                    <input
                      type="text"
                      placeholder="Search fighters, events, or weight classes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-bg-elevated border border-border-subtle rounded-lg text-text-primary placeholder-text-tertiary focus:border-red-primary focus:outline-none focus:ring-2 focus:ring-red-primary/20 transition-colors"
                    />
                  </div>
                  
                  {/* Filter Dropdown */}
                  <div className="relative">
                    <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" />
                    <select
                      value={activeFilter}
                      onChange={(e) => setActiveFilter(e.target.value)}
                      className="pl-10 pr-8 py-3 bg-bg-elevated border border-border-subtle rounded-lg text-text-primary focus:border-red-primary focus:outline-none focus:ring-2 focus:ring-red-primary/20 transition-colors appearance-none min-w-[200px]"
                    >
                      {filterTabs.map(tab => (
                        <option key={tab.id} value={tab.id}>
                          {tab.label} ({tab.count})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2">
                  {filterTabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveFilter(tab.id)}
                      className={`px-4 py-2 rounded-lg text-small font-medium transition-colors ${
                        activeFilter === tab.id
                          ? 'bg-red-primary text-text-white'
                          : 'bg-bg-elevated text-text-secondary hover:bg-bg-hover hover:text-text-primary'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results Count */}
              <div className="mb-6">
                <p className="text-small text-text-secondary">
                  Showing {filteredFights.length} of {upcomingFights.length} fights
                </p>
              </div>

              {/* Fight Cards Grid */}
              {filteredFights.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {filteredFights.map((fight) => (
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
                  <Search size={48} className="text-text-tertiary mx-auto mb-4" />
                  <h3 className="text-section-headline text-text-secondary mb-2">No fights found</h3>
                  <p className="text-body text-text-tertiary">
                    {searchQuery ? 'Try adjusting your search terms or filters.' : 'Check back soon for new predictions.'}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:w-80">
              <div className="sticky top-24 space-y-6">
                {/* Quick Filters */}
                <div className="card-elevated">
                  <h3 className="text-card-title text-text-white mb-4">Quick Filters</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setActiveFilter('all')}
                      className={`w-full text-left p-3 rounded-lg text-small transition-colors ${
                        activeFilter === 'all'
                          ? 'bg-red-primary/20 text-red-primary border border-red-primary/30'
                          : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
                      }`}
                    >
                      All Fights
                    </button>
                    <button
                      onClick={() => setActiveFilter('main-event')}
                      className={`w-full text-left p-3 rounded-lg text-small transition-colors ${
                        activeFilter === 'main-event'
                          ? 'bg-red-primary/20 text-red-primary border border-red-primary/30'
                          : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
                      }`}
                    >
                      Main Events Only
                    </button>
                  </div>
                </div>

                {/* Weight Classes */}
                <div className="card-elevated">
                  <h3 className="text-card-title text-text-white mb-4">Weight Classes</h3>
                  <div className="space-y-2">
                    {Array.from(new Set(upcomingFights.map(f => f.weightClass))).map(weightClass => (
                      <button
                        key={weightClass}
                        onClick={() => setActiveFilter(weightClass.toLowerCase().replace(' ', '-'))}
                        className={`w-full text-left p-3 rounded-lg text-small transition-colors ${
                          activeFilter === weightClass.toLowerCase().replace(' ', '-')
                            ? 'bg-red-primary/20 text-red-primary border border-red-primary/30'
                            : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
                        }`}
                      >
                        {weightClass}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Coming Soon */}
                <div className="card-elevated bg-gradient-to-br from-red-primary/10 to-bg-elevated">
                  <h3 className="text-card-title text-text-white mb-2">Premium Features</h3>
                  <p className="text-small text-text-secondary mb-4">
                    Unlock early access to predictions and detailed fight analysis.
                  </p>
                  <button className="btn-primary w-full text-sm">
                    Get Premium
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FightAnalyticsPage;