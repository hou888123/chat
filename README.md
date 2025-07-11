# MCP Cursor Monorepo

這個 monorepo 包含了多個相關的專案，使用 Yarn Workspaces 進行依賴管理。

## 專案結構

- `shared/`: 共用元件和工具
- `cc/`: 消費分析專案
- `cs/`: 功能搜尋專案

## 安裝

在根目錄執行以下命令安裝所有依賴：

```bash
yarn install
```

這會為所有專案安裝依賴，並將共用依賴安裝到根目錄的 `node_modules` 中。

## 開發

### 共用元件庫

```bash
# 建置共用元件
yarn build:shared
```

### 消費分析專案 (cc)

```bash
# 開發模式
yarn dev:cc

# 建置
yarn build:cc
```

### 客服專案 (cs)

```bash
# 開發模式
yarn dev:cs

# 建置
yarn build:cs
```

### 建置所有專案

```bash
yarn build:all
```

## 依賴管理

- 共用依賴放在根目錄的 `package.json` 中
- 專案特定依賴放在各自專案的 `package.json` 中
- 添加新依賴時，使用 `yarn workspace <workspace-name> add <package-name>`

## 注意事項

- 請不要在子專案中直接執行 `yarn install`，而是在根目錄執行
- 更新共用元件後，需要重新建置 `shared` 專案 