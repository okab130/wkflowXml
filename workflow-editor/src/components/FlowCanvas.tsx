/**
 * Main Flow Canvas component using React Flow
 */

import { useCallback, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Panel,
} from 'reactflow';
import type {
  Connection,
  NodeTypes,
  EdgeTypes,
  ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useWorkflowStore } from '../store/workflowStore';
import type { WorkflowNode, WorkflowEdge } from '../types';

// Import custom nodes
import StartNode from './nodes/StartNode';
import ApplicationNode from './nodes/ApplicationNode';
import ApprovalNode from './nodes/ApprovalNode';
import EndNode from './nodes/EndNode';
import ConditionNode from './nodes/ConditionNode';

// Import custom edges
import CustomEdge from './edges/CustomEdge';

// Define node types for React Flow
const nodeTypes: NodeTypes = {
  startNode: StartNode,
  applicationNode: ApplicationNode,
  approvalNode: ApprovalNode,
  conditionNode: ConditionNode,
  endNode: EndNode,
};

// Define edge types for React Flow
const edgeTypes: EdgeTypes = {
  default: CustomEdge,
};

interface FlowCanvasProps {
  onInit?: (instance: ReactFlowInstance) => void;
}

const FlowCanvas = ({ onInit }: FlowCanvasProps) => {
  const { nodes, edges, setNodes, setEdges, setSelectedNode } = useWorkflowStore();
  
  const [localNodes, setLocalNodes, onNodesChange] = useNodesState(nodes);
  const [localEdges, setLocalEdges, onEdgesChange] = useEdgesState(edges as any[]);

  // Sync store nodes/edges with local state
  useEffect(() => {
    setLocalNodes(nodes);
  }, [nodes, setLocalNodes]);

  useEffect(() => {
    setLocalEdges(edges as any[]);
  }, [edges, setLocalEdges]);

  // Sync local state with store
  const handleNodesChange = useCallback(
    (changes: any) => {
      onNodesChange(changes);
      setNodes(localNodes);
    },
    [localNodes, setNodes, onNodesChange]
  );

  const handleEdgesChange = useCallback(
    (changes: any) => {
      onEdgesChange(changes);
      setEdges(localEdges as WorkflowEdge[]);
    },
    [localEdges, setEdges, onEdgesChange]
  );

  // Handle new connections
  const onConnect = useCallback(
    (connection: Connection) => {
      // Find source node to check if it's a condition node
      const sourceNode = localNodes.find((n) => n.id === connection.source);
      
      const newEdge: any = {
        ...connection,
        id: `edge-${connection.source}-${connection.target}`,
        type: 'default', // Use our custom edge type
        animated: true,
      };

      // If source is a condition node, add its condition to the edge
      if (sourceNode?.type === 'conditionNode' && sourceNode.data.type === 'conditionNode') {
        newEdge.data = {
          condition: sourceNode.data.condition || '条件未設定',
        };
        newEdge.label = sourceNode.data.condition || '条件未設定';
      }
      
      const updatedEdges = addEdge(newEdge, localEdges);
      setLocalEdges(updatedEdges);
      setEdges(updatedEdges as WorkflowEdge[]);
    },
    [localNodes, localEdges, setLocalEdges, setEdges]
  );

  // Handle node click
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: WorkflowNode) => {
      setSelectedNode(node);
    },
    [setSelectedNode]
  );

  // Handle pane click (deselect node)
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  // Handle node drag
  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, _node: WorkflowNode) => {
      setNodes(localNodes);
    },
    [localNodes, setNodes]
  );

  // Handle node deletion
  const onNodesDelete = useCallback(
    (_deleted: WorkflowNode[]) => {
      // Clear selection if any deleted node was selected
      setSelectedNode(null);
      setNodes(localNodes);
    },
    [localNodes, setNodes, setSelectedNode]
  );

  // Handle edge deletion
  const onEdgesDelete = useCallback(
    () => {
      setEdges(localEdges as WorkflowEdge[]);
    },
    [localEdges, setEdges]
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={localNodes}
        edges={localEdges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onNodeDragStop={onNodeDragStop}
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
        onInit={onInit}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        deleteKeyCode="Delete"
        multiSelectionKeyCode="Control"
        fitView
        attributionPosition="bottom-left"
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            switch (node.type) {
              case 'startNode':
                return '#4ade80';
              case 'applicationNode':
                return '#a78bfa';
              case 'approvalNode':
                return '#60a5fa';
              case 'conditionNode':
                return '#fbbf24';
              case 'endNode':
                return '#ef4444';
              default:
                return '#94a3b8';
            }
          }}
          nodeBorderRadius={8}
          maskColor="rgba(0, 0, 0, 0.2)"
        />
        <Panel position="top-left">
          <div style={{ 
            background: 'white', 
            padding: '8px 16px', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            fontSize: '14px',
            fontWeight: 500
          }}>
            承認ワークフローエディタ
          </div>
        </Panel>
        <Panel position="bottom-right">
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.95)', 
            padding: '10px 14px', 
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            fontSize: '12px',
            color: '#64748b',
            maxWidth: '280px',
            backdropFilter: 'blur(8px)'
          }}>
            <div style={{ fontWeight: 600, marginBottom: '6px', color: '#1e293b' }}>
              💡 操作ガイド
            </div>
            <div style={{ lineHeight: '1.6' }}>
              • ノード選択 → <kbd style={{ 
                padding: '2px 6px', 
                background: '#f1f5f9', 
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '11px',
                border: '1px solid #e2e8f0'
              }}>Delete</kbd> で削除<br/>
              • 接続線選択 → <kbd style={{ 
                padding: '2px 6px', 
                background: '#f1f5f9', 
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '11px',
                border: '1px solid #e2e8f0'
              }}>Delete</kbd> で削除<br/>
              • <kbd style={{ 
                padding: '2px 6px', 
                background: '#f1f5f9', 
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '11px',
                border: '1px solid #e2e8f0'
              }}>Ctrl</kbd> + クリックで複数選択
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default FlowCanvas;
