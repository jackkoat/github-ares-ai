// Data service for fetching UFC prediction data

export interface Fighter {
  id: string;
  name: string;
  nickname: string;
  record: {
    wins: number;
    losses: number;
    draws: number;
  };
  division: string;
  ranking?: number;
  height: string;
  weight: string;
  reach: string;
  stance: string;
  age: number;
  photo: string;
  style: {
    striking: number;
    grappling: number;
    power: number;
    speed: number;
    cardio: number;
    defense: number;
    clinche: number;
    ground: number;
  };
  stats: {
    kos: number;
    submissions: number;
    decisions: number;
    avgFightTime: string;
    strikingAccuracy: string;
    takedownAccuracy: string;
    takedownDefense: string;
    significantStrikesPerMin: number;
    winsByFinish: number;
  };
  recentForm: Array<{
    opponent: string;
    result: 'win' | 'loss' | 'draw';
    method: string;
    round: number;
    time: string;
    date: string;
  }>;
  nextFight?: {
    opponent: string;
    date: string;
    venue: string;
    prediction: {
      winProbability: number;
      confidence: number;
      method: string;
      round: number;
    };
  };
  predictionAccuracy: number;
}

export interface UpcomingFight {
  id: string;
  event: string;
  title?: string;
  date: string;
  venue: string;
  mainEvent: boolean;
  prediction: {
    winProbability: number;
    confidence: number;
    method: string;
    round: number;
    aiInsight: string;
  };
  fighters: {
    fighterA: {
      id: string;
      name: string;
      nickname: string;
      rank: number;
      record: string;
      photo?: string;
    };
    fighterB: {
      id: string;
      name: string;
      nickname: string;
      rank: number;
      record: string;
      photo?: string;
    };
  };
  weightClass: string;
  status: string;
  odds: {
    fighterA: number;
    fighterB: number;
  };
  factors: Array<{
    name: string;
    winner: 'fighterA' | 'fighterB';
    score: number;
  }>;
}

export interface AccuracyStats {
  overall: {
    accuracy: number;
    totalPredictions: number;
    correctPredictions: number;
    recentStreak: number;
    confidenceAverage: number;
    lastUpdated: string;
  };
  byDivision: Array<{
    division: string;
    accuracy: number;
    totalPredictions: number;
    correctPredictions: number;
  }>;
  byMethod: Array<{
    method: string;
    accuracy: number;
    totalPredictions: number;
    correctPredictions: number;
  }>;
  monthlyAccuracy: Array<{
    month: string;
    accuracy: number;
    totalPredictions: number;
    correctPredictions: number;
  }>;
  recentResults: Array<{
    id: string;
    fight: string;
    date: string;
    predicted: {
      winner: string;
      method: string;
      round: number;
      confidence: number;
    };
    actual: {
      winner: string;
      method: string;
      round: number;
    };
    accuracy: number;
  }>;
  confidenceCalibration: Array<{
    confidenceRange: string;
    predictions: number;
    accuracy: number;
  }>;
}

class UFCDataService {
  private async fetchData<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
      throw error;
    }
  }

  async getFighters(): Promise<{ fighters: Fighter[] }> {
    return this.fetchData<{ fighters: Fighter[] }>('/data/fighters.json');
  }

  async getFighterById(id: string): Promise<Fighter | null> {
    try {
      const { fighters } = await this.getFighters();
      return fighters.find(fighter => fighter.id === id) || null;
    } catch (error) {
      console.error(`Error fetching fighter ${id}:`, error);
      return null;
    }
  }

  async getUpcomingFights(): Promise<{ upcomingFights: UpcomingFight[]; events: any[] }> {
    return this.fetchData<{ upcomingFights: UpcomingFight[]; events: any[] }>('/data/upcoming-fights.json');
  }

  async getFightById(id: string): Promise<UpcomingFight | null> {
    try {
      const { upcomingFights } = await this.getUpcomingFights();
      return upcomingFights.find(fight => fight.id === id) || null;
    } catch (error) {
      console.error(`Error fetching fight ${id}:`, error);
      return null;
    }
  }

  async getAccuracyStats(): Promise<AccuracyStats> {
    return this.fetchData<AccuracyStats>('/data/accuracy-stats.json');
  }

  // Generate sample chart data for fighter comparison
  generateFighterComparisonChart(fighterA: Fighter, fighterB: Fighter): any {
    const categories = ['Striking', 'Grappling', 'Power', 'Speed', 'Cardio', 'Defense'];
    const fighterAData = [
      fighterA.style.striking,
      fighterA.style.grappling,
      fighterA.style.power,
      fighterA.style.speed,
      fighterA.style.cardio,
      fighterA.style.defense
    ];
    const fighterBData = [
      fighterB.style.striking,
      fighterB.style.grappling,
      fighterB.style.power,
      fighterB.style.speed,
      fighterB.style.cardio,
      fighterB.style.defense
    ];

    return {
      backgroundColor: 'transparent',
      textStyle: {
        color: '#e4e4e7'
      },
      legend: {
        data: [fighterA.name, fighterB.name],
        textStyle: {
          color: '#a1a1aa'
        }
      },
      radar: {
        indicator: categories.map(cat => ({ name: cat, max: 10 })),
        axisName: {
          color: '#a1a1aa'
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        },
        splitArea: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        }
      },
      series: [
        {
          name: 'Fighter Comparison',
          type: 'radar',
          data: [
            {
              value: fighterAData,
              name: fighterA.name,
              itemStyle: {
                color: '#dc2626'
              },
              areaStyle: {
                color: 'rgba(220, 38, 38, 0.2)'
              }
            },
            {
              value: fighterBData,
              name: fighterB.name,
              itemStyle: {
                color: '#a1a1aa'
              },
              areaStyle: {
                color: 'rgba(161, 161, 170, 0.2)'
              }
            }
          ]
        }
      ]
    };
  }

  // Generate accuracy over time chart
  generateAccuracyChart(accuracyStats: AccuracyStats): any {
    return {
      backgroundColor: 'transparent',
      textStyle: {
        color: '#e4e4e7'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: accuracyStats.monthlyAccuracy.map(item => {
          const [year, month] = item.month.split('-');
          return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        }),
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        },
        axisLabel: {
          color: '#71717a'
        }
      },
      yAxis: {
        type: 'value',
        min: 80,
        max: 95,
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        },
        axisLabel: {
          color: '#71717a',
          formatter: '{value}%'
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        }
      },
      series: [
        {
          name: 'Accuracy',
          type: 'line',
          data: accuracyStats.monthlyAccuracy.map(item => item.accuracy),
          smooth: true,
          lineStyle: {
            color: '#dc2626',
            width: 3
          },
          itemStyle: {
            color: '#dc2626',
            borderColor: '#ffffff',
            borderWidth: 2
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(220, 38, 38, 0.3)'
                },
                {
                  offset: 1,
                  color: 'rgba(220, 38, 38, 0.05)'
                }
              ]
            }
          }
        }
      ]
    };
  }
}

export const ufcDataService = new UFCDataService();