# GitHub Issues Creation Script for wkflowXml Project
# Creates all 88 tasks from tasks.md as GitHub issues
# Repository: okab130/wkflowXml

param(
    [string]$RepoOwner = "okab130",
    [string]$RepoName = "wkflowXml",
    [string]$TasksFile = "tasks.md"
)

$ErrorActionPreference = "Stop"

# Color codes for output
function Write-Success { Write-Host "✓ $args" -ForegroundColor Green }
function Write-Info { Write-Host "ℹ $args" -ForegroundColor Cyan }
function Write-Warning { Write-Host "⚠ $args" -ForegroundColor Yellow }
function Write-Error { Write-Host "✗ $args" -ForegroundColor Red }

# Task definition structure
class Task {
    [string]$Id
    [string]$Title
    [string]$Description
    [string]$Dependencies
    [string]$Deliverables
    [string]$Estimate
    [string]$Implementation
    [string]$Phase
    [int]$IssueNumber = 0
}

# Global variables
$script:Tasks = @{}
$script:IssueMapping = @{}
$script:CreatedCount = 0
$script:FailedCount = 0
$script:SkippedCount = 0

# Parse tasks.md file
function Parse-TasksFile {
    param([string]$FilePath)
    
    Write-Info "Parsing $FilePath..."
    
    if (-not (Test-Path $FilePath)) {
        Write-Error "Tasks file not found: $FilePath"
        exit 1
    }
    
    $content = Get-Content -Path $FilePath -Raw -Encoding UTF8
    
    # Split by task headers (###)
    $taskBlocks = $content -split '###\s+' | Where-Object { $_ -match '^\w+-\d+:' }
    
    foreach ($block in $taskBlocks) {
        $task = [Task]::new()
        
        # Extract task ID and title from first line
        if ($block -match '^([\w-]+):\s+(.+?)[\r\n]') {
            $task.Id = $matches[1]
            $task.Title = $matches[2].Trim()
        } else {
            continue
        }
        
        # Extract description
        if ($block -match '\*\*説明\*\*:\s+(.+?)[\r\n]') {
            $task.Description = $matches[1].Trim()
        }
        
        # Extract dependencies
        if ($block -match '\*\*依存関係\*\*:\s+(.+?)[\r\n]') {
            $task.Dependencies = $matches[1].Trim()
        }
        
        # Extract deliverables
        if ($block -match '\*\*成果物\*\*:\s+(.+?)[\r\n]') {
            $task.Deliverables = $matches[1].Trim()
        }
        
        # Extract estimate
        if ($block -match '\*\*見積もり\*\*:\s+(.+?)[\r\n]') {
            $task.Estimate = $matches[1].Trim()
        }
        
        # Extract implementation details
        if ($block -match '\*\*実装内容\*\*:(.*?)(?=\*\*|###|$)') {
            $task.Implementation = $matches[1].Trim()
        } elseif ($block -match '\*\*パッケージリスト\*\*:(.*?)(?=\*\*|###|$)') {
            $task.Implementation = $matches[1].Trim()
        } elseif ($block -match '\*\*ディレクトリ構造\*\*:(.*?)(?=\*\*|###|$)') {
            $task.Implementation = $matches[1].Trim()
        } elseif ($block -match '\*\*型定義内容\*\*:(.*?)(?=\*\*|###|$)') {
            $task.Implementation = $matches[1].Trim()
        } elseif ($block -match '\*\*ショートカット例\*\*:(.*?)(?=\*\*|###|$)') {
            $task.Implementation = $matches[1].Trim()
        } elseif ($block -match '\*\*内容\*\*:(.*?)(?=\*\*|###|$)') {
            $task.Implementation = $matches[1].Trim()
        }
        
        # Determine phase from ID
        $task.Phase = Get-PhaseFromId $task.Id
        
        $script:Tasks[$task.Id] = $task
    }
    
    Write-Success "Parsed $($script:Tasks.Count) tasks"
}

# Determine phase from task ID
function Get-PhaseFromId {
    param([string]$Id)
    
    switch -Regex ($Id) {
        '^SETUP-' { return 'setup' }
        '^P1-' { return 'phase-1' }
        '^P2-' { return 'phase-2' }
        '^P3-' { return 'phase-3' }
        '^P4-' { return 'phase-4' }
        '^UX-' { return 'ui-ux' }
        '^TEST-' { return 'testing' }
        '^DOC-' { return 'documentation' }
        '^BE-' { return 'backend' }
        '^DEPLOY-' { return 'deploy' }
        default { return 'enhancement' }
    }
}

# Get size label from estimate
function Get-SizeLabel {
    param([string]$Estimate)
    
    switch ($Estimate) {
        'Small' { return 'size/S' }
        'Medium' { return 'size/M' }
        'Large' { return 'size/L' }
        default { return 'size/M' }
    }
}

# Build issue body
function Build-IssueBody {
    param([Task]$Task)
    
    $body = @"
## 📋 説明
$($Task.Description)

## 🎯 実装内容
$($Task.Implementation)

## 🔗 依存関係
$($Task.Dependencies)

## 📦 成果物
$($Task.Deliverables)

## ⏱️ 見積もり
$($Task.Estimate)

---
**Task ID:** ``$($Task.Id)``
"@
    
    return $body
}

# Get labels for task
function Get-TaskLabels {
    param([Task]$Task)
    
    $labels = @('enhancement')
    $labels += $Task.Phase
    $labels += Get-SizeLabel $Task.Estimate
    
    return $labels -join ','
}

# Parse dependencies and return task IDs
function Get-DependencyTasks {
    param([string]$DependenciesStr)
    
    if ($DependenciesStr -match 'なし|none') {
        return @()
    }
    
    # Extract task IDs from dependencies string
    $taskIds = @()
    if ($DependenciesStr -match '[\w-]+-\d+') {
        $taskIds = [regex]::Matches($DependenciesStr, '([\w-]+-\d+)') | ForEach-Object { $_.Groups[1].Value }
    }
    
    return $taskIds
}

# Add dependency references to issue body
function Add-DependencyReferences {
    param(
        [string]$Body,
        [array]$DepTaskIds
    )
    
    if ($DepTaskIds.Count -eq 0) {
        return $Body
    }
    
    $depRefs = @()
    foreach ($depId in $DepTaskIds) {
        if ($script:IssueMapping.ContainsKey($depId)) {
            $issueNum = $script:IssueMapping[$depId]
            $depRefs += "#$issueNum"
        } else {
            $depRefs += "$depId (not yet created)"
        }
    }
    
    $depSection = "`n`n### 🔗 Depends on`n" + ($depRefs -join ', ')
    return $Body + $depSection
}

# Create a single GitHub issue
function Create-GitHubIssue {
    param([Task]$Task)
    
    $issueTitle = "[$($Task.Id)] $($Task.Title)"
    $issueBody = Build-IssueBody -Task $Task
    $labels = Get-TaskLabels -Task $Task
    
    # Add dependency references if available
    $depTaskIds = Get-DependencyTasks -DependenciesStr $Task.Dependencies
    if ($depTaskIds.Count -gt 0) {
        $issueBody = Add-DependencyReferences -Body $issueBody -DepTaskIds $depTaskIds
    }
    
    try {
        Write-Info "Creating issue: $issueTitle"
        
        # Create issue using gh CLI
        $result = gh issue create `
            --repo "$RepoOwner/$RepoName" `
            --title $issueTitle `
            --body $issueBody `
            --label $labels `
            2>&1
        
        if ($LASTEXITCODE -eq 0) {
            # Extract issue number from URL
            if ($result -match '#(\d+)') {
                $issueNumber = [int]$matches[1]
                $script:IssueMapping[$Task.Id] = $issueNumber
                $Task.IssueNumber = $issueNumber
                $script:CreatedCount++
                Write-Success "Created issue #$issueNumber for $($Task.Id)"
                return $true
            }
        } else {
            Write-Warning "Failed to create issue for $($Task.Id): $result"
            $script:FailedCount++
            return $false
        }
    } catch {
        Write-Warning "Exception creating issue for $($Task.Id): $_"
        $script:FailedCount++
        return $false
    }
    
    return $false
}

# Get tasks in dependency order using topological sort
function Get-TasksInDependencyOrder {
    $ordered = @()
    $visited = @{}
    $visiting = @{}
    
    function Visit-Task {
        param([string]$TaskId)
        
        if ($visited.ContainsKey($TaskId)) {
            return
        }
        
        if ($visiting.ContainsKey($TaskId)) {
            Write-Warning "Circular dependency detected at $TaskId"
            return
        }
        
        $visiting[$TaskId] = $true
        
        $task = $script:Tasks[$TaskId]
        if ($task) {
            $depIds = Get-DependencyTasks -DependenciesStr $task.Dependencies
            foreach ($depId in $depIds) {
                if ($script:Tasks.ContainsKey($depId)) {
                    Visit-Task -TaskId $depId
                }
            }
        }
        
        $visiting.Remove($TaskId)
        $visited[$TaskId] = $true
        $ordered += $TaskId
    }
    
    # Visit all tasks
    foreach ($taskId in $script:Tasks.Keys | Sort-Object) {
        Visit-Task -TaskId $taskId
    }
    
    return $ordered
}

# Create all issues
function Create-AllIssues {
    Write-Info "`nCreating GitHub issues in dependency order..."
    Write-Info "Repository: $RepoOwner/$RepoName"
    Write-Info "Total tasks: $($script:Tasks.Count)"
    
    # Get tasks in dependency order
    $orderedTaskIds = Get-TasksInDependencyOrder
    
    Write-Info "`nProcessing $($orderedTaskIds.Count) tasks...`n"
    
    $progress = 0
    foreach ($taskId in $orderedTaskIds) {
        $progress++
        $task = $script:Tasks[$taskId]
        
        Write-Host "`n[$progress/$($orderedTaskIds.Count)] " -NoNewline -ForegroundColor Gray
        
        Create-GitHubIssue -Task $task
        
        # Rate limiting: wait 1 second between requests
        Start-Sleep -Milliseconds 1000
    }
}

# Update issues with dependency references (second pass)
function Update-IssueDependencies {
    Write-Info "`nUpdating dependency references in issues..."
    
    $updatedCount = 0
    foreach ($taskId in $script:Tasks.Keys) {
        $task = $script:Tasks[$taskId]
        $depTaskIds = Get-DependencyTasks -DependenciesStr $task.Dependencies
        
        if ($depTaskIds.Count -eq 0 -or $task.IssueNumber -eq 0) {
            continue
        }
        
        # Check if all dependencies now have issue numbers
        $allDepsCreated = $true
        $depRefs = @()
        foreach ($depId in $depTaskIds) {
            if ($script:IssueMapping.ContainsKey($depId)) {
                $issueNum = $script:IssueMapping[$depId]
                $depRefs += "#$issueNum"
            } else {
                $allDepsCreated = $false
            }
        }
        
        if ($allDepsCreated -and $depRefs.Count -gt 0) {
            try {
                $comment = "**Dependencies:** " + ($depRefs -join ', ')
                gh issue comment $task.IssueNumber `
                    --repo "$RepoOwner/$RepoName" `
                    --body $comment `
                    2>&1 | Out-Null
                
                if ($LASTEXITCODE -eq 0) {
                    $updatedCount++
                }
            } catch {
                Write-Warning "Failed to update dependencies for issue #$($task.IssueNumber)"
            }
            
            Start-Sleep -Milliseconds 500
        }
    }
    
    if ($updatedCount -gt 0) {
        Write-Success "Updated $updatedCount issues with dependency references"
    }
}

# Export issue mapping to file
function Export-IssueMapping {
    $mappingFile = "issue-mapping.json"
    
    $mapping = @{}
    foreach ($taskId in $script:IssueMapping.Keys) {
        $mapping[$taskId] = $script:IssueMapping[$taskId]
    }
    
    $mapping | ConvertTo-Json | Set-Content -Path $mappingFile -Encoding UTF8
    Write-Success "Issue mapping exported to $mappingFile"
}

# Print summary
function Print-Summary {
    Write-Host "`n" + ("=" * 60) -ForegroundColor Cyan
    Write-Host "SUMMARY" -ForegroundColor Cyan
    Write-Host ("=" * 60) -ForegroundColor Cyan
    
    Write-Host "Total tasks parsed: " -NoNewline
    Write-Host $script:Tasks.Count -ForegroundColor White
    
    Write-Host "Issues created: " -NoNewline
    Write-Host $script:CreatedCount -ForegroundColor Green
    
    if ($script:FailedCount -gt 0) {
        Write-Host "Issues failed: " -NoNewline
        Write-Host $script:FailedCount -ForegroundColor Red
    }
    
    if ($script:SkippedCount -gt 0) {
        Write-Host "Issues skipped: " -NoNewline
        Write-Host $script:SkippedCount -ForegroundColor Yellow
    }
    
    Write-Host "`nRepository: " -NoNewline
    Write-Host "https://github.com/$RepoOwner/$RepoName/issues" -ForegroundColor Blue
    
    Write-Host ("=" * 60) -ForegroundColor Cyan
}

# Main execution
function Main {
    Write-Host "`n" + ("=" * 60) -ForegroundColor Cyan
    Write-Host "GitHub Issues Creator for wkflowXml" -ForegroundColor Cyan
    Write-Host ("=" * 60) -ForegroundColor Cyan
    
    # Check if gh CLI is available
    try {
        $ghVersion = gh --version 2>&1 | Select-Object -First 1
        Write-Success "GitHub CLI found: $ghVersion"
    } catch {
        Write-Error "GitHub CLI (gh) not found. Please install it first."
        exit 1
    }
    
    # Parse tasks
    Parse-TasksFile -FilePath $TasksFile
    
    # Create issues
    Create-AllIssues
    
    # Update dependencies (second pass)
    Update-IssueDependencies
    
    # Export mapping
    Export-IssueMapping
    
    # Print summary
    Print-Summary
    
    Write-Host "`n"
}

# Run main function
Main
