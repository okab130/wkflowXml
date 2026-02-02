/**
 * Custom Edge with Label Support
 * Displays edge labels with conditions
 */

import { getBezierPath, EdgeLabelRenderer, BaseEdge } from 'reactflow';
import type { EdgeProps } from 'reactflow';

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
  data,
  selected,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Extract condition from data or label
  const displayLabel = data?.condition || label;

  // Style for selected edge
  const edgeStyle = {
    ...style,
    stroke: selected ? '#3b82f6' : style.stroke || '#b1b1b7',
    strokeWidth: selected ? 3 : 2,
    cursor: 'pointer',
  };

  return (
    <>
      <BaseEdge 
        id={id} 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={edgeStyle}
        interactionWidth={20}
      />
      {displayLabel && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              background: selected ? '#eff6ff' : 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 600,
              border: selected ? '2px solid #3b82f6' : '1px solid #e2e8f0',
              boxShadow: selected 
                ? '0 4px 8px rgba(59, 130, 246, 0.3)'
                : '0 2px 4px rgba(0, 0, 0, 0.1)',
              color: selected ? '#1e40af' : '#475569',
              pointerEvents: 'all',
              maxWidth: '120px',
              textAlign: 'center',
              zIndex: 1000,
              cursor: 'pointer',
            }}
            className="nodrag nopan"
          >
            {displayLabel}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default CustomEdge;
