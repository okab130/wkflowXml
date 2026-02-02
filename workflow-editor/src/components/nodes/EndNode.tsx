/**
 * End Node component
 */

import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { EndNodeData } from '../../types';

const EndNode = ({ data, selected }: NodeProps<EndNodeData>) => {
  return (
    <div
      style={{
        padding: '16px',
        borderRadius: '50%',
        background: '#ef4444',
        border: selected ? '3px solid #dc2626' : '2px solid #b91c1c',
        color: 'white',
        minWidth: '80px',
        minHeight: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        fontSize: '14px',
        boxShadow: selected
          ? '0 4px 12px rgba(239, 68, 68, 0.4)'
          : '0 2px 8px rgba(0, 0, 0, 0.15)',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
      }}
    >
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Top}
        id="end-input"
        style={{
          background: '#b91c1c',
          width: '12px',
          height: '12px',
          border: '2px solid white',
        }}
      />
      
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '24px', marginBottom: '4px' }}>⬛</div>
        <div>{data.label || '終了'}</div>
      </div>
    </div>
  );
};

export default memo(EndNode);
