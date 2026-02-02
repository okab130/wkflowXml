# Phase 2 Manual Testing Guide

## 🎯 Testing Overview
This guide provides step-by-step instructions for manually testing Phase 2 features.

**Server**: http://localhost:5176/  
**Duration**: ~15-20 minutes  
**Prerequisites**: Development server running

## 📋 Test Scenarios

### 1. Assignee Management - Add New Assignee

#### Test 1.1: Add Valid Assignee
**Steps**:
1. Open http://localhost:5176/ in browser
2. Scroll down in left sidebar to "担当者管理" section
3. Click "追加" button (blue button with + icon)
4. Fill in the form:
   - 名前: `山田太郎`
   - メールアドレス: `yamada@example.com`
   - 役職: `課長`
   - 部署: `開発部`
5. Click "追加" button

**Expected Result**:
- ✅ New assignee appears in the list below
- ✅ Form closes and resets
- ✅ Count shows "4名の担当者が登録されています"

#### Test 1.2: Add Invalid Email
**Steps**:
1. Click "追加" button again
2. Fill in:
   - 名前: `田中花子`
   - メールアドレス: `invalid-email` (invalid format)
3. Click "追加" button

**Expected Result**:
- ✅ Red error message appears: "有効なメールアドレスを入力してください"
- ✅ Form does not submit
- ✅ Email field has red border

#### Test 1.3: Empty Required Fields
**Steps**:
1. Clear all fields in the form
2. Click "追加" button

**Expected Result**:
- ✅ Error messages appear for both fields:
  - "名前は必須です"
  - "メールアドレスは必須です"
- ✅ Form does not submit

### 2. Assignee Management - Edit Assignee

#### Test 2.1: Edit Existing Assignee
**Steps**:
1. Find an assignee in the list (e.g., "田中太郎")
2. Click the edit button (pencil icon) on the right
3. Modify the name to `田中太郎 (更新)`
4. Change role to `部長代理`
5. Click "保存" button

**Expected Result**:
- ✅ Inline form appears with current values
- ✅ After save, assignee info updates in the list
- ✅ Form closes and shows updated info

#### Test 2.2: Cancel Edit
**Steps**:
1. Click edit button on any assignee
2. Make some changes to the form
3. Click "キャンセル" button

**Expected Result**:
- ✅ Form closes without saving changes
- ✅ Original data remains unchanged

### 3. Assignee Management - Delete Assignee

#### Test 3.1: Delete Unassigned Assignee
**Steps**:
1. Add a new test assignee (if needed)
2. Click the delete button (trash icon) on the right
3. Confirm deletion in the dialog

**Expected Result**:
- ✅ Confirmation dialog appears
- ✅ After confirmation, assignee is removed from list
- ✅ Count decreases by 1

#### Test 3.2: Try to Delete Assigned Assignee
**Steps**:
1. Drag an "承認ノード" to the canvas
2. Select the node and assign "田中太郎" from the right sidebar
3. Try to delete "田中太郎" using the delete button

**Expected Result**:
- ✅ Alert appears: "田中太郎は承認ノードに割り当てられているため削除できません。先にノードから削除してください。"
- ✅ Assignee is NOT deleted
- ✅ Assignment remains intact

### 4. Condition Editing

#### Test 4.1: Add Condition to ConditionNode
**Steps**:
1. Drag a "条件分岐" node to the canvas
2. Click on the condition node to select it
3. In the right sidebar, find "条件式" field
4. Enter: `amount > 10000`
5. Click outside the field

**Expected Result**:
- ✅ Right sidebar shows condition input field
- ✅ Condition is saved to the node
- ✅ Helpful tooltip is visible below the field

#### Test 4.2: Create Edge from ConditionNode
**Steps**:
1. With the condition node still having a condition
2. Drag a connection from the condition node to another node
3. Observe the edge

**Expected Result**:
- ✅ Edge is created successfully
- ✅ Edge displays label with condition: `amount > 10000`
- ✅ Label is positioned at the edge midpoint
- ✅ Label has white background with border

#### Test 4.3: Edge Without Condition
**Steps**:
1. Create a new condition node (no condition set)
2. Create an edge from it to another node

**Expected Result**:
- ✅ Edge displays label: `条件未設定`
- ✅ Label styling is consistent

### 5. Integration Testing

#### Test 5.1: Complete Workflow
**Steps**:
1. Clear canvas (refresh page)
2. Create a workflow:
   - Add "開始ノード"
   - Add "承認ノード" and assign 2 assignees
   - Add "条件分岐" with condition `approved === true`
   - Add two "終了ノード"
   - Connect: Start → Approval → Condition → End (both branches)
3. Verify all connections work
4. Check that condition labels appear on edges

**Expected Result**:
- ✅ All nodes can be added and connected
- ✅ Assignee assignment works
- ✅ Condition editing works
- ✅ Edge labels display correctly
- ✅ Node selection and property editing work

#### Test 5.2: Assignee Workflow
**Steps**:
1. Add 2 new assignees
2. Create an approval node
3. Assign both new assignees to the node
4. Try to delete one of the assigned assignees
5. Unassign the assignee from the node
6. Try to delete again

**Expected Result**:
- ✅ First delete attempt is blocked
- ✅ After unassigning, deletion succeeds
- ✅ Node no longer shows the deleted assignee

### 6. UI/UX Testing

#### Test 6.1: Visual Feedback
**Steps**:
1. Hover over assignee list items
2. Hover over action buttons (edit, delete)
3. Hover over form buttons

**Expected Result**:
- ✅ Hover effects work smoothly
- ✅ Colors change appropriately
- ✅ Cursor changes to pointer on interactive elements

#### Test 6.2: Form Validation Feedback
**Steps**:
1. Open add assignee form
2. Type invalid email, then click outside
3. Clear name field, then click outside

**Expected Result**:
- ✅ Real-time validation shows errors
- ✅ Error messages are clear and helpful
- ✅ Red border appears on invalid fields

#### Test 6.3: Empty States
**Steps**:
1. Delete all assignees (if possible)
2. Observe the empty state message

**Expected Result**:
- ✅ Helpful empty state message appears
- ✅ Icon and text are visible
- ✅ "追加" button still accessible

### 7. Edge Cases

#### Test 7.1: Long Names/Content
**Steps**:
1. Add assignee with very long name (50+ characters)
2. Add very long department name
3. Add long condition expression

**Expected Result**:
- ✅ Text wraps or truncates appropriately
- ✅ Layout doesn't break
- ✅ Still readable

#### Test 7.2: Special Characters
**Steps**:
1. Add assignee with special characters in name: `田中 (太郎)`
2. Add email with + symbol: `test+user@example.com`
3. Add condition with operators: `(a > 10 && b < 20) || c === 'test'`

**Expected Result**:
- ✅ Special characters are handled correctly
- ✅ Data saves and displays properly
- ✅ No JavaScript errors in console

#### Test 7.3: Rapid Actions
**Steps**:
1. Quickly add multiple assignees
2. Quickly edit and save
3. Rapidly connect multiple nodes

**Expected Result**:
- ✅ No race conditions
- ✅ All actions complete successfully
- ✅ State remains consistent

## 🐛 Bug Reporting

If you find any issues during testing, please report with:
- **Browser**: Chrome/Firefox/Edge/Safari + version
- **Steps to Reproduce**: Exact steps taken
- **Expected Result**: What should happen
- **Actual Result**: What actually happened
- **Console Errors**: Any errors in browser console
- **Screenshots**: If applicable

## ✅ Test Completion Checklist

- [ ] All assignee CRUD operations work
- [ ] Form validation works correctly
- [ ] Delete protection works
- [ ] Condition editing works
- [ ] Edge labels display correctly
- [ ] No console errors
- [ ] UI is responsive and smooth
- [ ] All edge cases handled

## 📊 Test Results Summary

**Date**: ___________  
**Tester**: ___________  
**Browser**: ___________  

**Results**:
- Tests Passed: ___ / 20
- Tests Failed: ___ / 20
- Critical Issues: ___
- Minor Issues: ___

**Overall Status**: ⏳ PENDING / ✅ PASSED / ❌ FAILED

**Notes**:
___________________________________________
___________________________________________
___________________________________________
