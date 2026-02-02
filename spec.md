# 承認ワークフロービジュアルエディタ - 機能仕様書

## プロジェクト概要

Web画面上でアイコンを配置し線でつなぐことで承認ワークフローを視覚的に設計し、そのデータをBPMN 2.0形式のXMLとして出力するシステム。

## 技術スタック

### フロントエンド
- **React** - UIフレームワーク
- **React Flow** - ビジュアルフローエディタライブラリ
- **TypeScript** - 型安全性のため

### バックエンド
- **Node.js** - サーバーサイド実行環境
- **Express** - Webフレームワーク

### データフォーマット
- **BPMN 2.0 XML** - ワークフロー定義の標準フォーマット

## 主要機能要件

### 1. ビジュアルフローエディタ

#### 1.1 ノード（アイコン）の種類
- **開始ノード** - ワークフロー開始点
- **承認ノード** - 承認処理を行うノード
  - 処理者（担当者）の設定が可能
  - 複数の処理者を設定可能
- **条件分岐ノード** - 条件に基づいた分岐
- **終了ノード** - ワークフロー終了点

#### 1.2 ノード操作
- ドラッグ&ドロップでキャンバス上に配置
- ノードの選択・削除
- ノードのプロパティ編集（サイドパネル）
  - ノード名
  - 処理者の設定
  - その他のメタデータ

#### 1.3 エッジ（線）操作
- ノード間を線でつなぐ
- 線の削除
- 条件付きエッジ（分岐条件の設定）

#### 1.4 キャンバス操作
- ズームイン/ズームアウト
- パン（画面移動）
- 自動レイアウト機能

### 2. 処理者設定機能

#### 2.1 処理者の管理
- 処理者のリスト管理
- 処理者情報
  - ID
  - 名前
  - メールアドレス
  - 役職・部署

#### 2.2 ノードへの処理者割り当て
- 承認ノードに1人または複数人の処理者を割り当て
- 複数処理者の場合の承認ルール
  - 全員承認
  - 一人承認
  - 過半数承認

### 3. XML出力機能

#### 3.1 BPMN 2.0形式への変換
- ビジュアルフロー → BPMN 2.0 XML変換
- 必須要素
  - プロセスID
  - タスク定義
  - シーケンスフロー
  - 処理者情報（レーン/プール）

#### 3.2 XMLダウンロード
- ワンクリックでXMLファイルをダウンロード
- ファイル名のカスタマイズ可能

#### 3.3 XML検証
- BPMN 2.0スキーマに準拠しているか検証
- エラー表示とバリデーション

### 4. ワークフロー管理

#### 4.1 保存・読み込み
- ワークフロー定義の保存（JSON/XML）
- 保存済みワークフローの読み込み
- バージョン管理（将来機能）

#### 4.2 プレビュー機能
- XML出力のプレビュー表示
- シンタックスハイライト

## 非機能要件

### パフォーマンス
- 100ノード以上のフローをスムーズに編集可能
- XML出力は1秒以内

### ユーザビリティ
- 直感的なドラッグ&ドロップインターフェース
- レスポンシブデザイン
- 日本語対応

### 拡張性
- 新しいノードタイプの追加が容易
- プラグインアーキテクチャ（将来機能）

## データモデル

### Workflow（ワークフロー）
```typescript
interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Node（ノード）
```typescript
interface Node {
  id: string;
  type: 'start' | 'approval' | 'condition' | 'end';
  label: string;
  position: { x: number; y: number };
  data: {
    assignees?: Assignee[];
    approvalRule?: 'all' | 'single' | 'majority';
    condition?: string;
  };
}
```

### Edge（エッジ）
```typescript
interface Edge {
  id: string;
  source: string;
  target: string;
  label?: string;
  condition?: string;
}
```

### Assignee（処理者）
```typescript
interface Assignee {
  id: string;
  name: string;
  email: string;
  role?: string;
  department?: string;
}
```

## UI/UXガイドライン

### レイアウト
- **左サイドバー** - ノードパレット（ドラッグ可能なアイコン一覧）
- **中央エリア** - フローキャンバス
- **右サイドバー** - プロパティパネル（選択ノードの詳細設定）
- **上部ツールバー** - 保存・読み込み・XML出力・ズームコントロール

### カラースキーム
- 開始ノード: 緑系
- 承認ノード: 青系
- 条件分岐ノード: 黄色系
- 終了ノード: 赤系

## 実装フェーズ

### Phase 1: 基本フローエディタ
- React Flowの統合
- 基本ノード（開始、承認、終了）の実装
- ノード接続機能

### Phase 2: 処理者設定
- 処理者管理UI
- ノードへの処理者割り当て
- 承認ルール設定

### Phase 3: XML出力
- BPMN 2.0変換ロジック
- XMLダウンロード機能
- バリデーション

### Phase 4: 保存・管理機能
- ローカルストレージ/DB保存
- ワークフロー一覧表示
- 読み込み機能

## 技術的考慮事項

### React Flowの主要機能
- カスタムノードコンポーネント
- エッジのカスタマイズ
- ミニマップ・コントロールパネル
- 状態管理（React Context or Zustand）

### BPMN 2.0変換
- `bpmn-js`ライブラリの活用を検討
- カスタムBPMN要素の拡張
- 処理者情報をBPMNレーン/プールにマッピング

### データ永続化
- Phase 1: ブラウザのLocalStorage
- Phase 2以降: バックエンドAPI + データベース（MongoDB/PostgreSQL）

## 参考リソース

- React Flow: https://reactflow.dev/
- BPMN 2.0 Specification: https://www.omg.org/spec/BPMN/2.0/
- bpmn-js: https://bpmn.io/toolkit/bpmn-js/

## 成果物

1. Webアプリケーション（React）
2. バックエンドAPI（Node.js/Express）
3. BPMN 2.0 XML出力機能
4. ユーザードキュメント
5. 開発者向けAPI仕様書
