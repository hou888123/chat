import React, { useEffect, useRef, ReactNode } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import type { ReminderModalProps } from '../../types';

import CloseIcon from '../../assets/close.svg';
/**
 * 提醒事項模態窗元件，支持自定義內容的通用模態窗
 */
const ReminderModal: React.FC<ReminderModalProps> = ({ 
  isOpen, 
  onClose,
  title = '提醒事項',
  content,
  className = '',
  autoResize = true,
  iconSrc = CloseIcon
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && autoResize && modalRef.current) {
      // 嘗試獲取聊天室容器
      const chatContainer = document.querySelector('.u-flex-1.u-overflow-y-auto.u-flex.u-flex-col') as HTMLElement;
      
      if (chatContainer) {
        const chatRect = chatContainer.getBoundingClientRect();
        const modalElement = modalRef.current;
        
        // 設置模態窗的寬度和高度
        modalElement.style.height = 'auto';
        modalElement.style.maxHeight = `calc(100vh - 160px)`;
        modalElement.style.width = 'calc(100vw - 40px)';

        // 將模態窗居中在聊天室內
        modalElement.style.position = 'absolute';
        modalElement.style.top = '50%';
        modalElement.style.left = '50%';
        modalElement.style.transform = 'translate(-50%, -50%)';
      }
    }
  }, [isOpen, autoResize]);

  // 根據內容類型渲染不同的內容
  const renderContent = () => {
    if (typeof content === 'string') {
      return <p className="u-text-custom-gray">{content}</p>;
    } else if (Array.isArray(content)) {
      return (
        <ol className="u-list-decimal u-list-inside u-text-gray-600">
          {content.map((item, index) => (
            <li key={index}>
              {item}
            </li>
          ))}
        </ol>
      );
    } else {
      return content;
    }
  };

  // 定義動畫變體
  const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.2 }
    }
  };

  const modalVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: '-30%',
      x: '-50%',
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: '-50%',
      x: '-50%',
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut" as const
      }
    },
    exit: {
      opacity: 0,
      y: '-50%',
      x: '-50%',
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeIn" as const
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className={`u-absolute u-inset-0 u-z-50 ${className}`}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div 
            className="u-absolute u-inset-0 u-bg-black u-bg-opacity-50" 
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div 
            ref={modalRef}
            className="u-bg-white u-rounded-lg u-z-10 u-flex u-flex-col"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* 標題和關閉按鈕 */}
            <div className="u-relative u-flex u-items-center u-justify-between u-px-5 u-py-4 u-border-b u-border-gray-200">
              <h2 className="u-text-xl u-font-bold">{title}</h2>
              <button 
                className="u-text-custom-gray u-text-2xl" 
                onClick={onClose}
              >
                <img src={iconSrc} alt="關閉" width="20" height="20" />
              </button>
            </div>
            
            {/* 內容區域，可滾動 */}
            <div className="u-px-6 u-py-4 u-overflow-y-auto u-flex-1">
              {renderContent()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReminderModal; 