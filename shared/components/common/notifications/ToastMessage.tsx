import React, { useEffect, useState } from 'react';
import { ToastMessageProps } from '../../../types';

// 注入全域樣式的函數
export const injectToastStyles = () => {
  const styleId = 'toast-animation-styles';
  
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes toastFadeInOut {
        0% { opacity: 0; transform: translateY(10px); }
        10% { opacity: 1; transform: translateY(0); }
        90% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(10px); }
      }
      .u-animate-toast {
        animation: toastFadeInOut 2s ease-in-out forwards;
      }
    `;
    document.head.appendChild(style);
  }
};

const ToastMessage: React.FC<ToastMessageProps> = ({
  message,
  show = false,
  onClose,
  duration = 3000,
}) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);

    // 如果顯示，計時後自動隱藏
    if (show) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) {
          onClose();
        }
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  // 注入樣式
  useEffect(() => {
    injectToastStyles();
  }, []);

  // 使用共用組件庫定義的u-toast類
  return (
    <div className={`u-fixed u-bottom-[136px] u-left-0 u-right-0 u-bg-black u-bg-opacity-75 u-text-white u-rounded-full u-py-3 u-px-4 u-text-center u-z-50 u-max-w-xs u-mx-auto u-w-fit ${isVisible ? 'u-animate-toast' : 'u-hidden'}`}>
      {message}
    </div>
  );
};

export default ToastMessage; 