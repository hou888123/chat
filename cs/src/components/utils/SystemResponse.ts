import { useState } from 'react';
import { SYSTEM_RESPONSES } from '../atoms/systemResponses';
import { chatRequest, API_ERROR_CODES, getSystemResponseByApiCode, ChatResponse, FeedbackResponse } from '../../services/apiService';
import { containsSensitiveData } from '../../utils/sensitiveDataPatterns';

// 只保留需要的系統回應，其他使用mockApiService
const EXTENDED_SYSTEM_RESPONSES = {
  GREETING: SYSTEM_RESPONSES.GREETING,
  INTRODUCTION: SYSTEM_RESPONSES.INTRODUCTION,
  IDLE_TIMEOUT_ERROR: SYSTEM_RESPONSES.IDLE_TIMEOUT_ERROR,
  FRONTEND_ERROR: SYSTEM_RESPONSES.FRONTEND_ERROR
};

// 定義系統回應類型
export type SystemResponse = {
  text: string;
  typingSpeed: number;
};

// 定義消費記錄類型
export type ConsumptionRecord = {
  period: string;
  times: number;
  amount: number;
  highestDate: string;
  highestAmount: number;
  detailsVisible?: boolean;
  storeName: string;  // 新增店家名稱
  details?: Array<{  // 新增消費明細
    date: string;
    amount: number;
    store: string;
    cardLastFour: string;
    category: string;
  }>;
  hasChart?: boolean;
  isCategory?: boolean;
  multipleStores?: boolean;
  isHighest?: boolean;
  noData?: boolean;
  hasNegativePie?: boolean; // 標記為負值餅圖
  twoStoresInfo?: Array<{
    storeName: string;
    times: number;
    amount: number;
    highestDate: string;
    highestAmount: number;
  }>;
  specialStore?: string;
};

// 定義推薦問題類型
export type RecommendedQuestion = {
  text: string;
  value?: string;
};

// 定義問題模塊狀態類型
export type QuestionModuleState = {
  questionId: string;
  showRelatedQuestions: boolean;
  recommendedQuestions: string[]; // 每個問題模塊的推薦問題列表
};

// 定義對話歷史類型
export type DialogHistoryItem = {
  type: string;
  text: string;
  withCard?: boolean;
  consumptionData?: ConsumptionRecord;
  questionId?: string;
  isIntroduction?: boolean;
  // 控制是否顯示"立即前往"按鈕
  showGoToAction?: boolean;
  // 新增屬性
  withFeedback?: boolean; // 是否顯示讚與倒讚
  deeplink?: string; // 深度連結
  recommendQuestions?: any[]; // 推薦問題
  questionTitle?: string; // 推薦問題標題
  requestId?: string; // 每個對話項的 requestId
  feedbackOptions?: string[]; // 每個對話項的倒讚選項
  feedbackResponse?: FeedbackResponse; // 每個對話項的完整 feedback 回應
};

// 創建對話分析模型
export const useDialogModel = () => {
  // 輸入框文本
  const [inputText, setInputText] = useState('');
  
  // 對話歷史
  const [dialogHistory, setDialogHistory] = useState<DialogHistoryItem[]>([]);
  
  // 選擇的問題
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  // 是否顯示介紹
  const [showIntro, setShowIntro] = useState(true);
  
  // 錯誤狀態
  const [isIdleTimeoutErrorVisible, setIsIdleTimeoutErrorVisible] = useState(false);
  const [isFrontendErrorVisible, setIsFrontendErrorVisible] = useState(false);
  
  
  // 顯示消費記錄
  const [showConsumptionRecord, setShowConsumptionRecord] = useState(false);
  
  // 消費記錄類型
  const [consumptionType, setConsumptionType] = useState<ConsumptionRecord | null>(null);
  
  // 添加載入狀態
  const [isLoading, setIsLoading] = useState(false);
  
  // 添加使用介紹文本狀態，可以是字符串或 QuestionSuggest 對象
  const [introductionText, setIntroductionText] = useState<string | any>(null);
  
  // 添加注意事項按鈕文字狀態
  const [noticeButtonText, setNoticeButtonText] = useState<string>('注意事項');

  // 處理 Token 限制錯誤按鈕點擊
  const handleTokenLimitErrorButtonClick = (customErrorMessage?: string) => {
    setSelectedOption("查詢次數已達上限");
    
    // 清空對話歷史
    setDialogHistory([]);
    
    // 使用自定義錯誤訊息或默認訊息
    const errorMessage = customErrorMessage || getSystemResponseByApiCode(API_ERROR_CODES.TOKEN_LIMIT_ERROR);
    
    // 添加系統錯誤訊息
    setDialogHistory(prev => [
      ...prev,
      {
        type: 'system',
        text: errorMessage,
        showGoToAction: true
      }
    ]);
    
    // 發送自定義事件，通知系統應該滾動到底部
    document.dispatchEvent(new CustomEvent('userMessageSent'));
  };

  // 處理閒置超時錯誤按鈕
  const handleIdleTimeoutErrorButtonClick = () => {
    // 清空對話歷史
    setDialogHistory([{
      type: 'system',
      text: EXTENDED_SYSTEM_RESPONSES.IDLE_TIMEOUT_ERROR.text
    }]);
    
    // 顯示閒置超時錯誤畫面
    setIsIdleTimeoutErrorVisible(true);
    // 清空輸入框
    setInputText('');
    // 發送自定義事件，通知系統應該滾動到底部
    document.dispatchEvent(new CustomEvent('userMessageSent'));
    console.log("閒置超時錯誤狀態已設置:", true);
  };

  // 前端載入錯誤按鈕點擊處理
  const handleFrontendErrorButtonClick = () => {
    // 清空對話歷史
    setDialogHistory([{
      type: 'system',
      text: EXTENDED_SYSTEM_RESPONSES.FRONTEND_ERROR.text
    }]);
    
    // 顯示前端加載失敗畫面
    setIsFrontendErrorVisible(true);
    // 清空輸入框
    setInputText('');
    // 發送自定義事件，通知系統應該滾動到底部
    document.dispatchEvent(new CustomEvent('userMessageSent'));
    console.log("前端加載失敗狀態已設置:", true);
  };

  // 切換顯示消費詳情
  const toggleConsumptionDetails = () => {
    setShowConsumptionRecord(!showConsumptionRecord);
  };

  const handleRetry = () => {
    setSelectedOption(null);
    // 確保所有錯誤狀態都被清除
    setIsIdleTimeoutErrorVisible(false);
    setIsFrontendErrorVisible(false);
  };

  const handleClose = () => {
    setSelectedOption(null);
    setInputText('');
    setShowConsumptionRecord(false);
  };

  // 重置對話，返回初始狀態
  const resetConversation = () => {
    // 重置對話歷史
    setDialogHistory([]);
    // 清除選項
    setSelectedOption(null);
    // 清空輸入文字
    setInputText('');
    // 隱藏消費詳情
    setShowConsumptionRecord(false);
    // 重置消費記錄
    setConsumptionType(null);
    // 關閉介紹頁面
    setShowIntro(false);
  };

  // 處理使用介紹
  const handleIntroOptionClick = () => {
    // 清除錯誤狀態但保留對話歷史

    // 使用Introduction回應
    const questionId = `q_${Date.now()}`;
    
    // 使用 API 返回的使用介紹問題內容，不使用默認文本
    let introQuestionText = "";
    
    // 使用 API 返回的使用介紹文本
    let introText = "";
    
    // 從 introductionText 中提取問題內容和回應文本
    if (introductionText) {
      if (typeof introductionText === 'string') {
        // 如果是字符串，假設這是 API 返回的回應文本
        introText = introductionText;
        // 由於沒有明確的問題內容，不設置 introQuestionText
        // 這種情況下不會創建用戶消息，直到獲得有效的問題內容
      } else if (typeof introductionText === 'object') {
        // 從對象中提取問題內容和回應文本
        const introObj = introductionText as any;
        if (introObj.questionContent) {
          introQuestionText = introObj.questionContent;
        }
        if (introObj.questionText) {
          introText = introObj.questionText;
        }
      }
    }
    
    // 只有當有有效的問題內容和回應文本時才添加消息
    if (introQuestionText && introText) {
      // 添加用戶消息並標記為使用介紹
      const userMessage = { type: 'user' as const, text: introQuestionText, questionId, isIntroduction: true };
      
      const systemMessage = { 
        type: 'system' as const, 
        text: introText, 
        questionId, 
        isIntroduction: true,
        // 添加注意事項按鈕文字
        noticeButtonText: noticeButtonText
      };

      // 保留現有對話歷史，只添加新的消息
      setDialogHistory(prev => [...prev, userMessage, systemMessage]);

      // 發送自定義事件，通知系統用戶已發送訊息
      document.dispatchEvent(new CustomEvent('userMessageSent'));
    } else {
      console.error("無法獲取有效的使用介紹問題內容或回應文本");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  // 處理選項點擊
  const handleOptionClick = (option: string, existingQuestionId?: string) => {
    // 防止重複點擊或處理中
    if (isLoading) {
      console.log("正在載入中，忽略點擊", option);
      return;
    }

    // 立即設置載入狀態防止重複點擊
    setIsLoading(true);

    // 初始化標記當前操作的時間戳
    const operationTimestamp = Date.now();
    console.log(`處理問題點擊: ${option} (開始於 ${operationTimestamp})`);

    // 使用提供的questionId或生成新的
    const questionId = existingQuestionId || `q_${operationTimestamp}`;
    
    // 設置選中選項
    setSelectedOption(option);

    // 只有在沒有現有的questionId時才添加使用者問題
    if (!existingQuestionId) {
      setDialogHistory(prev => [
        ...prev, 
        { type: 'user', text: option, questionId }
      ]);
    }

    // 調用 API 請求
    chatRequest(option)
      .then((response: ChatResponse) => {
        console.log('API 回應 (選項點擊):', response);
        
        // 關閉loading狀態
        setIsLoading(false);
        
        // 檢查是否有購買摘要數據 (購買摘要作為系統回應)
        if (response.responseMessageObject?.genText) {
          // 決定要顯示的文本：如果 errorMessage 不為空，則顯示 errorMessage，否則顯示 genText
          const displayText = response.responseMessageObject.errorMessage ? 
                            response.responseMessageObject.errorMessage : 
                            response.responseMessageObject.genText;
          
          // 創建系統回應對象，使用API返回的系統回應文字
          let systemResponse: DialogHistoryItem = {
            type: 'system', 
            text: displayText,
            withFeedback: response.type === "200", // 當type為200時顯示讚與倒讚
            questionId
          };
          
          // 檢查是否有深度連結
          if (response.responseMessageObject?.deeplink) {
            systemResponse.deeplink = response.responseMessageObject.deeplink;
          }
          
          // 檢查是否有推薦問題
          if (response.responseMessageObject?.questionSuggest?.length) {
            systemResponse.recommendQuestions = response.responseMessageObject.questionSuggest;
          }
          
          // 添加系統回應到對話歷史
          setDialogHistory(prev => [...prev, systemResponse]);
          
          // 發送自定義事件，通知系統用戶已收到新訊息，應該滾動到底部
          document.dispatchEvent(new CustomEvent('userMessageSent'));
          return;
        }
        
        // 獲取對應的系統回應文字
        const systemResponseText = getSystemResponseByApiCode(response.code);
        
        // 創建系統回應對象
        let systemResponse: DialogHistoryItem = {
          type: 'system', 
          text: response.data?.response || systemResponseText,
          withCard: false,
          questionId
        };
        
        // 根據 API 回應代碼設置特殊屬性
        if (response.code === API_ERROR_CODES.TOKEN_LIMIT_ERROR) {
          systemResponse.showGoToAction = true;
        }
        
        // 添加系統回應到對話歷史
        setDialogHistory(prev => [...prev, systemResponse]);
        
        // 發送自定義事件，通知系統用戶已收到新訊息，應該滾動到底部
        document.dispatchEvent(new CustomEvent('userMessageSent'));
      })
      .catch(error => {
        console.error('API 錯誤 (選項點擊):', error);
        
        // 關閉loading狀態
        setIsLoading(false);
        
        // 添加錯誤回應到對話歷史
        setDialogHistory(prev => [
          ...prev,
          {
            type: 'system',
            text: getSystemResponseByApiCode(API_ERROR_CODES.SYSTEM_ERROR),
            questionId
          }
        ]);

        // 發送自定義事件，通知系統用戶已收到新訊息，應該滾動到底部
        document.dispatchEvent(new CustomEvent('userMessageSent'));
      });
  };

  // 添加用戶訊息到對話歷史
  const addUserMessage = (text: string, questionId?: string) => {
    const newUserMessage = { 
      type: 'user', 
      text, 
      questionId: questionId || `q_${Date.now()}`
    };
    setDialogHistory(prev => [...prev, newUserMessage]);
  };

  // 開始加載狀態
  const startLoading = () => {
    setIsLoading(true);
  };
  
  // 重置loading狀態
  const resetLoading = () => {
    setIsLoading(false);
  };

  // 添加自定義招呼語方法
  const setCustomGreeting = (greeting: string) => {
    // 更新 EXTENDED_SYSTEM_RESPONSES 中的招呼語
    EXTENDED_SYSTEM_RESPONSES.GREETING = {
      text: greeting,
      typingSpeed: EXTENDED_SYSTEM_RESPONSES.GREETING.typingSpeed
    };
  };

  // 返回模型數據和方法，移除全局錯誤狀態
  return {
    inputText,
    setInputText,
    dialogHistory,
    setDialogHistory,
    selectedOption,
    showIntro,
    showConsumptionRecord,
    consumptionType,
    systemResponses: EXTENDED_SYSTEM_RESPONSES,
    isIdleTimeoutErrorVisible,
    isFrontendErrorVisible, 
    handleOptionClick,
    handleInputChange,
    handleRetry,
    handleClose,
    resetConversation,
    handleIntroOptionClick,
    handleTokenLimitErrorButtonClick,
    handleIdleTimeoutErrorButtonClick,
    handleFrontendErrorButtonClick,
    toggleConsumptionDetails,
    isLoading,
    setIsLoading,
    startLoading,
    resetLoading,
    addUserMessage,
    setCustomGreeting,
    setIntroductionText,
    noticeButtonText,
    setNoticeButtonText
  };
};

// 修改默認導出
export default useDialogModel; 