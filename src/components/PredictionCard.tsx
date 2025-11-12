import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Clock, TrendingUp } from 'lucide-react';

interface PredictionCardProps {
  fightId: string;
  eventName: string;
  date: string;
  venue: string;
  fighterA: {
    name: string;
    nickname?: string;
    record: string;
    rank?: number;
    photo?: string;
  };
  fighterB: {
    name: string;
    nickname?: string;
    record: string;
    rank?: number;
    photo?: string;
  };
  weightClass: string;
  prediction: {
    winProbability: number;
    confidence: number;
    method: string;
    round: number;
  };
  aiInsight?: string;
  isMainEvent?: boolean;
  status?: string;
  className?: string;
}

const PredictionCard: React.FC<PredictionCardProps> = ({
  fightId,
  eventName,
  date,
  venue,
  fighterA,
  fighterB,
  weightClass,
  prediction,
  aiInsight,
  isMainEvent = false,
  status = 'confirmed',
  className = ''
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 80) return { level: 'High', color: 'success-green' };
    if (confidence >= 65) return { level: 'Medium', color: 'warning-amber' };
    return { level: 'Low', color: 'text-secondary' };
  };

  const confidence = getConfidenceLevel(prediction.confidence);
  const winnerPercentage = prediction.winProbability;
  const loserPercentage = 100 - winnerPercentage;

  return (
    <div className={`card-elevated group cursor-pointer ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {isMainEvent && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-primary/20 text-red-primary border border-red-primary/30">
              <TrendingUp size={12} className="mr-1" />
              Main Event
            </span>
          )}
          <span className="text-small text-text-tertiary uppercase tracking-wider">
            {weightClass}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-small text-text-tertiary">
          <Clock size={14} />
          <span>{formatDate(date)}</span>
        </div>
      </div>

      {/* Fighter Matchup */}
      <div className="mb-6">
        <div className="text-section-headline text-center mb-4">
          {fighterA.name} vs {fighterB.name}
        </div>
        
        <div className="flex items-center justify-between">
          {/* Fighter A */}
          <div className="flex-1 text-center">
            <div className="relative mb-3">
              <div className="w-20 h-20 mx-auto bg-bg-hover rounded-full flex items-center justify-center border border-border-subtle">
                <img 
                  src={fighterA.photo || '/images/fighter_headshot_placeholder.jpg'} 
                  alt={fighterA.name}
                  className="w-16 h-16 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/fighter_portrait_placeholder.jpg';
                  }}
                />
              </div>
              {fighterA.rank && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-primary text-text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {fighterA.rank}
                </span>
              )}
            </div>
            <div className="text-card-title mb-1">{fighterA.name}</div>
            {fighterA.nickname && (
              <div className="text-small text-text-secondary mb-1">"{fighterA.nickname}"</div>
            )}
            <div className="text-small text-text-tertiary font-mono">{fighterA.record}</div>
          </div>

          {/* VS */}
          <div className="flex-shrink-0 mx-6">
            <div className="text-2xl font-display font-bold text-text-secondary">VS</div>
          </div>

          {/* Fighter B */}
          <div className="flex-1 text-center">
            <div className="relative mb-3">
              <div className="w-20 h-20 mx-auto bg-bg-hover rounded-full flex items-center justify-center border border-border-subtle">
                <img 
                  src={fighterB.photo || '/images/fighter_portrait_placeholder.jpg'} 
                  alt={fighterB.name}
                  className="w-16 h-16 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/fighter_portrait_placeholder.jpg';
                  }}
                />
              </div>
              {fighterB.rank && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-primary text-text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {fighterB.rank}
                </span>
              )}
            </div>
            <div className="text-card-title mb-1">{fighterB.name}</div>
            {fighterB.nickname && (
              <div className="text-small text-text-secondary mb-1">"{fighterB.nickname}"</div>
            )}
            <div className="text-small text-text-tertiary font-mono">{fighterB.record}</div>
          </div>
        </div>
      </div>

      {/* Win Probability Bar */}
      <div className="mb-6">
        <div className="win-probability-bar mb-3">
          <div 
            className="win-probability-fill"
            style={{ width: `${winnerPercentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-small">
          <span className="text-text-primary font-medium">{winnerPercentage}%</span>
          <span className="text-text-secondary">{loserPercentage}%</span>
        </div>
      </div>

      {/* Prediction Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-body">AI Confidence:</span>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-text-primary">{prediction.confidence}%</span>
            <span className={`text-small px-2 py-1 rounded-full bg-bg-hover ${confidence.color}`}>
              {confidence.level}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-body">Predicted Method:</span>
          <span className="font-medium text-text-secondary">
            {prediction.method}, Round {prediction.round}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-body">Venue:</span>
          <span className="text-small text-text-tertiary">{venue}</span>
        </div>
      </div>

      {/* AI Insight Preview */}
      {aiInsight && (
        <div className="mb-6 p-4 bg-bg-hover/50 rounded-lg border border-border-subtle">
          <p className="text-small text-text-secondary leading-relaxed line-clamp-2">
            {aiInsight}
          </p>
        </div>
      )}

      {/* Action Button */}
      <Link 
        to={`/fight/${fightId}`}
        className="btn-ghost w-full group-hover:border-red-primary group-hover:text-red-primary transition-colors duration-150"
      >
        <span>View Full Analysis</span>
        <ChevronRight size={16} className="ml-2" />
      </Link>
    </div>
  );
};

export default PredictionCard;