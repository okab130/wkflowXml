/**
 * Application Node Component
 * Represents a workflow application/request submission step
 */

import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { ApplicationNodeData } from '../../types';

const ApplicationNode = ({ data, selected }: NodeProps<ApplicationNodeData>) => {
  const applicant = data.assignees && data.assignees.length > 0 ? data.assignees[0] : null;

  return (
    <div
      style={{
        padding: '12px 16px',
        borderRadius: '8px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: selected ? '2px solid #4c51bf' : '2px solid #667eea',
        minWidth: '160px',
        boxShadow: selected
          ? '0 4px 12px rgba(102, 126, 234, 0.4)'
          : '0 2px 8px rgba(102, 126, 234, 0.25)',
        color: 'white',
        transition: 'all 0.2s ease',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: '#667eea',
          width: '10px',
          height: '10px',
          border: '2px solid white',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
        <div
          style={{
            fontSize: '18px',
            marginRight: '8px',
          }}
        >
          📝
        </div>
        <div
          style={{
            fontSize: '13px',
            fontWeight: 600,
            opacity: 0.9,
          }}
        >
          申請
        </div>
      </div>

      <div
        style={{
          fontSize: '14px',
          fontWeight: 600,
          marginBottom: applicant ? '8px' : '0',
        }}
      >
        {data.label}
      </div>

      {applicant && (
        <div
          style={{
            marginTop: '8px',
            paddingTop: '8px',
            borderTop: '1px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              opacity: 0.8,
              marginBottom: '4px',
            }}
          >
            申請者
          </div>
          <div
            style={{
              fontSize: '12px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span style={{ marginRight: '4px' }}>👤</span>
            {applicant.name}
          </div>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: '#667eea',
          width: '10px',
          height: '10px',
          border: '2px solid white',
        }}
      />
    </div>
  );
};

export default memo(ApplicationNode);
