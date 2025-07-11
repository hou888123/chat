import React, { useEffect, useRef, useState, useMemo } from 'react';
import Highcharts from 'highcharts';

interface DataPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  lineColor?: string;
  animated?: boolean;
  showPoints?: boolean;
  showLabels?: boolean;
  yAxisMax?: number;
  compareData?: DataPoint[];
  compareLineColor?: string;
  mainSeriesName?: string;
  compareSeriesName?: string;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  width: initialWidth = 400,
  height: initialHeight = 240,
  lineColor = '#ff0000',
  animated = true,
  showPoints = true,
  showLabels = true,
  yAxisMax,
  compareData,
  compareLineColor = '#FF8800',
  mainSeriesName = '主要數據',
  compareSeriesName = '比較數據'
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<Highcharts.Chart | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(initialWidth);
  const [isTouching, setIsTouching] = useState<boolean>(false);
  const touchStartRef = useRef<{x: number, y: number} | null>(null);
  
  
  // 監聽容器寬度變化
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateWidth = () => {
      if (containerRef.current) {
        // 獲取容器寬度，限制在300px到400px之間
        const parentWidth = containerRef.current.parentElement?.clientWidth || initialWidth;
        const newWidth = Math.min(400, Math.max(300, parentWidth));
        setContainerWidth(newWidth);
      }
    };
    
    // 初始化時設置寬度
    updateWidth();
    
    // 創建ResizeObserver監聽容器大小變化
    const resizeObserver = new ResizeObserver(updateWidth);
    if (containerRef.current.parentElement) {
      resizeObserver.observe(containerRef.current.parentElement);
    }
    
    // 同時也監聽window的resize事件
    window.addEventListener('resize', updateWidth);
    
    return () => {
      // 清理監聽
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, [initialWidth]);
  
  // 當容器寬度變化時，重新繪製圖表
  useEffect(() => {
    if (chartInstanceRef.current) {
      // 計算新的高度以保持比例
      const aspectRatio = initialHeight / initialWidth;
      const newHeight = Math.round(containerWidth * aspectRatio);
      
      // 調整圖表大小
      chartInstanceRef.current.setSize(containerWidth, newHeight, true);
    }
  }, [containerWidth, initialWidth, initialHeight]);
  
  // 格式化金額為帶千分位和$符號的格式
  const formatCurrency = (value: number): string => {
    return '$' + value.toLocaleString('en-US');
  };
  
  useEffect(() => {
    if (chartRef.current && data && data.length > 0) {
      // 清除現有圖表
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
      
      // 調試日誌 - 檢查數據是否正確傳入
      console.log('LineChart 重新渲染 - 主要數據:', data.length, '筆');
      if (compareData) {
        console.log('LineChart 重新渲染 - 比較數據:', compareData.length, '筆');
      }
      
      // 找出最高值及其索引
      const maxValue = Math.max(...data.map(item => item.value));
      const maxIndex = data.findIndex(item => item.value === maxValue);
      
      // 如果有比較數據，找出比較數據的最高點
      let compareMaxValue = 0;
      let compareMaxIndex = -1;
      
      if (compareData && compareData.length > 0) {
        compareMaxValue = Math.max(...compareData.map(item => item.value));
        compareMaxIndex = compareData.findIndex(item => item.value === compareMaxValue);
      }
      
      // 計算Y軸刻度的高度（5個級距，每個間隔30px）
      const yAxisHeight = 30 * 4; // 4個間隔產生5個刻度
      
      // 將資料轉換為Highcharts格式
      const mainSeries: any = {
        type: 'line',
        name: mainSeriesName,
        color: lineColor,
        data: data.map((point, index) => ({
          x: new Date(point.label.replace(/(\d+)\/(\d+)\/(\d+)/, '$1-$2-$3')).getTime(),
          y: point.value
        }))
      };
      
      // 建立系列數組
      const series: any[] = [mainSeries];
      
      // 如果有比較數據，添加第二條線
      if (compareData && compareData.length > 0) {
        const compareSeries: any = {
          type: 'line',
          name: compareSeriesName,
          color: compareLineColor,
          data: compareData.map((point, index) => ({
            x: new Date(point.label.replace(/(\d+)\/(\d+)\/(\d+)/, '$1-$2-$3')).getTime(),
            y: point.value
          }))
        };
        
        series.push(compareSeries);
      }
      
      // 獲取所有日期以確定X軸範圍
      const allDates = [
        ...data.map(d => new Date(d.label.replace(/(\d+)\/(\d+)\/(\d+)/, '$1-$2-$3')).getTime()),
        ...(compareData ? compareData.map(d => new Date(d.label.replace(/(\d+)\/(\d+)\/(\d+)/, '$1-$2-$3')).getTime()) : [])
      ];
      
      // 排序並找出最早和最晚的日期
      allDates.sort((a, b) => a - b);
      const firstDate = allDates.length > 0 ? new Date(allDates[0]) : new Date();
      const lastDate = allDates.length > 0 ? new Date(allDates[allDates.length - 1]) : new Date();
      
      // 格式化日期顯示
      const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
      };

      const mobilePositioner = function (this: any, labelWidth: number, _: any, point: any) {
          const chart = this.chart as any;

          const getXPosition = () => {
              const basePosition = point.plotX + chart.plotLeft;
              const labelRight = basePosition + labelWidth / 2;
              const labeLeft = basePosition - labelWidth / 2;
              const plotRight = chart.plotWidth + chart.plotLeft;

              if (labelRight > plotRight) return basePosition - labelWidth;
              if (labeLeft < chart.plotLeft) return basePosition;
              return labeLeft;
          };

          return {
              x: getXPosition(),
              y: -6,
          };
      };
      // 建立Highcharts圖表
      const chart = Highcharts.chart(chartRef.current, {
        chart: {
          type: 'line',
          width: containerWidth,
          height: 228,
          animation: animated,
          style: {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
          },
          zooming: {
            mouseWheel: false
          },
          panning: {
            enabled: true,
            type: 'x'
          }
        },
        title: {
          text: undefined
        },
        credits: {
          enabled: false
        },
        xAxis: {
          type: 'datetime',
          labels: {
            useHTML: true,
            formatter: function() {
                const isFirst = this.isFirst;
                const isLast = this.isLast;
                
                let margin = '';
                if (isFirst) margin = 'margin-left: 58px;';
                if (isLast) margin = 'margin-right: 58px;';
                
                return '<div style="' + margin + ';">' + 
                      Highcharts.dateFormat('%Y/%m/%d', Number(this.value)) + 
                      '</div>';
            },
            rotation: 0, // 水平顯示文字
            style: {
              fontSize: '12px',
              color: '#707070'
            },
            overflow: 'allow' // 使用Highcharts允許的值
          },
          lineWidth: 0, // 添加X軸線條
          lineColor: 'transparent',
          tickPositions: [firstDate.getTime(), lastDate.getTime()], // 只在首尾顯示刻度
          tickWidth: 0, // 移除刻度線
          tickLength: 0, // 移除刻度線長度
          gridLineWidth: 0, // 移除垂直網格線
          startOnTick: false,
          endOnTick: false,
          crosshair: {
            width: .5,
            color: '#bdbdbd',
            dashStyle: 'Solid'
          }
        },
        yAxis: {
          title: {
            text: undefined
          },
          min: 0,
          max: yAxisMax,
          startOnTick: true,
          endOnTick: true,
          height: yAxisHeight, // 設定Y軸高度
          gridLineColor: '#e7e7e7',
          gridLineDashStyle: 'Dash',
          gridLineWidth: .5,
          labels: {
            style: {
              fontSize: '12px',
              color: '#707070'
            }
          },
          plotLines: [{
              value: 0,
              color: '#E7E7E7', // 跟背景一樣的顏色
              width: .5 // 或設為 0 完全不顯示
          }],
          lineWidth: 0, // 添加Y軸線條
          lineColor: 'transparent' // Y軸線條顏色
        },
        tooltip: {
          formatter: function() {
            // 顯示日期和數值
            const date = formatDate(new Date(this.x));
            return `<div class="u-text-center u-text-sm u-font-roboto"><span class="u-text-gray-900">${this.y !== undefined ? formatCurrency(this.y) : '$0'}</span> <br> <span class="u-text-gray-600">${date}</span></div>`;
          },
          enabled: true,
          shared: false,
          useHTML: true,
          backgroundColor: 'transparent',
          headerFormat: '',
          hideDelay: 100,
          positioner: mobilePositioner,
        },
        plotOptions: {
          line: {
            animation: animated,
            lineWidth: 1,
            marker: {
              enabled: false, // 預設不顯示標記點
              radius: 5,
              lineWidth: 1,
              lineColor: '#fff',
              symbol: 'circle',
              states: {
                hover: {
                  enabled: true,
                  lineWidth: 1,
                  lineColor: 'rgba(255, 255, 255, 0.8)',
                  radius: 6,
                  radiusPlus: 2,
                  lineWidthPlus: 1,
                }
              }
            },
            dataLabels: {
              enabled: false,
              align: 'center'
            },
            states: {
              hover: {
                lineWidthPlus: 0,
                halo: {
                  size: 12,
                  opacity: 0.25
                }
              }
            },
            stickyTracking: false,
            connectNulls: false
          },
          series: {
            includeInDataExport: true,
            connectNulls: false,
            states: {
                hover: {
                  enabled: true
                },
            },
            stickyTracking: true,  // 保持追蹤狀態
            enableMouseTracking: true
          }
        },
        responsive: {
          rules: [{
            condition: {
              maxWidth: 400
            },
            chartOptions: {
              chart: {
                spacing: [54, 20, 24, 15],
              },
              legend: {
                enabled: false
              },
              yAxis: {
                tickAmount: 5,
                tickPixelInterval: 30,
                lineWidth: 1
              },
              xAxis: {
                lineWidth: 1
              }
            }
          }]
        },
        series: series // 直接使用series陣列
      });
      
      // 在圖表渲染後，添加最高點的標籤和光暈效果
      if (chart && maxIndex >= 0 && maxValue > compareMaxValue) {
        const maxPoint = chart.series[0].points.find(p => p.y === maxValue);
        chart.tooltip.refresh(maxPoint!);
        maxPoint?.setState('hover');
        chart.xAxis[0].drawCrosshair(undefined, maxPoint);
      }
      
      // 添加比較數據的最高點標籤和光暈效果
      if (chart && compareMaxIndex >= 0 && compareData && compareData.length > 0 && compareMaxValue > maxValue) {
        const compareMaxPoint = chart.series[1].points.find(p => p.y === compareMaxValue);
        chart.tooltip.refresh(compareMaxPoint!);
        compareMaxPoint?.setState('hover');
        chart.xAxis[0].drawCrosshair(undefined, compareMaxPoint);
      }
      
      // 保存圖表實例以便後續更新
      chartInstanceRef.current = chart;
    }
  }, [
    // 只包含真正會影響圖表數據的依賴項
    JSON.stringify(data), 
    JSON.stringify(compareData), 
    containerWidth, 
    yAxisMax,
    lineColor,
    compareLineColor,
    mainSeriesName,
    compareSeriesName
  ]);
        
        return (
    <div 
      ref={containerRef} 
      style={{ width: '100%', minWidth: '300px', maxWidth: '400px' }}
    >
      <div ref={chartRef} style={{ width: '100%' }}></div>
    </div>
  );
};

export default LineChart; 