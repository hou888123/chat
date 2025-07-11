# cs 對話式功能搜尋

## 專案目錄結構

```
src/
├── assets/ # 靜態資源文件
├── components/ # 組件目錄
│ ├── common/ # 通用元件 - 跨功能模組重複使用
│ ├── hooks/ # 自訂hooks
│ ├── icons/ # 圖示元件
│ ├── modules/ # 功能模組組件
│ │ ├── chat/ # 聊天模組
│ │ ├── feedback/ # 回饋模組
│ │ └── pagination/ # 換頁模組
│ ├── pages/ # 頁面層級元件
│ ├── store/ # 狀態管理
│ └── utils/ # 工具函數
├── styles/ # 樣式文件
├── types/ # 類型定義
└── utils/ # 通用工具函數
```

## 主要功能模組

- **聊天模組**: 提供對話介面與互動功能
- **回饋模組**: 收集使用者回饋和評分