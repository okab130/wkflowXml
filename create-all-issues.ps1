#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Creates all 88 GitHub issues from tasks.md without labels
.DESCRIPTION
    Parses tasks.md to extract all task sections and creates GitHub issues
    with proper formatting, including dependencies, deliverables, and estimates.
#>

param(
    [string]$Owner = "",
    [string]$Repo = ""
)

# Get repo info if not provided
if (-not $Owner -or -not $Repo) {
    $remoteUrl = git config --get remote.origin.url
    if ($remoteUrl -match "github\.com[:/]([^/]+)/([^/.]+)") {
        $Owner = $matches[1]
        $Repo = $matches[2]
    } else {
        Write-Error "Could not determine repository. Please provide -Owner and -Repo parameters."
        exit 1
    }
}

Write-Host "Creating issues for repository: $Owner/$Repo" -ForegroundColor Cyan
Write-Host ""

# Read tasks.md
$tasksFile = "tasks.md"
if (-not (Test-Path $tasksFile)) {
    Write-Error "tasks.md not found in current directory"
    exit 1
}

$content = Get-Content $tasksFile -Raw -Encoding UTF8

# Split into task sections
$taskPattern = '(?m)^### ([A-Z0-9]+-[0-9]+): (.+?)$'
$matches = [regex]::Matches($content, $taskPattern)

if ($matches.Count -eq 0) {
    Write-Error "No tasks found in tasks.md"
    exit 1
}

Write-Host "Found $($matches.Count) tasks to create" -ForegroundColor Green
Write-Host ""

$createdIssues = @()
$failedIssues = @()
$taskNumber = 0

foreach ($match in $matches) {
    $taskNumber++
    $taskId = $match.Groups[1].Value
    $taskTitle = $match.Groups[2].Value
    
    # Find the content between this task and the next one
    $startIndex = $match.Index
    $endIndex = $content.Length
    
    # Find next task header
    $nextMatch = $matches | Where-Object { $_.Index -gt $startIndex } | Select-Object -First 1
    if ($nextMatch) {
        $endIndex = $nextMatch.Index
    }
    
    # Extract task content
    $taskContent = $content.Substring($startIndex, $endIndex - $startIndex).Trim()
    
    # Parse task details
    $description = ""
    $dependencies = ""
    $deliverables = ""
    $estimate = ""
    $implementation = ""
    
    # Extract each field
    if ($taskContent -match '(?m)\*\*説明\*\*: (.+?)$') {
        $description = $matches[1].Trim()
    }
    
    if ($taskContent -match '(?m)\*\*依存関係\*\*: (.+?)$') {
        $dependencies = $matches[1].Trim()
    }
    
    if ($taskContent -match '(?m)\*\*成果物\*\*: (.+?)$') {
        $deliverables = $matches[1].Trim()
    }
    
    if ($taskContent -match '(?m)\*\*見積もり\*\*: (.+?)$') {
        $estimate = $matches[1].Trim()
    }
    
    # Extract implementation content (everything between 実装内容 and next section or end)
    if ($taskContent -match '(?ms)\*\*実装内容\*\*:(.+?)(?=\n### |\n## |\*\*パッケージリスト\*\*:|\*\*ディレクトリ構造\*\*:|\*\*型定義内容\*\*:|\*\*検証項目\*\*:|\*\*カスタムフック\*\*:|\*\*コンポーネント\*\*:|\*\*ユーティリティ関数\*\*:|\*\*ストア機能\*\*:|\*\*エクスポートフォーマット\*\*:|\*\*インポート対応形式\*\*:|\*\*実装手順\*\*:|$)') {
        $implementation = $matches[1].Trim()
    } elseif ($taskContent -match '(?ms)\*\*パッケージリスト\*\*:(.+?)(?=\n### |\n## |$)') {
        $implementation = "**パッケージリスト**:`n" + $matches[1].Trim()
    } elseif ($taskContent -match '(?ms)\*\*ディレクトリ構造\*\*:(.+?)(?=\n### |\n## |$)') {
        $implementation = "**ディレクトリ構造**:`n" + $matches[1].Trim()
    } elseif ($taskContent -match '(?ms)\*\*型定義内容\*\*:(.+?)(?=\n### |\n## |$)') {
        $implementation = "**型定義内容**:`n" + $matches[1].Trim()
    } elseif ($taskContent -match '(?ms)\*\*検証項目\*\*:(.+?)(?=\n### |\n## |$)') {
        $implementation = "**検証項目**:`n" + $matches[1].Trim()
    } elseif ($taskContent -match '(?ms)\*\*カスタムフック\*\*:(.+?)(?=\n### |\n## |$)') {
        $implementation = "**カスタムフック**:`n" + $matches[1].Trim()
    } elseif ($taskContent -match '(?ms)\*\*コンポーネント\*\*:(.+?)(?=\n### |\n## |$)') {
        $implementation = "**コンポーネント**:`n" + $matches[1].Trim()
    } elseif ($taskContent -match '(?ms)\*\*ユーティリティ関数\*\*:(.+?)(?=\n### |\n## |$)') {
        $implementation = "**ユーティリティ関数**:`n" + $matches[1].Trim()
    } elseif ($taskContent -match '(?ms)\*\*ストア機能\*\*:(.+?)(?=\n### |\n## |$)') {
        $implementation = "**ストア機能**:`n" + $matches[1].Trim()
    } elseif ($taskContent -match '(?ms)\*\*エクスポートフォーマット\*\*:(.+?)(?=\n### |\n## |$)') {
        $implementation = "**エクスポートフォーマット**:`n" + $matches[1].Trim()
    } elseif ($taskContent -match '(?ms)\*\*インポート対応形式\*\*:(.+?)(?=\n### |\n## |$)') {
        $implementation = "**インポート対応形式**:`n" + $matches[1].Trim()
    } elseif ($taskContent -match '(?ms)\*\*実装手順\*\*:(.+?)(?=\n### |\n## |$)') {
        $implementation = "**実装手順**:`n" + $matches[1].Trim()
    }
    
    # Build issue body with proper backtick escaping
    $issueBody = @"
## 説明
$description

## 依存関係
$dependencies

## 成果物
$deliverables

## 見積もり
$estimate
"@

    if ($implementation) {
        $issueBody += @"


## 実装内容
$implementation
"@
    }
    
    # Escape backticks for PowerShell (double them)
    $issueBody = $issueBody -replace '`', '````'
    
    # Create issue title
    $issueTitle = "[$taskId] $taskTitle"
    
    Write-Host "[$taskNumber/$($matches.Count)] Creating: $issueTitle" -ForegroundColor Yellow
    
    try {
        # Create the issue using GitHub CLI without labels
        $result = gh issue create `
            --repo "$Owner/$Repo" `
            --title $issueTitle `
            --body $issueBody 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            $createdIssues += @{
                Number = $taskNumber
                TaskId = $taskId
                Title = $taskTitle
                Url = $result
            }
            Write-Host "  ✓ Created: $result" -ForegroundColor Green
        } else {
            throw "GitHub CLI returned error code $LASTEXITCODE"
        }
    } catch {
        $errorMsg = $_.Exception.Message
        Write-Host "  ✗ Failed: $errorMsg" -ForegroundColor Red
        $failedIssues += @{
            Number = $taskNumber
            TaskId = $taskId
            Title = $taskTitle
            Error = $errorMsg
        }
    }
    
    # Delay between requests (except for last one)
    if ($taskNumber -lt $matches.Count) {
        Start-Sleep -Seconds 1
    }
}

# Summary
Write-Host ""
Write-Host "=" * 80 -ForegroundColor Cyan
Write-Host "SUMMARY" -ForegroundColor Cyan
Write-Host "=" * 80 -ForegroundColor Cyan
Write-Host ""
Write-Host "Total tasks processed: $($matches.Count)" -ForegroundColor White
Write-Host "Successfully created: $($createdIssues.Count)" -ForegroundColor Green
Write-Host "Failed: $($failedIssues.Count)" -ForegroundColor Red
Write-Host ""

if ($failedIssues.Count -gt 0) {
    Write-Host "Failed Issues:" -ForegroundColor Red
    foreach ($failed in $failedIssues) {
        Write-Host "  - [$($failed.TaskId)] $($failed.Title)" -ForegroundColor Red
        Write-Host "    Error: $($failed.Error)" -ForegroundColor DarkRed
    }
    Write-Host ""
}

Write-Host "All done! 🎉" -ForegroundColor Green
