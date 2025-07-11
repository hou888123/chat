// 定義 API 回應類型
export interface ChatResponse {
  code: string;
  message: string;
  data?: any;
  consumptionModule?: {
    type: string;
    data: any;
    systemResponse: string;
  };
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

// 定義消費總覽模組類型
export const CONSUMPTION_MODULE_TYPES = {
  CHART: 'chart',                   // 有線圖消費記錄
  DATE: 'date',                     // 無線圖指定日期消費記錄
  TWO_STORES_CHART: 'twoStoresChart', // 特店＋有折線消費記錄
  ONE_STORES_CHART: 'oneStoresChart', // 一間店面加一折線圖
  TWO_STORES: 'twoStores',          // 無線圖兩間店消費記錄
  CATEGORY: 'category',             // 日期區間消費類別消費記錄
  HIGHEST: 'highest',               // 最高消費記錄
  AMOUNT_COUNT: 'amountCount',          // 大於等於金額消費記錄
  NO_DATA: 'noData'                 // 查無資訊消費記錄
};

// 從消費記錄文件導入所有消費記錄
import {
  CHART_CONSUMPTION_RECORD,
  DATE_CONSUMPTION_RECORD,
  TWO_STORES_CHART_CONSUMPTION_RECORD,
  ONE_STORES_CHART_CONSUMPTION_RECORD,
  TWO_STORES_CONSUMPTION_RECORD,
  CATEGORY_CONSUMPTION_RECORD,
  HIGHEST_CONSUMPTION_RECORD,
  AMOUNT_COUNT_CONSUMPTION_RECORD,
  NO_DATA_CONSUMPTION_RECORD,
  NEGATIVE_PIE_CONSUMPTION_RECORD
} from '../components/atoms/consumptionRecords';

// 模擬 API 請求函數
export const mockchatRequest = (userInput: string): Promise<ChatResponse> => {
  return new Promise((resolve, reject) => {
    // 模擬 API 延遲 (3 秒)
    setTimeout(() => {
      // 處理消費總覽模組關鍵詞
      if (userInput.toLowerCase().includes('全負餅')) {
        resolve({
          code: API_ERROR_CODES.SUCCESS,
          message: '處理成功',
          consumptionModule: {
            type: CONSUMPTION_MODULE_TYPES.CATEGORY,
            data: NEGATIVE_PIE_CONSUMPTION_RECORD,
            systemResponse: '2025/01/01 ~ 2025/01/31 期間：<br>您在百貨公司類別的信用卡消費次數為 17 次，總金額 (折合臺幣) 為 4,000 元。<br>若您查詢的消費類別未列於圖表的前五大項中，可點擊「更多」查看完整的類別明細。'
          }
        });
      } else if (userInput.toLowerCase().includes('一店')) {
        resolve({
          code: API_ERROR_CODES.SUCCESS,
          message: '處理成功',
          consumptionModule: {
            type: CONSUMPTION_MODULE_TYPES.ONE_STORES_CHART,
            data: ONE_STORES_CHART_CONSUMPTION_RECORD,
            systemResponse: '2025/01/01 ~ 2025/01/31 期間：<br>您在星巴克的信用卡消費次數為 12 次，總金額 (折合臺幣) 為 18,600 元。其中 2025/01/15 的消費金額最高，共 3,500 元。'
          }
        });
      } else if (userInput.toLowerCase().includes('一線')) {
        resolve({
          code: API_ERROR_CODES.SUCCESS,
          message: '處理成功',
          consumptionModule: {
            type: CONSUMPTION_MODULE_TYPES.CHART,
            data: CHART_CONSUMPTION_RECORD,
            systemResponse: '2025/01/01 ~ 2025/01/31 期間：<br>您的信用卡消費次數為 17 次，總金額 (折合臺幣) 為 100,000 元。其中 2025/01/01 的消費金額最高，共 8,000 元。'
          }
        });
      } else if (userInput.toLowerCase().includes('無線')) {
        resolve({
          code: API_ERROR_CODES.SUCCESS,
          message: '處理成功',
          consumptionModule: {
            type: CONSUMPTION_MODULE_TYPES.DATE,
            data: DATE_CONSUMPTION_RECORD,
            systemResponse: '您在 2025/01/01 的信用卡消費次數為 17 次，總金額 (折合臺幣) 為 32,600 元。'
          }
        });
      } else if (userInput.toLowerCase().includes('兩店')) {
        resolve({
          code: API_ERROR_CODES.SUCCESS,
          message: '處理成功',
          consumptionModule: {
            type: CONSUMPTION_MODULE_TYPES.TWO_STORES,
            data: TWO_STORES_CONSUMPTION_RECORD,
            systemResponse: '您在 2025/01/01 在麥當勞、SOGO 百貨的信用卡消費次數為 22 次，總金額 (折合臺幣) 為 20,000 元。'
          }
        });
      } else if (userInput.toLowerCase().includes('二線')) {
        resolve({
          code: API_ERROR_CODES.SUCCESS,
          message: '處理成功',
          consumptionModule: {
            type: CONSUMPTION_MODULE_TYPES.TWO_STORES_CHART,
            data: TWO_STORES_CHART_CONSUMPTION_RECORD,
            systemResponse: '2025/01/01 ~ 2025/01/31 期間：<br>您在麥當勞的信用卡消費次數為 17 次，總金額 (折合臺幣) 為 32,200 元。其中 2025/01/01 的消費金額最高，共 8,000 元。<br>您在SOGO 百貨的信用卡消費次數為 8 次，總金額 (折合臺幣) 為 32,200 元。其中 2025/01/25 的消費金額最高，共 6,000 元。'
          }
        });
      } else if (userInput.toLowerCase().includes('消費類別')) {
        resolve({
          code: API_ERROR_CODES.SUCCESS,
          message: '處理成功',
          consumptionModule: {
            type: CONSUMPTION_MODULE_TYPES.CATEGORY,
            data: CATEGORY_CONSUMPTION_RECORD,
            systemResponse: '2025/01/01 ~ 2025/01/31 期間：<br>您在百貨公司類別的信用卡消費次數為 17 次，總金額 (折合臺幣) 為 4,000 元。<br>若您查詢的消費類別未列於圖表的前五大項中，可點擊「更多」查看完整的類別明細。'
          }
        });
      } else if (userInput.toLowerCase().includes('最高消費')) {
        resolve({
          code: API_ERROR_CODES.SUCCESS,
          message: '處理成功',
          consumptionModule: {
            type: CONSUMPTION_MODULE_TYPES.HIGHEST,
            data: HIGHEST_CONSUMPTION_RECORD,
            systemResponse: '2025/01/01 ~ 2025/01/31 期間：<br>您最高額的單筆消費為金額 (折合臺幣) 1,000 元。'
          }
        });
      } else if (userInput.toLowerCase().includes('金額大於')) {
        resolve({
          code: API_ERROR_CODES.SUCCESS,
          message: '處理成功',
          consumptionModule: {
            type: CONSUMPTION_MODULE_TYPES.AMOUNT_COUNT,
            data: AMOUNT_COUNT_CONSUMPTION_RECORD,
            systemResponse: '2025/01/01 ~ 2025/01/31 期間：<br>您的信用卡單筆消費金額大於 (≥) 1,000 元的筆數共 17 筆，總金額 (折合臺幣) 為 66,000 元。'
          }
        });
      } else if (userInput.toLowerCase().includes('無資訊')) {
        resolve({
          code: API_ERROR_CODES.SUCCESS,
          message: '處理成功',
          consumptionModule: {
            type: CONSUMPTION_MODULE_TYPES.NO_DATA,
            data: NO_DATA_CONSUMPTION_RECORD,
            systemResponse: '查無符合條件的消費，或消費明細尚未出帳。'
          }
        });
      }
      // 根據用戶輸入內容判斷返回的錯誤代碼
      else if (userInput.toLowerCase().includes('系統')) {
        resolve({
          code: API_ERROR_CODES.SYSTEM_ERROR,
          message: '目前系統發生非預期的狀況，請您稍後再試或聯繫客服。(Error Code)'
        });
      } else if (userInput.toLowerCase().includes('業務')) {
        resolve({
          code: API_ERROR_CODES.BUSINESS_KEYWORD_ERROR,
          message: '您的問題包含業務專屬關鍵字，請重新提問。'
        });
      } else if (userInput.toLowerCase().includes('機敏')) {
        resolve({
          code: API_ERROR_CODES.SENSITIVE_DATA_ERROR,
          message: '請勿輸入個人資料 (如身分證字號、聯絡方式等)。建議您詢問其他問題。'
        });
      } else if (userInput.toLowerCase().includes('關鍵字')) {
        resolve({
          code: API_ERROR_CODES.KEYWORD_ERROR,
          message: '您的問題包含無法處理的關鍵字，請重新提問。'
        });
      } else if (userInput.toLowerCase().includes('主題')) {
        resolve({
          code: API_ERROR_CODES.TOPIC_CONTENT_ERROR,
          message: '您的問題主題不適合在此討論，請重新提問。'
        });
      } else if (userInput.toLowerCase().includes('上限')) {
        resolve({
          code: API_ERROR_CODES.TOKEN_LIMIT_ERROR,
          message: '您的問題已達到處理上限，請縮短問題或分多次提問。'
        });
      } else if (userInput.toLowerCase().includes('閒置')) {
        resolve({
          code: API_ERROR_CODES.IDLE_TIMEOUT_ERROR,
          message: '因長時間未操作，系統已自動登出，請重新登入。'
        });
      } else if (userInput.toLowerCase().includes('特店') && userInput.toLowerCase().includes('超過')) {
        resolve({
          code: API_ERROR_CODES.STORE_LIMIT_ERROR,
          message: '目前一次只能查詢 2 間店家的消費資訊。'
        });
      } else if (userInput.toLowerCase().includes('類別') && userInput.toLowerCase().includes('超過')) {
        resolve({
          code: API_ERROR_CODES.MULTIPLE_CATEGORIES_ERROR,
          message: '目前一次只能查詢 1 種消費類別的資訊。'
        });
      } else if (userInput.toLowerCase().includes('相似度')) {
        resolve({
          code: API_ERROR_CODES.LOW_SIMILARITY_ERROR,
          message: '您的問題相似度過低，請重新提問。'
        });
      } else {
        // 默認成功回應
        resolve({
          code: API_ERROR_CODES.SUCCESS,
          message: '處理成功',
          data: {
            response: `您的問題「${userInput}」已成功處理。`
          }
        });
      }
    }, 3000); // 3 秒延遲
  });
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
      return '處理成功';
    default:
      return '無法識別的回應代碼';
  }
}; 