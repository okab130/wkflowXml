/**
 * Type definitions for the Approval Workflow Visual Editor
 */

import type { Node as ReactFlowNode, Edge as ReactFlowEdge } from 'reactflow';

// ========== Node Types ==========

/**
 * Node types supported in the workflow
 */
export const NodeType = {
  START: 'startNode',
  APPROVAL: 'approvalNode',
  CONDITION: 'conditionNode',
  END: 'endNode',
} as const;

export type NodeType = (typeof NodeType)[keyof typeof NodeType];

/**
 * Approval rule for nodes with multiple assignees
 */
export const ApprovalRule = {
  ALL: 'all',           // All assignees must approve
  ANY: 'any',           // Any one assignee can approve
  MAJORITY: 'majority', // Majority of assignees must approve
} as const;

export type ApprovalRule = (typeof ApprovalRule)[keyof typeof ApprovalRule];

// ========== Assignee Types ==========

/**
 * Assignee (Processor) information
 */
export interface Assignee {
  id: string;
  name: string;
  email: string;
  role?: string;
  department?: string;
}

// ========== Node Data Types ==========

/**
 * Base data for all nodes
 */
export interface BaseNodeData {
  type: NodeType;
  label: string;
  description?: string;
}

/**
 * Data for Start Node
 */
export interface StartNodeData extends BaseNodeData {
  type: typeof NodeType.START;
}

/**
 * Data for Approval Node
 */
export interface ApprovalNodeData extends BaseNodeData {
  type: typeof NodeType.APPROVAL;
  assignees: Assignee[];
  approvalRule: ApprovalRule;
}

/**
 * Data for Condition Node
 */
export interface ConditionNodeData extends BaseNodeData {
  type: typeof NodeType.CONDITION;
  condition?: string;
}

/**
 * Data for End Node
 */
export interface EndNodeData extends BaseNodeData {
  type: typeof NodeType.END;
}

/**
 * Union type for all node data
 */
export type NodeData = StartNodeData | ApprovalNodeData | ConditionNodeData | EndNodeData;

// ========== React Flow Types ==========

/**
 * Custom Node type for React Flow
 */
export type WorkflowNode = ReactFlowNode<NodeData>;

/**
 * Custom Edge type for React Flow
 * Using type instead of interface to work with React Flow's Edge type
 */
export type WorkflowEdge = ReactFlowEdge & {
  label?: string;
  condition?: string;
};

// ========== Workflow Types ==========

/**
 * Complete workflow definition
 */
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  assignees: Assignee[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Workflow metadata for list display
 */
export interface WorkflowMetadata {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// ========== Store Types ==========

/**
 * Application state
 */
export interface AppState {
  // Current workflow
  currentWorkflow: Workflow | null;
  
  // Nodes and edges
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  
  // Assignees
  assignees: Assignee[];
  
  // Selected node
  selectedNode: WorkflowNode | null;
  
  // Actions
  setNodes: (nodes: WorkflowNode[]) => void;
  setEdges: (edges: WorkflowEdge[]) => void;
  addNode: (node: WorkflowNode) => void;
  updateNode: (nodeId: string, data: Partial<NodeData>) => void;
  deleteNode: (nodeId: string) => void;
  addEdge: (edge: WorkflowEdge) => void;
  deleteEdge: (edgeId: string) => void;
  setSelectedNode: (node: WorkflowNode | null) => void;
  
  // Assignee actions
  addAssignee: (assignee: Assignee) => void;
  updateAssignee: (assigneeId: string, data: Partial<Assignee>) => void;
  deleteAssignee: (assigneeId: string) => void;
  
  // Workflow actions
  loadWorkflow: (workflow: Workflow) => void;
  saveWorkflow: (name: string, description?: string) => void;
  clearWorkflow: () => void;
}

// ========== BPMN Types ==========

/**
 * BPMN 2.0 Process definition
 */
export interface BPMNProcess {
  id: string;
  name: string;
  isExecutable: boolean;
  startEvents: BPMNStartEvent[];
  endEvents: BPMNEndEvent[];
  tasks: BPMNTask[];
  sequenceFlows: BPMNSequenceFlow[];
  gateways?: BPMNGateway[];
}

/**
 * BPMN Start Event
 */
export interface BPMNStartEvent {
  id: string;
  name: string;
}

/**
 * BPMN End Event
 */
export interface BPMNEndEvent {
  id: string;
  name: string;
}

/**
 * BPMN Task (User Task for approval)
 */
export interface BPMNTask {
  id: string;
  name: string;
  assignee?: string;
  candidateUsers?: string[];
  type: 'userTask' | 'serviceTask';
}

/**
 * BPMN Sequence Flow
 */
export interface BPMNSequenceFlow {
  id: string;
  sourceRef: string;
  targetRef: string;
  name?: string;
  conditionExpression?: string;
}

/**
 * BPMN Gateway (Exclusive, Parallel, etc.)
 */
export interface BPMNGateway {
  id: string;
  name: string;
  type: 'exclusive' | 'parallel' | 'inclusive';
}

/**
 * Complete BPMN Definition
 */
export interface BPMNDefinition {
  process: BPMNProcess;
  participants?: BPMNParticipant[];
  lanes?: BPMNLane[];
}

/**
 * BPMN Participant (Pool)
 */
export interface BPMNParticipant {
  id: string;
  name: string;
  processRef: string;
}

/**
 * BPMN Lane
 */
export interface BPMNLane {
  id: string;
  name: string;
  flowNodeRefs: string[];
}
