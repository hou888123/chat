import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConsumptionRecord } from '../../utils/SystemResponse';

import FlagIcon from '../../../assets/flag.svg';
import arrowRightIcon from '../../../assets/arrow_right.svg';
import { VariablePieChart, LineChart } from '../../charts';
import { VariablePieCategoryData } from '../../charts/VariablePieChart';

interface ConsumptionRecordComponentProps {
  consumptionRecord: ConsumptionRecord | null;
  initialShowDetails?: boolean; // 可選的初始展開狀態
  id?: string; // 可選的唯一標識符，用於區分不同的消費記錄
}

// 類別數據接口
interface CategoryData {
  name: string;
  amount: number;
  percentage: number;
  color: string;
  details: any[];
  isExpanded: boolean;
}

const ConsumptionRecordComponent: React.FC<ConsumptionRecordComponentProps> = ({
  consumptionRecord,
  initialShowDetails = false,
  id = 'default'
}) => {
  if (!consumptionRecord) return null;
  
  // 在組件內部維護展開/收合狀態
  const [showConsumptionDetails, setShowConsumptionDetails] = useState(initialShowDetails);
  
  // 維護類別展開狀態
  const [categories, setCategories] = useState<CategoryData[]>([]);
  
  // 添加選中類別的狀態
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number>(-1);
  
  // 添加圖表動畫狀態
  const [chartAnimated, setChartAnimated] = useState(false);
  
  // 當前頁碼狀態
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;
  const totalPages = consumptionRecord?.details?.length ? Math.ceil(consumptionRecord.details.length / itemsPerPage) : 0;
  
  // 頁面顯示配置
  const [paginationConfig, setPaginationConfig] = useState({
    maxVisiblePages: 3, // 最多顯示3個頁碼按鈕
    showFirstLast: false, // 不顯示第一頁和最後一頁
    alwaysShowPrevNext: true // 始終顯示上一頁下一頁按鈕
  });

  // 為類別明細的分頁配置
  const [categoryPaginationConfig, setCategoryPaginationConfig] = useState({
    maxVisiblePages: 3, // 最多显示3个页码按钮
    showFirstLast: false, // 不显示第一页和最后一页
    alwaysShowPrevNext: true // 始终显示上一页下一页按钮
  });
  
  // 切換到上一頁
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // 切換到下一頁
  const goToNextPage = () => {
    // 如果當前頁是最後一頁且需要新增一頁顯示提示
    if (currentPage === totalPages && shouldShowCompletionMessageOnNewPage()) {
      setCurrentPage(currentPage + 1); // 設置為總頁數+1的頁面
      return;
    }
    
    // 正常情況下，如果當前頁小於總頁數，則跳轉到下一頁
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  // 生成分頁按鈕
  const renderPaginationButtons = () => {
    const { maxVisiblePages, showFirstLast } = paginationConfig;
    
    // 計算實際的總頁數（包括額外的"完成頁"）
    const actualTotalPages = shouldShowCompletionMessageOnNewPage() ? totalPages + 1 : totalPages;
    
    // 計算需要顯示的頁碼範圍
    let startPage, endPage;
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    // 當前頁在前半部分
    if (currentPage <= halfVisible + 1) {
      startPage = 1;
      endPage = Math.min(maxVisiblePages, actualTotalPages);
    } 
    // 當前頁在后半部分
    else if (currentPage >= actualTotalPages - halfVisible) {
      startPage = Math.max(1, actualTotalPages - maxVisiblePages + 1);
      endPage = actualTotalPages;
    } 
    // 當前頁在中间
    else {
      startPage = currentPage - halfVisible;
      endPage = currentPage + halfVisible;
    }
    
    // 生成頁碼按鈕（非可點擊）
    const pages = [];
    
    // 前省略號
    if (startPage > 1) {
      pages.push(
        <span
          key="ellipsis-start"
            className="u-w-6 u-h-6 u-mx-1 u-rounded-full u-flex u-items-center u-justify-center u-text-gray-600"
          >
            ...
        </span>
      );
    }
    
    // 頁碼
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <span
          key={i}
            className={`u-w-6 u-h-6 u-mx-1 u-rounded-full u-flex u-items-center u-justify-center ${
            currentPage === i 
                ? 'u-text-blue-500 u-font-bold' 
                : 'u-text-gray-600'
            }`}
          >
          {i}
        </span>
      );
    }
    
    // 後省略號
    if (endPage < actualTotalPages) {
      pages.push(
        <span
          key="ellipsis-end"
            className="u-w-6 u-h-6 u-mx-1 u-rounded-full u-flex u-items-center u-justify-center u-text-gray-600"
          >
            ...
        </span>
    );
    }
    
    return pages;
  };

  // 渲染餅圖
  const renderPieChart = () => {
    if (!chartAnimated) {
    return (
          <div className="u-flex u-flex-col u-items-center u-justify-center u-py-8">
            <svg width="50" height="50" viewBox="0 0 50 50">
              <circle 
                cx="25" 
                cy="25" 
                r="20" 
                stroke="#E5E7EB" 
                strokeWidth="4" 
                fill="none" 
              />
              <circle 
                cx="25" 
                cy="25" 
                r="20" 
                stroke="#10B981" 
                strokeWidth="4" 
                fill="none" 
                strokeDasharray="125.6" 
                strokeDashoffset="25" 
                className="u-loading-spinner" 
              />
            </svg>
            <span className="u-mt-2 u-text-gray">加載中...</span>
          </div>
      );
    }
    
    // 將 CategoryData 轉換為 VariablePieCategoryData
    const variablePieCategories: VariablePieCategoryData[] = categories.map(category => ({
      name: category.name,
      amount: Math.abs(category.amount)
    }));
    
    // 處理負值餅圖的情況
    if (consumptionRecord?.hasNegativePie) {
      // 負值餅圖只顯示一個"更多"類別，但不影響類別列表的顯示
                return (
        <div className="u-flex u-flex-col u-items-center u-w-full u-pb-4">
          <VariablePieChart 
            categories={[{name: "更多", amount: 100}]}
            onCategoryClick={() => {}} // 空函數，不允許點擊
            selectedCategoryIndex={-1}
            isNegativePie={true}
            singleColor="#BDBDBD" // 灰色
          />
          <div className="u-text-center u-text-gray-600 u-mb-2">
            期間內，退款金額大於消費金額。
          </div>
        </div>
      );
    }
    
    return (
      <div className="u-flex u-justify-center u-w-full u-pb-4">
        <VariablePieChart 
          categories={variablePieCategories}
          onCategoryClick={(categoryIndex: number) => {
            // 點擊餅圖區域時的處理邏輯
            toggleCategory(categoryIndex);
          }}
          selectedCategoryIndex={selectedCategoryIndex}
        />
      </div>
    );
  };

  // 切換類別展開狀態
  const toggleCategory = (index: number) => {
    const newCategories = [...categories];
    
    // 如果點擊的類別已經展開，則收起
    if (newCategories[index].isExpanded) {
      newCategories[index].isExpanded = false;
      setSelectedCategoryIndex(-1);
    } else {
      // 收起其他所有類別
      newCategories.forEach((category, i) => {
        category.isExpanded = i === index;
      });
      
      // 設置選中的類別索引
      setSelectedCategoryIndex(index);
      
      // 重置該類別的分頁狀態
      setCategoryPagination({
        ...categoryPagination,
        [index]: { currentPage: 1, itemsPerPage: 5 }
      });
    }
    
    setCategories(newCategories);
  };

  // 在消費記錄組件頂部添加狀態變量
  const [categoryPagination, setCategoryPagination] = useState<{[key: number]: {currentPage: number, itemsPerPage: number}}>({});

  // 獲取特定類別當前頁的明細
  const getCategoryCurrentPageItems = (categoryIndex: number, details: any[]) => {
    const pagination = categoryPagination[categoryIndex] || { currentPage: 1, itemsPerPage: 5 };
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    return details.slice(startIndex, startIndex + pagination.itemsPerPage);
  };

  // 判斷類別明細是否需要新增一頁顯示"已載入完畢"提示
  const shouldShowCategoryCompletionMessageOnNewPage = (categoryIndex: number) => {
    const details = categories[categoryIndex]?.details || [];
    const pagination = categoryPagination[categoryIndex] || { currentPage: 1, itemsPerPage: 5 };
    const totalPages = Math.ceil(details.length / pagination.itemsPerPage);
    const lastPageItemsCount = details.length % pagination.itemsPerPage || pagination.itemsPerPage;
    
    // 如果最後一頁有5筆明細，則需要新增一頁
    return lastPageItemsCount === pagination.itemsPerPage && totalPages > 0;
  };
  
  // 判斷是否在當前類別頁顯示"已載入完畢"提示
  const shouldShowCategoryCompletionMessage = (categoryIndex: number) => {
    const details = categories[categoryIndex]?.details || [];
    const pagination = categoryPagination[categoryIndex] || { currentPage: 1, itemsPerPage: 5 };
    const totalPages = Math.ceil(details.length / pagination.itemsPerPage);
    
    // 如果需要新增一頁顯示提示，則當前頁不顯示
    if (shouldShowCategoryCompletionMessageOnNewPage(categoryIndex)) return false;
    
    // 如果當前頁是特殊的"完成頁"，則不顯示提示（因為已經在分頁控件中顯示了）
    if (pagination.currentPage > totalPages) return false;
    
    // 其他情況下，如果是最後一頁，則顯示提示
    return pagination.currentPage === totalPages;
  };
  
  // 計算類別明細"已載入完畢"區域的高度
  const getCategoryCompletionMessageHeight = (categoryIndex: number) => {
    const details = categories[categoryIndex]?.details || [];
    const pagination = categoryPagination[categoryIndex] || { currentPage: 1, itemsPerPage: 5 };
    const totalPages = Math.ceil(details.length / pagination.itemsPerPage);
    
    // 如果明細數量為0-5筆，高度固定為56px
    if (details.length <= pagination.itemsPerPage) {
      return 56;
    }
    
    // 如果是最後一頁，根據最後一頁的明細數量計算高度
    if (pagination.currentPage === totalPages) {
      const lastPageItemsCount = details.length % pagination.itemsPerPage || pagination.itemsPerPage;
      
      // 如果最後一頁有5筆明細，則新增一頁顯示此區域，高度為5筆明細的高度
      if (lastPageItemsCount === pagination.itemsPerPage && totalPages > 1) {
        // 如果不是唯一的一頁，則高度為5筆明細的高度
        return 5 * 105; // 每筆明細高度為105px
      } else if (lastPageItemsCount === pagination.itemsPerPage && totalPages === 1) {
        // 如果是唯一的一頁且有5筆明細，高度為56px
        return 56;
      } else {
        // 如果最後一頁明細數量少於5筆，計算補充高度
        return (pagination.itemsPerPage - lastPageItemsCount) * 105; // 每筆明細高度為105px
      }
    }
    
    // 如果是額外的"完成頁"，高度為5筆明細的高度
    if (pagination.currentPage > totalPages) {
      return 5 * 105; // 5筆明細的高度
    }
    
    return 56; // 默認高度
  };

  // 跳轉到類別的特定頁
  const goToCategoryPage = (categoryIndex: number, page: number) => {
    const pagination = categoryPagination[categoryIndex] || { currentPage: 1, itemsPerPage: 5 };
    const totalPages = Math.ceil((categories[categoryIndex]?.details?.length || 0) / pagination.itemsPerPage);
    
    // 如果當前頁是最後一頁且需要新增一頁顯示提示
    if (pagination.currentPage === totalPages && shouldShowCategoryCompletionMessageOnNewPage(categoryIndex)) {
      setCategoryPagination({
        ...categoryPagination,
        [categoryIndex]: { ...pagination, currentPage: page }
      });
      return;
    }
    
    if (page >= 1 && page <= totalPages) {
      // 更新分頁狀態
      setCategoryPagination({
        ...categoryPagination,
        [categoryIndex]: { ...pagination, currentPage: page }
      });
    }
    // 如果是特殊的"完成頁"（總頁數+1）
    else if (page === totalPages + 1 && shouldShowCategoryCompletionMessageOnNewPage(categoryIndex)) {
      setCategoryPagination({
        ...categoryPagination,
        [categoryIndex]: { ...pagination, currentPage: page }
      });
    }
  };

  // 渲染類別的分頁按鈕
  const renderCategoryPaginationButtons = (categoryIndex: number) => {
    const details = categories[categoryIndex]?.details || [];
    const pagination = categoryPagination[categoryIndex] || { currentPage: 1, itemsPerPage: 5 };
    const totalPages = Math.ceil(details.length / pagination.itemsPerPage);
    const { maxVisiblePages } = categoryPaginationConfig;
    
    // 計算實際的總頁數（包括額外的"完成頁"）
    const actualTotalPages = shouldShowCategoryCompletionMessageOnNewPage(categoryIndex) ? totalPages + 1 : totalPages;
    
    if (actualTotalPages <= 1) return null;
    
    // 計算需要顯示的頁碼範圍
    let startPage, endPage;
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    // 當前頁在前半部分
    if (pagination.currentPage <= halfVisible + 1) {
      startPage = 1;
      endPage = Math.min(maxVisiblePages, actualTotalPages);
    } 
    // 當前頁在后半部分
    else if (pagination.currentPage >= actualTotalPages - halfVisible) {
      startPage = Math.max(1, actualTotalPages - maxVisiblePages + 1);
      endPage = actualTotalPages;
    } 
    // 當前頁在中间
    else {
      startPage = pagination.currentPage - halfVisible;
      endPage = pagination.currentPage + halfVisible;
    }
    
    // 生成頁碼（非可點擊）
    const pages = [];
    
    // 前省略號
    if (startPage > 1) {
      pages.push(
        <span
          key="ellipsis-start"
          className="u-w-6 u-h-6 u-mx-1 u-rounded-full u-flex u-items-center u-justify-center u-text-gray-600"
        >
          ...
        </span>
      );
    }
    
    // 頁碼
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <span
          key={i}
          className={`u-w-6 u-h-6 u-mx-1 u-rounded-full u-flex u-items-center u-justify-center ${
            pagination.currentPage === i 
              ? 'u-text-blue-500 u-font-bold' 
              : 'u-text-gray-600'
          }`}
        >
          {i}
        </span>
      );
    }
    
    // 後省略號
    if (endPage < actualTotalPages) {
      pages.push(
        <span
          key="ellipsis-end"
          className="u-w-6 u-h-6 u-mx-1 u-rounded-full u-flex u-items-center u-justify-center u-text-gray-600"
        >
          ...
        </span>
      );
    }
    
    return (
      <div className="u-flex u-justify-between u-items-center u-py-4 u-px-4">
        <button 
          onClick={() => goToCategoryPage(categoryIndex, pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
          className={`u-w-4 u-h-4 u-flex u-items-center u-justify-center ${pagination.currentPage === 1 ? ' u-opacity-20' : ' u-opacity-100'}`}
        >
          <img 
            src={arrowRightIcon} 
            alt="上一頁" 
            className="u-transform u-rotate-180" 
            style={{ width: "40px", height: "40px" }} 
          />
        </button>
        
        <div className="u-flex u-items-center u-space-x-2">
          {pages}
        </div>
        
        <button 
          onClick={() => goToCategoryPage(categoryIndex, pagination.currentPage + 1)}
          disabled={pagination.currentPage === actualTotalPages}
          className={`u-w-4 u-h-4 u-flex u-items-center u-justify-center ${pagination.currentPage === actualTotalPages ? ' u-opacity-20' : ' u-opacity-100'}`}
        >
          <img 
            src={arrowRightIcon} 
            alt="下一頁" 
            style={{ width: "40px", height: "40px" }} 
          />
        </button>
      </div>
    );
  };

  // 渲染類別消費數據
  const renderCategoryList = () => {
    return (
      <div className='u-py-3'>
        {categories.map((category, index) => {
          return (
            <div key={index}>
              {/* 類別標題和金額展示 */}
              <div 
                className={`u-pt-3 ${category.isExpanded ? '' : 'u-pb-3'} u-px-4`}
              onClick={() => toggleCategory(index)}
            >
              
              <div className={`${category.isExpanded ? 'u-pb-3' : ''} u-flex u-justify-between u-items-center`}>
              <div className="u-flex u-items-center">
                  <div className={`${category.isExpanded ? 'u-w-3 u-h-3' : 'u-w-2 u-h-2'} u-rounded-full u-ml-[2px] u-mr-1.5`} style={{ backgroundColor: category.isExpanded ? '#fff' : category.color , border: category.isExpanded ? `3.5px solid ${category.color}` : 'none' }}></div>
                  <span className={`u-text-base ${category.isExpanded ? 'u-font-bold' : ''}`}>{category.name} {category.percentage}%</span>
              </div>
              <div className="u-flex u-items-center">
                  <span className={`u-mr-2 ${category.isExpanded ? 'u-font-bold' : ''}`}>
                  {category.amount < 0 ? '-' : ''}${Math.abs(category.amount).toLocaleString()}
                  </span>
                <svg 
                  className={`u-h-4 u-w-4 u-transform ${category.isExpanded ? 'u-rotate-180' : ''}`}
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              </div>
              {category.isExpanded && <div className="u-border-b u-border-dashed u-border-gray-200"></div>}
            </div>
            
              {/* 展開的類別明細 */}
              <AnimatePresence>
              {category.isExpanded && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className={`${index === categories.length - 1 ? '' : 'u-border-b u-border-gray-200 u-mb-3'}  u-overflow-hidden`}
                  >
                    {category.details.length > 0 ? (
                      // 有明細時顯示明細列表
                      <>
                {/* 當在特殊的"完成頁"時顯示"符合條件的交易明細已載入完畢。"提示 */}
                {(() => {
                  const pagination = categoryPagination[index] || { currentPage: 1, itemsPerPage: 5 };
                  const totalPages = Math.ceil(category.details.length / pagination.itemsPerPage);
                  
                  return pagination.currentPage > totalPages && shouldShowCategoryCompletionMessageOnNewPage(index) ? (
                    <div 
                      className="u-flex u-justify-center u-items-center u-text-gray-600 u-text-sm"
                      style={{ height: `${getCategoryCompletionMessageHeight(index)}px` }}
                    >
                      符合條件的交易明細已載入完畢。
                    </div>
                  ) : (
                    <>
                {getCategoryCurrentPageItems(index, category.details).map((detail, detailIndex) => (
                        <motion.div 
                          key={detailIndex} 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: detailIndex * 0.05 }}
                          className="u-px-4"
                        >
                          <div className="u-py-3 u-border-b u-border-dashed u-border-gray-100">
                              <div className="u-flex u-justify-between u-mb-1">
                                <span className="u-text-sm">{detail.date}</span>
                                <span className="u-text-sm">
                                {detail.amount < 0 ? '-' : ''}${Math.abs(detail.amount).toLocaleString()}
                                </span>
                    </div>
                                  <div className="u-text-sm u-text-gray u-mb-1">{detail.store}</div>
                    <div className="u-flex u-justify-between">
                                  <span className="u-text-sm u-text-gray-600">卡號末四碼 {detail.cardLastFour}</span>
                                  <span className="u-text-sm u-text-gray-600">{detail.category}</span>
                    </div>
                  </div>
                        </motion.div>
                      ))}
                      
                      {/* 符合條件的交易明細已載入完畢提示 - 移到頁碼上方 */}
                      {shouldShowCategoryCompletionMessage(index) && (
                        <div 
                          className="u-flex u-justify-center u-items-center u-text-gray-600 u-text-sm u-border-b u-border-gray-200"
                          style={{ height: `${getCategoryCompletionMessageHeight(index)}px` }}
                        >
                          符合條件的交易明細已載入完畢。
                        </div>
                      )}
                    </>
                  );
                })()}
                
                {/* 分頁按鈕 - 當明細超過5條時顯示 */}
                {category.details.length > 5 && renderCategoryPaginationButtons(index)}
                      </>
                    ) : (
                      // 無明細時顯示提示
                      <div className="u-py-4 u-text-center u-text-gray-500">
                        此類別暫無明細
              </div>
            )}
                  </motion.div>
              )}
              </AnimatePresence>
          </div>
          );
        })}
      </div>
    );
  };

  // 渲染折線圖
  const renderLineChart = () => {
    // 檢查是否正在加載
    if (!chartAnimated) {
      return (
        <div className="u-flex u-flex-col u-items-center u-justify-center u-py-10">
          <svg width="50" height="50" viewBox="0 0 50 50">
            <circle 
              cx="25" 
              cy="25" 
              r="20" 
              stroke="#E5E7EB" 
              strokeWidth="4" 
              fill="none" 
            />
            <circle 
              cx="25" 
              cy="25" 
              r="20" 
              stroke="#3B82F6" 
              strokeWidth="4" 
              fill="none" 
              strokeDasharray="125.6" 
              strokeDashoffset="25" 
              className="u-loading-spinner" 
            />
          </svg>
          <span className="u-mt-2 u-text-gray">加載中...</span>
        </div>
      );
    }

    // 判斷是否是多店鋪數據
    const isMultipleStores = consumptionRecord?.multipleStores && consumptionRecord?.twoStoresInfo && consumptionRecord.twoStoresInfo.length > 0;

    // 創建數據點
    let dataPointsStore1: {date: string; amount: number}[] = [];
    let dataPointsStore2: {date: string; amount: number}[] = [];
    let storeNames: string[] = [];
    
    if (isMultipleStores) {
      // 從消費紀錄明細中提取每個店鋪的數據
      const store1Name = consumptionRecord.twoStoresInfo?.[0]?.storeName || '';
      const store2Name = consumptionRecord.twoStoresInfo?.[1]?.storeName || '';
      
      // 使用部分匹配而不是精確匹配
      const store1Records = consumptionRecord.details?.filter(d => d.store.includes(store1Name)) || [];
      const store2Records = consumptionRecord.details?.filter(d => d.store.includes(store2Name)) || [];
      
      console.log('店鋪名稱:', store1Name, store2Name);
      console.log('店鋪1記錄數:', store1Records.length);
      console.log('店鋪2記錄數:', store2Records.length);
      
      // 直接使用每個店鋪自己的數據，不合并日期
      dataPointsStore1 = store1Records.map(r => ({
        date: r.date,
        amount: r.amount
      }));
      
      dataPointsStore2 = store2Records.map(r => ({
        date: r.date,
        amount: r.amount
      }));
      
      // 按日期排序數據
      dataPointsStore1.sort((a, b) => {
        const dateA = new Date(a.date.replace(/(\d+)\/(\d+)\/(\d+)/, '$1-$2-$3'));
        const dateB = new Date(b.date.replace(/(\d+)\/(\d+)\/(\d+)/, '$1-$2-$3'));
        return dateA.getTime() - dateB.getTime();
      });
      
      dataPointsStore2.sort((a, b) => {
        const dateA = new Date(a.date.replace(/(\d+)\/(\d+)\/(\d+)/, '$1-$2-$3'));
        const dateB = new Date(b.date.replace(/(\d+)\/(\d+)\/(\d+)/, '$1-$2-$3'));
        return dateA.getTime() - dateB.getTime();
      });
      
      // 如果數據為空，使用預設數據
      if (dataPointsStore1.length === 0) {
        dataPointsStore1 = [
          { date: '2023/01/01', amount: 8000 },
          { date: '2023/01/05', amount: 2800 },
          { date: '2023/01/10', amount: 4500 },
          { date: '2023/01/15', amount: 6000 },
          { date: '2023/01/20', amount: 3500 },
          { date: '2023/01/25', amount: 4200 },
          { date: '2023/01/31', amount: 2000 },
        ];
      }
      
      if (dataPointsStore2.length === 0) {
        dataPointsStore2 = [
          { date: '2023/01/01', amount: 5500 },
          { date: '2023/01/05', amount: 4800 },
          { date: '2023/01/10', amount: 5200 },
          { date: '2023/01/15', amount: 4000 },
          { date: '2023/01/20', amount: 4800 },
          { date: '2023/01/25', amount: 3800 },
          { date: '2023/01/31', amount: 4200 },
        ];
      }
      
      storeNames = [
        consumptionRecord.twoStoresInfo?.[0]?.storeName || '店铺1',
        consumptionRecord.twoStoresInfo?.[1]?.storeName || '店铺2'
      ];
      
      // 如果店鋪名為空，使用預設店鋪名
      if (!storeNames[0] || storeNames[0] === '店铺1') {
        storeNames[0] = consumptionRecord.twoStoresInfo?.[0]?.storeName || '店鋪1';
      }
      if (!storeNames[1] || storeNames[1] === '店铺2') {
        storeNames[1] = consumptionRecord.twoStoresInfo?.[1]?.storeName || '店鋪2';
      }
      
      console.log('處理後數據1:', dataPointsStore1);
      console.log('處理後數據2:', dataPointsStore2);
    } else {
      // 單店鋪情況，按日期排序數據
      dataPointsStore1 = consumptionRecord?.details?.map(d => ({
        date: d.date,
        amount: d.amount
      })) || [];
      
      // 按日期排序數據
      dataPointsStore1.sort((a, b) => {
        const dateA = new Date(a.date.replace(/(\d+)\/(\d+)\/(\d+)/, '$1-$2-$3'));
        const dateB = new Date(b.date.replace(/(\d+)\/(\d+)\/(\d+)/, '$1-$2-$3'));
        return dateA.getTime() - dateB.getTime();
      });
      
      // 如果沒有數據，使用預設數據
      if (dataPointsStore1.length === 0) {
        dataPointsStore1 = [
          { date: '2025/01/01', amount: 7000 },
          { date: '2025/01/05', amount: 2500 },
          { date: '2025/01/10', amount: 6000 },
          { date: '2025/01/15', amount: 8000 },
          { date: '2025/01/20', amount: 4100 },
          { date: '2025/01/31', amount: 2000 },
        ];
      }
      
      // 單店鋪情況下的店鋪名稱
      storeNames = [consumptionRecord.storeName || '店鋪'];
    }

    // 轉換為LineChart組件使用的數據格式
    const chartData = dataPointsStore1.map(d => ({
      label: d.date,
      value: d.amount
    }));
    
    // 如果是多店鋪數據，還要提供比較數據
    const compareData = isMultipleStores 
      ? dataPointsStore2.map(d => ({
          label: d.date,
          value: d.amount
        }))
      : undefined;

    // 尋找所有數據的最大值，用於Y軸的縮放
    const allDataPoints = [...dataPointsStore1, ...dataPointsStore2];
    const maxAmount = Math.max(...allDataPoints.map(d => d.amount));
    
    // 將Y軸的最大值向上取整到最接近的千位
    const yAxisMax = Math.ceil(maxAmount / 1000) * 1000;

    return (
      <div className="u-w-full">
        {/* 只有在多店鋪模式下才顯示顏色指示 */}
        {isMultipleStores && (
          <div className="u-pt-4 u-px-6 u-text-sm u-text-gray-900 u-flex u-items-center">
            <div className="u-flex u-items-center u-mr-6">
              <div className="u-w-2 u-h-2 u-bg-[#3B82F6] u-rounded-full u-mr-1.5"></div>
              <span>{storeNames[0]}</span>
                </div>
            <div className="u-flex u-items-center">
              <div className="u-w-2 u-h-2 u-bg-[#FF8800] u-rounded-full u-mr-1.5"></div>
              <span>{storeNames[1]}</span>
            </div>
          </div>
        )}
        <div className="u-flex u-justify-center u-mt-2">
          <LineChart 
            data={chartData}
            compareData={compareData}
            width={500}
            height={300}
            lineColor="#1890D2"
            compareLineColor="#FFAB50"
            animated={chartAnimated}
            showPoints={true}
            showLabels={true}
            yAxisMax={yAxisMax}
            mainSeriesName={storeNames[0]}
            compareSeriesName={isMultipleStores ? storeNames[1] : undefined}
          />
        </div>
      </div>
    );
  };

  // 設置圖表動畫狀態 - 統一處理
  useEffect(() => {
    // 只在組件第一次載入且有消費記錄時初始化動畫
    if (consumptionRecord && !chartInitializedRef.current) {
      console.log('初始化圖表動畫 - 消費記錄 ID:', id);
      
      // 重置動畫狀態
      setChartAnimated(false);
      
      // 延遲啟動動畫
      const timer = setTimeout(() => {
        setChartAnimated(true);
        chartInitializedRef.current = true;
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [consumptionRecord, id]);

  // 初始化餅圖類別數據
  useEffect(() => {
    if (consumptionRecord?.isCategory && consumptionRecord?.details && !pieChartInitializedRef.current) {
      console.log('初始化餅圖數據 - 消費記錄 ID:', id);
      
      // 處理負值餅圖的情況
      if (consumptionRecord.hasNegativePie) {
        // 按類別分組明細
        const detailsByCategory: {[key: string]: any[]} = {};
        consumptionRecord.details.forEach(detail => {
          if (!detailsByCategory[detail.category]) {
            detailsByCategory[detail.category] = [];
          }
          detailsByCategory[detail.category].push(detail);
        });
        
        // 計算每個類別的總金額和百分比
        const totalAmount = Math.abs(consumptionRecord.amount);
        let categoryData: CategoryData[] = Object.keys(detailsByCategory).map(categoryName => {
          const details = detailsByCategory[categoryName];
          const amount = details.reduce((sum, detail) => sum + detail.amount, 0);
          const percentage = Math.round((Math.abs(amount) / totalAmount) * 100);
          
          return {
            name: categoryName,
            amount: amount,
            percentage: percentage,
            color: "#BDBDBD", // 灰色
            details: details,
            isExpanded: false
          };
        });
        
        // 按百分比降序排序
        categoryData.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
        
        // 添加"更多"類別，作為獨立類別，明細數量為0筆
        const moreCategory: CategoryData = {
          name: "更多",
          amount: 0, // 金額為0
          percentage: 100, // 在餅圖中顯示為100%
          color: "#BDBDBD", // 灰色
          details: [], // 空明細列表
          isExpanded: false
        };
        
        // 將"更多"類別添加到類別數據中
        categoryData = [...categoryData, moreCategory];
        
        setCategories(categoryData);
      } else {
        // 為了模擬圖片中的數據，我們創建固定的類別
      const categoryData: CategoryData[] = [
        {
            name: "百貨公司百貨公司",
          amount: 4000,
          percentage: 40,
            color: "#1D9C58", // 绿色
          details: consumptionRecord.details.filter(item => item.category === "百貨公司" || item.category === "百貨"),
          isExpanded: false
        },
        {
          name: "預借現金/貸款",
          amount: 2500,
          percentage: 25,
            color: "#67C7FB", // 蓝色
            details: consumptionRecord.details.filter(item => item.category === "預借現金/貸款"),
          isExpanded: false
        },
        {
            name: "分期分期分期分期",
          amount: 1500,
          percentage: 15,
            color: "#757EEC", // 靛蓝色
          details: [],
          isExpanded: false
        },
        {
          name: "市區停車費",
          amount: 1200,
          percentage: 12,
            color: "#FFAB50", // 黄色
          details: [],
          isExpanded: false
        },
        {
          name: "郵購/保險",
          amount: 500,
          percentage: 5,
            color: "#EC5555", // 红色
          details: [],
          isExpanded: false
        },
        {
          name: "更多",
          amount: 300,
          percentage: 3,
            color: "#BDBDBD", // 灰色
          details: [],
          isExpanded: false
        }
      ];
      setCategories(categoryData);
      }
      
      // 重置選中狀態和分頁狀態
      setSelectedCategoryIndex(-1);
      setCategoryPagination({});
      
      // 標記餅圖已初始化
      pieChartInitializedRef.current = true;
    }
  }, [consumptionRecord?.isCategory, consumptionRecord?.details, consumptionRecord?.hasNegativePie, id]);

  // 判斷是否需要新增一頁顯示"已載入完畢"提示
  const shouldShowCompletionMessageOnNewPage = () => {
    if (!consumptionRecord?.details) return false;
    
    const lastPageItemsCount = getLastPageItemsCount();
    // 如果最後一頁有5筆明細，則需要新增一頁
    return lastPageItemsCount === itemsPerPage && totalPages > 0;
  };
  
  // 判斷是否在當前頁顯示"已載入完畢"提示
  const shouldShowCompletionMessageOnCurrentPage = () => {
    // 如果需要新增一頁顯示提示，則當前頁不顯示
    if (shouldShowCompletionMessageOnNewPage()) return false;
    
    // 如果當前頁是特殊的"完成頁"，則不顯示提示（因為已經在分頁控件中顯示了）
    if (currentPage > totalPages) return false;
    
    // 其他情況下，如果是最後一頁、無頁碼或最高消費記錄，則顯示提示
    return isLastPage() || consumptionRecord?.isHighest;
  };
  
  // 獲取當前頁顯示的記錄
  const getCurrentPageItems = () => {
    if (!consumptionRecord?.details) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    // 確保只返回當前頁應顯示的記錄
    return consumptionRecord.details.slice(startIndex, startIndex + itemsPerPage);
  };

  // 計算最後一頁的明細數量
  const getLastPageItemsCount = () => {
    if (!consumptionRecord?.details) return 0;
    const totalItems = consumptionRecord.details.length;
    return totalItems % itemsPerPage === 0 ? itemsPerPage : totalItems % itemsPerPage;
  };

  // 判斷是否為最後一頁
  const isLastPage = () => {
    return currentPage === totalPages;
  };

  // 計算"已載入完畢"區域的高度
  const getCompletionMessageHeight = () => {
    // 如果明細數量為0-5筆，高度固定為56px
    if (consumptionRecord?.details && consumptionRecord.details.length <= itemsPerPage) {
      return 56;
    }
    
    // 如果是最後一頁，根據最後一頁的明細數量計算高度
    if (isLastPage()) {
      const lastPageItemsCount = getLastPageItemsCount();
      
      // 如果最後一頁有5筆明細，則新增一頁顯示此區域，高度為5筆明細的高度
      if (lastPageItemsCount === itemsPerPage && totalPages > 1) {
        // 如果不是唯一的一頁，則高度為5筆明細的高度
        return 5 * 101; // 假設每筆明細高度為101px
      } else if (lastPageItemsCount === itemsPerPage && totalPages === 1) {
        // 如果是唯一的一頁且有5筆明細，高度為56px
        return 56;
      } else {
        // 如果最後一頁明細數量少於5筆，計算補充高度
        return ((itemsPerPage - lastPageItemsCount) * 101) - 1; // 假設每筆明細高度為101px
      }
    }
    
    // 如果是額外的"完成頁"，高度為5筆明細的高度
    if (currentPage > totalPages) {
      return 5 * 101; // 5筆明細的高度
    }
    
    return 56; // 默認高度
  };

  // 用於追蹤圖表是否已經初始化的 ref
  const chartInitializedRef = useRef<boolean>(false);
  const pieChartInitializedRef = useRef<boolean>(false);

  return (
    <div className="u-bg-white u-rounded-lg u-mt-5 u-font-roboto">
      <div className="u-overflow-hidden">
        <div className={`u-pt-4 u-px-4 ${consumptionRecord?.isHighest ? 'u-pb-3 u-border-b u-border-gray-200' : ''}`}>
          <div className="u-flex u-items-center u-mb-1">
          <img src={FlagIcon} alt="旗幟" className="u-w-4 u-h-4 u-mr-2" />
            <h4 className="u-text-sm u-font-semibold">
              {consumptionRecord?.isHighest ? "最高額的消費" : 
              (consumptionRecord?.isCategory ? "消費類別" : 
                (consumptionRecord?.multipleStores ? "店家消費總覽" : "消費總覽")
              )
            }
          </h4>
        </div>
        
          <div>
            <span className="u-text-sm">{consumptionRecord?.period}</span>
        </div>
        </div>
        {/* 顯示交易筆數信息 - 僅在非折線圖時顯示 */}
        {consumptionRecord?.multipleStores && consumptionRecord?.twoStoresInfo && !consumptionRecord?.hasChart && (
          <div className="u-flex u-flex-col u-mt-1 u-mb-3 u-px-4 u-text-sm ">
            <div>總筆數：{consumptionRecord?.times || 0} 筆</div>
            <div>{consumptionRecord.twoStoresInfo[0]?.storeName || '店铺1'}：{consumptionRecord.twoStoresInfo[0]?.times || 0} 筆</div>
            <div>{consumptionRecord.twoStoresInfo[1]?.storeName || '店铺2'}：{consumptionRecord.twoStoresInfo[1]?.times || 0} 筆</div>
          </div>
        )}
        
        {consumptionRecord?.noData ? (
          <div className="u-mt-3 u-py-12 u-text-center u-border-t u-border-gray-150 u-text-gray-600 u-text-sm">
            期間內，查無資訊。
          </div>
        ) : (
          <>
            {/* 消費類別顯示 */}
            {consumptionRecord?.isCategory ? (
              <>
                {renderPieChart()}
                
                {/* 添加類別和消費金額的標題行 */}
                <div className="u-flex u-justify-between u-items-center u-py-2 u-px-4 u-border-y u-border-gray-150">
                  <span className="u-text-sm u-text-gray-600 u-font-semibold">類別</span>
                  <span className="u-text-sm u-text-gray-600 u-font-semibold">消費金額</span>
                </div>
                
                {renderCategoryList()}
              </>
            ) : (
              <>
                {/* 消費總覽顯示 - 添加三行關鍵信息，僅在有折線圖時顯示 */}
                {consumptionRecord?.hasChart && (
                  <div>
                    {consumptionRecord?.multipleStores && consumptionRecord?.twoStoresInfo ? (
                      // 多店鋪模式顯示每家店鋪的信息（圖1格式）
                      <div className="u-px-4 u-border-b u-border-gray-200">
                        {consumptionRecord.twoStoresInfo && consumptionRecord.twoStoresInfo.map((store, index) => (
                          <div key={index} className={`${ index < consumptionRecord.twoStoresInfo!.length - 1 ? 'u-border-b u-border-dashed u-border-gray-150' : ''} u-py-3`}>
                            <div className="u-flex u-justify-between u-items-center u-pb-1">
                              <span className="u-w-[60%] u-flex u-items-center">
                                <span className="u-max-w-[53%] u-mr-2">{store.storeName}</span>
                                <span className="u-max-w-[47%] u-mr-2 u-break-all">({store.times.toLocaleString()})</span>
                              </span>
                              <span className="u-w-[40%] u-break-all u-font-bold u-text-right">${store.amount.toLocaleString()}</span>
                            </div>
                            <div className="u-flex u-justify-between u-items-center">
                              <span className="u-text-gray-600 u-text-sm">最高消費日 {store.highestDate}</span>
                              <span className="u-text-gray-600 u-text-sm">${store.highestAmount.toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      // 根據是否為單店鋪模式決定顯示格式
                      <div className="u-px-4 u-border-b u-border-gray-200">
                        {consumptionRecord.multipleStores === false ? (
                          // 單店鋪模式 - 一店 (ONE_STORES_CHART) 使用與多店鋪相同格式
                          <div className="u-py-3">
                            <div className="u-flex u-justify-between u-items-center u-pb-1">
                              <span className="u-w-[60%] u-flex u-items-center">
                                <span className="u-max-w-[53%] u-mr-2">{consumptionRecord.storeName}</span>
                                <span className="u-max-w-[47%] u-mr-2 u-break-all">({consumptionRecord.times.toLocaleString()})</span>
                              </span>
                              <span className="u-w-[40%] u-break-all u-font-bold u-text-right">${consumptionRecord.amount.toLocaleString()}</span>
                            </div>
                            <div className="u-flex u-justify-between u-items-center">
                              <span className="u-text-gray-600 u-text-sm">最高消費日 {consumptionRecord.highestDate}</span>
                              <span className="u-text-gray-600 u-text-sm">${consumptionRecord.highestAmount.toLocaleString()}</span>
                            </div>
                          </div>
                        ) : (
                          // 一線 (CHART_CONSUMPTION_RECORD) 使用原來的三行信息格式
                          <>
                            <div className="u-flex u-justify-between u-items-center u-py-3 u-border-b u-border-dashed u-border-gray-150">
                          <span className="">消費總金額</span>
                              <span className="u-font-bold">${consumptionRecord.amount.toLocaleString()}</span>
                        </div>
                            <div className="u-flex u-justify-between u-items-center u-py-3 u-border-b u-border-dashed u-border-gray-150">
                          <span className="">最高消費日</span>
                              <span className="u-font-bold">{consumptionRecord.highestDate}</span>
                        </div>
                            <div className="u-flex u-justify-between u-items-center u-py-3">
                          <span className="">當日總金額</span>
                              <span className="u-font-bold">${consumptionRecord.highestAmount.toLocaleString()}</span>
                        </div>
                      </>
                        )}
                      </div>
                    )}
                    
                    {/* 折線圖 */}
                    {renderLineChart()}
                  </div>
                )}
                
                {/* 針對非最高消費記錄，顯示店家和金額信息 */}
                {!consumptionRecord?.isHighest && !consumptionRecord?.hasChart && (
                  <div className='u-px-4'>
                    {consumptionRecord?.multipleStores && consumptionRecord?.details ? (
                      // 解析storeName，按逗號分割，通常格式為"家樂福、全聯"
                      (() => {
                        const storeNames = consumptionRecord.storeName.split('、');
                        // 根據store字段把details分組
                        const storeDetails = storeNames.map(name => {
                          return {
                            name: name,
                            count: consumptionRecord.details?.filter(d => d.store.includes(name)).length || 0,
                            amount: consumptionRecord.details?.filter(d => d.store.includes(name))
                              .reduce((sum, d) => sum + d.amount, 0) || 0
                          };
                        });
                        
                        return (
                          <>
                            {storeDetails.map((store, index) => (
                              <React.Fragment key={index}>
                                <div className="u-flex u-justify-between u-items-center u-py-3">
                                  <span className="">{store.name}（{store.count}）</span>
                                  <span className="u-font-bold">${store.amount.toLocaleString()}</span>
                                </div>
                                {index < storeDetails.length - 1 && (
                                  <div className="u-border-b u-border-dashed u-border-gray-150"></div>
                                )}
                              </React.Fragment>
                            ))}
                          </>
                        );
                      })()
                    ) : (
                      <div className="u-flex u-justify-between u-items-center u-py-3">
                        <span className="u-w-[60%] u-flex u-items-center">
                          <span className="u-max-w-[53%] u-mr-2">
                            {/* 判斷是否為 AMOUNT_COUNT 情境 */}
                            {consumptionRecord?.period?.includes("2025/01/01 ~ 2025/03/31") ? 
                              "消費總金額" : 
                              consumptionRecord?.storeName}
                          </span>
                          <span className="u-max-w-[47%] u-mr-2 u-break-all">({consumptionRecord?.times.toLocaleString()})</span>
                        </span>
                        <span className="u-w-[40%] u-break-all u-font-bold u-text-right">${consumptionRecord?.amount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                )}
                
                {/* 消費明細區域 - 所有類型共用 */}
                <div className={`${showConsumptionDetails ? 'u-px-4 u-border-t u-border-gray-200' : ''}`}>
                  {/* 只在有折線圖時顯示交易明細標題 */}
                  
                  {/* 明細內容 - 根據不同類型決定是否顯示 */}
                  <AnimatePresence>
                  {(consumptionRecord?.isHighest || showConsumptionDetails || 
                    (consumptionRecord?.hasChart && showConsumptionDetails)) && 
                    consumptionRecord?.details && consumptionRecord.details.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className={`${consumptionRecord?.isHighest ? 'u-px-4' : ''} u-overflow-hidden`}
                      >
                      {/* 明細項目 */}
                      {getCurrentPageItems().map((detail, index) => (
                          <motion.div 
                            key={index} 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            className={`u-pt-3 u-pb-2 u-border-b u-border-dashed u-border-gray-150`}
                          >
                            <div className="u-flex u-justify-between u-mb-1">
                              <span className="u-text-sm">{detail.date}</span>
                              <span className="u-text-sm">
                                ${Math.abs(detail.amount).toLocaleString()}{detail.amount < 0 ? '-' : ''}
                              </span>
                          </div>
                            <div className="u-text-sm u-mb-1">{detail.store}</div>
                          <div className="u-flex u-justify-between">
                              <span className="u-text-sm u-text-gray-600">卡號末四碼 {detail.cardLastFour}</span>
                              <span className="u-text-sm u-text-gray-600">{detail.category}</span>
                          </div>
                          </motion.div>
                      ))}
                      
                      {/* 符合條件的交易明細已載入完畢提示 */}
                      {(shouldShowCompletionMessageOnCurrentPage()) && (
                        <div 
                          className="u-flex u-justify-center u-items-center u-text-gray-600 u-text-sm"
                          style={{ height: `${getCompletionMessageHeight()}px` }}
                        >
                          符合條件的交易明細已載入完畢。
                        </div>
                      )}
                      
                      </motion.div>
                  )}
                  </AnimatePresence>
                </div>
                
                {/* 分頁控件 明細數量大於5筆且有多頁時才顯示 */}
                {(consumptionRecord?.isHighest || showConsumptionDetails || 
                  (consumptionRecord?.hasChart && showConsumptionDetails)) && 
                  (totalPages > 1 || shouldShowCompletionMessageOnNewPage()) && (
                  <div className={`${(isLastPage() && !shouldShowCompletionMessageOnNewPage()) ? 'u-border-t u-border-gray-150' : ''}`}>
                    {/* 當在特殊的"完成頁"時顯示"符合條件的交易明細已載入完畢。"提示 */}
                    {currentPage > totalPages ? (
                      <div>
                        <div 
                          className="u-flex u-justify-center u-items-center u-text-gray-600 u-text-sm"
                          style={{ height: `${5 * 101}px` }} /* 固定為5筆資料的高度 */
                        >
                          符合條件的交易明細已載入完畢。
                        </div>
                        <div className="u-flex u-justify-between u-items-center u-py-4 u-px-6 u-border-t u-border-gray-150">
                          <button 
                            onClick={goToPreviousPage}
                            className="u-w-4 u-h-4 u-flex u-items-center u-justify-center u-opacity-100"
                          >
                            <img 
                              src={arrowRightIcon} 
                              alt="上一頁" 
                              className="u-transform u-rotate-180" 
                              style={{ width: "40px", height: "40px" }} 
                            />
                          </button>
                          
                          <div className="u-flex u-justify-center u-items-center">
                            {renderPaginationButtons()}
                          </div>
                          
                          <button 
                            disabled={true}
                            className="u-w-4 u-h-4 u-flex u-items-center u-justify-center u-opacity-20"
                          >
                            <img 
                              src={arrowRightIcon} 
                              alt="下一頁" 
                              style={{ width: "40px", height: "40px" }} 
                            />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="u-flex u-justify-between u-items-center u-py-4 u-px-6">
                        <button 
                          onClick={goToPreviousPage}
                            disabled={currentPage === 1}
                          className={`u-w-4 u-h-4 u-flex u-items-center u-justify-center ${
                            currentPage === 1 
                              ? 'u-opacity-20' 
                              : 'u-opacity-100'
                          }`}
                        >
                          <img 
                            src={arrowRightIcon} 
                            alt="上一頁" 
                            className="u-transform u-rotate-180" 
                            style={{ width: "40px", height: "40px" }} 
                          />
                          </button>
                          
                          <div className="u-flex u-justify-center u-items-center">
                            {renderPaginationButtons()}
                          </div>
                          
                          <button 
                          onClick={goToNextPage}
                          disabled={(currentPage === totalPages && !shouldShowCompletionMessageOnNewPage())}
                          className={`u-w-4 u-h-4 u-flex u-items-center u-justify-center ${
                            (currentPage === totalPages && !shouldShowCompletionMessageOnNewPage())
                              ? 'u-opacity-20' 
                              : 'u-opacity-100'
                          }`}
                        >
                          <img 
                            src={arrowRightIcon} 
                            alt="下一頁" 
                            style={{ width: "40px", height: "40px" }} 
                          />
                          </button>
                        </div>
                      )}
                        </div>
                  )}
                  
                {/* 展開/收合明細按鈕 - 對於最高消費記錄不顯示 */}
                  {consumptionRecord?.details && consumptionRecord.details.length > 0 && 
                   !consumptionRecord.isHighest && (
                  <div className='u-px-4 u-py-4 u-border-t u-border-gray-150'>
                    <button 
                      className="u-w-full u-flex u-items-center u-justify-center u-text-gray-600"
                      onClick={() => setShowConsumptionDetails(!showConsumptionDetails)}
                    >
                      <span className="u-mr-1 u-text-sm u-font-semibold">{showConsumptionDetails ? '收合明細' : '展開明細'}</span>
                      <svg 
                        className={`u-h-4 u-w-4 u-transform ${showConsumptionDetails ? 'u-rotate-180' : ''}`}
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ConsumptionRecordComponent; 