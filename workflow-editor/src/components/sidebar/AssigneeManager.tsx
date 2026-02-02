/**
 * Assignee Manager Component
 * Full CRUD operations for managing assignees
 */

import { useState } from 'react';
import { FiUserPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { useWorkflowStore } from '../../store/workflowStore';
import { v4 as uuidv4 } from 'uuid';
import type { Assignee } from '../../types';

interface AssigneeFormData {
  name: string;
  email: string;
  role: string;
  department: string;
}

const emptyForm: AssigneeFormData = {
  name: '',
  email: '',
  role: '',
  department: '',
};

const AssigneeManager = () => {
  const { assignees, addAssignee, updateAssignee, deleteAssignee, nodes } = useWorkflowStore();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<AssigneeFormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<AssigneeFormData>>({});

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<AssigneeFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = '名前は必須です';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスは必須です';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle add new assignee
  const handleAddNew = () => {
    if (!validateForm()) return;

    const newAssignee: Assignee = {
      id: uuidv4(),
      ...formData,
    };

    addAssignee(newAssignee);
    setFormData(emptyForm);
    setIsAddingNew(false);
    setErrors({});
  };

  // Handle edit assignee
  const handleEdit = (assignee: Assignee) => {
    setEditingId(assignee.id);
    setFormData({
      name: assignee.name,
      email: assignee.email,
      role: assignee.role || '',
      department: assignee.department || '',
    });
    setErrors({});
  };

  // Handle save edit
  const handleSaveEdit = () => {
    if (!validateForm() || !editingId) return;

    updateAssignee(editingId, formData);
    setEditingId(null);
    setFormData(emptyForm);
    setErrors({});
  };

  // Handle cancel edit/add
  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingId(null);
    setFormData(emptyForm);
    setErrors({});
  };

  // Handle delete assignee
  const handleDelete = (assignee: Assignee) => {
    // Check if assignee is assigned to any nodes
    const isAssigned = nodes.some(
      (node) =>
        node.data.type === 'approvalNode' &&
        node.data.assignees.some((a) => a.id === assignee.id)
    );

    if (isAssigned) {
      alert(
        `${assignee.name}は承認ノードに割り当てられているため削除できません。\n先にノードから削除してください。`
      );
      return;
    }

    if (
      confirm(
        `${assignee.name}を削除してもよろしいですか？\nこの操作は取り消せません。`
      )
    ) {
      deleteAssignee(assignee.id);
    }
  };

  // Render form fields
  const renderForm = () => (
    <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
      <div style={{ marginBottom: '12px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '11px',
            fontWeight: 600,
            color: '#475569',
            marginBottom: '4px',
          }}
        >
          名前 <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="田中太郎"
          style={{
            width: '100%',
            padding: '6px 10px',
            border: errors.name ? '1px solid #ef4444' : '1px solid #e2e8f0',
            borderRadius: '4px',
            fontSize: '13px',
            outline: 'none',
          }}
          onFocus={(e) => {
            if (!errors.name) e.target.style.borderColor = '#3b82f6';
          }}
          onBlur={(e) => {
            if (!errors.name) e.target.style.borderColor = '#e2e8f0';
          }}
        />
        {errors.name && (
          <div style={{ fontSize: '10px', color: '#ef4444', marginTop: '2px' }}>
            {errors.name}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '11px',
            fontWeight: 600,
            color: '#475569',
            marginBottom: '4px',
          }}
        >
          メールアドレス <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="tanaka@example.com"
          style={{
            width: '100%',
            padding: '6px 10px',
            border: errors.email ? '1px solid #ef4444' : '1px solid #e2e8f0',
            borderRadius: '4px',
            fontSize: '13px',
            outline: 'none',
          }}
          onFocus={(e) => {
            if (!errors.email) e.target.style.borderColor = '#3b82f6';
          }}
          onBlur={(e) => {
            if (!errors.email) e.target.style.borderColor = '#e2e8f0';
          }}
        />
        {errors.email && (
          <div style={{ fontSize: '10px', color: '#ef4444', marginTop: '2px' }}>
            {errors.email}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '11px',
            fontWeight: 600,
            color: '#475569',
            marginBottom: '4px',
          }}
        >
          役職
        </label>
        <input
          type="text"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          placeholder="部長"
          style={{
            width: '100%',
            padding: '6px 10px',
            border: '1px solid #e2e8f0',
            borderRadius: '4px',
            fontSize: '13px',
            outline: 'none',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
          onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '11px',
            fontWeight: 600,
            color: '#475569',
            marginBottom: '4px',
          }}
        >
          部署
        </label>
        <input
          type="text"
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          placeholder="営業部"
          style={{
            width: '100%',
            padding: '6px 10px',
            border: '1px solid #e2e8f0',
            borderRadius: '4px',
            fontSize: '13px',
            outline: 'none',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
          onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
        />
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <button
          onClick={editingId ? handleSaveEdit : handleAddNew}
          style={{
            flex: 1,
            padding: '8px 12px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#2563eb')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#3b82f6')}
        >
          <FiCheck size={14} />
          {editingId ? '保存' : '追加'}
        </button>
        <button
          onClick={handleCancel}
          style={{
            flex: 1,
            padding: '8px 12px',
            background: '#e2e8f0',
            color: '#475569',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#cbd5e1')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#e2e8f0')}
        >
          <FiX size={14} />
          キャンセル
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ marginTop: '24px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
        }}
      >
        <h4
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#1e293b',
            margin: 0,
          }}
        >
          担当者管理
        </h4>
        {!isAddingNew && !editingId && (
          <button
            onClick={() => setIsAddingNew(true)}
            style={{
              padding: '6px 12px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#2563eb')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#3b82f6')}
          >
            <FiUserPlus size={12} />
            追加
          </button>
        )}
      </div>

      {/* Add New Form */}
      {isAddingNew && renderForm()}

      {/* Assignee List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
        {assignees.length === 0 ? (
          <div
            style={{
              padding: '16px',
              textAlign: 'center',
              background: '#f8fafc',
              border: '1px dashed #cbd5e1',
              borderRadius: '8px',
              color: '#64748b',
              fontSize: '12px',
            }}
          >
            <FiAlertCircle
              size={24}
              style={{ marginBottom: '8px', display: 'block', margin: '0 auto 8px' }}
            />
            担当者が登録されていません
          </div>
        ) : (
          assignees.map((assignee) => (
            <div key={assignee.id}>
              {editingId === assignee.id ? (
                renderForm()
              ) : (
                <div
                  style={{
                    padding: '12px',
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: '13px',
                          fontWeight: 600,
                          color: '#1e293b',
                          marginBottom: '4px',
                        }}
                      >
                        {assignee.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '2px' }}>
                        {assignee.email}
                      </div>
                      {(assignee.role || assignee.department) && (
                        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                          {assignee.role && <span>{assignee.role}</span>}
                          {assignee.role && assignee.department && <span> • </span>}
                          {assignee.department && <span>{assignee.department}</span>}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => handleEdit(assignee)}
                        style={{
                          padding: '6px',
                          background: 'transparent',
                          color: '#64748b',
                          border: '1px solid #e2e8f0',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#eff6ff';
                          e.currentTarget.style.color = '#3b82f6';
                          e.currentTarget.style.borderColor = '#3b82f6';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = '#64748b';
                          e.currentTarget.style.borderColor = '#e2e8f0';
                        }}
                        title="編集"
                      >
                        <FiEdit2 size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(assignee)}
                        style={{
                          padding: '6px',
                          background: 'transparent',
                          color: '#64748b',
                          border: '1px solid #e2e8f0',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#fef2f2';
                          e.currentTarget.style.color = '#ef4444';
                          e.currentTarget.style.borderColor = '#ef4444';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = '#64748b';
                          e.currentTarget.style.borderColor = '#e2e8f0';
                        }}
                        title="削除"
                      >
                        <FiTrash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Info Message */}
      {assignees.length > 0 && (
        <div
          style={{
            marginTop: '12px',
            padding: '10px',
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '6px',
            fontSize: '11px',
            color: '#1e40af',
          }}
        >
          <strong>{assignees.length}名</strong>の担当者が登録されています
        </div>
      )}
    </div>
  );
};

export default AssigneeManager;
