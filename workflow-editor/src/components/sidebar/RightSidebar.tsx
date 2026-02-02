/**
 * Right Sidebar with Property Panel
 */

import { useState, useEffect } from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { ApprovalRule, NodeType } from '../../types';

const RightSidebar = () => {
  const { selectedNode, updateNode, assignees } = useWorkflowStore();
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (selectedNode) {
      setLabel(selectedNode.data.label || '');
      setDescription(selectedNode.data.description || '');
    }
  }, [selectedNode]);

  const handleLabelChange = (newLabel: string) => {
    setLabel(newLabel);
    if (selectedNode) {
      updateNode(selectedNode.id, { ...selectedNode.data, label: newLabel });
    }
  };

  const handleDescriptionChange = (newDescription: string) => {
    setDescription(newDescription);
    if (selectedNode) {
      updateNode(selectedNode.id, { ...selectedNode.data, description: newDescription });
    }
  };

  const handleApprovalRuleChange = (rule: ApprovalRule) => {
    if (selectedNode && selectedNode.data.type === NodeType.APPROVAL) {
      updateNode(selectedNode.id, { ...selectedNode.data, approvalRule: rule });
    }
  };

  const handleAssigneeToggle = (assigneeId: string) => {
    if (selectedNode && selectedNode.data.type === NodeType.APPROVAL) {
      const currentAssignees = selectedNode.data.assignees || [];
      const isAssigned = currentAssignees.some((a) => a.id === assigneeId);
      const assignee = assignees.find((a) => a.id === assigneeId);

      if (!assignee) return;

      const newAssignees = isAssigned
        ? currentAssignees.filter((a) => a.id !== assigneeId)
        : [...currentAssignees, assignee];

      updateNode(selectedNode.id, { ...selectedNode.data, assignees: newAssignees });
    }
  };

  if (!selectedNode) {
    return (
      <div
        style={{
          width: '280px',
          background: 'white',
          borderLeft: '1px solid #e2e8f0',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <div style={{ textAlign: 'center', color: '#94a3b8' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📋</div>
          <div style={{ fontSize: '14px' }}>ノードを選択してください</div>
        </div>
      </div>
    );
  }

  const isApprovalNode = selectedNode.data.type === NodeType.APPROVAL;
  const currentAssignees = isApprovalNode && selectedNode.data.type === NodeType.APPROVAL ? selectedNode.data.assignees || [] : [];
  const currentRule = isApprovalNode && selectedNode.data.type === NodeType.APPROVAL ? selectedNode.data.approvalRule || ApprovalRule.ALL : null;

  return (
    <div
      style={{
        width: '280px',
        background: 'white',
        borderLeft: '1px solid #e2e8f0',
        padding: '20px',
        overflowY: 'auto',
        height: '100%',
      }}
    >
      <h3
        style={{
          fontSize: '16px',
          fontWeight: 600,
          marginBottom: '16px',
          color: '#1e293b',
        }}
      >
        プロパティ
      </h3>

      {/* Node Label */}
      <div style={{ marginBottom: '16px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: 600,
            color: '#475569',
            marginBottom: '6px',
          }}
        >
          ノード名
        </label>
        <input
          type="text"
          value={label}
          onChange={(e) => handleLabelChange(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            fontSize: '14px',
            outline: 'none',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
          onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
        />
      </div>

      {/* Node Description */}
      <div style={{ marginBottom: '16px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: 600,
            color: '#475569',
            marginBottom: '6px',
          }}
        >
          説明
        </label>
        <textarea
          value={description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          rows={3}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            fontSize: '14px',
            outline: 'none',
            resize: 'vertical',
            fontFamily: 'inherit',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
          onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
        />
      </div>

      {/* Approval Node specific properties */}
      {isApprovalNode && (
        <>
          {/* Approval Rule */}
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: '#475569',
                marginBottom: '8px',
              }}
            >
              承認ルール
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { value: ApprovalRule.ALL, label: '全員承認' },
                { value: ApprovalRule.ANY, label: '一人承認' },
                { value: ApprovalRule.MAJORITY, label: '過半数承認' },
              ].map((rule) => (
                <label
                  key={rule.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px',
                    background: currentRule === rule.value ? '#eff6ff' : 'white',
                    border: currentRule === rule.value ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  <input
                    type="radio"
                    name="approvalRule"
                    value={rule.value}
                    checked={currentRule === rule.value}
                    onChange={() => handleApprovalRuleChange(rule.value)}
                    style={{ marginRight: '8px' }}
                  />
                  {rule.label}
                </label>
              ))}
            </div>
          </div>

          {/* Assignees */}
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: '#475569',
                marginBottom: '8px',
              }}
            >
              担当者 ({currentAssignees.length}名)
            </label>
            {assignees.length === 0 ? (
              <div
                style={{
                  padding: '12px',
                  background: '#fef3c7',
                  border: '1px solid #fcd34d',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#92400e',
                }}
              >
                担当者が登録されていません
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {assignees.map((assignee) => {
                  const isAssigned = currentAssignees.some((a) => a.id === assignee.id);
                  return (
                    <label
                      key={assignee.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '8px',
                        background: isAssigned ? '#eff6ff' : 'white',
                        border: isAssigned ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isAssigned}
                        onChange={() => handleAssigneeToggle(assignee.id)}
                        style={{ marginRight: '8px' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600 }}>{assignee.name}</div>
                        {assignee.role && (
                          <div style={{ fontSize: '11px', color: '#64748b' }}>
                            {assignee.role}
                          </div>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* Node Type Info */}
      <div
        style={{
          marginTop: '24px',
          padding: '12px',
          background: '#f8fafc',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#64748b',
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: '4px' }}>ノードタイプ</div>
        <div>
          {selectedNode.data.type === NodeType.START && '開始ノード'}
          {selectedNode.data.type === NodeType.APPROVAL && '承認ノード'}
          {selectedNode.data.type === NodeType.CONDITION && '条件分岐'}
          {selectedNode.data.type === NodeType.END && '終了ノード'}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
