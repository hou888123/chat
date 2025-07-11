# 共用反饋模組

本目錄包含各種回饋相關的共用組件。

## FeedbackModule

基礎回饋模組，提供讚與倒點讚、操作按鈕等通用功能。

## GoToModule

GoToModule 目前分別存在於兩個項目中：
- MCP-Cursor-function-search-source/src/components/modules/feedback/GoToModule.tsx
- MCP-Cursor-analysis-source/src/components/modules/feedback/GoToModule.tsx

兩個項目的實現幾乎完全相同，僅在註釋上有細微差異。

### 共用元件整合計劃

為避免代碼重複，建議在之後的迭代中將 GoToModule 完全整合到共用元件庫中。

整合步驟：
1. 確保 shared/components/modules/feedback/GoToModule.tsx 能正確被編譯
2. 確保共用資源 (SVG圖示) 在共用元件庫中可用
3. 在 shared/index.ts 中正確導出 GoToModule
4. 修改兩個項目的 ChatContent.tsx，從 @shared 導入 GoToModule
5. 刪除兩個項目中各自的 GoToModule.tsx 實現

目前由於構建配置的限制，暫時保持兩個項目中各自的 GoToModule 實現，確保兩者保持同步。