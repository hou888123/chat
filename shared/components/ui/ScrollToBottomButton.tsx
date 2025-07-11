import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollToBottomIcon from '../../assets/arrow.svg';

interface ScrollToBottomButtonProps {
  containerRef: React.RefObject<HTMLElement>; // 必須提供容器參考
  threshold?: number; // 判斷"接近底部"的閾值（像素）
  onScrollToBottom?: () => void; // 外部滾動處理函數
  show?: boolean; // 外部控制顯示狀態（可選）
}

/**
 * 滾動到底部按鈕組件
 * 
 * 自動監測容器滾動狀態，當不在底部時顯示按鈕
 * 點擊按鈕會自動滾動到容器底部
 */
const ScrollToBottomButton: React.FC<ScrollToBottomButtonProps> = ({
  containerRef,
  threshold = 10,
  onScrollToBottom,
  show,
}) => {
  const [internalShowButton, setInternalShowButton] = useState(false);
  
  // 如果外部提供了show屬性，使用外部控制；否則使用內部邏輯
  const showButton = show !== undefined ? show : internalShowButton;
  
  // 滾動檢查函數
  const checkScrollPosition = useCallback(() => {
    const container = containerRef?.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const hasScroll = scrollHeight > clientHeight;
    const isNearBottom = scrollHeight - scrollTop - clientHeight <= threshold;
    
    // 只有當容器有滾動條且不在底部時才顯示按鈕
    setInternalShowButton(hasScroll && !isNearBottom);
  }, [containerRef, threshold]);

  useEffect(() => {
    // 如果外部已經控制顯示狀態，則不需要內部邏輯
    if (show !== undefined) return;
    
    const container = containerRef?.current;
    if (!container) return;

    // 添加滾動監聽
    container.addEventListener('scroll', checkScrollPosition);
    
    // 監聽容器大小變化和內容變化
    const resizeObserver = new ResizeObserver(checkScrollPosition);
    resizeObserver.observe(container);

    // 監聽容器內容變化（聊天訊息添加）
    const mutationObserver = new MutationObserver(checkScrollPosition);
    mutationObserver.observe(container, { 
      childList: true, 
      subtree: true,
      characterData: true 
    });

    // 初始檢查
    checkScrollPosition();

    // 定時檢查（防止某些情況下未觸發事件）
    const intervalCheck = setInterval(checkScrollPosition, 1000);

    // 清理監聽
    return () => {
      container.removeEventListener('scroll', checkScrollPosition);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      clearInterval(intervalCheck);
    };
  }, [containerRef, threshold, show, checkScrollPosition]);

  // 滾動到底部處理函數
  const handleClick = () => {
    if (onScrollToBottom) {
      // 使用外部提供的滾動函數
      onScrollToBottom();
    } else if (containerRef?.current) {
      // 使用內部默認滾動邏輯
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
      
      // 滾動後立即隱藏按鈕（提升用戶體驗）
      setInternalShowButton(false);
    }
  };

  // 根據位置設置樣式
  const positionClass = 'u-left-1/2 u-transform u--translate-x-1/2'  ;

  return (
    <AnimatePresence>
      {showButton && (
        <motion.button
          initial={{ opacity: 0, y: 18, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 18, x: '-50%' }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={handleClick}
          className={`u-fixed u-bottom-[140px] ${positionClass} u-z-40`}
          aria-label="滾動到底部"
        >
          {/* 下箭頭按鈕 */}
          <div className="u-w-[36px] u-h-[36px] u-rounded-full u-bg-white u-shadow-[0px_8px_20px_0px_rgba(0,0,0,0.1)] u-rotate-90 u-flex u-items-center u-justify-center u-cursor-pointer">
            <img 
              src={ScrollToBottomIcon} 
              alt="至底按鈕" 
              className="u-w-[21px] u-h-[19px]" 
            />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToBottomButton; 