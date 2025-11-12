import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';

interface AnalyticsChartContainerProps {
  title?: string;
  children?: React.ReactNode;
  className?: string;
  chartOptions?: any;
  height?: string;
}

const AnalyticsChartContainer: React.FC<AnalyticsChartContainerProps> = ({
  title,
  children,
  className = '',
  chartOptions,
  height = 'h-80'
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (chartRef.current && chartOptions) {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
      
      chartInstance.current = echarts.init(chartRef.current, 'dark');
      chartInstance.current.setOption(chartOptions);
      
      const handleResize = () => {
        chartInstance.current?.resize();
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        chartInstance.current?.dispose();
      };
    }
  }, [chartOptions]);

  return (
    <div className={`card-elevated ${className}`}>
      {title && (
        <div className="mb-6">
          <h3 className="text-section-headline">{title}</h3>
        </div>
      )}
      
      {children ? (
        <div className={height}>
          {children}
        </div>
      ) : chartOptions ? (
        <div ref={chartRef} className={`w-full ${height}`} />
      ) : (
        <div className={`w-full ${height} flex items-center justify-center text-text-tertiary`}>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 border-2 border-border-subtle border-t-red-primary rounded-full animate-spin" />
            <p className="text-small">Loading chart data...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsChartContainer;