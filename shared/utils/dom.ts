/**
 * DOM 相關共用工具函數
 */

/**
 * 初始化輸入框失焦處理函數
 * 
 * 當用戶在移動設備上點擊輸入框外部區域時，自動使輸入框失焦
 */
export const initInputBlurHandling = (): void => {
  document.addEventListener('touchstart', function (event) {
    const activeElement = document.activeElement;

    // 檢查目前是否 focus 在 input 或 textarea
    if (
      activeElement &&
      (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')
    ) {
      // 如果點擊的不是 input/textarea 本身
      if (!activeElement.contains(event.target as Node) && !(event.target as Element).closest('input, textarea')) {
        // 需要確保activeElement是HTMLElement才能呼叫blur()方法
        (activeElement as HTMLElement).blur();
      }
    }
  });
}; 