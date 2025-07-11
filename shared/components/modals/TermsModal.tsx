import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

import BellIcon from '../../assets/bell.svg';
import type { TermsModalProps } from '../../types';

/**
 * 服務條款模態窗元件，提供確認和取消按鈕的通用模態窗
 */
const TermsModal: React.FC<TermsModalProps> = ({ 
  isOpen, 
  onClose,
  confirmLink,
  title = '確定要離開嗎？',
  content = '您即將離開 CUBE App 前往其他網頁。',
  className = '',
  cancelText = '留在此頁',
  confirmText = '確認',
  iconSrc = BellIcon
}) => {
  const handleConfirm = () => {
    if (confirmLink) {
      window.open(confirmLink, '_blank', 'noopener,noreferrer');
    }
    onClose();
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
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut" as const
      }
    },
    exit: {
      opacity: 0,
      y: 30,
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
          className="u-fixed u-inset-0 u-flex u-items-center u-justify-center u-z-50"
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
            className={`u-bg-white u-rounded-lg u-p-5 u-z-10 u-flex u-flex-col u-items-center ${className}`}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* 圖標 */}
            <div className="u-mb-4 u-relative">
              <img src={iconSrc} alt="提醒" width="64" height="64" />
            </div>
            <p className="u-text-center u-mt-3 u-mb-2 u-font-semibold u-text-xl u-text-gray-900">
              {title}
            </p>
            <p className="u-text-center u-mb-3 u-text-md u-text-gray-600">
              {content}
            </p>
            
            {/* 按鈕組 */}
            <div className="u-flex u-w-full u-space-x-4">
              <button 
                className="u-flex-1 u-font-medium"
                onClick={onClose}
              >
                {cancelText}
              </button>
              <button 
                className="u-flex-1 u-py-3 u-bg-blue-1000 u-text-white u-rounded-md u-font-medium"
                onClick={handleConfirm}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TermsModal; 