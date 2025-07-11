import React, { ReactNode, useRef, useEffect, useState, createContext, useContext } from 'react';
import ScrollToBottomButton  from '../../components/ui/ScrollToBottomButton';
import { useSmartScroll } from '../hooks/useSmartScroll';

// 創建一個 Context 來提供容器高度
export const ContainerHeightContext = createContext<number>(0);

// 提供一個 Hook 來獲取容器高度
export const useContainerHeight = () => useContext(ContainerHeightContext);

export interface DialogLayoutProps {
  children: ReactNode;
  footerComponent?: ReactNode;
  scrollDependencies?: any[]; // 用於觸發智能滾動的依賴項
  forceScrollOnUserMessage?: boolean; // 用戶發送訊息時是否強制滾動到底部
  onUserMessageSent?: () => void; // 用戶發送訊息時的回調函數
}

/**
 * 標準化對話頁面布局組件
 * 提供標準化的對話界面，包含標題欄、內容區域和可選的底部組件
 * 集成智能滾動功能
 */
const DialogLayout: React.FC<DialogLayoutProps> = ({
  children,
  footerComponent,
  scrollDependencies = [],
  forceScrollOnUserMessage = true, // 默認為 true，用戶發送訊息時強制滾動到底部
  onUserMessageSent
}) => {
  // 使用智能滾動Hook
  const { containerRef, scrollState, scrollToBottom, markAsUserMessage } = useSmartScroll(
    scrollDependencies,
    { 
      threshold: 10, // 增加閾值，與 ScrollToBottomButton 保持一致
      autoScrollDelay: 100,
      forceScrollOnUserMessage // 設置是否在用戶發送訊息時強制滾動到底部
    }
  );

  // 添加狀態來存儲容器高度
  const [containerHeight, setContainerHeight] = useState<number>(0);
  
  // 使用 useEffect 來測量容器高度
  useEffect(() => {
    const updateContainerHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
      }
    };
    
    // 初始測量
    updateContainerHeight();
    
    // 添加 resize 事件監聽器
    window.addEventListener('resize', updateContainerHeight);
    
    // 當滾動依賴項變化時，重新測量高度
    const resizeObserver = new ResizeObserver(updateContainerHeight);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    // 清理函數
    return () => {
      window.removeEventListener('resize', updateContainerHeight);
      resizeObserver.disconnect();
    };
  }, [containerRef]);
  
  // 監聽用戶發送訊息事件
  useEffect(() => {
    // 創建一個自定義事件監聽器
    const handleUserMessageSent = () => {
      // 標記下一次內容變化為用戶訊息觸發
      markAsUserMessage();
      
      // 如果提供了回調函數，則調用它
      if (onUserMessageSent) {
        onUserMessageSent();
      }
    };
    
    // 添加事件監聽器
    document.addEventListener('userMessageSent', handleUserMessageSent);
    
    // 清理函數
    return () => {
      document.removeEventListener('userMessageSent', handleUserMessageSent);
    };
  }, [markAsUserMessage, onUserMessageSent]);

  return (
    <div className="u-relative u-inset-0 u-flex u-items-end u-justify-center">
      <div className="u-relative u-w-full u-max-w-full u-flex u-flex-col">
        
        <div 
          ref={containerRef} 
          className="u-fixed u-top-0 u-left-0 u-right-0 u-bottom-[108px] u-overflow-y-auto u-flex-1 u-flex u-flex-col u-z-0"
        >
          <ContainerHeightContext.Provider value={containerHeight}>
            {children}
          </ContainerHeightContext.Provider>
        </div>
        
        {/* 智能滾動到底部按鈕 - 使用組件內部邏輯判斷是否顯示 */}
        <ScrollToBottomButton 
          containerRef={containerRef}
          onScrollToBottom={() => scrollToBottom(true)}
        />
        
        {footerComponent}
      </div>
    </div>
  );
};

export default DialogLayout; 