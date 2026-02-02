# 🚀 Quick Start Guide - GitHub Issues Creation

## Run the Script in 3 Steps

### Step 1: Open PowerShell in the project directory
```powershell
cd C:\Users\user\gh\wkflowXml
```

### Step 2: Run the helper script
```powershell
.\run-issues-creation.ps1
```

### Step 3: Confirm and wait
- The script will check prerequisites
- Review the summary
- Confirm to create 88 issues
- Wait ~2-3 minutes for completion

## What Happens?

✅ **Pre-flight checks:**
- Verifies GitHub CLI is installed
- Checks authentication status
- Validates repository access
- Confirms tasks.md exists

✅ **Issue creation:**
- Parses 88 tasks from tasks.md
- Creates issues in dependency order
- Adds proper labels (phase, size, type)
- Links dependencies between issues

✅ **Post-creation:**
- Exports issue mapping to `issue-mapping.json`
- Displays completion summary
- Shows direct links to issues

## Output Files

- `issue-mapping.json` - Maps task IDs to issue numbers
- Script logs are displayed in console

## View Created Issues

https://github.com/okab130/wkflowXml/issues

## Need Help?

See SCRIPTS-README.md for detailed documentation.
