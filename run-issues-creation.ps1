# GitHub Issues Creation Runner
# Helper script to verify setup and run the main issue creation script
# Repository: okab130/wkflowXml

param(
    [string]$RepoOwner = "okab130",
    [string]$RepoName = "wkflowXml",
    [switch]$SkipConfirmation,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

# Color output functions
function Write-Success { Write-Host "✓ $args" -ForegroundColor Green }
function Write-Info { Write-Host "ℹ $args" -ForegroundColor Cyan }
function Write-Warning { Write-Host "⚠ $args" -ForegroundColor Yellow }
function Write-Error { Write-Host "✗ $args" -ForegroundColor Red }
function Write-Header { 
    Write-Host "`n" + ("=" * 70) -ForegroundColor Cyan
    Write-Host $args -ForegroundColor Cyan
    Write-Host ("=" * 70) -ForegroundColor Cyan
}

# Check if GitHub CLI is installed
function Test-GitHubCLI {
    Write-Info "Checking GitHub CLI installation..."
    
    try {
        $ghVersion = gh --version 2>&1 | Select-Object -First 1
        Write-Success "GitHub CLI installed: $ghVersion"
        return $true
    } catch {
        Write-Error "GitHub CLI (gh) is not installed or not in PATH"
        Write-Host "`nTo install GitHub CLI:"
        Write-Host "  • Windows: winget install --id GitHub.cli"
        Write-Host "  • Or download from: https://cli.github.com/"
        return $false
    }
}

# Check GitHub CLI authentication
function Test-GitHubAuth {
    Write-Info "Checking GitHub authentication..."
    
    try {
        $authStatus = gh auth status 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "GitHub CLI is authenticated"
            
            # Extract username
            if ($authStatus -match 'Logged in to github\.com account (.+?) ') {
                $username = $matches[1]
                Write-Info "Logged in as: $username"
            }
            
            return $true
        } else {
            Write-Error "GitHub CLI is not authenticated"
            Write-Host "`nTo authenticate, run:"
            Write-Host "  gh auth login"
            return $false
        }
    } catch {
        Write-Error "Failed to check authentication status"
        return $false
    }
}

# Check if repository exists and is accessible
function Test-RepositoryAccess {
    param(
        [string]$Owner,
        [string]$Repo
    )
    
    Write-Info "Checking repository access: $Owner/$Repo..."
    
    try {
        $repoInfo = gh repo view "$Owner/$Repo" --json name,owner,isPrivate 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            $repoData = $repoInfo | ConvertFrom-Json
            Write-Success "Repository found: $($repoData.owner.login)/$($repoData.name)"
            
            if ($repoData.isPrivate) {
                Write-Info "Repository type: Private"
            } else {
                Write-Info "Repository type: Public"
            }
            
            return $true
        } else {
            Write-Error "Repository not found or not accessible"
            Write-Host "Error: $repoInfo"
            return $false
        }
    } catch {
        Write-Error "Failed to access repository"
        return $false
    }
}

# Check if tasks.md exists
function Test-TasksFile {
    $tasksFile = "tasks.md"
    
    Write-Info "Checking for $tasksFile..."
    
    if (Test-Path $tasksFile) {
        $lineCount = (Get-Content $tasksFile).Count
        Write-Success "Found $tasksFile ($lineCount lines)"
        return $true
    } else {
        Write-Error "$tasksFile not found in current directory"
        Write-Host "Current directory: $(Get-Location)"
        return $false
    }
}

# Check if create-issues.ps1 exists
function Test-MainScript {
    $mainScript = "create-issues.ps1"
    
    Write-Info "Checking for $mainScript..."
    
    if (Test-Path $mainScript) {
        Write-Success "Found $mainScript"
        return $true
    } else {
        Write-Error "$mainScript not found in current directory"
        return $false
    }
}

# Get existing issues count
function Get-ExistingIssuesCount {
    param(
        [string]$Owner,
        [string]$Repo
    )
    
    try {
        $issues = gh issue list --repo "$Owner/$Repo" --limit 1000 --state all --json number 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            $issueData = $issues | ConvertFrom-Json
            return $issueData.Count
        }
    } catch {
        # Ignore error
    }
    
    return 0
}

# Display pre-flight summary
function Show-PreflightSummary {
    param(
        [string]$Owner,
        [string]$Repo,
        [int]$ExistingIssues
    )
    
    Write-Header "PRE-FLIGHT SUMMARY"
    
    Write-Host "Repository:        " -NoNewline
    Write-Host "$Owner/$Repo" -ForegroundColor Yellow
    
    Write-Host "Existing issues:   " -NoNewline
    Write-Host $ExistingIssues -ForegroundColor Yellow
    
    Write-Host "Issues to create:  " -NoNewline
    Write-Host "88" -ForegroundColor Green
    
    Write-Host "Estimated time:    " -NoNewline
    Write-Host "~2-3 minutes" -ForegroundColor Cyan
    
    Write-Host "`nLabels that will be used:"
    Write-Host "  • Phase: " -NoNewline -ForegroundColor Gray
    Write-Host "setup, phase-1, phase-2, phase-3, phase-4, ui-ux, testing, documentation, backend, deploy" -ForegroundColor White
    
    Write-Host "  • Size: " -NoNewline -ForegroundColor Gray
    Write-Host "size/S, size/M, size/L" -ForegroundColor White
    
    Write-Host "  • Type: " -NoNewline -ForegroundColor Gray
    Write-Host "enhancement" -ForegroundColor White
}

# Confirm with user
function Confirm-Action {
    Write-Host "`n"
    Write-Warning "This will create 88 new GitHub issues in $RepoOwner/$RepoName"
    Write-Host "Do you want to continue? " -NoNewline -ForegroundColor Yellow
    Write-Host "[Y/n] " -NoNewline -ForegroundColor Cyan
    
    $confirmation = Read-Host
    
    if ($confirmation -eq '' -or $confirmation -eq 'Y' -or $confirmation -eq 'y') {
        return $true
    }
    
    return $false
}

# Run the main script
function Invoke-MainScript {
    param(
        [string]$Owner,
        [string]$Repo
    )
    
    Write-Header "CREATING ISSUES"
    
    $startTime = Get-Date
    
    try {
        & .\create-issues.ps1 -RepoOwner $Owner -RepoName $Repo
        
        $endTime = Get-Date
        $duration = $endTime - $startTime
        
        Write-Host "`n"
        Write-Success "Completed in $([math]::Round($duration.TotalMinutes, 2)) minutes"
        
        return $true
    } catch {
        Write-Error "Failed to execute create-issues.ps1"
        Write-Host "Error: $_"
        return $false
    }
}

# Show final summary with links
function Show-FinalSummary {
    param(
        [string]$Owner,
        [string]$Repo
    )
    
    Write-Header "FINAL SUMMARY"
    
    Write-Host "View all issues:" -ForegroundColor White
    Write-Host "  https://github.com/$Owner/$Repo/issues" -ForegroundColor Blue
    
    Write-Host "`nView by milestone/project:" -ForegroundColor White
    Write-Host "  https://github.com/$Owner/$Repo/milestones" -ForegroundColor Blue
    
    Write-Host "`nView issue mapping:" -ForegroundColor White
    if (Test-Path "issue-mapping.json") {
        Write-Host "  $(Resolve-Path 'issue-mapping.json')" -ForegroundColor Blue
    }
    
    Write-Host "`nNext steps:" -ForegroundColor White
    Write-Host "  1. Review created issues on GitHub"
    Write-Host "  2. Create milestones or projects for tracking"
    Write-Host "  3. Assign team members to issues"
    Write-Host "  4. Start implementation following the dependency order"
    
    Write-Host "`n"
}

# Main execution
function Main {
    Write-Header "GitHub Issues Creation Runner - wkflowXml"
    
    Write-Host "This script will:"
    Write-Host "  1. Verify GitHub CLI installation and authentication"
    Write-Host "  2. Check repository access"
    Write-Host "  3. Parse tasks.md (88 tasks)"
    Write-Host "  4. Create GitHub issues in dependency order"
    Write-Host "  5. Add labels and dependency references"
    Write-Host "`n"
    
    # Pre-flight checks
    Write-Header "PRE-FLIGHT CHECKS"
    
    $allChecks = $true
    
    if (-not (Test-GitHubCLI)) {
        $allChecks = $false
    }
    
    if (-not (Test-GitHubAuth)) {
        $allChecks = $false
    }
    
    if (-not (Test-RepositoryAccess -Owner $RepoOwner -Repo $RepoName)) {
        $allChecks = $false
    }
    
    if (-not (Test-TasksFile)) {
        $allChecks = $false
    }
    
    if (-not (Test-MainScript)) {
        $allChecks = $false
    }
    
    if (-not $allChecks) {
        Write-Host "`n"
        Write-Error "Pre-flight checks failed. Please fix the issues above."
        exit 1
    }
    
    Write-Host "`n"
    Write-Success "All pre-flight checks passed!"
    
    # Get existing issues count
    $existingCount = Get-ExistingIssuesCount -Owner $RepoOwner -Repo $RepoName
    
    # Show summary
    Show-PreflightSummary -Owner $RepoOwner -Repo $RepoName -ExistingIssues $existingCount
    
    # Dry run mode
    if ($DryRun) {
        Write-Host "`n"
        Write-Warning "DRY RUN MODE - No issues will be created"
        Write-Info "Remove -DryRun flag to actually create issues"
        exit 0
    }
    
    # Confirm with user
    if (-not $SkipConfirmation) {
        if (-not (Confirm-Action)) {
            Write-Host "`n"
            Write-Info "Operation cancelled by user"
            exit 0
        }
    }
    
    # Run main script
    $success = Invoke-MainScript -Owner $RepoOwner -Repo $RepoName
    
    if ($success) {
        Show-FinalSummary -Owner $RepoOwner -Repo $RepoName
    } else {
        Write-Host "`n"
        Write-Error "Issue creation failed. Check the output above for details."
        exit 1
    }
}

# Run
try {
    Main
} catch {
    Write-Host "`n"
    Write-Error "Unexpected error: $_"
    exit 1
}
