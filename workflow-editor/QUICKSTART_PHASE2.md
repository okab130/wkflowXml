# Phase 2 - Quick Start Guide

## 🎯 You Are Here

Phase 2 is **COMPLETE**! The assignee management system is fully implemented and ready for testing.

## 📂 What's New

### Components Created
```
src/components/sidebar/AssigneeManager.tsx  ← Full CRUD for assignees
src/components/edges/CustomEdge.tsx         ← Edge labels with conditions
```

### Components Enhanced
```
src/components/sidebar/LeftSidebar.tsx      ← Includes AssigneeManager
src/components/sidebar/RightSidebar.tsx     ← Condition editing UI
src/components/FlowCanvas.tsx               ← Custom edge integration
src/store/workflowStore.ts                  ← Initial mock data
```

## 🚀 Quick Test

### 1. Start the Server
```bash
cd C:\Users\user\gh\wkflowXml\workflow-editor
npm run dev
# Opens at http://localhost:5176/
```

### 2. Test Assignee CRUD
1. Open http://localhost:5176/
2. Scroll down left sidebar to "担当者管理"
3. Click "追加" to add a new assignee
4. Click edit icon (✏️) to edit
5. Click delete icon (🗑️) to delete

### 3. Test Condition Editing
1. Drag "条件分岐" node to canvas
2. Select it (click on it)
3. In right sidebar, enter a condition: `amount > 10000`
4. Create an edge from the condition node
5. See the condition label on the edge

## 📚 Documentation Files

| File | Purpose | When to Read |
|------|---------|--------------|
| **PHASE2_COMPLETE.md** | Quick summary | Start here ⭐ |
| **PHASE2_REPORT.md** | Technical details | Deep dive |
| **TESTING_GUIDE.md** | Test scenarios | Before testing |
| **IMPLEMENTATION_SUMMARY.md** | Overall project | Big picture |

## 🧪 Testing Status

- ✅ Build: PASSED
- ✅ TypeScript: No errors
- ⏳ Manual testing: **YOUR TURN!**

Follow **TESTING_GUIDE.md** for detailed test scenarios.

## 🐛 Known Issues

None! Build is clean with zero errors.

## 💡 Key Code Patterns

### Adding an Assignee
```typescript
import { useWorkflowStore } from '../../store/workflowStore';

const { addAssignee } = useWorkflowStore();

addAssignee({
  id: uuidv4(),
  name: '山田太郎',
  email: 'yamada@example.com',
  role: '課長',
  department: '開発部',
});
```

### Editing a Condition
```typescript
const { updateNode } = useWorkflowStore();

updateNode(nodeId, {
  ...node.data,
  condition: 'amount > 10000',
});
```

### Edge Labels
Edges automatically get labels from ConditionNode's condition property. No manual setup needed!

## 🎨 UI Components

### AssigneeManager
- Location: Left sidebar, below node palette
- Features: Add, Edit, Delete, View all
- Validation: Name and email required, email format checked

### Condition Editor
- Location: Right sidebar (when ConditionNode selected)
- Field: "条件式" input field
- Shows: Helpful tooltip about edge labels

### Edge Labels
- Appear automatically on edges from ConditionNode
- Position: Middle of edge
- Style: White background, bordered, shadow

## 🔧 Troubleshooting

### Server won't start
```bash
# Kill existing process
Get-Process | Where-Object { $_.ProcessName -eq "node" } | Stop-Process

# Restart
npm run dev
```

### TypeScript errors
```bash
# Rebuild
npm run build

# Should see: ✓ built in ~1.8s
```

### Changes not showing
- Hard refresh browser: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Check browser console for errors (F12)

## 📋 Pre-Phase 3 Checklist

Before starting Phase 3, verify:

- [ ] All Phase 2 tests pass (see TESTING_GUIDE.md)
- [ ] No console errors in browser
- [ ] Assignee CRUD works smoothly
- [ ] Condition editing works
- [ ] Edge labels display correctly
- [ ] Build is clean (`npm run build`)
- [ ] Documentation reviewed

## 🚦 Next Phase Preview

### Phase 3: BPMN XML Export (Next Up)

**Goal**: Convert workflow to BPMN 2.0 XML format

**Main Tasks**:
1. Create BPMN builder utility
2. Map React Flow nodes to BPMN elements
3. Generate XML structure
4. Add download button
5. XML preview modal

**Estimated Time**: 3-4 hours

**Key Files to Create**:
- `src/utils/bpmnBuilder.ts` - XML generation logic
- `src/components/ExportModal.tsx` - XML preview UI
- `src/components/toolbar/Toolbar.tsx` - Export button

## 💬 Questions?

### "Where do I start testing?"
Open **TESTING_GUIDE.md** and follow the test scenarios in order.

### "What if I find a bug?"
Document it in the TESTING_GUIDE.md results section with:
- Steps to reproduce
- Expected vs actual result
- Browser and console errors

### "Can I modify the code?"
Yes! The code is clean and well-documented. Key areas:
- Form validation: `AssigneeManager.tsx` lines 50-60
- Edge labels: `CustomEdge.tsx` entire file
- Condition UI: `RightSidebar.tsx` lines 180-220

### "How do I run tests?"
Manual testing only for now. Unit tests planned for Phase 5.

## 🎉 Success Criteria

Phase 2 is successful if:
- ✅ You can add/edit/delete assignees
- ✅ Validation works (try invalid email)
- ✅ Delete protection works (try deleting assigned user)
- ✅ Conditions can be edited
- ✅ Edge labels appear on connections
- ✅ No console errors
- ✅ UI is smooth and responsive

## 📞 Ready to Continue?

When Phase 2 testing is complete:
1. Update testing results in TESTING_GUIDE.md
2. Screenshot any UI issues
3. Document any edge cases found
4. Proceed to Phase 3 implementation

---

**Current Status**: ✅ Phase 2 Complete  
**Server**: http://localhost:5176/  
**Next**: Manual Testing → Phase 3

Good luck! 🚀
