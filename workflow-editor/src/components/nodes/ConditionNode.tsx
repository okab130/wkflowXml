/**
 * Condition Node component (for branching logic)
 */

import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { ConditionNodeData } from '../../types';

const ConditionNode = ({ data, selected }: NodeProps<ConditionNodeData>) => {
  return (
    <div
      style={{
        padding: '20px',
        background: 'white',
        border: selected ? '3px solid #f59e0b' : '2px solid #fbbf24',
        color: '#92400e',
        minWidth: '100px',
        minHeight: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        fontSize: '14px',
        boxShadow: selected
          ? '0 4px 12px rgba(245, 158, 11, 0.4)'
          : '0 2px 8px rgba(0, 0, 0, 0.15)',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        transform: 'rotate(45deg)',
      }}
    >
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Top}
        id="condition-input"
        style={{
          background: '#f59e0b',
          width: '12px',
          height: '12px',
          border: '2px solid white',
          transform: 'rotate(-45deg)',
        }}
      />
      
      <div style={{ 
        textAlign: 'center',
        transform: 'rotate(-45deg)',
      }}>
        <div style={{ fontSize: '24px', marginBottom: '4px' }}>◇</div>
        <div>{data.label || '条件分岐'}</div>
      </div>

      {/* Output handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="condition-output-yes"
        style={{
          background: '#f59e0b',
          width: '12px',
          height: '12px',
          border: '2px solid white',
          transform: 'rotate(-45deg)',
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="condition-output-no"
        style={{
          background: '#f59e0b',
          width: '12px',
          height: '12px',
          border: '2px solid white',
          transform: 'rotate(-45deg)',
        }}
      />
    </div>
  );
};

export default memo(ConditionNode);
