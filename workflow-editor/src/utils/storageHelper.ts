/**
 * LocalStorage Helper for Workflow Management
 * 
 * Handles all LocalStorage operations for workflow persistence.
 * Storage key: 'workflows' - Array of Workflow objects
 */

import type { Workflow, WorkflowMetadata } from '../types';

const STORAGE_KEY = 'workflows';

/**
 * Error class for storage operations
 */
export class StorageError extends Error {
  cause?: unknown;
  
  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'StorageError';
    this.cause = cause;
  }
}

/**
 * Get all workflows from LocalStorage
 * @returns Array of workflows
 */
export const getAllWorkflows = (): Workflow[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const workflows = JSON.parse(data) as Workflow[];
    
    // Validate that it's an array
    if (!Array.isArray(workflows)) {
      console.error('Invalid workflows data in localStorage');
      return [];
    }
    
    return workflows;
  } catch (error) {
    console.error('Failed to load workflows:', error);
    throw new StorageError('ワークフローの読み込みに失敗しました', error);
  }
};

/**
 * Get workflow metadata (without full node/edge data for list display)
 * @returns Array of workflow metadata
 */
export const getWorkflowMetadata = (): WorkflowMetadata[] => {
  try {
    const workflows = getAllWorkflows();
    return workflows.map(w => ({
      id: w.id,
      name: w.name,
      description: w.description,
      createdAt: w.createdAt,
      updatedAt: w.updatedAt,
    }));
  } catch (error) {
    console.error('Failed to load workflow metadata:', error);
    throw new StorageError('ワークフロー情報の読み込みに失敗しました', error);
  }
};

/**
 * Get a specific workflow by ID
 * @param id Workflow ID
 * @returns Workflow or null if not found
 */
export const getWorkflowById = (id: string): Workflow | null => {
  try {
    const workflows = getAllWorkflows();
    return workflows.find(w => w.id === id) || null;
  } catch (error) {
    console.error('Failed to load workflow:', error);
    throw new StorageError('ワークフローの読み込みに失敗しました', error);
  }
};

/**
 * Save a workflow to LocalStorage
 * @param workflow Workflow to save
 */
export const saveWorkflow = (workflow: Workflow): void => {
  try {
    const workflows = getAllWorkflows();
    const existingIndex = workflows.findIndex(w => w.id === workflow.id);
    
    if (existingIndex >= 0) {
      // Update existing workflow
      workflows[existingIndex] = workflow;
    } else {
      // Add new workflow
      workflows.push(workflow);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows));
  } catch (error) {
    console.error('Failed to save workflow:', error);
    throw new StorageError('ワークフローの保存に失敗しました', error);
  }
};

/**
 * Delete a workflow from LocalStorage
 * @param id Workflow ID to delete
 * @returns true if deleted, false if not found
 */
export const deleteWorkflow = (id: string): boolean => {
  try {
    const workflows = getAllWorkflows();
    const filteredWorkflows = workflows.filter(w => w.id !== id);
    
    if (filteredWorkflows.length === workflows.length) {
      // Workflow not found
      return false;
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredWorkflows));
    return true;
  } catch (error) {
    console.error('Failed to delete workflow:', error);
    throw new StorageError('ワークフローの削除に失敗しました', error);
  }
};

/**
 * Update workflow metadata (name and description)
 * @param id Workflow ID
 * @param name New name
 * @param description New description
 * @returns true if updated, false if not found
 */
export const updateWorkflowMetadata = (
  id: string,
  name: string,
  description?: string
): boolean => {
  try {
    const workflows = getAllWorkflows();
    const workflow = workflows.find(w => w.id === id);
    
    if (!workflow) return false;
    
    workflow.name = name;
    workflow.description = description;
    workflow.updatedAt = new Date().toISOString();
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows));
    return true;
  } catch (error) {
    console.error('Failed to update workflow metadata:', error);
    throw new StorageError('ワークフロー情報の更新に失敗しました', error);
  }
};

/**
 * Check if a workflow name already exists (case-insensitive)
 * @param name Workflow name to check
 * @param excludeId Optional workflow ID to exclude from check (for updates)
 * @returns true if name exists
 */
export const isWorkflowNameExists = (name: string, excludeId?: string): boolean => {
  try {
    const workflows = getAllWorkflows();
    return workflows.some(
      w => w.name.toLowerCase() === name.toLowerCase() && w.id !== excludeId
    );
  } catch (error) {
    console.error('Failed to check workflow name:', error);
    return false;
  }
};

/**
 * Get workflow count
 * @returns Number of saved workflows
 */
export const getWorkflowCount = (): number => {
  try {
    const workflows = getAllWorkflows();
    return workflows.length;
  } catch (error) {
    console.error('Failed to get workflow count:', error);
    return 0;
  }
};

/**
 * Export workflow as JSON string
 * @param workflow Workflow to export
 * @returns JSON string
 */
export const exportWorkflowToJson = (workflow: Workflow): string => {
  try {
    return JSON.stringify(workflow, null, 2);
  } catch (error) {
    console.error('Failed to export workflow:', error);
    throw new StorageError('ワークフローのエクスポートに失敗しました', error);
  }
};

/**
 * Import workflow from JSON string
 * @param json JSON string
 * @returns Parsed workflow
 */
export const importWorkflowFromJson = (json: string): Workflow => {
  try {
    const workflow = JSON.parse(json) as Workflow;
    
    // Validate required fields
    if (!workflow.id || !workflow.name || !Array.isArray(workflow.nodes) || !Array.isArray(workflow.edges)) {
      throw new Error('Invalid workflow structure');
    }
    
    return workflow;
  } catch (error) {
    console.error('Failed to import workflow:', error);
    throw new StorageError('ワークフローのインポートに失敗しました。形式が正しくありません。', error);
  }
};

/**
 * Clear all workflows (with confirmation)
 * Use with caution!
 */
export const clearAllWorkflows = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear workflows:', error);
    throw new StorageError('ワークフローのクリアに失敗しました', error);
  }
};
