# Phase 4 Quick Reference Guide

## 🎯 Quick Start

### Save Your First Workflow
```
1. Create a workflow (add nodes and edges)
2. Click "保存" in the toolbar
3. Enter name: "マイワークフロー"
4. Click "保存"
```

### Load a Workflow
```
1. Click "読み込み" in the toolbar
2. Click on any workflow in the list
3. Done! The workflow is loaded
```

## 🔑 Key Features

| Feature | Button | Description |
|---------|--------|-------------|
| **New Workflow** | 新規 | Clear canvas and start fresh |
| **Save** | 保存 | Save current workflow to LocalStorage |
| **Load** | 読み込み | Browse and load saved workflows |
| **Import** | インポート | Import workflow from JSON file |
| **Export JSON** | JSON | Export workflow as JSON file |
| **Export BPMN** | BPMN | Export as BPMN 2.0 XML |

## 🎨 Visual Indicators

| Indicator | Meaning |
|-----------|---------|
| **● (Orange)** | Unsaved changes |
| **Badge Number** | Number of saved workflows |
| **✅ 正常** | Workflow is valid |
| **⚠️ 警告** | Workflow has warnings |
| **❌ エラー** | Workflow has errors |

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Esc** | Close dialog/modal |
| **Enter** | Submit form (in dialogs) |

## 📦 Storage Information

- **Location**: Browser LocalStorage
- **Key**: `workflows`
- **Format**: JSON array
- **Persistence**: Survives browser restart
- **Limit**: ~5-10MB (browser dependent)

## 🔄 Workflow Lifecycle

```
Create → Save → Load → Edit → Save (Update)
           ↓
         Delete
```

## ⚠️ Important Confirmations

### When You'll Be Asked to Confirm:

1. **Loading workflow** (if unsaved changes exist)
   - "保存されていない変更があります。読み込むと変更が失われますが、よろしいですか？"

2. **Creating new workflow** (if unsaved changes exist)
   - "保存されていない変更があります。新規作成すると変更が失われますが、よろしいですか？"

3. **Importing JSON** (if unsaved changes exist)
   - "保存されていない変更があります。インポートすると変更が失われますが、よろしいですか？"

4. **Deleting workflow**
   - "本当に削除しますか？[Workflow Name]"

## ✅ Validation Rules

### Workflow Name
- **Required**: Yes
- **Min Length**: 2 characters
- **Max Length**: 100 characters
- **Unique**: Must be unique (case-insensitive)

### Workflow Description
- **Required**: No
- **Max Length**: 500 characters

### Save Requirements
- Must have at least 1 node
- Workflow name must be valid
- Name must not duplicate existing workflow

## 📋 Common Tasks

### Task 1: Save Current Work
```
1. Click "保存"
2. Enter name (if first save)
3. Click "保存"
```

### Task 2: Update Existing Workflow
```
1. Make changes to loaded workflow
2. Click "保存"
3. Name is pre-filled
4. Click "保存"
```

### Task 3: Rename a Workflow
```
1. Click "読み込み"
2. Click edit icon (✏️) on workflow
3. Change name/description
4. Click "更新"
```

### Task 4: Delete a Workflow
```
1. Click "読み込み"
2. Click delete icon (🗑️) on workflow
3. Click "削除" to confirm
```

### Task 5: Export for Backup
```
1. Load the workflow
2. Click "JSON"
3. Save the file to safe location
```

### Task 6: Import from Backup
```
1. Click "インポート"
2. Select JSON file
3. Click "Open"
```

## 🐛 Troubleshooting

### "同じ名前のワークフローが既に存在します"
- **Problem**: Duplicate name
- **Solution**: Choose a different name

### "ワークフロー名を入力してください"
- **Problem**: Name is empty
- **Solution**: Enter a name (2-100 characters)

### "ワークフローのインポートに失敗しました"
- **Problem**: Invalid JSON file
- **Solution**: Ensure file is a valid workflow JSON

### "ワークフローが空です"
- **Problem**: Trying to export empty workflow
- **Solution**: Add at least one node first

## 💡 Pro Tips

1. **Save Often**: Use the "保存" button frequently
2. **Use Descriptions**: Add descriptions to remember workflow purpose
3. **Export Backups**: Regularly export important workflows as JSON
4. **Watch the Indicator**: Orange dot (●) means unsaved changes
5. **Organize Names**: Use consistent naming (e.g., "部門_種類_日付")

## 📊 Workflow List View

The workflow list shows:
- **Name**: Workflow name (click to load)
- **Description**: Brief description (if provided)
- **Updated**: Last update timestamp
- **Actions**: Edit (✏️) and Delete (🗑️) buttons

## 🔗 Integration with Other Features

### With BPMN Export
1. Save workflow to LocalStorage
2. Load it anytime
3. Export to BPMN XML

### With Validation
- Validation works with saved workflows
- Errors/warnings shown before save

### With Assignees
- Assignees are saved with workflow
- All assignee data preserved

## 📱 Mobile Support

All Phase 4 features work on mobile:
- Responsive dialogs
- Touch-friendly buttons
- Scrollable workflow list
- Full-screen modals

## 🎓 Best Practices

1. **Naming Convention**
   ```
   Good: "購買申請_10万円以上_v1"
   Bad:  "test", "aaa", "新しいワークフロー"
   ```

2. **Use Descriptions**
   ```
   Good: "10万円以上の購買申請に使用。部長承認が必要。"
   Bad:  "" (empty)
   ```

3. **Regular Backups**
   - Export important workflows monthly
   - Keep JSON files in safe location

4. **Clean Up Old Workflows**
   - Delete unused workflows
   - Keep storage organized

## 🔒 Security Notes

- Data stored locally only
- Not sent to any server
- Cleared when browser data is cleared
- No authentication required

## 📞 Need Help?

- Check validation errors (click "検証" button)
- Review workflow structure
- Try exporting and re-importing
- Clear browser cache if issues persist

---

**Version**: Phase 4 (Complete)
**Last Updated**: 2025-02-02
**Status**: ✅ All Features Operational
