/**
 * 錯誤訊息常量
 * 集中管理所有錯誤訊息，確保在所有專案中保持一致
 */

export const ERROR_MESSAGES = {
  // 前端加載失敗錯誤
  FRONTEND_LOADING_ERROR: {
    MESSAGE: "發生非預期的狀況，請稍後再試。",
    CODE: "(Error Code)"
  },
  
  // 閒置超時錯誤
  IDLE_TIMEOUT_ERROR: {
    MESSAGE: "您的操作已逾時，請重新開啟以繼續使用。",
    BUTTON_TEXT: ""
  }
}; 