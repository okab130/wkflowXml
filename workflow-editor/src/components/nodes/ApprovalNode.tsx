/**
 * Approval Node component
 */

import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { ApprovalNodeData } from '../../types';

const ApprovalNode = ({ data, selected }: NodeProps<ApprovalNodeData>) => {
  const assigneeCount = data.assignees?.length || 0;
  
  return (
    <div
      style={{
        padding: '16px 20px',
        borderRadius: '12px',
        background: 'white',
        border: selected ? '3px solid #3b82f6' : '2px solid #60a5fa',
        color: '#1e40af',
        minWidth: '160px',
        boxShadow: selected
          ? '0 4px 12px rgba(59, 130, 246, 0.4)'
          : '0 2px 8px rgba(0, 0, 0, 0.15)',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
      }}
    >
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Top}
        id="approval-input"
        style={{
          background: '#3b82f6',
          width: '12px',
          height: '12px',
          border: '2px solid white',
        }}
      />
      
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '28px', marginBottom: '8px' }}>📝</div>
        <div style={{ fontWeight: 600, marginBottom: '4px' }}>
          {data.label || '承認'}
        </div>
        
        {assigneeCount > 0 && (
          <div style={{ 
            fontSize: '12px', 
            color: '#64748b',
            marginTop: '8px',
            padding: '4px 8px',
            background: '#f1f5f9',
            borderRadius: '4px',
          }}>
            担当者: {assigneeCount}名
          </div>
        )}
        
        {data.approvalRule && (
          <div style={{ 
            fontSize: '11px', 
            color: '#94a3b8',
            marginTop: '4px',
          }}>
            {data.approvalRule === 'all' ? '全員承認' : 
             data.approvalRule === 'any' ? '一人承認' : '過半数承認'}
          </div>
        )}
      </div>

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="approval-output"
        style={{
          background: '#3b82f6',
          width: '12px',
          height: '12px',
          border: '2px solid white',
        }}
      />
    </div>
  );
};

export default memo(ApprovalNode);
