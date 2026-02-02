/**
 * Main Application Component
 */

import { useState, useRef, useCallback } from 'react';
import type { DragEvent } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';

import FlowCanvas from './components/FlowCanvas';
import LeftSidebar from './components/sidebar/LeftSidebar';
import RightSidebar from './components/sidebar/RightSidebar';
import Toolbar from './components/toolbar/Toolbar';
import { useWorkflowStore } from './store/workflowStore';
import { NodeType, ApprovalRule } from './types';
import type { WorkflowNode } from './types';

import './App.css';

function App() {
  const { addNode, addAssignee, assignees } = useWorkflowStore();
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Add some mock assignees on first load
  useState(() => {
    if (assignees.length === 0) {
      addAssignee({
        id: uuidv4(),
        name: '田中太郎',
        email: 'tanaka@example.com',
        role: '部長',
        department: '営業部',
      });
      addAssignee({
        id: uuidv4(),
        name: '佐藤花子',
        email: 'sato@example.com',
        role: '課長',
        department: '経理部',
      });
      addAssignee({
        id: uuidv4(),
        name: '鈴木一郎',
        email: 'suzuki@example.com',
        role: '主任',
        department: '総務部',
      });
    }
  });

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) {
        return;
      }

      const type = event.dataTransfer.getData('application/reactflow') as NodeType;
      if (!type) {
        return;
      }

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const nodeId = `${type}-${uuidv4()}`;
      
      let newNode: WorkflowNode;

      switch (type) {
        case NodeType.START:
          newNode = {
            id: nodeId,
            type: 'startNode',
            position,
            data: {
              type: NodeType.START,
              label: '開始',
            },
          };
          break;
        case NodeType.APPLICATION:
          newNode = {
            id: nodeId,
            type: 'applicationNode',
            position,
            data: {
              type: NodeType.APPLICATION,
              label: '申請',
              assignees: [],
            },
          };
          break;
        case NodeType.APPROVAL:
          newNode = {
            id: nodeId,
            type: 'approvalNode',
            position,
            data: {
              type: NodeType.APPROVAL,
              label: '承認',
              assignees: [],
              approvalRule: ApprovalRule.ALL,
            },
          };
          break;
        case NodeType.CONDITION:
          newNode = {
            id: nodeId,
            type: 'conditionNode',
            position,
            data: {
              type: NodeType.CONDITION,
              label: '条件分岐',
            },
          };
          break;
        case NodeType.END:
          newNode = {
            id: nodeId,
            type: 'endNode',
            position,
            data: {
              type: NodeType.END,
              label: '終了',
            },
          };
          break;
        default:
          return;
      }

      addNode(newNode);
    },
    [reactFlowInstance, addNode]
  );

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100vh', 
      width: '100vw',
      overflow: 'hidden',
      background: '#f8fafc'
    }}>
      <Toolbar />
      
      <div style={{
        display: 'flex',
        flex: 1,
        marginTop: '64px',
        overflow: 'hidden'
      }}>
        <LeftSidebar />
        
        <div 
          ref={reactFlowWrapper}
          style={{ 
            flex: 1, 
            height: '100%',
            position: 'relative'
          }}
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <ReactFlowProvider>
            <FlowCanvas onInit={setReactFlowInstance} />
          </ReactFlowProvider>
        </div>
        
        <RightSidebar />
      </div>
    </div>
  );
}

export default App;
