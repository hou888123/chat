import { useRef, useEffect, useState, useCallback } from 'react';

interface UseSmartScrollOptions {
  threshold?: number; // 距離底部多少像素算作"在底部"
  autoScrollDelay?: number; // 自動滾動延遲時間
  forceScrollOnUserMessage?: boolean; // 用戶發送訊息時是否強制滾動到底部
}

interface SmartScrollState {
  isAtBottom: boolean;
  hasScroll: boolean;
  showScrollButton: boolean;
}

/**
 * 智能滾動Hook
 * 管理對話框的滾動行為，包括：
 * 1. 檢測是否在底部
 * 2. 檢測是否有滾動條
 * 3. 智能自動滾動（只在用戶原本就在底部時自動滾動）
 * 4. 控制滾動到底部按鈕的顯示
 * 5. 支援用戶發送訊息和系統回覆時強制滾動到底部
 * 
 * @param dependencies 依賴項數組，當這些值變化時觸發智能滾動
 * @param options 配置選項
 * @returns 滾動相關的狀態和方法
 */
export const useSmartScroll = <T>(
  dependencies: T[], 
  options: UseSmartScrollOptions = {}
) => {
  const { threshold = 10, autoScrollDelay = 100, forceScrollOnUserMessage = true } = options;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState<SmartScrollState>({
    isAtBottom: true,
    hasScroll: false,
    showScrollButton: false
  });

  // 用於追蹤最近一次內容變化是否由用戶訊息觸發
  const isUserMessageRef = useRef<boolean>(false);
  
  // 檢查滾動狀態
  const checkScrollState = useCallback(() => {
    if (!containerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const hasScroll = scrollHeight > clientHeight;
    const isAtBottom = scrollHeight - scrollTop - clientHeight <= threshold;
    const showScrollButton = hasScroll && !isAtBottom;
    
    setScrollState({
      isAtBottom,
      hasScroll,
      showScrollButton
    });
  }, [threshold]);
  
  // 滾動到底部
  const scrollToBottom = useCallback((smooth = true) => {
    if (!containerRef.current) return;
    
    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto'
    });
    
    // 滾動後重新檢查狀態
    setTimeout(checkScrollState, smooth ? 300 : 0);
  }, [checkScrollState]);
  
  // 智能自動滾動
  const smartAutoScroll = useCallback(() => {
    if (!containerRef.current) return;
    
    // 檢查當前是否在底部
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isCurrentlyAtBottom = scrollHeight - scrollTop - clientHeight <= threshold;
    
    // 如果用戶在底部，或者這是用戶訊息且設置了強制滾動，則自動滾動到新的底部
    if (isCurrentlyAtBottom || (isUserMessageRef.current && forceScrollOnUserMessage)) {
      // 延遲滾動以確保內容已完全渲染
      setTimeout(() => {
        scrollToBottom(true);
        // 重置用戶訊息標記
        isUserMessageRef.current = false;
      }, autoScrollDelay);
    } else {
      // 如果不滾動，也需要重置用戶訊息標記
      isUserMessageRef.current = false;
    }
  }, [threshold, autoScrollDelay, scrollToBottom, forceScrollOnUserMessage]);
  
  // 標記下一次內容變化為用戶訊息觸發
  const markAsUserMessage = useCallback(() => {
    isUserMessageRef.current = true;
  }, []);
  
  // 監聽滾動事件
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    container.addEventListener('scroll', checkScrollState);
    
    // 初始檢查
    checkScrollState();
    
    return () => {
      container.removeEventListener('scroll', checkScrollState);
    };
  }, [checkScrollState]);
  
  // 當依賴項變化時，執行智能自動滾動
  useEffect(() => {
    // 延遲一點時間，確保DOM已更新
    const timer = setTimeout(() => {
      smartAutoScroll();
      // 再次檢查滾動狀態
      checkScrollState();
    }, autoScrollDelay);
    
    return () => clearTimeout(timer);
  // 使用 JSON.stringify 將依賴項數組轉換為字符串，確保依賴數組大小保持一致
  }, [JSON.stringify(dependencies), smartAutoScroll, checkScrollState, autoScrollDelay]);
  
  // 監聽容器大小變化
  useEffect(() => {
    if (!containerRef.current) return;
    
    const resizeObserver = new ResizeObserver(() => {
      checkScrollState();
    });
    
    resizeObserver.observe(containerRef.current);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [checkScrollState]);
  
  return {
    containerRef,
    scrollState,
    scrollToBottom,
    checkScrollState,
    markAsUserMessage
  };
}; 