# GitHub Issues Creation Scripts

This directory contains PowerShell scripts to automatically create all 88 GitHub issues for the wkflowXml project from the tasks.md file.

## 📁 Files

- **`run-issues-creation.ps1`** - Main runner script (use this)
- **`create-issues.ps1`** - Core issue creation logic
- **`tasks.md`** - Source task definitions (88 tasks)

## 🚀 Quick Start

### 1. Prerequisites

Ensure GitHub CLI is installed and authenticated:

```powershell
# Check if gh CLI is installed
gh --version

# If not installed, install it
winget install --id GitHub.cli

# Authenticate with GitHub
gh auth login
```

### 2. Run the Script

**Option A: Interactive (Recommended)**
```powershell
.\run-issues-creation.ps1
```

**Option B: Auto-confirm (Skip confirmation)**
```powershell
.\run-issues-creation.ps1 -SkipConfirmation
```

**Option C: Dry Run (Test without creating)**
```powershell
.\run-issues-creation.ps1 -DryRun
```

**Option D: Custom Repository**
```powershell
.\run-issues-creation.ps1 -RepoOwner "username" -RepoName "repo"
```

## 🎯 What the Scripts Do

### run-issues-creation.ps1
1. ✅ Verifies GitHub CLI installation
2. ✅ Checks GitHub authentication
3. ✅ Validates repository access
4. ✅ Confirms tasks.md exists
5. ✅ Shows pre-flight summary
6. ✅ Asks for confirmation
7. ✅ Runs the main creation script
8. ✅ Displays final summary with links

### create-issues.ps1
1. 📖 Parses all 88 tasks from tasks.md
2. 🏷️ Assigns appropriate labels:
   - **Phase**: setup, phase-1, phase-2, phase-3, phase-4, ui-ux, testing, documentation, backend, deploy
   - **Size**: size/S, size/M, size/L
   - **Type**: enhancement
3. 🔗 Creates issues in dependency order
4. 📝 Formats issue body with:
   - Description (説明)
   - Implementation details (実装内容)
   - Dependencies (依存関係)
   - Deliverables (成果物)
   - Estimate (見積もり)
5. 🔄 Updates dependency references
6. 💾 Exports issue mapping to `issue-mapping.json`

## 📊 Issue Format

Each issue is created with:

**Title:** `[TASK-ID] タイトル`
- Example: `[SETUP-01] プロジェクト初期化`

**Body:**
```markdown
## 📋 説明
[Description]

## 🎯 実装内容
[Implementation details]

## 🔗 依存関係
[Dependencies]

## 📦 成果物
[Deliverables]

## ⏱️ 見積もり
[Estimate]

---
**Task ID:** `TASK-ID`

### 🔗 Depends on
#issue1, #issue2, ...
```

## 📈 Progress Tracking

After creation, the script generates:

### issue-mapping.json
```json
{
  "SETUP-01": 1,
  "SETUP-02": 2,
  "P1-01": 3,
  ...
}
```

This maps task IDs to GitHub issue numbers for reference.

## 🔍 Task Breakdown

Total: **88 tasks**

| Phase | Count | Description |
|-------|-------|-------------|
| Setup | 6 | Project initialization |
| Phase 1 | 12 | Basic flow editor |
| Phase 2 | 11 | Assignee configuration |
| Phase 3 | 13 | XML output |
| Phase 4 | 10 | Save/Load functionality |
| UI/UX | 7 | UI improvements |
| Testing | 7 | Test suite |
| Documentation | 5 | Documentation |
| Backend | 6 | Backend (optional) |
| Deploy | 5 | Deployment setup |

## ⚙️ Script Parameters

### run-issues-creation.ps1

```powershell
-RepoOwner <string>      # Repository owner (default: "okab130")
-RepoName <string>       # Repository name (default: "wkflowXml")
-SkipConfirmation       # Skip user confirmation prompt
-DryRun                 # Test mode - no issues created
```

### create-issues.ps1

```powershell
-RepoOwner <string>      # Repository owner (default: "okab130")
-RepoName <string>       # Repository name (default: "wkflowXml")
-TasksFile <string>      # Tasks file path (default: "tasks.md")
```

## 🛠️ Troubleshooting

### "GitHub CLI not found"
```powershell
winget install --id GitHub.cli
# Or download from: https://cli.github.com/
```

### "Not authenticated"
```powershell
gh auth login
```

### "Repository not found"
- Verify repository exists: https://github.com/okab130/wkflowXml
- Check you have access to the repository
- Verify repo owner and name are correct

### "Rate limited"
- The script includes 1-second delays between requests
- If you hit rate limits, wait and retry

## 📝 Example Output

```
============================================================
PRE-FLIGHT CHECKS
============================================================
✓ GitHub CLI installed: gh version 2.40.0
✓ GitHub CLI is authenticated
ℹ Logged in as: okab130
✓ Repository found: okab130/wkflowXml
✓ Found tasks.md (757 lines)
✓ Found create-issues.ps1

============================================================
PRE-FLIGHT SUMMARY
============================================================
Repository:        okab130/wkflowXml
Existing issues:   0
Issues to create:  88
Estimated time:    ~2-3 minutes

============================================================
CREATING ISSUES
============================================================
ℹ Parsing tasks.md...
✓ Parsed 88 tasks

[1/88] ✓ Created issue #1 for SETUP-01
[2/88] ✓ Created issue #2 for SETUP-02
...
[88/88] ✓ Created issue #88 for DEPLOY-05

============================================================
SUMMARY
============================================================
Total tasks parsed: 88
Issues created: 88

Repository: https://github.com/okab130/wkflowXml/issues
```

## 🔗 Useful Links

After running the script:

- **All Issues**: https://github.com/okab130/wkflowXml/issues
- **By Labels**: Click label filters on the issues page
- **Issue Mapping**: Check `issue-mapping.json` in this directory

## ⏱️ Estimated Execution Time

- **Pre-flight checks**: ~10 seconds
- **Issue creation**: ~2-3 minutes (88 issues × 1 second)
- **Total**: ~3 minutes

## 🎯 Next Steps

After creating the issues:

1. 📋 Review created issues on GitHub
2. 🎯 Create milestones or projects for tracking
3. 👥 Assign team members to issues
4. 🚀 Start implementation following dependency order

## 📄 License

These scripts are part of the wkflowXml project.
