# 共享元件庫

這個共享元件庫是一個Monorepo的一部分，包含可在多個專案中共用的UI元件和功能元件。

## 可用元件

### UI元件

1. **Button** - 可自訂的按鈕元件
2. **Input** - 文字輸入框組件
3. **PrivacyNotice** - 隱私提醒組件，包含服務條款和提醒事項鏈接

### 通用元件

1. **ToastMessage** - 訊息提示元件
2. **ErrorButtonsList** - 系統狀態示範按鈕列表
3. **ConsumptionButtonsList** - 消費性總覽模組按鈕列表

## 安裝

由於這是一個本機共用元件庫，透過檔案路徑引用，所以不需要發佈到npm。

在你的專案中加入依賴：

```json
{
 "dependencies": {
 "@shared": "file:../shared"
 }
}
```

然後運行：

『`bash
npm install
# 或
yarn install
```

## 使用範例

### 導入元件

```jsx
import { Button, Input, ToastMessage, PrivacyNotice } 從 '@shared';
```

### 按鈕元件

```jsx
<Button
 label="點擊我"
 variant="primary"
 size="medium"
 onClick={() => console.log('按鈕被點選')}
/>
```

### 輸入框元件

```jsx
const [value, setValue] = useState('');

<Input
 value={value}
 onChange={setValue}
 placeholder="請輸入文字..."
/>
```

### Toast訊息元件

```jsx
const [showToast, setShowToast] = useState(false);

<Button
 label="顯示提示"
 onClick={() => setShowToast(true)}
/>

<ToastMessage
 message="操作成功!"
 show={showToast}
 onClose={() => setShowToast(false)}
/>
```

### 隱私提醒元件

```jsx
<PrivacyNotice
 termsLink="https://example.com/terms"
 noticeLink="https://example.com/notice"
/>

// 自訂樣式
<PrivacyNotice
 termsLink="https://example.com/terms"
 noticeLink="https://example.com/notice"
 textColor="u-text-gray-700"
 linkColor="u-text-red-500"
 fontSize="u-text-sm"
/>
```

## 開發

如需修改共用元件庫：

1. 在共用元件庫中修改元件
2. 建置元件庫 `yarn build`
3. 在使用該程式庫的專案中重新安裝依賴 `yarn install`