/**
 * Start Node component
 */

import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { StartNodeData } from '../../types';

const StartNode = ({ data, selected }: NodeProps<StartNodeData>) => {
  return (
    <div
      style={{
        padding: '16px',
        borderRadius: '50%',
        background: '#4ade80',
        border: selected ? '3px solid #22c55e' : '2px solid #16a34a',
        color: 'white',
        minWidth: '80px',
        minHeight: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        fontSize: '14px',
        boxShadow: selected
          ? '0 4px 12px rgba(34, 197, 94, 0.4)'
          : '0 2px 8px rgba(0, 0, 0, 0.15)',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '24px', marginBottom: '4px' }}>⭕</div>
        <div>{data.label || '開始'}</div>
      </div>
      
      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="start-output"
        style={{
          background: '#16a34a',
          width: '12px',
          height: '12px',
          border: '2px solid white',
        }}
      />
    </div>
  );
};

export default memo(StartNode);
