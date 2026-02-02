/**
 * Left Sidebar with Node Palette for drag & drop
 */

import type { DragEvent } from 'react';
import { NodeType } from '../../types';
import AssigneeManager from './AssigneeManager';

interface NodePaletteItem {
  type: NodeType;
  label: string;
  icon: string;
  description: string;
  color: string;
}

const nodeItems: NodePaletteItem[] = [
  {
    type: NodeType.START,
    label: '開始ノード',
    icon: '⭕',
    description: 'ワークフローの開始点',
    color: '#4ade80',
  },
  {
    type: NodeType.APPROVAL,
    label: '承認ノード',
    icon: '📝',
    description: '承認処理を行う',
    color: '#60a5fa',
  },
  {
    type: NodeType.CONDITION,
    label: '条件分岐',
    icon: '◇',
    description: '条件に基づいて分岐',
    color: '#fbbf24',
  },
  {
    type: NodeType.END,
    label: '終了ノード',
    icon: '⬛',
    description: 'ワークフローの終了点',
    color: '#ef4444',
  },
];

const LeftSidebar = () => {
  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      style={{
        width: '240px',
        background: 'white',
        borderRight: '1px solid #e2e8f0',
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
        ノードパレット
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {nodeItems.map((item) => (
          <div
            key={item.type}
            draggable
            onDragStart={(e) => onDragStart(e, item.type)}
            style={{
              padding: '12px',
              background: 'white',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              cursor: 'grab',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = item.color;
              e.currentTarget.style.boxShadow = `0 2px 8px ${item.color}40`;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.cursor = 'grabbing';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.cursor = 'grab';
            }}
          >
            <div
              style={{
                fontSize: '28px',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {item.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#1e293b',
                  marginBottom: '2px',
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: '#64748b',
                }}
              >
                {item.description}
              </div>
            </div>
          </div>
        ))}
      </div>
      
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
        <div style={{ fontWeight: 600, marginBottom: '8px' }}>使い方</div>
        <ol style={{ paddingLeft: '16px', margin: 0 }}>
          <li style={{ marginBottom: '4px' }}>ノードをドラッグ</li>
          <li style={{ marginBottom: '4px' }}>キャンバスにドロップ</li>
          <li style={{ marginBottom: '4px' }}>ノードを接続</li>
        </ol>
      </div>

      {/* Assignee Manager */}
      <AssigneeManager />
    </div>
  );
};

export default LeftSidebar;
