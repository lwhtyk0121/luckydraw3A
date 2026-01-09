# LuckyDraw 3A - 智能抽獎分組工具

這是一個基於 React + Vite 開發的智能抽獎與分組工具，整合了 Google Gemini AI 來生成創意組名與破冰任務。

## 功能特點

- **智能抽獎**：快速抽取獲勝者。
- **智能分組**：自動將參加者分組，並由 AI 生成有趣的隊名與破冰問題。
- **匯出功能**：支援將結果匯出為 CSV 檔案。
- **響應式設計**：完美適配手機與電腦裝置。

## 開發設定

### 1. 取得 API Key
前往 [Google AI Studio](https://aistudio.google.com/) 取得您的 Gemini API Key。

### 2. 設定環境變數
在專案根目錄建立 `.env` 檔案並填入金鑰：
```env
GEMINI_API_KEY=你的_GEMINI_API_KEY
```

### 3. 安裝與執行
由於本環境限制，請在您的本機執行：
```bash
npm install
npm run dev
```

## 部署與 CI/CD

本專案已設定 GitHub Actions。當您將程式碼推送到 `main` 分支時，會觸發自動部署：

1. **GitHub Pages**：程式碼會自動編譯並部署至 `gh-pages` 分支。
2. **秘密設定**：請在 GitHub Repo 的 `Settings > Secrets and variables > Actions` 中新增一個 `GEMINI_API_KEY`，否則部署後的 AI 功能將無法運作。

## 技術棧

- React 19
- Vite 6
- Tailwind CSS (用於樣式)
- Google GenAI SDK
