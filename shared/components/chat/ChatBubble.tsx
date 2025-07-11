import React from 'react';
import { motion, Variants } from 'framer-motion';

interface ChatBubbleProps {
  isUser: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * 通用消息氣泡組件
 * 用於顯示對話中的用戶消息和系統回覆
 * @param isUser 是否為用戶消息
 * @param children 消息內容
 * @param className 額外的樣式類名
 */
const ChatBubble: React.FC<ChatBubbleProps> = ({ 
  isUser, 
  children,
  className = ''
}) => {
  // 定義動畫變體
  const bubbleVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <motion.div 
      className={`u-flex u-mb-4 ${isUser ? 'u-justify-end' : 'u-flex-col u-items-start'}`}
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
    >
      <div 
        className={`
          ${isUser ? 'u-max-w-[80%] u-px-3 u-py-2 u-bg-white u-rounded-md u-shadow-sm' : 'u-max-w-[80%] u-px-4 u-py-2 u-rounded-lg'}
          ${className}
        `}
      >
        {children}
      </div>
    </motion.div>
  );
};

export default ChatBubble; 