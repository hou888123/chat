import React, { useState, useRef, useEffect } from 'react';

interface CustomChatInputProps {
  /**
   * 輸入框占位符文本
   */
  placeholder?: string;
  /**
   * 輸入框值
   */
  value: string;
  /**
   * 是否禁用輸入框
   */
  disabled?: boolean;
  /**
   * 是否顯示發送按鈕
   */
  showSendButton?: boolean;
  /**
   * 輸入框最大高度
   */
  maxHeight?: number;
  /**
   * 輸入框最小高度
   */
  minHeight?: number;
  /**
   * 值變化時的回調函數
   */
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  /**
   * 提交時的回調函數
   */
  onSubmit: (e: React.FormEvent) => void;
  /**
   * 自定義樣式類名
   */
  className?: string;
  /**
   * 最大字符數
   */
  maxLength?: number;
}

/**
 * 自定義聊天輸入組件，用於用戶輸入消息
 */
const CustomChatInput: React.FC<CustomChatInputProps> = ({
  placeholder = '請輸入您的问题...',
  value,
  disabled = false,
  showSendButton = true,
  maxHeight = 72, // 約為三行文本的高度
  minHeight = 40,
  onChange,
  onSubmit,
  className = '',
  maxLength = 200
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // 處理輸入框聚焦
  const handleFocus = () => {
    setIsFocused(true);
  };

  // 處理輸入框失焦
  const handleBlur = () => {
    setIsFocused(false);
  };

  // 處理按鍵事件（回車提交）
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e as unknown as React.FormEvent);
    }
  };

  // 處理文本變化，限制最大字符數
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxLength) {
      onChange(e);
    }
  };

  // 自動聚焦到輸入框
  useEffect(() => {
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  return (
    <form
      onSubmit={onSubmit}
      className={`u-relative u-flex u-flex-col u-w-full u-rounded-lg u-border ${
        isFocused ? 'u-border-blue-500' : 'u-border-gray-300'
      } ${className}`}
    >
      <textarea
        ref={textareaRef}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        maxLength={maxLength}
        style={{ 
          maxHeight: `${maxHeight}px`,
          minHeight: `${minHeight}px`,
          resize: 'none',
          overflowY: 'auto'
        }}
        className="u-flex-grow u-p-3 u-rounded-lg u-outline-none u-bg-transparent u-w-full"
      />
      
      <div className="u-flex u-justify-between u-items-center u-px-3 u-py-1">
        <div className="u-text-xs u-text-gray-500">
          {value.length}/{maxLength}
        </div>
        
        {showSendButton && (
          <button
            type="submit"
            disabled={disabled || !value.trim()}
            className={`u-p-2 u-rounded-full u-w-10 u-h-10 u-flex u-items-center u-justify-center u-transition-colors ${
              disabled || !value.trim()
                ? 'u-text-gray-400 u-cursor-not-allowed'
                : 'u-text-blue-500 hover:u-bg-blue-100 u-cursor-pointer'
            }`}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"
                fill="currentColor"
              />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
};

export default CustomChatInput; 