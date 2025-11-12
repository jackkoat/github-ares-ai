import React from 'react';

interface WinProbabilityDisplayProps {
  fighterA: {
    name: string;
    photo?: string;
  };
  fighterB: {
    name: string;
    photo?: string;
  };
  winProbability: number; // Percentage for fighterA
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabels?: boolean;
  className?: string;
}

const WinProbabilityDisplay: React.FC<WinProbabilityDisplayProps> = ({
  fighterA,
  fighterB,
  winProbability,
  size = 'lg',
  showLabels = true,
  className = ''
}) => {
  const sizeClasses = {
    sm: { container: 'h-16', text: 'text-sm', fighterImg: 'w-8 h-8' },
    md: { container: 'h-20', text: 'text-base', fighterImg: 'w-10 h-10' },
    lg: { container: 'h-24', text: 'text-lg', fighterImg: 'w-12 h-12' },
    xl: { container: 'h-32', text: 'text-xl', fighterImg: 'w-16 h-16' }
  };

  const currentSize = sizeClasses[size];
  const fighterBPercentage = 100 - winProbability;

  return (
    <div className={`flex items-center space-x-4 ${currentSize.container} ${className}`}>
      {/* Fighter A */}
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div className="relative flex-shrink-0">
          <img 
            src={fighterA.photo || '/images/fighter-silhouette.png'} 
            alt={fighterA.name}
            className={`${currentSize.fighterImg} rounded-full object-cover border-2 border-border-subtle`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/fighter_portrait_placeholder.jpg';
            }}
          />
        </div>
        {showLabels && (
          <div className="min-w-0 flex-1">
            <div className={`${currentSize.text} font-semibold text-text-primary truncate`}>
              {fighterA.name}
            </div>
            <div className={`${currentSize.text} font-bold text-red-primary`}>
              {winProbability}%
            </div>
          </div>
        )}
      </div>

      {/* Probability Bar */}
      <div className="flex-1 max-w-xs">
        <div className="win-probability-bar h-4 mb-1">
          <div 
            className="win-probability-fill"
            style={{ width: `${winProbability}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-text-tertiary">
          <span>{winProbability}%</span>
          <span>{fighterBPercentage}%</span>
        </div>
      </div>

      {/* Fighter B */}
      <div className="flex items-center space-x-3 flex-1 justify-end min-w-0">
        {showLabels && (
          <div className="min-w-0 flex-1 text-right">
            <div className={`${currentSize.text} font-semibold text-text-primary truncate`}>
              {fighterB.name}
            </div>
            <div className={`${currentSize.text} font-bold text-text-secondary`}>
              {fighterBPercentage}%
            </div>
          </div>
        )}
        <div className="relative flex-shrink-0">
          <img 
            src={fighterB.photo || '/images/fighter-silhouette.png'} 
            alt={fighterB.name}
            className={`${currentSize.fighterImg} rounded-full object-cover border-2 border-border-subtle`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/fighter_portrait_placeholder.jpg';
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default WinProbabilityDisplay;