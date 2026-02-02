# Phase 4 Testing Guide

## 🧪 Test Plan Overview

This document provides comprehensive testing instructions for Phase 4: Save/Load and Workflow Management features.

## 🎯 Test Environment

- **URL**: http://localhost:5179/
- **Browser**: Chrome/Firefox/Edge (latest versions)
- **Storage**: Browser LocalStorage
- **Network**: Not required (fully offline)

## 📋 Test Categories

1. Save Functionality
2. Load Functionality
3. Delete Functionality
4. Edit Metadata Functionality
5. New/Clear Functionality
6. JSON Import/Export
7. Validation and Error Handling
8. UI/UX Testing
9. Edge Cases

---

## Test Suite 1: Save Functionality

### Test 1.1: First Time Save
**Steps:**
1. Open the application
2. Add a Start node to canvas
3. Add an Approval node
4. Connect the nodes
5. Click "保存" button
6. Enter name: "テストワークフロー1"
7. Enter description: "テスト用"
8. Click "保存"

**Expected Results:**
- ✅ Save dialog appears
- ✅ Form validates successfully
- ✅ Dialog closes after save
- ✅ Unsaved indicator (●) disappears
- ✅ Workflow count badge shows 1

### Test 1.2: Update Existing Workflow
**Steps:**
1. Load a saved workflow
2. Add another node
3. Click "保存" button
4. Name is pre-filled
5. Click "保存"

**Expected Results:**
- ✅ Dialog shows existing name/description
- ✅ Workflow is updated (not duplicated)
- ✅ Updated timestamp changes
- ✅ Unsaved indicator disappears

### Test 1.3: Save Empty Workflow
**Steps:**
1. Clear canvas (no nodes)
2. Click "保存" button

**Expected Results:**
- ✅ Button is disabled
- ✅ Cannot save empty workflow

### Test 1.4: Save with Invalid Name
**Steps:**
1. Create workflow
2. Click "保存"
3. Enter name: "a" (too short)
4. Click "保存"

**Expected Results:**
- ✅ Error message: "ワークフロー名は2文字以上で入力してください"
- ✅ Form does not submit

### Test 1.5: Save with Duplicate Name
**Steps:**
1. Save workflow with name "Test1"
2. Create new workflow
3. Try to save with name "Test1"

**Expected Results:**
- ✅ Error message: "同じ名前のワークフローが既に存在します"
- ✅ Form does not submit

---

## Test Suite 2: Load Functionality

### Test 2.1: Load Workflow from List
**Steps:**
1. Click "読み込み" button
2. Click on any workflow in the list

**Expected Results:**
- ✅ Workflow list modal appears
- ✅ Shows all saved workflows
- ✅ Clicking workflow loads it
- ✅ Canvas displays correct nodes and edges
- ✅ Modal closes automatically

### Test 2.2: Load with Unsaved Changes
**Steps:**
1. Create workflow without saving
2. Click "読み込み"
3. Try to load another workflow

**Expected Results:**
- ✅ Confirmation dialog appears
- ✅ Warning about unsaved changes
- ✅ Can cancel or proceed
- ✅ If proceed, current work is lost

### Test 2.3: Load Empty List
**Steps:**
1. Clear all workflows (via browser console: localStorage.clear())
2. Click "読み込み"

**Expected Results:**
- ✅ Shows empty state message
- ✅ Icon and helpful text displayed
- ✅ "保存されたワークフローがありません" message

### Test 2.4: Verify Workflow Data Integrity
**Steps:**
1. Create complex workflow:
   - 5 different node types
   - Multiple edges
   - 3 assignees
2. Save workflow
3. Create new workflow
4. Load the saved workflow

**Expected Results:**
- ✅ All nodes restored correctly
- ✅ All edges restored correctly
- ✅ All assignees restored correctly
- ✅ Node positions maintained
- ✅ Approval rules preserved

---

## Test Suite 3: Delete Functionality

### Test 3.1: Delete Workflow
**Steps:**
1. Open workflow list
2. Click delete icon (🗑️) on a workflow
3. Review confirmation dialog
4. Click "削除"

**Expected Results:**
- ✅ Confirmation dialog appears
- ✅ Shows workflow name
- ✅ Workflow removed from list
- ✅ Count badge updates
- ✅ Storage updated

### Test 3.2: Cancel Delete
**Steps:**
1. Open workflow list
2. Click delete icon
3. Click "キャンセル"

**Expected Results:**
- ✅ Confirmation dialog closes
- ✅ Workflow remains in list
- ✅ No changes made

### Test 3.3: Delete Currently Loaded Workflow
**Steps:**
1. Load a workflow
2. Open workflow list
3. Delete the loaded workflow
4. Close list

**Expected Results:**
- ✅ Workflow deleted from storage
- ✅ Canvas still shows the workflow
- ✅ Can continue editing (unsaved)

---

## Test Suite 4: Edit Metadata

### Test 4.1: Edit Workflow Name
**Steps:**
1. Open workflow list
2. Click edit icon (✏️)
3. Change name to "新しい名前"
4. Click "更新"

**Expected Results:**
- ✅ Edit dialog appears
- ✅ Name and description pre-filled
- ✅ Changes saved
- ✅ List updates with new name
- ✅ Updated timestamp changes

### Test 4.2: Edit Description Only
**Steps:**
1. Edit a workflow
2. Keep name same
3. Change description
4. Save

**Expected Results:**
- ✅ Description updates
- ✅ Name unchanged
- ✅ Timestamp updates

### Test 4.3: Edit with Invalid Name
**Steps:**
1. Edit workflow
2. Change to existing name
3. Try to save

**Expected Results:**
- ✅ Error message about duplicate
- ✅ Cannot save

---

## Test Suite 5: New/Clear Functionality

### Test 5.1: New Workflow (No Changes)
**Steps:**
1. Load a workflow
2. Don't make changes
3. Click "新規"

**Expected Results:**
- ✅ No confirmation needed
- ✅ Canvas clears immediately
- ✅ Default name shown

### Test 5.2: New Workflow (With Unsaved Changes)
**Steps:**
1. Load workflow
2. Add a node
3. Click "新規"

**Expected Results:**
- ✅ Confirmation dialog appears
- ✅ Can cancel or proceed
- ✅ If proceed, canvas clears

### Test 5.3: Multiple New Workflows
**Steps:**
1. Click "新規"
2. Create workflow
3. Save as "Flow1"
4. Click "新規"
5. Create different workflow
6. Save as "Flow2"

**Expected Results:**
- ✅ Both workflows saved separately
- ✅ Can load either workflow
- ✅ No data mixing

---

## Test Suite 6: JSON Import/Export

### Test 6.1: Export Workflow as JSON
**Steps:**
1. Create workflow
2. Click "JSON" button
3. Check downloaded file

**Expected Results:**
- ✅ JSON file downloads
- ✅ Filename matches workflow name
- ✅ Valid JSON structure
- ✅ Contains all workflow data

### Test 6.2: Import Valid JSON
**Steps:**
1. Export a workflow
2. Click "新規"
3. Click "インポート"
4. Select the exported JSON file

**Expected Results:**
- ✅ File picker opens
- ✅ Workflow imports successfully
- ✅ Success message shown
- ✅ Canvas shows imported workflow

### Test 6.3: Import Invalid JSON
**Steps:**
1. Create text file with invalid JSON
2. Click "インポート"
3. Select invalid file

**Expected Results:**
- ✅ Error message shown
- ✅ No changes to canvas
- ✅ User-friendly error text

### Test 6.4: Import with Unsaved Changes
**Steps:**
1. Create workflow without saving
2. Click "インポート"
3. Select JSON file

**Expected Results:**
- ✅ Confirmation dialog appears
- ✅ Can proceed or cancel
- ✅ If cancel, no import

---

## Test Suite 7: Validation and Error Handling

### Test 7.1: Name Validation
**Test Cases:**
- Empty name: ❌
- 1 character: ❌
- 2 characters: ✅
- 100 characters: ✅
- 101 characters: ❌

### Test 7.2: Description Validation
**Test Cases:**
- Empty: ✅ (optional)
- 500 characters: ✅
- 501 characters: ❌

### Test 7.3: LocalStorage Full
**Steps:**
1. Fill localStorage to limit
2. Try to save workflow

**Expected Results:**
- ✅ Error caught and handled
- ✅ User-friendly message

### Test 7.4: Corrupted Storage Data
**Steps:**
1. Manually corrupt localStorage data
2. Try to load workflows

**Expected Results:**
- ✅ Error handled gracefully
- ✅ Returns empty array
- ✅ Console shows error

---

## Test Suite 8: UI/UX Testing

### Test 8.1: Unsaved Changes Indicator
**Steps:**
1. Load workflow
2. Add a node
3. Observe toolbar

**Expected Results:**
- ✅ Orange dot (●) appears
- ✅ Dot pulses/animates
- ✅ Disappears after save

### Test 8.2: Workflow Count Badge
**Steps:**
1. Save 3 workflows
2. Check "読み込み" button

**Expected Results:**
- ✅ Badge shows "3"
- ✅ Badge color matches theme
- ✅ Updates when workflow deleted

### Test 8.3: Modal Animations
**Steps:**
1. Open any modal
2. Close modal
3. Observe transitions

**Expected Results:**
- ✅ Fade-in overlay
- ✅ Slide-up content
- ✅ Smooth transitions

### Test 8.4: Keyboard Navigation
**Steps:**
1. Open save dialog
2. Press Tab to navigate
3. Press Escape to close

**Expected Results:**
- ✅ Tab moves between inputs
- ✅ Escape closes dialog
- ✅ Enter submits form

### Test 8.5: Responsive Design (Mobile)
**Steps:**
1. Resize browser to mobile width (375px)
2. Test all dialogs and modals

**Expected Results:**
- ✅ Dialogs fit screen
- ✅ Buttons stack vertically
- ✅ Text remains readable
- ✅ Touch targets adequate

---

## Test Suite 9: Edge Cases

### Test 9.1: Special Characters in Name
**Test Cases:**
- Japanese: "購買申請ワークフロー" ✅
- Emoji: "🔥 Workflow" ✅
- Symbols: "Test@#$%" ✅
- Line breaks: Trimmed ✅

### Test 9.2: Very Long Description
**Steps:**
1. Enter 500 character description
2. Save workflow
3. Load workflow
4. View in list

**Expected Results:**
- ✅ Full description saved
- ✅ Truncated in list view
- ✅ Full text in edit dialog

### Test 9.3: Rapid Save/Load
**Steps:**
1. Save workflow
2. Immediately load another
3. Immediately save again
4. Repeat 5 times

**Expected Results:**
- ✅ No race conditions
- ✅ All operations complete
- ✅ Data integrity maintained

### Test 9.4: Multiple Browser Tabs
**Steps:**
1. Open application in 2 tabs
2. Save in Tab 1
3. Load list in Tab 2

**Expected Results:**
- ⚠️ Tab 2 needs refresh to see changes
- ✅ No data corruption
- ✅ LocalStorage shared correctly

### Test 9.5: Browser Storage Cleared
**Steps:**
1. Save workflows
2. Clear browser storage
3. Reload application

**Expected Results:**
- ✅ Application loads
- ✅ No workflows shown
- ✅ Can start fresh

---

## 🎯 Acceptance Criteria

All tests must pass for Phase 4 to be considered complete:

### Critical (Must Pass)
- ✅ Save workflow to LocalStorage
- ✅ Load workflow from LocalStorage
- ✅ Delete workflow
- ✅ JSON import/export
- ✅ Unsaved changes detection
- ✅ Data integrity

### Important (Should Pass)
- ✅ Edit workflow metadata
- ✅ Validation errors
- ✅ Confirmation dialogs
- ✅ Error handling

### Nice to Have (Could Pass)
- ✅ Animations
- ✅ Keyboard shortcuts
- ✅ Responsive design
- ✅ Empty states

---

## 📊 Test Results Template

```
Test Date: _____________
Tester: _____________
Browser: _____________
OS: _____________

| Test ID | Test Name | Status | Notes |
|---------|-----------|--------|-------|
| 1.1 | First Time Save | ✅ | |
| 1.2 | Update Existing | ✅ | |
| ... | ... | ... | ... |

Summary:
- Total Tests: __
- Passed: __
- Failed: __
- Blocked: __
```

---

## 🐛 Bug Report Template

```
**Test ID**: 
**Test Name**: 
**Browser**: 
**Steps to Reproduce**:
1. 
2. 
3. 

**Expected Result**:

**Actual Result**:

**Screenshots**: (if applicable)

**Console Errors**: (if any)
```

---

**Testing Status**: Ready for QA
**Phase**: 4 (Complete)
**Last Updated**: 2025-02-02
