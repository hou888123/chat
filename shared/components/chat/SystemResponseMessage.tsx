import React, { useState, useEffect, useRef } from 'react';
import { formatCurrency } from '../../utils/formatters';
import TypingText from '../ui/TypingText';

interface SystemResponseMessageProps {

  // 純文本模式的屬性
  text?: string;
  typingSpeed?: number;
  isGreeting?: boolean;
  isLoading?: boolean;
  enableTyping?: boolean;
  className?: string;
  
  // 新增打字效果完成事件回調
  onTypingComplete?: () => void;
}

/**
 * 通用系統回覆消息組件
 * 支持純文本和消費數據格式
 */
const SystemResponseMessage: React.FC<SystemResponseMessageProps> = ({

  // 純文本模式參數
  text = '',
  typingSpeed = 60,
  isGreeting = false,
  isLoading = false,
  enableTyping = true,
  className = '',
  
  // 打字效果完成事件回調
  onTypingComplete
}) => {
  // 純文本模式
  if (text) {
    if (enableTyping) {
      return (
        <TypingText
          text={text}
          typingSpeed={typingSpeed}
          className={`u-text-base u-text-gray-900 u-break-words ${isGreeting ? 'u-text-xl' : ''} ${className}`}
          onTypingComplete={onTypingComplete}
        />
      );
    } else {
      // 不啟用打字效果時直接顯示文字
      return (
        <div 
          className={`u-text-base u-text-gray-900 u-break-words ${isGreeting ? 'u-text-xl' : ''} ${className}`}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      );
    }
  }

  let consumptionText = '';
  // 使用 TypingText 組件來顯示消費數據文字
  if (enableTyping) {
    return (
      <TypingText
        text={consumptionText}
        typingSpeed={typingSpeed}
        className={`u-text-base u-text-gray-900 u-break-words ${className}`}
        onTypingComplete={onTypingComplete}
      />
    );
  } else {
    // 不啟用打字效果時直接顯示文字
    return (
      <div 
        className={`u-text-base u-text-gray-900 u-break-words ${className}`}
        dangerouslySetInnerHTML={{ __html: consumptionText }}
      />
    );
  }
};

export default SystemResponseMessage; 