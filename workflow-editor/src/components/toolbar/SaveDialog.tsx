/**
 * Save Dialog Component
 * 
 * Modal dialog for saving workflows with name and description.
 */

import { useState, useEffect } from 'react';
import { FiX, FiSave, FiAlertCircle } from 'react-icons/fi';
import { useWorkflowStore } from '../../store/workflowStore';
import { isWorkflowNameExists } from '../../utils/storageHelper';
import './SaveDialog.css';

interface SaveDialogProps {
  onClose: () => void;
  onSave: (name: string, description?: string) => void;
  initialName?: string;
  initialDescription?: string;
}

const SaveDialog: React.FC<SaveDialogProps> = ({
  onClose,
  onSave,
  initialName = '',
  initialDescription = '',
}) => {
  const { currentWorkflow } = useWorkflowStore();
  const [name, setName] = useState(initialName || currentWorkflow?.name || '');
  const [description, setDescription] = useState(initialDescription || currentWorkflow?.description || '');
  const [error, setError] = useState<string>('');

  // Focus on name input when dialog opens
  useEffect(() => {
    const input = document.getElementById('workflow-name-input') as HTMLInputElement;
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
    
    // Check for duplicate name (only if creating new or renaming)
    if (isWorkflowNameExists(trimmedName, currentWorkflow?.id)) {
      setError('同じ名前のワークフローが既に存在します');
      return;
    }
    
    // Save
    onSave(trimmedName, description.trim() || undefined);
    onClose();
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
      <div className="modal-content save-dialog" onClick={(e) => e.stopPropagation()} onKeyDown={handleKeyDown}>
        {/* Header */}
        <div className="modal-header">
          <h2>
            <FiSave />
            ワークフローを保存
          </h2>
          <button className="close-button" onClick={onClose} title="閉じる">
            <FiX />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="save-form">
          {/* Error Message */}
          {error && (
            <div className="error-message">
              <FiAlertCircle />
              <span>{error}</span>
            </div>
          )}

          {/* Name Input */}
          <div className="form-group">
            <label htmlFor="workflow-name-input">
              ワークフロー名 <span className="required">*</span>
            </label>
            <input
              id="workflow-name-input"
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
            <label htmlFor="workflow-description-input">
              説明（任意）
            </label>
            <textarea
              id="workflow-description-input"
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

          {/* Info Message */}
          <div className="info-message">
            <FiAlertCircle />
            <span>保存したワークフローはブラウザのLocalStorageに保存されます</span>
          </div>

          {/* Buttons */}
          <div className="modal-footer">
            <button type="button" className="button secondary" onClick={onClose}>
              キャンセル
            </button>
            <button type="submit" className="button primary">
              <FiSave />
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaveDialog;
