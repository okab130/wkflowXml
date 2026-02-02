/**
 * Edit Workflow Metadata Dialog Component
 * 
 * Modal dialog for editing workflow name and description.
 */

import { useState, useEffect } from 'react';
import { FiX, FiEdit, FiAlertCircle } from 'react-icons/fi';
import { isWorkflowNameExists, updateWorkflowMetadata } from '../../utils/storageHelper';
import './EditMetadataDialog.css';

interface EditMetadataDialogProps {
  workflowId: string;
  initialName: string;
  initialDescription?: string;
  onClose: () => void;
  onSave: () => void;
}

const EditMetadataDialog: React.FC<EditMetadataDialogProps> = ({
  workflowId,
  initialName,
  initialDescription = '',
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [error, setError] = useState<string>('');

  // Focus on name input when dialog opens
  useEffect(() => {
    const input = document.getElementById('edit-workflow-name-input') as HTMLInputElement;
    if (input) {
      input.focus();
      input.select();
    }
  }, []);

  /**
   * Validate and submit the form
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('ワークフロー名を入力してください');
      return;
    }
    
    if (trimmedName.length < 2) {
      setError('ワークフロー名は2文字以上で入力してください');
      return;
    }
    
    if (trimmedName.length > 100) {
      setError('ワークフロー名は100文字以内で入力してください');
      return;
    }
    
    // Check for duplicate name
    if (isWorkflowNameExists(trimmedName, workflowId)) {
      setError('同じ名前のワークフローが既に存在します');
      return;
    }
    
    // Update metadata
    try {
      const success = updateWorkflowMetadata(workflowId, trimmedName, description.trim() || undefined);
      if (success) {
        onSave();
        onClose();
      } else {
        setError('ワークフローが見つかりませんでした');
      }
    } catch (err) {
      console.error('Failed to update metadata:', err);
      setError('更新に失敗しました');
    }
  };

  /**
   * Handle escape key to close
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content edit-metadata-dialog" onClick={(e) => e.stopPropagation()} onKeyDown={handleKeyDown}>
        {/* Header */}
        <div className="modal-header">
          <h2>
            <FiEdit />
            ワークフロー情報を編集
          </h2>
          <button className="close-button" onClick={onClose} title="閉じる">
            <FiX />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="edit-form">
          {/* Error Message */}
          {error && (
            <div className="error-message">
              <FiAlertCircle />
              <span>{error}</span>
            </div>
          )}

          {/* Name Input */}
          <div className="form-group">
            <label htmlFor="edit-workflow-name-input">
              ワークフロー名 <span className="required">*</span>
            </label>
            <input
              id="edit-workflow-name-input"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="例: 購買申請ワークフロー"
              maxLength={100}
              required
            />
            <div className="form-hint">
              {name.length}/100 文字
            </div>
          </div>

          {/* Description Input */}
          <div className="form-group">
            <label htmlFor="edit-workflow-description-input">
              説明（任意）
            </label>
            <textarea
              id="edit-workflow-description-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="例: 10万円以上の購買申請に使用するワークフロー"
              rows={4}
              maxLength={500}
            />
            <div className="form-hint">
              {description.length}/500 文字
            </div>
          </div>

          {/* Buttons */}
          <div className="modal-footer">
            <button type="button" className="button secondary" onClick={onClose}>
              キャンセル
            </button>
            <button type="submit" className="button primary">
              <FiEdit />
              更新
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMetadataDialog;
