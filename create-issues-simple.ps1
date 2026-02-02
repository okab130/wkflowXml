# Simple GitHub Issues Creator
# Creates all tasks as GitHub issues using gh CLI

$repo = "okab130/wkflowXml"
$created = 0

Write-Host "Creating issues for $repo..." -ForegroundColor Cyan

# SETUP Phase
Write-Host "`nSETUP Phase..." -ForegroundColor Yellow

gh issue create --repo $repo --title "[SETUP-01] プロジェクト初期化" --label "enhancement,setup,size/S" --body @"
## 説明
Vite + React + TypeScriptでプロジェクトを初期化

## 実装内容
- ``npm create vite@latest workflow-editor -- --template react-ts``
- プロジェクト名と設定の確認
- 初期ファイルの確認とクリーンアップ

## 依存関係
なし

## 成果物
- ``package.json``
- ``vite.config.ts``
- ``tsconfig.json``

## 見積もり
Small
"@
$created++
Start-Sleep -Seconds 1

gh issue create --repo $repo --title "[SETUP-02] 依存パッケージインストール" --label "enhancement,setup,size/S" --body @"
## 説明
React Flow、React Router等の必要なパッケージをインストール

## 依存関係
- #1 (SETUP-01)

## パッケージリスト
- ``reactflow`` - ビジュアルフローエディタ
- ``react-router-dom`` - ルーティング（オプション）
- ``zustand`` - 状態管理
- ``react-icons`` - アイコン
- ``uuid`` - ユニークID生成
- ``fast-xml-parser`` - XML処理

## 成果物
- 更新された``package.json``
- ``node_modules/``

## 見積もり
Small
"@
$created++
Start-Sleep -Seconds 1

gh issue create --repo $repo --title "[SETUP-03] プロジェクト構造作成" --label "enhancement,setup,size/S" --body @"
## 説明
srcディレクトリ以下の構造を作成

## 依存関係
- #1 (SETUP-01)

## ディレクトリ構造
\`\`\`
src/
├── components/
│   ├── nodes/
│   ├── edges/
│   ├── sidebar/
│   └── toolbar/
├── utils/
├── types/
├── store/
└── styles/
\`\`\`

## 成果物
ディレクトリ構造

## 見積もり
Small
"@
$created++
Start-Sleep -Seconds 1

Write-Host "`n✓ Created $created issues" -ForegroundColor Green
Write-Host "View at: https://github.com/$repo/issues" -ForegroundColor Cyan
