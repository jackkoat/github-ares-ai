import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface FighterComparisonTableProps {
  fighterA: {
    name: string;
    stats: Record<string, number | string>;
  };
  fighterB: {
    name: string;
    stats: Record<string, number | string>;
  };
  stats: Array<{
    key: string;
    label: string;
    format?: 'number' | 'percentage' | 'time' | 'text';
    higherIsBetter?: boolean;
  }>;
  className?: string;
}

const FighterComparisonTable: React.FC<FighterComparisonTableProps> = ({
  fighterA,
  fighterB,
  stats,
  className = ''
}) => {
  const formatValue = (value: number | string, format?: string) => {
    if (typeof value === 'string') return value;
    
    switch (format) {
      case 'percentage':
        return `${value}%`;
      case 'time':
        return value.toString();
      case 'number':
        return value.toFixed(1);
      default:
        return value.toString();
    }
  };

  const getStatComparison = (fighterAValue: number | string, fighterBValue: number | string, higherIsBetter = true) => {
    if (typeof fighterAValue === 'string' || typeof fighterBValue === 'string') {
      return 'equal';
    }
    
    if (fighterAValue === fighterBValue) return 'equal';
    
    const fighterAWins = higherIsBetter ? fighterAValue > fighterBValue : fighterAValue < fighterBValue;
    return fighterAWins ? 'fighterA' : 'fighterB';
  };

  const getComparisonIcon = (comparison: string) => {
    switch (comparison) {
      case 'fighterA':
        return <TrendingUp size={16} className="text-red-primary" />;
      case 'fighterB':
        return <TrendingDown size={16} className="text-text-secondary" />;
      default:
        return <Minus size={16} className="text-text-tertiary" />;
    }
  };

  const getValueClassName = (comparison: string) => {
    switch (comparison) {
      case 'fighterA':
        return 'text-red-primary font-semibold';
      case 'fighterB':
        return 'text-text-secondary';
      default:
        return 'text-text-primary';
    }
  };

  return (
    <div className={`card-elevated ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-subtle">
              <th className="text-left py-4 px-6 text-section-headline">
                {fighterA.name}
              </th>
              <th className="text-center py-4 px-6 text-section-headline text-text-secondary">
                Stat
              </th>
              <th className="text-right py-4 px-6 text-section-headline">
                {fighterB.name}
              </th>
            </tr>
          </thead>
          <tbody>
            {stats.map((stat, index) => {
              const fighterAValue = fighterA.stats[stat.key];
              const fighterBValue = fighterB.stats[stat.key];
              const comparison = getStatComparison(fighterAValue, fighterBValue, stat.higherIsBetter);
              
              return (
                <tr 
                  key={stat.key} 
                  className={`border-b border-border-subtle/50 last:border-b-0 ${
                    index % 2 === 0 ? 'bg-transparent' : 'bg-bg-hover/30'
                  }`}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {comparison === 'fighterA' && getComparisonIcon(comparison)}
                      <span className={`font-mono ${getValueClassName(comparison)}`}>
                        {formatValue(fighterAValue, stat.format)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center text-text-secondary font-medium">
                    {stat.label}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <span className={`font-mono ${getValueClassName(comparison === 'fighterA' ? 'fighterB' : comparison === 'fighterB' ? 'fighterA' : 'equal')}`}>
                        {formatValue(fighterBValue, stat.format)}
                      </span>
                      {comparison === 'fighterB' && getComparisonIcon(comparison)}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FighterComparisonTable;