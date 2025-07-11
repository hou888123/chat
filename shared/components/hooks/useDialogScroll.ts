import { useRef, useEffect } from 'react';

/**
 * 對話框滾動Hook
 * 自動滾動對話框到最新消息
 */
export const useDialogScroll = <T>(dependencies: T[]) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  
  // 當對話歷史更新時，滾動到最新消息
  useEffect(() => {
    if (!scrollRef.current) return;
    
    // 使用requestAnimationFrame確保在瀏覽器重繪之前執行滾動
    const scrollToLatest = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ block: 'end', behavior: 'smooth' });
      }
    };
    
    const animationId = requestAnimationFrame(scrollToLatest);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, dependencies);
  
  return scrollRef;
}; 