# SelfAssembly - 表單設計器

基於 Angular 19 和 ng-zorro-antd 的拖拽式表單設計器，支援視覺化設計表單並產生配置。

## 專案特色

### 🎯 核心功能
- **拖拽式設計**：從左側組件庫拖拽元件到中間設計區域
- **即時預覽**：所見即所得的表單設計體驗
- **屬性設定**：右側面板可設定組件屬性，包括必填、佔位符等
- **Grid 佈局**：支援 Grid 網格佈局，可設定 1-24 的 span 值
- **巢狀拖拽**：所有元件都可以放入 Grid 網格中進行佈局
- **雙模式切換**：設計模式與預覽模式一鍵切換
- **組件管理**：完整的增刪改功能，支援Grid內組件獨立管理

### 📦 支援組件
1. **Grid 網格**：可設定 nzSpan (1-24)，支援巢狀放置其他組件
2. **文字輸入框**：基本文字輸入
3. **多行文字**：textarea 多行文字輸入
4. **數字輸入**：數字專用輸入框
5. **下拉選單**：可自訂選項的下拉選擇
6. **日期選擇器**：日期時間選擇
7. **複選框**：單一選項複選
8. **單選按鈕**：多選一的選項組

### 🛠 技術架構
- **前端框架**：Angular 19
- **UI 組件庫**：ng-zorro-antd (Ant Design)
- **拖拽功能**：@angular/cdk/drag-drop
- **狀態管理**：Angular Signals
- **樣式語言**：Less

## 開發環境要求

- Node.js 18+
- Angular CLI 19+
- npm 或 yarn

## 安裝與啟動

### 1. 安裝依賴
```bash
npm install
```

### 2. 啟動開發服務器
```bash
ng serve
```
瀏覽器開啟 `http://localhost:4200/`

### 3. 建置專案
```bash
ng build
```

## 使用說明

### 基本操作
1. **拖拽組件**：從左側組件庫拖拽所需元件到中間設計區域
2. **選擇組件**：點擊設計區域中的組件進行選擇
3. **編輯屬性**：在右側屬性面板修改組件屬性
4. **刪除組件**：選中組件後點擊刪除按鈕
5. **清空設計**：使用頂部工具列的「清空」按鈕

### Grid 網格使用
1. **建立 Grid**：拖拽 "Grid 網格" 到設計區域
2. **設定 Span**：在右側面板調整 Grid Span 值 (1-24)
3. **加入子組件**：將其他組件拖拽到 Grid 內部
4. **管理子組件**：Grid 內的組件可獨立選擇和編輯

### 預覽模式
1. **切換模式**：點擊頂部工具列的「預覽模式」按鈕
2. **測試表單**：在預覽模式下可以實際操作表單元件
3. **查看配置**：點擊「查看配置」按鈕輸出 JSON 配置
4. **返回設計**：點擊「設計模式」按鈕返回編輯狀態

## 重要配置說明

### 依賴套件
```json
{
  "ng-zorro-antd": "^19.x.x",
  "@angular/cdk": "^19.x.x",
  "@ant-design/icons-angular": "^19.x.x"
}
```

### 關鍵模組導入
在 `app.config.ts` 中已配置：
- `NzIconModule` - 圖標支援
- `NzI18nModule` - 國際化支援（繁體中文）
- `DragDropModule` - 拖拽功能
- `BrowserAnimationsModule` - 動畫支援

### 拖拽功能實現
- 使用 `@angular/cdk/drag-drop` 實現拖拽功能
- 支援跨容器拖拽（組件庫 ↔ 設計區域 ↔ Grid 內部）
- 實現巢狀拖拽，Grid 內可放置其他組件

### 響應式設計
- 支援桌面、平板、手機三種螢幕尺寸
- 使用 CSS Media Queries 實現響應式佈局
- 小螢幕時自動調整版面配置

## 開發說明

### 專案結構
```
src/app/
├── components/
│   └── form-designer/           # 表單設計器主組件
│       ├── form-designer.component.ts
│       ├── form-designer.component.html
│       └── form-designer.component.less
├── app.component.*              # 根組件
├── app.config.ts               # 應用配置
└── icons-provider.ts           # 圖標配置
```

### 核心介面定義
```typescript
interface FormComponent {
  id: string;
  type: 'input' | 'select' | 'datepicker' | 'checkbox' | 'radio' | 'textarea' | 'number' | 'grid';
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
  value?: any;
  nzSpan?: number;    // Grid 專用
  children?: FormComponent[];  // Grid 子組件
}
```

### 新增組件類型
1. 在 `FormComponent` 介面中加入新類型
2. 在 `componentTemplates` 陣列中加入模板定義
3. 在 HTML 模板中加入對應的渲染邏輯
4. 在屬性面板中加入專用設定項目

## 測試

### 執行單元測試
```bash
ng test
```

### 執行端到端測試
```bash
ng e2e
```

## 建置與部署

### 開發建置
```bash
ng build
```

### 生產建置
```bash
ng build --configuration=production
```

建置結果存放在 `dist/` 目錄中。

## 版本歷史

- **v1.0.0** - 基礎功能實現
  - 拖拽式組件設計
  - 基本表單組件支援
  - 屬性編輯面板
  
- **v1.1.0** - Grid 功能增強
  - Grid 網格佈局支援
  - 可設定 nzSpan 屬性
  - 巢狀拖拽功能
  
- **v1.2.0** - 預覽與管理功能
  - 雙模式切換（設計/預覽）
  - 完整刪除功能
  - 表單配置輸出

## 技術支援

如有問題或建議，請參考：
- [Angular 官方文件](https://angular.dev/)
- [ng-zorro-antd 官方文件](https://ng.ant.design/)
- [Angular CDK 拖拽文件](https://material.angular.io/cdk/drag-drop/overview)

## 授權
此專案採用 MIT 授權條款。
- **ComponentTemplate 介面**：定義組件模板結構
- **拖拽邏輯**：分為主區域拖拽和 Grid 內部拖拽
- **組件渲染**：使用 Angular 的 `*ngSwitch` 條件渲染

### 效能優化
- 使用 `trackBy` 函數優化列表渲染
- 組件懶載入和按需載入
- CSS 動畫使用 GPU 加速

## 故障排除

### 常見問題
1. **組件無法拖拽**：檢查 CDK DragDropModule 是否正確匯入
2. **圖標無法顯示**：確認 icons-provider.ts 中有對應圖標
3. **樣式異常**：檢查 ng-zorro-antd 主題是否正確載入

### 建置錯誤
如果遇到建置錯誤，請執行：
```bash
npm install
ng build --verbose
```

## 未來規劃
- [ ] 支援更多組件類型（表格、上傳等）
- [ ] 表單驗證規則設定
- [ ] 匯出表單配置 JSON
- [ ] 匯入表單配置功能
- [ ] 表單預覽模式
- [ ] 組件樣式自訂

## 授權資訊
此專案使用 Angular CLI 19.2.3 版本建立。

---

如需技術支援或問題回報，請參考 [Angular CLI 文件](https://angular.dev/tools/cli)。
