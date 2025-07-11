import { useState } from 'react';

/**
 * 錯誤處理Hook
 * 集中管理各種錯誤狀態和處理邏輯
 */
export const useErrorHandling = () => {
  // 錯誤狀態
  const [isFrontendErrorVisible, setIsFrontendErrorVisible] = useState(false);
  const [isIdleTimeoutErrorVisible, setIsIdleTimeoutErrorVisible] = useState(false);
  
  // 錯誤處理函數
  const handleFrontendErrorButtonClick = () => setIsFrontendErrorVisible(true);
  const handleIdleTimeoutErrorButtonClick = () => setIsIdleTimeoutErrorVisible(true);
  
  return {
    // 錯誤狀態
    isFrontendErrorVisible,
    isIdleTimeoutErrorVisible,
    
    // 錯誤處理函數
    handleFrontendErrorButtonClick,
    handleIdleTimeoutErrorButtonClick,
  };
}; 