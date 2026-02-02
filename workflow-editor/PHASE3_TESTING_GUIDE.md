# Phase 3 Testing Guide: BPMN XML Export

## Quick Start

```bash
cd C:\Users\user\gh\wkflowXml\workflow-editor
npm run dev
# Open http://localhost:5173/
```

---

## Test Cases

### ✅ Test 1: Basic Export

**Priority**: Critical  
**Time**: 2 minutes

**Steps**:
1. Add Start node to canvas
2. Add Approval node
3. Add End node
4. Connect Start → Approval → End
5. Click "エクスポート" button in toolbar

**Expected Results**:
- ✅ File downloads successfully
- ✅ Filename: `承認ワークフロー_[timestamp].bpmn`
- ✅ File contains XML starting with `<?xml version="1.0"`
- ✅ File contains `<startEvent>`, `<userTask>`, `<endEvent>`
- ✅ File contains 3 `<sequenceFlow>` elements

**Screenshot Locations**:
- Before: Canvas with 3 nodes
- After: Downloaded file in folder

---

### ✅ Test 2: XML Preview

**Priority**: Critical  
**Time**: 2 minutes

**Steps**:
1. Create workflow (Start → Application → End)
2. Click "プレビュー" button
3. Verify modal opens
4. Check syntax highlighting
5. Scroll through XML
6. Click "閉じる" to close

**Expected Results**:
- ✅ Modal opens with dark background
- ✅ XML is syntax highlighted (colors)
- ✅ Line numbers shown on left
- ✅ Can scroll through content
- ✅ File stats shown at bottom (bytes, lines)
- ✅ Modal closes when clicking "閉じる" or backdrop

**Visual Check**:
- XML keywords in blue/purple
- Attributes in yellow/orange
- Strings in green
- Tags in white/gray

---

### ✅ Test 3: Copy to Clipboard

**Priority**: High  
**Time**: 1 minute

**Steps**:
1. Open XML preview (Test 2)
2. Click "コピー" button
3. Wait for feedback (2 seconds)
4. Open text editor (Notepad)
5. Paste (Ctrl+V)

**Expected Results**:
- ✅ Button changes to "コピーしました" with checkmark
- ✅ Button reverts to "コピー" after 2 seconds
- ✅ XML is copied to clipboard
- ✅ Pasted XML is complete and valid

---

### ✅ Test 4: Validation - Missing Start

**Priority**: Critical  
**Time**: 1 minute

**Steps**:
1. Clear canvas (refresh page)
2. Add only End node (no Start)
3. Click validation button (red icon)
4. Read error messages

**Expected Results**:
- ✅ Validation button shows red background
- ✅ Validation panel opens on right
- ✅ Error section shows: "ワークフローには少なくとも1つの開始ノードが必要です"
- ✅ Export button still works (with warning)

---

### ✅ Test 5: Validation - Success

**Priority**: High  
**Time**: 2 minutes

**Steps**:
1. Create complete workflow:
   - Start → Application → Approval → End
2. Assign "田中太郎" to Application
3. Assign "佐藤花子" to Approval
4. Click validation button

**Expected Results**:
- ✅ Validation button shows green background
- ✅ Validation panel shows "✅ 検証成功"
- ✅ Message: "ワークフローは正常です。エラーや警告はありません。"
- ✅ No errors listed
- ✅ No warnings listed

---

### ✅ Test 6: Validation - Warnings

**Priority**: Medium  
**Time**: 2 minutes

**Steps**:
1. Create workflow: Start → Application (no outgoing edge)
2. Click validation button

**Expected Results**:
- ✅ Validation button shows yellow/orange background
- ✅ Warning section appears
- ✅ Warning: "ノード ... には出力エッジがありません"
- ✅ Export still works

---

### ✅ Test 7: Workflow Name Customization

**Priority**: Medium  
**Time**: 1 minute

**Steps**:
1. Click on workflow name input in toolbar
2. Change to "経費申請フロー"
3. Export BPMN
4. Check downloaded filename

**Expected Results**:
- ✅ Name changes in toolbar
- ✅ Filename includes "経費申請フロー"
- ✅ BPMN XML contains `name="経費申請フロー"`
- ✅ No special characters cause issues

---

### ✅ Test 8: Lane Generation

**Priority**: High  
**Time**: 3 minutes

**Steps**:
1. Create workflow with Application and Approval nodes
2. Assign "田中太郎 (部長)" to Application
3. Assign "佐藤花子 (課長)" to Approval
4. Export BPMN
5. Open file in text editor
6. Search for `<laneSet>`

**Expected Results**:
- ✅ `<laneSet id="LaneSet_1">` exists
- ✅ Two `<lane>` elements
- ✅ Lane 1: name="田中太郎 (部長)"
- ✅ Lane 2: name="佐藤花子 (課長)"
- ✅ Each lane contains `<flowNodeRef>` for correct node

**XML to Check**:
```xml
<laneSet id="LaneSet_1">
  <lane id="Lane_1" name="田中太郎 (部長)">
    <flowNodeRef>applicationNode-...</flowNodeRef>
  </lane>
  <lane id="Lane_2" name="佐藤花子 (課長)">
    <flowNodeRef>approvalNode-...</flowNodeRef>
  </lane>
</laneSet>
```

---

### ✅ Test 9: Condition Node Export

**Priority**: High  
**Time**: 3 minutes

**Steps**:
1. Create workflow: Start → Condition → [Approval, End]
2. Select Condition node
3. Set condition in right sidebar: "amount > 10000"
4. Add edges from condition (one to Approval, one to End)
5. Export BPMN
6. Open in text editor

**Expected Results**:
- ✅ `<exclusiveGateway>` element exists
- ✅ Gateway has `<documentation>amount > 10000</documentation>`
- ✅ Sequence flows from gateway exist
- ✅ Flows have `<conditionExpression>` elements

**XML to Check**:
```xml
<exclusiveGateway id="..." name="条件分岐">
  <documentation>amount &gt; 10000</documentation>
</exclusiveGateway>

<sequenceFlow id="..." sourceRef="[condition-id]" targetRef="[approval-id]">
  <conditionExpression xsi:type="tFormalExpression">...</conditionExpression>
</sequenceFlow>
```

---

### ✅ Test 10: Download from Preview

**Priority**: Medium  
**Time**: 1 minute

**Steps**:
1. Create any workflow
2. Click "プレビュー"
3. In modal, click "ダウンロード" button
4. Check downloads folder

**Expected Results**:
- ✅ File downloads
- ✅ Same result as toolbar export
- ✅ Modal stays open after download
- ✅ Can download multiple times

---

### ✅ Test 11: All Node Types

**Priority**: High  
**Time**: 5 minutes

**Steps**:
1. Create workflow with ALL node types:
   - Start
   - Application
   - Approval
   - Condition
   - End
2. Connect in sequence
3. Export and check XML

**Expected Results**:
- ✅ `<startEvent>` for Start node
- ✅ `<userTask implementation="application">` for Application
- ✅ `<userTask implementation="approval">` for Approval
- ✅ `<exclusiveGateway>` for Condition
- ✅ `<endEvent>` for End node
- ✅ All connected with `<sequenceFlow>`

---

### ✅ Test 12: Empty Workflow

**Priority**: Low  
**Time**: 30 seconds

**Steps**:
1. Refresh page (empty canvas)
2. Try to export (button disabled)
3. Try to preview (button disabled)
4. Click validation button

**Expected Results**:
- ✅ Export button is disabled (gray, not clickable)
- ✅ Preview button is disabled
- ✅ Validation button works
- ✅ Shows errors: missing start and end

---

### ✅ Test 13: Large Workflow

**Priority**: Medium  
**Time**: 5 minutes

**Steps**:
1. Create workflow with 20+ nodes
2. Connect them all
3. Export and preview
4. Check performance

**Expected Results**:
- ✅ Export completes in <2 seconds
- ✅ Preview opens in <1 second
- ✅ Syntax highlighting renders smoothly
- ✅ No lag when scrolling
- ✅ File size shown correctly

---

### ✅ Test 14: Special Characters

**Priority**: Medium  
**Time**: 2 minutes

**Steps**:
1. Create workflow
2. Set workflow name: "テスト<>&"フロー"
3. Add node with label: "承認 <条件>"
4. Export BPMN
5. Open in text editor

**Expected Results**:
- ✅ Special characters escaped in XML:
  - `<` → `&lt;`
  - `>` → `&gt;`
  - `&` → `&amp;`
  - `"` → `&quot;`
- ✅ No XML parsing errors
- ✅ File is valid XML

**Check in XML**:
```xml
<process name="テスト&lt;&gt;&amp;&quot;フロー">
  <userTask name="承認 &lt;条件&gt;" />
</process>
```

---

### ✅ Test 15: Multiple Assignees

**Priority**: High  
**Time**: 3 minutes

**Steps**:
1. Create Approval node
2. Assign 3 people:
   - 田中太郎
   - 佐藤花子
   - 鈴木一郎
3. Set approval rule to "ALL"
4. Export BPMN
5. Check XML

**Expected Results**:
- ✅ Single `<userTask>` element
- ✅ Three `<performer>` child elements
- ✅ Each performer has `<resourceRef>` with assignee ID
- ✅ All three lanes created

**XML Structure**:
```xml
<userTask id="..." name="承認">
  <performer>
    <resourceRef>田中太郎-id</resourceRef>
  </performer>
  <performer>
    <resourceRef>佐藤花子-id</resourceRef>
  </performer>
  <performer>
    <resourceRef>鈴木一郎-id</resourceRef>
  </performer>
</userTask>
```

---

### ✅ Test 16: Responsive Design

**Priority**: Low  
**Time**: 2 minutes

**Steps**:
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Set to "iPhone 12" (390x844)
4. Test toolbar buttons
5. Open preview modal

**Expected Results**:
- ✅ Toolbar stacks vertically or buttons shrink
- ✅ Workflow name input adjusts width
- ✅ All buttons remain clickable
- ✅ Preview modal fits on screen
- ✅ XML scrollable
- ✅ Footer buttons accessible

---

### ✅ Test 17: BPMN Namespace Validation

**Priority**: Medium  
**Time**: 2 minutes

**Steps**:
1. Export any workflow
2. Open in text editor
3. Check `<definitions>` element attributes

**Expected Results**:
- ✅ Contains: `xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"`
- ✅ Contains: `xmlns:bpmndi="..."`
- ✅ Contains: `xmlns:xsi="..."`
- ✅ Contains: `targetNamespace="http://bpmn.io/schema/bpmn"`
- ✅ Contains: `exporter="Workflow Visual Editor"`
- ✅ Contains: `exporterVersion="1.0"`

---

### ✅ Test 18: File Size Stats

**Priority**: Low  
**Time**: 1 minute

**Steps**:
1. Create small workflow (3 nodes)
2. Preview XML
3. Check footer stats

**Expected Results**:
- ✅ File size shown in bytes (e.g., "2,345 bytes")
- ✅ Line count shown (e.g., "45 lines")
- ✅ Numbers are localized with commas
- ✅ Stats match actual XML

---

### ✅ Test 19: Keyboard Navigation

**Priority**: Low  
**Time**: 2 minutes

**Steps**:
1. Click in workflow name input
2. Press Tab repeatedly
3. Navigate through all toolbar buttons
4. Press Enter on Export button

**Expected Results**:
- ✅ Tab cycles through all interactive elements
- ✅ Focus visible (outline/highlight)
- ✅ Enter key activates buttons
- ✅ Validation panel can be closed with click
- ✅ Preview modal closes with X button click

---

### ✅ Test 20: Validation Panel Toggle

**Priority**: Medium  
**Time**: 1 minute

**Steps**:
1. Click validation button (opens panel)
2. Click validation button again
3. Click X button in panel
4. Click validation button to reopen

**Expected Results**:
- ✅ Panel toggles on/off
- ✅ State persists (doesn't re-validate)
- ✅ X button closes panel
- ✅ Validation button shows correct status

---

## Test Summary Template

```
Date: ___________
Tester: _________

| Test # | Test Name | Pass/Fail | Notes |
|--------|-----------|-----------|-------|
| 1 | Basic Export | ⬜ | |
| 2 | XML Preview | ⬜ | |
| 3 | Copy to Clipboard | ⬜ | |
| 4 | Validation - Missing Start | ⬜ | |
| 5 | Validation - Success | ⬜ | |
| 6 | Validation - Warnings | ⬜ | |
| 7 | Workflow Name | ⬜ | |
| 8 | Lane Generation | ⬜ | |
| 9 | Condition Node | ⬜ | |
| 10 | Download from Preview | ⬜ | |
| 11 | All Node Types | ⬜ | |
| 12 | Empty Workflow | ⬜ | |
| 13 | Large Workflow | ⬜ | |
| 14 | Special Characters | ⬜ | |
| 15 | Multiple Assignees | ⬜ | |
| 16 | Responsive Design | ⬜ | |
| 17 | BPMN Namespace | ⬜ | |
| 18 | File Size Stats | ⬜ | |
| 19 | Keyboard Navigation | ⬜ | |
| 20 | Validation Panel | ⬜ | |

Overall: _____ / 20 passed
```

---

## Bug Reporting Template

**Bug Title**: [Short description]

**Severity**: Critical / High / Medium / Low

**Test Case**: Test #X - [Test name]

**Steps to Reproduce**:
1. 
2. 
3. 

**Expected Result**:


**Actual Result**:


**Screenshots**:
[Attach if applicable]

**Environment**:
- Browser: 
- OS: 
- Screen size: 

---

## Known Limitations (Not Bugs)

1. **Save button disabled**: Feature coming in Phase 4
2. **No BPMN import**: Feature not planned yet
3. **No diagram rendering**: Only XML export, no visual diagram in BPMN
4. **Large files (>10 MB)**: May be slow to preview

---

## Testing Tips

### Quick Workflow Templates

**Template 1: Simple Approval**
```
Start → Application → Approval → End
```

**Template 2: Conditional**
```
Start → Application → Condition → [Approval, Rejection] → End
```

**Template 3: Multi-stage**
```
Start → Application → Approval1 → Approval2 → Approval3 → End
```

### XML Validation Tools

**Online Validators**:
- https://www.xmlvalidation.com/
- https://jsonformatter.org/xml-validator

**BPMN Viewers**:
- https://bpmn.io/ (upload .bpmn file)
- Camunda Modeler (desktop app)

### Browser DevTools

**Check Console**: F12 → Console tab
- Should have no errors
- Warnings acceptable if explained

**Check Network**: F12 → Network tab
- File download should show in list
- Status: 200 OK

**Check Elements**: F12 → Elements tab
- Verify modal structure
- Check CSS styles

---

## Automated Testing (Future)

### Unit Tests (Jest)

```typescript
// xmlBuilder.test.ts
test('escapes XML special characters', () => {
  expect(escapeXml('<test>')).toBe('&lt;test&gt;');
});

// bpmnConverter.test.ts
test('converts start node to startEvent', () => {
  const xml = convertNodeToBpmnElement(startNode);
  expect(xml).toContain('<startEvent');
});
```

### E2E Tests (Playwright)

```typescript
// export.spec.ts
test('exports BPMN file', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.click('[data-testid="add-start-node"]');
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('button:has-text("エクスポート")')
  ]);
  expect(download.suggestedFilename()).toMatch(/\.bpmn$/);
});
```

---

**Testing Estimated Time**: 60-90 minutes (all tests)  
**Priority Tests Time**: 30 minutes (tests 1-11)  
**Critical Tests Time**: 15 minutes (tests 1, 2, 4, 5, 8, 9)
