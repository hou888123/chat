import React from 'react';
import ChatBubble from './ChatBubble';
import SystemResponseMessage from './SystemResponseMessage';
import { LoadingCircles, FeedbackModule } from '../../index';

export interface ConsumptionData {
  period?: string;
  storeName?: string;
  times?: number;
  amount?: number;
  noData?: boolean;
  isHighest?: boolean;
  isCategory?: boolean;
  highestDate?: string;
  highestAmount?: number;
  hasChart?: boolean;
  multipleStores?: boolean;
  specialStore?: string;
  twoStoresInfo?: Array<{
    storeName: string;
    times: number;
    amount: number;
    highestDate: string;
    highestAmount: number;
  }>;
}

export interface DialogHistoryItem {
  type: 'user' | 'system';
  text: string;
  questionId?: string;
  isIntroduction?: boolean;
  withCard?: boolean;
  consumptionData?: ConsumptionData;
  showGoToButton?: boolean;
  showFeedback?: boolean;
  showGoToAction?: boolean;
}

interface ChatContentProps {
  dialogHistory: DialogHistoryItem[];
  isLoading: boolean;
  getQuestionModuleInfo?: (questionId: string) => any | null;
  onLike?: () => void;
  onDislikeOptionSelect?: (option: string) => void;
  onQuestionClick?: (question: string) => void;
  renderAdditionalContent?: (item: DialogHistoryItem, index: number) => React.ReactNode;
  onGoToClick?: () => void;
  showFeedback?: boolean;
}

/**
 * 共享對話內容組件
 * 用於顯示對話歷史和當前對話狀態
 */
const ChatContent: React.FC<ChatContentProps> = ({
  dialogHistory,
  isLoading,
  getQuestionModuleInfo,
  onLike,
  onDislikeOptionSelect,
  onQuestionClick,
  renderAdditionalContent,
  onGoToClick,
  showFeedback = true
}) => {
  // 如果對話歷史為空且不在加載中，則不顯示任何內容
  if (dialogHistory.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className="u-flex u-flex-col u-w-full">
      {/* 渲染對話歷史 */}
      {dialogHistory.map((item: DialogHistoryItem, index: number) => {
        if (item.type === 'user') {
          // 用戶訊息 - 使用白色背景
          return (
            <ChatBubble key={`user-message-${index}`} isUser={true}>
              <p className="u-text-base">{item.text}</p>
            </ChatBubble>
          );
        } else {
          // 系統訊息
          return (
            <React.Fragment key={`system-message-${index}`}>
              <ChatBubble isUser={false}>
                {item.text && (
                  <SystemResponseMessage 
                    text={item.text} 
                    typingSpeed={60} 
                    isLoading={true}
                  />
                )}
              </ChatBubble>
              
              {/* 讚與倒讚與「立即前往」按鈕 */}
              {showFeedback && (
                <div className="u-mt-3 u-w-full">
                  <FeedbackModule
                    type="goto"
                    showActionButton={item.showGoToButton !== false}
                    onActionClick={onGoToClick}
                    actionButtonText="立即前往"
                    onLike={onLike}
                    onDislikeOptionSelect={onDislikeOptionSelect}
                    feedbackOptions={["回應速度太慢", "對話流程複雜", "問題理解有誤", "導引路徑有誤"]}
                  />
                </div>
              )}
              
              {/* 允許呈現外部提供的額外內容，如交互按鈕或建議問題 */}
              {renderAdditionalContent && renderAdditionalContent(item, index)}
            </React.Fragment>
          );
        }
      })}
      
      {/* 加載中狀態 - 使用共享組件 */}
      {isLoading && (
        <div className="u-py-1 u-mb-4 u-min-h-[calc(100vh-268px)]">
          <LoadingCircles />
        </div>
      )}
    </div>
  );
};

export default ChatContent; 