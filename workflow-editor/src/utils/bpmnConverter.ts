/**
 * BPMN 2.0 Converter
 * Converts workflow nodes and edges to BPMN 2.0 XML format
 */

import type {
  WorkflowNode,
  WorkflowEdge,
  Assignee,
} from '../types';
import { NodeType } from '../types';
import {
  createBpmnHeader,
  createBpmnDefinitions,
  createElement,
  createElementWithChildren,
} from './xmlBuilder';

/**
 * Main function to convert workflow to BPMN 2.0 XML
 */
export function convertWorkflowToBpmn(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  assignees: Assignee[],
  workflowName: string = 'Workflow Process'
): string {
  const processId = 'Process_1';
  
  // Convert nodes to BPMN elements
  const bpmnElements: string[] = [];
  const laneFlowNodeRefs: Map<string, string[]> = new Map();
  
  // Process each node
  nodes.forEach(node => {
    const element = convertNodeToBpmnElement(node);
    if (element) {
      bpmnElements.push(element);
      
      // Track flow nodes for lanes
      const assigneeIds = getNodeAssigneeIds(node);
      assigneeIds.forEach(assigneeId => {
        if (!laneFlowNodeRefs.has(assigneeId)) {
          laneFlowNodeRefs.set(assigneeId, []);
        }
        laneFlowNodeRefs.get(assigneeId)!.push(node.id);
      });
    }
  });
  
  // Convert edges to sequence flows
  edges.forEach(edge => {
    const flow = convertEdgeToSequenceFlow(edge, nodes);
    if (flow) {
      bpmnElements.push(flow);
    }
  });
  
  // Build process element
  const processElement = createElementWithChildren(
    'process',
    {
      id: processId,
      name: workflowName,
      isExecutable: true,
    },
    bpmnElements,
    1
  );
  
  // Build lanes if there are assignees
  const lanes: string[] = [];
  if (assignees.length > 0 && laneFlowNodeRefs.size > 0) {
    assignees.forEach((assignee, index) => {
      const flowNodeRefs = laneFlowNodeRefs.get(assignee.id) || [];
      const laneChildren: string[] = flowNodeRefs.map(nodeId =>
        createElement('flowNodeRef', {}, nodeId, 3)
      );
      
      const lane = createElementWithChildren(
        'lane',
        {
          id: `Lane_${index + 1}`,
          name: `${assignee.name} (${assignee.role || '担当者'})`,
        },
        laneChildren,
        2
      );
      lanes.push(lane);
    });
  }
  
  // Build laneSet if lanes exist
  const laneSetElement = lanes.length > 0
    ? createElementWithChildren('laneSet', { id: 'LaneSet_1' }, lanes, 1)
    : null;
  
  // Build collaboration with participant
  const participantElement = createElement(
    'participant',
    {
      id: 'Participant_1',
      name: workflowName,
      processRef: processId,
    },
    undefined,
    2
  );
  
  const collaborationElement = createElementWithChildren(
    'collaboration',
    { id: 'Collaboration_1' },
    [participantElement],
    1
  );
  
  // Combine all elements
  const definitionChildren: string[] = [processElement];
  
  if (laneSetElement) {
    // Insert laneSet into process by rebuilding it
    const processWithLanes = createElementWithChildren(
      'process',
      {
        id: processId,
        name: workflowName,
        isExecutable: true,
      },
      [laneSetElement, ...bpmnElements],
      1
    );
    definitionChildren[0] = processWithLanes;
  }
  
  definitionChildren.push(collaborationElement);
  
  // Build complete BPMN XML
  const header = createBpmnHeader();
  const definitions = createBpmnDefinitions(definitionChildren);
  
  return `${header}\n${definitions}`;
}

/**
 * Converts a workflow node to BPMN element
 */
function convertNodeToBpmnElement(node: WorkflowNode): string | null {
  const { id, data } = node;
  const indent = 2;
  
  switch (data.type) {
    case NodeType.START:
      return createElement(
        'startEvent',
        {
          id,
          name: data.label,
        },
        undefined,
        indent
      );
      
    case NodeType.END:
      return createElement(
        'endEvent',
        {
          id,
          name: data.label,
        },
        undefined,
        indent
      );
      
    case NodeType.APPLICATION: {
      const documentation = data.description
        ? createElement('documentation', {}, data.description, indent + 1)
        : undefined;
      
      const children = documentation ? [documentation] : [];
      
      return createElementWithChildren(
        'userTask',
        {
          id,
          name: data.label,
          'implementation': 'application',
        },
        children,
        indent
      );
    }
      
    case NodeType.APPROVAL: {
      const children: string[] = [];
      
      // Add assignee as performer
      if (data.assignees && data.assignees.length > 0) {
        data.assignees.forEach(assignee => {
          children.push(
            createElement(
              'performer',
              {},
              createElement('resourceRef', {}, assignee.id, 0),
              indent + 1
            )
          );
        });
      }
      
      return children.length > 0
        ? createElementWithChildren(
            'userTask',
            {
              id,
              name: data.label,
              'implementation': 'approval',
            },
            children,
            indent
          )
        : createElement(
            'userTask',
            {
              id,
              name: data.label,
              'implementation': 'approval',
            },
            undefined,
            indent
          );
    }
      
    case NodeType.CONDITION: {
      const children: string[] = [];
      
      if (data.condition) {
        children.push(
          createElement('documentation', {}, data.condition, indent + 1)
        );
      }
      
      return children.length > 0
        ? createElementWithChildren(
            'exclusiveGateway',
            {
              id,
              name: data.label,
            },
            children,
            indent
          )
        : createElement(
            'exclusiveGateway',
            {
              id,
              name: data.label,
            },
            undefined,
            indent
          );
    }
      
    default:
      return null;
  }
}

/**
 * Converts an edge to BPMN sequence flow
 */
function convertEdgeToSequenceFlow(edge: WorkflowEdge, nodes: WorkflowNode[]): string | null {
  const { id, source, target, label } = edge;
  
  // Check if source is a condition node
  const sourceNode = nodes.find(n => n.id === source);
  const isFromCondition = sourceNode && sourceNode.data.type === NodeType.CONDITION;
  
  const children: string[] = [];
  
  // Add condition expression if this edge comes from a condition node and has a label
  if (isFromCondition && label) {
    const conditionExpr = createElement(
      'conditionExpression',
      { 'xsi:type': 'tFormalExpression' },
      label,
      3
    );
    children.push(conditionExpr);
  }
  
  if (children.length > 0) {
    return createElementWithChildren(
      'sequenceFlow',
      {
        id,
        name: label,
        sourceRef: source,
        targetRef: target,
      },
      children,
      2
    );
  }
  
  return createElement(
    'sequenceFlow',
    {
      id,
      name: label,
      sourceRef: source,
      targetRef: target,
    },
    undefined,
    2
  );
}

/**
 * Gets assignee IDs from a node
 */
function getNodeAssigneeIds(node: WorkflowNode): string[] {
  const data = node.data;
  
  if (data.type === NodeType.APPLICATION && data.assignees) {
    return data.assignees.map(a => a.id);
  }
  
  if (data.type === NodeType.APPROVAL && data.assignees) {
    return data.assignees.map(a => a.id);
  }
  
  return [];
}

/**
 * Validates BPMN structure
 */
export function validateBpmn(nodes: WorkflowNode[], edges: WorkflowEdge[]): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check for at least one start event
  const startNodes = nodes.filter(n => n.data.type === NodeType.START);
  if (startNodes.length === 0) {
    errors.push('ワークフローには少なくとも1つの開始ノードが必要です');
  }
  
  // Check for at least one end event
  const endNodes = nodes.filter(n => n.data.type === NodeType.END);
  if (endNodes.length === 0) {
    errors.push('ワークフローには少なくとも1つの終了ノードが必要です');
  }
  
  // Check for orphaned nodes (no incoming or outgoing edges)
  nodes.forEach(node => {
    const hasIncoming = edges.some(e => e.target === node.id);
    const hasOutgoing = edges.some(e => e.source === node.id);
    
    if (node.data.type !== NodeType.START && !hasIncoming) {
      warnings.push(`ノード "${node.data.label}" (${node.id}) には入力エッジがありません`);
    }
    
    if (node.data.type !== NodeType.END && !hasOutgoing) {
      warnings.push(`ノード "${node.data.label}" (${node.id}) には出力エッジがありません`);
    }
  });
  
  // Check for condition nodes without conditions
  nodes.forEach(node => {
    if (node.data.type === NodeType.CONDITION && !node.data.condition) {
      warnings.push(`条件分岐ノード "${node.data.label}" には条件式が設定されていません`);
    }
  });
  
  // Check for task nodes without assignees
  nodes.forEach(node => {
    if (
      (node.data.type === NodeType.APPLICATION || node.data.type === NodeType.APPROVAL) &&
      (!node.data.assignees || node.data.assignees.length === 0)
    ) {
      warnings.push(`タスクノード "${node.data.label}" には担当者が割り当てられていません`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Generates a downloadable BPMN file name
 */
export function generateBpmnFileName(workflowName: string = 'workflow'): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const sanitized = workflowName.replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF_-]/g, '_');
  return `${sanitized}_${timestamp}.bpmn`;
}
