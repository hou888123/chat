import axios from 'axios';

// API 基本配置
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 定義設備信息類型
export interface DeviceInfoType {
  0: string;
  1: string;
}

// 定義 URL 對象接口
export interface UrlObject {
  urlText: string;
  urlLink?: string;
  urlContent?: string;
}

// 定義 API 響應類型
export interface ProfileResponse {
  customerId: string;
}

export interface InitializeResponse {
  sessionId: string;
  requestLimitAmount: number;
  usedAmount: number;
  returnCode: string;
  returnDesc: string;
  greetContent: string;
  headerDescription: string;
  urlObject?: UrlObject[];
  questionSuggest?: QuestionSuggest[];
}

// 定義問題建議接口
export interface QuestionSuggest {
  questionContent: string; // 顯示在首頁的問題文本
  questionText: string;    // 點擊後顯示的系統回覆文本
}

// 定義 API 回應類型
export interface ChatResponse {
  code: string;
  message: string;
  data?: any;
  responseMessageObject?: {
    genText: string;
    errorMessage?: string; // 添加 errorMessage 屬性
    deeplink?: string;
    questionSuggest?: QuestionSuggest[];
    similarQuestion?: QuestionSuggest[]; // 添加 similarQuestion 屬性
    tid?: string; // 添加 tid 屬性
  };
  period?: string; // 添加 period 屬性
  amount?: number; // 添加 amount 屬性
  highestDate?: string; // 添加 highestDate 屬性
  highestAmount?: number; // 添加 highestAmount 屬性
  details?: Array<{ // 添加 details 屬性
    date: string;
    amount: number;
  }>;
  purchaseSummary?: string;
  type?: string;
  requestId?: string; // 添加 requestId 字段
  requestLimitAmount?: number; // 添加查詢次數上限
  usedAmount?: number; // 添加已使用次數
}

// 定義 Feedback 回應類型
export interface FeedbackResponse {
  code: string;
  message: string;
  feedbackComment?: Array<{
    optionId: string;
    optionCentent: string;
  }>;
}

// 定義 Comment 回應類型
export interface CommentResponse {
  code: string;
  message: string;
}

// 定義錯誤代碼常量
export const API_ERROR_CODES = {
  SYSTEM_ERROR: '001',
  BUSINESS_KEYWORD_ERROR: '002',
  SENSITIVE_DATA_ERROR: '003',
  KEYWORD_ERROR: '004',
  TOPIC_CONTENT_ERROR: '005',
  TOKEN_LIMIT_ERROR: '006',
  IDLE_TIMEOUT_ERROR: '007',
  STORE_LIMIT_ERROR: '008',
  MULTIPLE_CATEGORIES_ERROR: '009',
  LOW_SIMILARITY_ERROR: '010',
  SUCCESS: '200'
};

// 全局變數存儲 sessionId 和最新的 requestId
let currentSessionId: string | null = null;
let currentRequestId: string | null = null;

// 設置 sessionId
export const setSessionId = (sessionId: string) => {
  currentSessionId = sessionId;
};

// 獲取 sessionId
export const getSessionId = () => {
  return currentSessionId;
};

// 設置 requestId
export const setRequestId = (requestId: string) => {
  currentRequestId = requestId;
};

// 獲取 requestId
export const getRequestId = () => {
  return currentRequestId;
};

// 獲取用戶 Profile
export const getProfile = async (code: string): Promise<ProfileResponse> => {
  try {
    const response = await apiClient.post('/profile', { code });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    throw new Error('Failed to fetch profile');
  }
};

// 初始化會話
export const initializeSession = async (
  device: DeviceInfoType,
  deviceVersion: DeviceInfoType
): Promise<InitializeResponse> => {
  try {
    const response = await apiClient.post('/initialize', {
      device: `${device[0]},${device[1]}`,
      deviceVersion: `${deviceVersion[0]},${deviceVersion[1]}`
    });
    return response.data;
  } catch (error) {
    console.error('Failed to initialize session:', error);
    throw new Error('Failed to initialize session');
  }
};

/**
 * 真實 API 請求函數
 * @param userInput 使用者輸入文字
 * @returns Promise<ChatResponse>
 */
export const chatRequest = async (userInput: string): Promise<ChatResponse> => {
  // 提取 type 值的正則表達式
  const typeMatch = userInput.match(/type([A-Za-z0-9]+)/i);
  const tidMatch = userInput.match(/tid([A-Za-z0-9]+)/i);
  // 構建請求內容
  const requestBody = {
    sessionId: getSessionId(),
    message: userInput,
    isDefault: false,
    tid: tidMatch ? tidMatch[1] : null,
    questionCondition: null,
  };

  try {
    const response = await apiClient.post('/chat', requestBody);
    const data = response.data;
    
    // 保存 requestId 以供後續使用
    if (data.requestId) {
      setRequestId(data.requestId);
    }
    
    // 將API回應映射到內部使用的ChatResponse格式
    const chatResponse = {
      code: data.code || API_ERROR_CODES.SUCCESS,
      message: data.message || '處理成功',
      purchaseSummary: data.purchaseSummary,
      responseMessageObject: data.responseMessageObject,
      type: data.type,
      requestId: data.requestId,
      requestLimitAmount: data.requestLimitAmount,
      usedAmount: data.usedAmount,
      period: data.period,
      amount: data.amount,
      highestDate: data.highestDate,
      highestAmount: data.highestAmount,
      details: data.details
    };
    
    return chatResponse;
  } catch (error) {
    console.error('聊天 API 請求失敗:', error);
    throw new Error('聊天 API 請求失敗');
  }
};

/**
 * 發送 Feedback API 請求
 * @param sessionId 會話 ID
 * @param requestId 請求 ID
 * @returns Promise<FeedbackResponse>
 */
export const sendFeedback = async (sessionId: string, requestId: string): Promise<FeedbackResponse> => {
  try {
    const response = await apiClient.post('/feedback', {
      sessionId,
      requestId,
      evaluate: true
    });
    
    return response.data;
  } catch (error) {
    console.error('Feedback API 請求失敗:', error);
    throw new Error('Feedback API 請求失敗');
  }
};

/**
 * 發送 Comment API 請求
 * @param sessionId 會話 ID
 * @param requestId 請求 ID
 * @param optionContent 選項內容
 * @param optionId 選項 ID (可選)
 * @returns Promise<CommentResponse>
 */
export const sendComment = async (
  sessionId: string, 
  requestId: string, 
  optionContent: string,
  optionId: string = ""
): Promise<CommentResponse> => {
  try {
    const response = await apiClient.post('/comment', {
      sessionId,
      requestId,
      optionId,
      optionCentent: optionContent // 注意這裡使用 optionCentent 而不是 optionContent
    });
    
    return response.data;
  } catch (error) {
    console.error('Comment API 請求失敗:', error);
    throw new Error('Comment API 請求失敗');
  }
};

// 根據 API 回應代碼獲取對應的系統回應
export const getSystemResponseByApiCode = (apiCode: string): string => {
  switch (apiCode) {
    case API_ERROR_CODES.SYSTEM_ERROR:
      return '目前系統發生非預期的狀況，請您稍後再試或聯繫客服。(Error Code)';
    case API_ERROR_CODES.BUSINESS_KEYWORD_ERROR:
      return '由於目前只提供信用卡「消費分析」的服務，建議您詢問其他問題。';
    case API_ERROR_CODES.SENSITIVE_DATA_ERROR:
      return '請勿輸入個人資料 (如身分證字號、聯絡方式等)。建議您詢問其他問題。';
    case API_ERROR_CODES.KEYWORD_ERROR:
      return '無法回應不合適的內容。建議您詢問其他問題。';
    case API_ERROR_CODES.TOPIC_CONTENT_ERROR:
      return '無法回應不合適的內容。建議您詢問其他問題。';
    case API_ERROR_CODES.TOKEN_LIMIT_ERROR:
      return '您今日的詢問次數已達上限，請至「信用卡總覽」繼續查詢，或於隔日再次使用。';
    case API_ERROR_CODES.IDLE_TIMEOUT_ERROR:
      return '因長時間未操作，系統已自動登出，請重新登入。';
    case API_ERROR_CODES.STORE_LIMIT_ERROR:
      return '目前一次只能查詢 2 間店家的消費資訊。建議您分批查詢或再次詢問。';
    case API_ERROR_CODES.MULTIPLE_CATEGORIES_ERROR:
      return '目前一次只能查詢 1 種消費類別的資訊。建議您分批查詢或再次詢問。';
    case API_ERROR_CODES.LOW_SIMILARITY_ERROR:
      return '感謝您的詢問與回覆。由於目前只提供信用卡「消費分析」的服務，建議您詢問其他問題。';
    case API_ERROR_CODES.SUCCESS:
    default:
      return ''; // 成功時不直接顯示固定訊息，而是依據 API 回傳內容
  }
}; 