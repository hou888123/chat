import React, { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts';
// 引入 Highcharts More 模塊以支持 variablepie 圖表
import 'highcharts/highcharts-more';
import 'highcharts/modules/variable-pie';

// VariablePieChart專用的類別資料接口 - 只包含名稱和金額
export interface VariablePieCategoryData {
  name: string;
  amount: number;
}

interface VariablePieChartProps {
  categories: VariablePieCategoryData[];
  width?: number;
  height?: number;
  onCategoryClick?: (categoryIndex: number) => void;
  selectedCategoryIndex?: number;
  isNegativePie?: boolean; // 標記是否為負值餅圖
  singleColor?: string; // 單一顏色，用於負值餅圖
}

// 固定顏色陣列
const FIXED_COLORS = [
  "#1D9C58", // 綠色
  "#67C7FB", // 藍色
  "#757EEC", // 靛藍色
  "#FFAB50", // 黃色
  "#EC5555", // 紅色
  "#BDBDBD"  // 灰色
];

// 將顏色轉換為半透明
const makeColorTransparent = (color: string, opacity: number = 0.3): string => {
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
};

const VariablePieChart: React.FC<VariablePieChartProps> = ({
  categories,
  onCategoryClick,
  selectedCategoryIndex,
  isNegativePie = false,
  singleColor
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<Highcharts.Chart | null>(null);
  const originalColorsRef = useRef<string[]>([]);

  // 初始化圖表
  useEffect(() => {
    if (!chartRef.current || categories.length === 0) return;

    // 過濾掉金額為0或負數的類別，除非是負值餅圖
    const filteredCategories = isNegativePie 
      ? categories 
      : categories.filter(category => category.amount > 0);

    if (filteredCategories.length === 0) return;

    // 計算總金額和百分比
    const totalAmount = filteredCategories.reduce((sum, category) => sum + category.amount, 0);
    
    // 將資料轉換為Highcharts格式，並計算百分比
    const seriesData = filteredCategories.map((category, index) => {
      const percentage = (category.amount / totalAmount) * 100;
      // 如果是負值餅圖且提供了單一顏色，則使用該顏色，否則使用固定顏色陣列
      const originalColor = isNegativePie && singleColor 
        ? singleColor 
        : FIXED_COLORS[index % FIXED_COLORS.length];
      
      // 保存原始顏色
      originalColorsRef.current[index] = originalColor;
      
      return {
        name: category.name,
        y: percentage,
        z: 76, // 初始z值
        color: originalColor,
        amount: category.amount,
        percentage: percentage,
        isLowPercentage: percentage < 10,
        categoryIndex: index,
        originalColor: originalColor
      };
    });

    // 如果圖表已存在，不重新創建
    if (chartInstanceRef.current) {
      return;
    }
    
    // 建立Highcharts圖表
    const chart = Highcharts.chart(chartRef.current, {
      chart: {
        type: 'variablepie',
        width: 345,
        height: 165,
        animation: {
          duration: 100 // 縮短動畫時間到300ms
        },
        marginLeft: -5
      },
      title: {
        text: undefined
      },
      credits: {
        enabled: false
      },  
      tooltip: {
        enabled: !isNegativePie, // 負值餅圖不顯示提示框
        formatter: function (this: any) {
          return `<b>${this.point?.name} : ${this.point?.percentage?.toFixed(1)}%<br/>`;
        },
        backgroundColor: '#fff'
      },
      plotOptions: {
        variablepie: {
          cursor: isNegativePie ? 'default' : 'pointer', // 負值餅圖不顯示指針
          dataLabels: {
            enabled: !isNegativePie, // 負值餅圖不顯示標籤
            distance: 10, // 增加標籤距離，為折行文字留出更多空間
            formatter: function(this: any) {
              const name = String(this.point?.name || '');
              const isLowPercentage = this.point?.isLowPercentage;
              
              // 低於10%不顯示標籤
              if (isLowPercentage) {
                return null;
              }
              
              // 超過7字則折行，確保完整顯示
              if (name.length <= 7) {
                return `<tspan>${name}</tspan>`;
              }
          
              const firstLine = name.slice(0, 7);
              const secondLine = name.slice(7);
              
              return `<tspan>${firstLine}<br>${secondLine}</tspan>`;
            },
            style: {
              fontSize: '12px',
              fontWeight: '600',
            }
          },
          size: '200',
          innerSize: '40',
          minPointSize: 38,
          maxPointSize: 65,
          zMin: 76,
          zMax: 85,
          showInLegend: false,
          slicedOffset: 0,
          sizeBy: 'radius',
          point: {
            events: {
              click: function(this: any) {
                if (onCategoryClick && !isNegativePie) {
                  onCategoryClick(this.categoryIndex);
                }
              }
            }
          },
          states: {
            hover: {
              halo: {
                size: 0, // 負值餅圖不顯示光暈
                opacity: 0.4
              },
              enabled: !isNegativePie // 負值餅圖不啟用 hover 狀態
            }
          }
        }
      },
      series: [{
        type: 'variablepie',
        data: seriesData,
        borderRadius: 0
      }]
    });

    chartInstanceRef.current = chart;
  }, [categories, isNegativePie, singleColor]); // 添加 isNegativePie 和 singleColor 的依賴

  // 更新選中狀態的effect
  useEffect(() => {
    if (!chartInstanceRef.current || !chartInstanceRef.current.series[0]) return;

    const chart = chartInstanceRef.current;
    const series = chart.series[0];

    // 更新每個點的狀態
    series.points.forEach((point: any, index: number) => {
      const originalColor = originalColorsRef.current[index] || FIXED_COLORS[index % FIXED_COLORS.length];
      
      if (selectedCategoryIndex !== undefined && selectedCategoryIndex !== -1) {
        if (index === selectedCategoryIndex) {
          // 選中的點：大幅增加z值，添加邊框效果，保持原色
          point.update({
            z: 85, // 大幅增加z值以顯著放大
            color: originalColor,
          });
        } else {
          // 未選中的點：使用較小的z值，變透明
          point.update({
            z: 76, // 降低z值縮小尺寸
            color: makeColorTransparent(originalColor, 0.3),
          });
        }
      } else {
        // 沒有選中任何點：恢復所有點的原始狀態
        point.update({
          z: 76, // 恢復默認z值
          color: originalColor,
        });
      }
    });

    // 重繪圖表
    chart.redraw(false);
  }, [selectedCategoryIndex]);

  return <div className='u-w-full u-flex u-justify-center' ref={chartRef}></div>;
};

export default VariablePieChart; 