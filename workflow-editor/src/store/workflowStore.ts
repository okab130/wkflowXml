/**
 * Zustand store for workflow editor state management
 */

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type {
  AppState,
  WorkflowNode,
  WorkflowEdge,
  Assignee,
  Workflow,
  NodeData,
} from '../types';

// Initial mock assignees
const initialAssignees: Assignee[] = [
  {
    id: uuidv4(),
    name: '田中太郎',
    email: 'tanaka@example.com',
    role: '部長',
    department: '営業部',
  },
  {
    id: uuidv4(),
    name: '佐藤花子',
    email: 'sato@example.com',
    role: '課長',
    department: '経理部',
  },
  {
    id: uuidv4(),
    name: '鈴木一郎',
    email: 'suzuki@example.com',
    role: '主任',
    department: '総務部',
  },
];

export const useWorkflowStore = create<AppState>((set, get) => ({
  // Initial state
  currentWorkflow: null,
  nodes: [],
  edges: [],
  assignees: initialAssignees,
  selectedNode: null,

  // Node actions
  setNodes: (nodes: WorkflowNode[]) => {
    set({ nodes });
  },

  setEdges: (edges: WorkflowEdge[]) => {
    set({ edges });
  },

  addNode: (node: WorkflowNode) => {
    set((state) => ({
      nodes: [...state.nodes, node],
    }));
  },

  updateNode: (nodeId: string, data: Partial<NodeData>) => {
    set((state) => {
      const updatedNodes = state.nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...data } as NodeData };
        }
        return node;
      });
      
      // Also update selectedNode if it's the same node
      const updatedSelectedNode = state.selectedNode?.id === nodeId
        ? updatedNodes.find(n => n.id === nodeId) || state.selectedNode
        : state.selectedNode;
      
      return {
        nodes: updatedNodes,
        selectedNode: updatedSelectedNode,
      };
    });
  },

  deleteNode: (nodeId: string) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
      selectedNode: state.selectedNode?.id === nodeId ? null : state.selectedNode,
    }));
  },

  addEdge: (edge: WorkflowEdge) => {
    set((state) => ({
      edges: [...state.edges, edge],
    }));
  },

  deleteEdge: (edgeId: string) => {
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== edgeId),
    }));
  },

  setSelectedNode: (node: WorkflowNode | null) => {
    set({ selectedNode: node });
  },

  // Assignee actions
  addAssignee: (assignee: Assignee) => {
    set((state) => ({
      assignees: [...state.assignees, assignee],
    }));
  },

  updateAssignee: (assigneeId: string, data: Partial<Assignee>) => {
    set((state) => ({
      assignees: state.assignees.map((assignee) =>
        assignee.id === assigneeId ? { ...assignee, ...data } : assignee
      ),
    }));
  },

  deleteAssignee: (assigneeId: string) => {
    set((state) => ({
      assignees: state.assignees.filter((assignee) => assignee.id !== assigneeId),
      // Remove assignee from all nodes
      nodes: state.nodes.map((node) => {
        if (node.data.type === 'approvalNode') {
          return {
            ...node,
            data: {
              ...node.data,
              assignees: node.data.assignees.filter((a: Assignee) => a.id !== assigneeId),
            },
          };
        }
        return node;
      }),
    }));
  },

  // Workflow actions
  loadWorkflow: (workflow: Workflow) => {
    set({
      currentWorkflow: workflow,
      nodes: workflow.nodes,
      edges: workflow.edges,
      assignees: workflow.assignees,
      selectedNode: null,
    });
  },

  saveWorkflow: (name: string, description?: string) => {
    const state = get();
    const now = new Date().toISOString();
    const workflow: Workflow = {
      id: state.currentWorkflow?.id || uuidv4(),
      name,
      description,
      nodes: state.nodes,
      edges: state.edges,
      assignees: state.assignees,
      createdAt: state.currentWorkflow?.createdAt || now,
      updatedAt: now,
    };

    set({ currentWorkflow: workflow });

    // Save to localStorage
    const savedWorkflows = JSON.parse(localStorage.getItem('workflows') || '[]');
    const existingIndex = savedWorkflows.findIndex((w: Workflow) => w.id === workflow.id);

    if (existingIndex >= 0) {
      savedWorkflows[existingIndex] = workflow;
    } else {
      savedWorkflows.push(workflow);
    }

    localStorage.setItem('workflows', JSON.stringify(savedWorkflows));
  },

  clearWorkflow: () => {
    set({
      currentWorkflow: null,
      nodes: [],
      edges: [],
      selectedNode: null,
    });
  },
}));
