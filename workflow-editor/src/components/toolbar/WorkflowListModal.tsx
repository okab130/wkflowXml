/**
 * Workflow List Modal Component
 * 
 * Displays saved workflows and allows loading/deleting them.
 */

import { useState, useEffect } from 'react';
import { FiX, FiFolder, FiTrash2, FiEdit, FiClock, FiAlertTriangle } from 'react-icons/fi';
import type { WorkflowMetadata } from '../../types';
import { getWorkflowMetadata, deleteWorkflow as deleteWorkflowFromStorage } from '../../utils/storageHelper';
import './WorkflowListModal.css';

interface WorkflowListModalProps {
  onClose: () => void;
  onLoadWorkflow: (id: string) => void;
  onEditWorkflow: (id: string) => void;
}

const WorkflowListModal: React.FC<WorkflowListModalProps> = ({
  onClose,
  onLoadWorkflow,
  onEditWorkflow,
}) => {
  const [workflows, setWorkflows] = useState<WorkflowMetadata[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Load workflows on mount
   */
  useEffect(() => {
    loadWorkflows();
  }, []);

  /**
   * Load workflows from storage
   */
  const loadWorkflows = () => {
    try {
      setLoading(true);
      const metadata = getWorkflowMetadata();
      // Sort by updated date (newest first)
      metadata.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      setWorkflows(metadata);
    } catch (error) {
      console.error('Failed to load workflows:', error);
      alert('ワークフローの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle workflow deletion
   */
  const handleDelete = (id: string) => {
    try {
      const success = deleteWorkflowFromStorage(id);
      if (success) {
        // Remove from list
        setWorkflows(workflows.filter(w => w.id !== id));
        setDeleteConfirmId(null);
      } else {
        alert('ワークフローが見つかりませんでした');
      }
    } catch (error) {
      console.error('Failed to delete workflow:', error);
      alert('ワークフローの削除に失敗しました');
    }
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  /**
   * Handle escape key to close
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (deleteConfirmId) {
        setDeleteConfirmId(null);
      } else {
        onClose();
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content workflow-list-modal" onClick={(e) => e.stopPropagation()} onKeyDown={handleKeyDown}>
        {/* Header */}
        <div className="modal-header">
          <h2>
            <FiFolder />
            保存済みワークフロー
          </h2>
          <button className="close-button" onClick={onClose} title="閉じる">
            <FiX />
          </button>
        </div>

        {/* Content */}
        <div className="workflow-list-content">
          {loading ? (
            <div className="loading-state">
              <p>読み込み中...</p>
            </div>
          ) : workflows.length === 0 ? (
            <div className="empty-state">
              <FiFolder size={48} />
              <p>保存されたワークフローがありません</p>
              <p className="empty-hint">ワークフローを作成して保存してください</p>
            </div>
          ) : (
            <div className="workflow-list">
              {workflows.map((workflow) => (
                <div key={workflow.id} className="workflow-item">
                  {/* Delete Confirmation */}
                  {deleteConfirmId === workflow.id ? (
                    <div className="delete-confirm">
                      <div className="delete-confirm-content">
                        <FiAlertTriangle />
                        <div>
                          <p className="delete-confirm-title">本当に削除しますか?</p>
                          <p className="delete-confirm-text">{workflow.name}</p>
                        </div>
                      </div>
                      <div className="delete-confirm-buttons">
                        <button
                          className="button secondary small"
                          onClick={() => setDeleteConfirmId(null)}
                        >
                          キャンセル
                        </button>
                        <button
                          className="button danger small"
                          onClick={() => handleDelete(workflow.id)}
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Workflow Info */}
                      <div className="workflow-info" onClick={() => onLoadWorkflow(workflow.id)}>
                        <h3 className="workflow-name">{workflow.name}</h3>
                        {workflow.description && (
                          <p className="workflow-description">{workflow.description}</p>
                        )}
                        <div className="workflow-meta">
                          <span className="workflow-date">
                            <FiClock />
                            更新: {formatDate(workflow.updatedAt)}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="workflow-actions">
                        <button
                          className="icon-button"
                          onClick={() => onEditWorkflow(workflow.id)}
                          title="名前と説明を編集"
                        >
                          <FiEdit />
                        </button>
                        <button
                          className="icon-button danger"
                          onClick={() => setDeleteConfirmId(workflow.id)}
                          title="削除"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <div className="workflow-count">
            保存済み: {workflows.length} 件
          </div>
          <button className="button secondary" onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowListModal;
