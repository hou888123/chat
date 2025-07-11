import React, { FormEvent, useRef, useEffect, KeyboardEvent } from 'react';
import { ChatInputProps } from '../../types';
import { motion, Variants } from 'framer-motion';

const newChatButtonVariants: Variants = {
  hidden: { opacity: 0, y: 15, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { 
      duration: 0.3, 
      ease: "easeOut" as const 
    } 
  },
  exit: { 
    opacity: 0, 
    y: 10, 
    scale: 0.95, 
    transition: { 
      duration: 0.2, 
      ease: "easeIn" as const 
    } 
  }
};

const ChatInput: React.FC<ChatInputProps> = ({
  inputText,
  handleInputChange,
  handleInputSubmit,
  isDisabled = false,
  showNewChatButton = false,
  toggleNewChatButton = () => {},
  handleNewChat = () => {},
  showPlusButton = true,
  className = '',
  submitIconSrc = '',
  plusIconSrc = '',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // 自動調整文本框高度
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    // 重置高度，以便重新計算
    textarea.style.height = 'auto';
    
    // 計算新高度（內容高度），但不超過96px
    const newHeight = Math.min(textarea.scrollHeight, 96);
    textarea.style.height = `${newHeight}px`;
  }, [inputText]);
  
  // 處理按下Enter鍵提交表單
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // 如果按下的是Enter鍵，且沒有同時按下Shift鍵
    if (e.key === 'Enter' && !e.shiftKey) {
      // 檢查是否正在使用輸入法選字（IME編輯狀態）
      if (e.nativeEvent.isComposing) {
        // 如果是輸入法選字狀態，不執行任何操作，讓Enter鍵用於確認選字
        return;
      }
      
      e.preventDefault(); // 阻止默認行為（換行）
      
      // 如果輸入框至少有兩個字符且不是禁用狀態，則提交表單
      if (inputText.trim().length >= 2 && !isDisabled) {
        // 發送自定義事件，通知系統用戶已發送訊息
        document.dispatchEvent(new CustomEvent('userMessageSent'));
        
        // 提交表單
        handleInputSubmit(e as unknown as FormEvent<HTMLFormElement>);
      }
    }
  };

  // 處理表單提交
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // 如果輸入框至少有兩個字符且不是禁用狀態，則提交表單
    if (inputText.trim().length >= 2 && !isDisabled) {
      // 發送自定義事件，通知系統用戶已發送訊息
      document.dispatchEvent(new CustomEvent('userMessageSent'));
      
      // 提交表單
      handleInputSubmit(e);
    }
  };

  return (
    <div className={`u-fixed u-bottom-0 u-left-0 u-right-0 u-w-full u-z-10 ${className}`}>
      <div className='u-h-5 u-w-full' style={{background:'linear-gradient(180deg, rgba(230, 238, 244, 0) 0%, #E6EEF4 100%)'}}></div>
      {/* 新對話按鈕選項 - 只在showNewChatButton為true時顯示 */}
      {showNewChatButton && (
        <>
          {/* 新對話按鈕 */}
          <motion.button 
            className="u-absolute -u-top-8 u-left-5 u-bg-white u-shadow-[0px_8px_20px_0px_rgba(0,0,0,0.1)] u-py-2 u-px-3 u-rounded-lg u-shadow u-text-center u-flex u-items-center u-justify-center u-font-normal u-text-base u-z-[inherit]"
            onClick={handleNewChat}
            variants={newChatButtonVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            開啟新對話
          </motion.button>
        </>
      )}

      {/* 輸入框區域 - 統一處理不同模式下的輸入框 */}
      <div className={`u-flex u-items-end u-px-5 u-pt-1 u-pb-[60px] u-flex u-items-start u-bg-[#E6EEF4] ${showNewChatButton ? 'u-relative' : ''}`}>
        {/* 加號按鈕 - 只在showPlusButton為true且有圖標時顯示 */}
        {showPlusButton && plusIconSrc && (
          <button 
            className={`u-flex u-items-center u-justify-center u-text-white u-cursor-pointer u-min-w-[24px] u-mr-[13.5px] u-mb-3 ${isDisabled ? 'u-opacity-50' : 'u-opacity-100'}`}
            onClick={toggleNewChatButton} disabled={isDisabled}
          >
            <img src={plusIconSrc} alt="新增" width="24" height="24"/>
          </button>
        )}
        
        {/* 輸入框和提交按鈕 */}
        <form className='u-w-full' onSubmit={handleSubmit}>
          <div className={`u-relative u-flex u-w-full u-rounded-[13px] u-bg-gradient-to-r u-from-[#b2b8ff] u-to-[#239EE1] u-p-[1px] ${isDisabled ? 'u-opacity-50' : 'u-opacity-100'}`}>
            <textarea
              ref={textareaRef}
              className={`u-w-full u-p-3 u-pr-12 u-rounded-xl u-outline-none u-placeholder-gray-600 u-opacity-100 ${isDisabled ? 'u-bg-[#E6EEF4]' : 'u-bg-white'}`}
              placeholder="我想問..."
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isDisabled}
              maxLength={200}
              rows={1}
              style={{
                minHeight: '40px',
                maxHeight: '96px', // 約為三行文本的高度
                resize: 'none',
                overflowY: 'auto'
              }}
            />
            {inputText.trim().length >= 2 && !isDisabled && submitIconSrc && (
              <button
                type="submit"
                className="u-absolute u-right-3 u-bottom-[12.5px]"
              >
                <img src={submitIconSrc} alt="送出" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInput; 