/**
 * Toolbar Component
 * Top toolbar with workflow actions (save, load, export, etc.)
 */

import { useState, useEffect } from 'react';
import { 
  FiDownload, 
  FiEye, 
  FiSave, 
  FiAlertCircle, 
  FiFolder, 
  FiUpload,
  FiFilePlus 
} from 'react-icons/fi';
import { useWorkflowStore } from '../../store/workflowStore';
import { convertWorkflowToBpmn, validateBpmn, generateBpmnFileName } from '../../utils/bpmnConverter';
import { 
  getWorkflowById, 
  exportWorkflowToJson, 
  importWorkflowFromJson,
  getWorkflowCount 
} from '../../utils/storageHelper';
import XmlPreviewModal from './XmlPreviewModal';
import SaveDialog from './SaveDialog';
import WorkflowListModal from './WorkflowListModal';
import EditMetadataDialog from './EditMetadataDialog';
import './Toolbar.css';

const Toolbar = () => {
  const { nodes, edges, assignees, currentWorkflow, saveWorkflow, loadWorkflow, clearWorkflow } = useWorkflowStore();
  const [showPreview, setShowPreview] = useState(false);
  const [bpmnXml, setBpmnXml] = useState<string>('');
  const [workflowName, setWorkflowName] = useState('承認ワークフロー');
  const [showValidation, setShowValidation] = useState(false);
  
  // New state for Phase 4 features
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showWorkflowList, setShowWorkflowList] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editWorkflowId, setEditWorkflowId] = useState<string>('');
  const [workflowCount, setWorkflowCount] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Update workflow count on mount and when workflows change
  useEffect(() => {
    updateWorkflowCount();
  }, []);

  // Update workflow name when current workflow changes
  useEffect(() => {
    if (currentWorkflow) {
      setWorkflowName(currentWorkflow.name);
    }
  }, [currentWorkflow]);

  // Track unsaved changes
  useEffect(() => {
    if (currentWorkflow) {
      // Check if nodes/edges have changed since last save
      const currentState = JSON.stringify({ nodes, edges, assignees });
      const savedState = JSON.stringify({
        nodes: currentWorkflow.nodes,
        edges: currentWorkflow.edges,
        assignees: currentWorkflow.assignees,
      });
      setHasUnsavedChanges(currentState !== savedState);
    } else {
      // New workflow with content
      setHasUnsavedChanges(nodes.length > 0);
    }
  }, [nodes, edges, assignees, currentWorkflow]);

  /**
   * Update workflow count
   */
  const updateWorkflowCount = () => {
    setWorkflowCount(getWorkflowCount());
  };

  /**
   * Handles workflow save
   */
  const handleSave = (name: string, description?: string) => {
    try {
      saveWorkflow(name, description);
      setWorkflowName(name);
      updateWorkflowCount();
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to save workflow:', error);
      alert('ワークフローの保存に失敗しました');
    }
  };

  /**
   * Handles workflow load
   */
  const handleLoadWorkflow = (id: string) => {
    try {
      const workflow = getWorkflowById(id);
      if (workflow) {
        // Check for unsaved changes
        if (hasUnsavedChanges) {
          const confirmed = window.confirm(
            '保存されていない変更があります。\n読み込むと変更が失われますが、よろしいですか？'
          );
          if (!confirmed) return;
        }

        loadWorkflow(workflow);
        setWorkflowName(workflow.name);
        setShowWorkflowList(false);
        setHasUnsavedChanges(false);
      } else {
        alert('ワークフローが見つかりませんでした');
      }
    } catch (error) {
      console.error('Failed to load workflow:', error);
      alert('ワークフローの読み込みに失敗しました');
    }
  };

  /**
   * Handles edit workflow metadata
   */
  const handleEditWorkflow = (id: string) => {
    setEditWorkflowId(id);
    setShowWorkflowList(false);
    setShowEditDialog(true);
  };

  /**
   * Handles metadata save
   */
  const handleMetadataSaved = () => {
    updateWorkflowCount();
    // If editing current workflow, update the name
    if (currentWorkflow?.id === editWorkflowId) {
      const workflow = getWorkflowById(editWorkflowId);
      if (workflow) {
        setWorkflowName(workflow.name);
      }
    }
  };

  /**
   * Handles new workflow (clear canvas)
   */
  const handleNew = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        '保存されていない変更があります。\n新規作成すると変更が失われますが、よろしいですか？'
      );
      if (!confirmed) return;
    }

    clearWorkflow();
    setWorkflowName('承認ワークフロー');
    setHasUnsavedChanges(false);
  };

  /**
   * Handles JSON export
   */
  const handleExportJson = () => {
    try {
      if (nodes.length === 0) {
        alert('ワークフローが空です');
        return;
      }

      // Create a workflow object for export
      const workflow = currentWorkflow || {
        id: crypto.randomUUID(),
        name: workflowName,
        description: undefined,
        nodes,
        edges,
        assignees,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const json = exportWorkflowToJson(workflow);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${workflowName.replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '_')}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export JSON:', error);
      alert('JSONのエクスポートに失敗しました');
    }
  };

  /**
   * Handles JSON import
   */
  const handleImportJson = () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json,.json';
      
      input.onchange = (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const json = event.target?.result as string;
            const workflow = importWorkflowFromJson(json);

            // Check for unsaved changes
            if (hasUnsavedChanges) {
              const confirmed = window.confirm(
                '保存されていない変更があります。\nインポートすると変更が失われますが、よろしいですか？'
              );
              if (!confirmed) return;
            }

            loadWorkflow(workflow);
            setWorkflowName(workflow.name);
            setHasUnsavedChanges(false);
            alert('ワークフローをインポートしました');
          } catch (error) {
            console.error('Failed to import workflow:', error);
            alert('ワークフローのインポートに失敗しました。ファイルの形式を確認してください。');
          }
        };
        reader.readAsText(file);
      };

      input.click();
    } catch (error) {
      console.error('Failed to import JSON:', error);
      alert('JSONのインポートに失敗しました');
    }
  };

  /**
   * Handles BPMN export (download)
   */
  const handleExportBpmn = () => {
    try {
      const xml = convertWorkflowToBpmn(nodes, edges, assignees, workflowName);
      const blob = new Blob([xml], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = generateBpmnFileName(workflowName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export BPMN:', error);
      alert('BPMN XMLのエクスポートに失敗しました');
    }
  };

  /**
   * Handles XML preview
   */
  const handlePreview = () => {
    try {
      const xml = convertWorkflowToBpmn(nodes, edges, assignees, workflowName);
      setBpmnXml(xml);
      setShowPreview(true);
    } catch (error) {
      console.error('Failed to generate preview:', error);
      alert('プレビューの生成に失敗しました');
    }
  };

  /**
   * Handles validation toggle
   */
  const handleValidate = () => {
    setShowValidation(!showValidation);
  };

  /**
   * Validates current workflow
   */
  const validation = validateBpmn(nodes, edges);
  const hasErrors = validation.errors.length > 0;
  const hasWarnings = validation.warnings.length > 0;

  return (
    <>
      <div className="toolbar">
        <div className="toolbar-left">
          <div className="toolbar-title">
            <h1>ワークフローエディター</h1>
          </div>
          <div className="toolbar-divider" />
          <div className="workflow-name-input">
            <label htmlFor="workflow-name">ワークフロー名:</label>
            <input
              id="workflow-name"
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              placeholder="ワークフロー名を入力"
            />
          </div>
        </div>

        <div className="toolbar-right">
          {/* Unsaved Changes Indicator */}
          {hasUnsavedChanges && (
            <span className="unsaved-indicator" title="保存されていない変更があります">
              ●
            </span>
          )}

          {/* New Workflow Button */}
          <button
            className="toolbar-button"
            onClick={handleNew}
            title="新規ワークフロー"
          >
            <FiFilePlus />
            新規
          </button>

          {/* Save Button */}
          <button
            className="toolbar-button"
            onClick={() => setShowSaveDialog(true)}
            disabled={nodes.length === 0}
            title="ワークフローを保存"
          >
            <FiSave />
            保存
          </button>

          {/* Load Button */}
          <button
            className="toolbar-button"
            onClick={() => setShowWorkflowList(true)}
            title={`保存済みワークフロー (${workflowCount}件)`}
          >
            <FiFolder />
            読み込み
            {workflowCount > 0 && (
              <span className="workflow-count-badge">{workflowCount}</span>
            )}
          </button>

          <div className="toolbar-divider" />

          {/* Import JSON Button */}
          <button
            className="toolbar-button"
            onClick={handleImportJson}
            title="JSON からインポート"
          >
            <FiUpload />
            インポート
          </button>

          {/* Export JSON Button */}
          <button
            className="toolbar-button"
            onClick={handleExportJson}
            disabled={nodes.length === 0}
            title="JSON でエクスポート"
          >
            <FiDownload />
            JSON
          </button>

          <div className="toolbar-divider" />

          {/* Validation Indicator */}
          <button
            className={`toolbar-button validation-button ${hasErrors ? 'error' : hasWarnings ? 'warning' : 'success'}`}
            onClick={handleValidate}
            title="検証結果を表示"
          >
            <FiAlertCircle />
            {hasErrors ? 'エラー' : hasWarnings ? '警告' : '正常'}
          </button>

          {/* Preview Button */}
          <button
            className="toolbar-button"
            onClick={handlePreview}
            disabled={nodes.length === 0}
            title="XML プレビュー"
          >
            <FiEye />
            プレビュー
          </button>

          {/* Export BPMN Button */}
          <button
            className="toolbar-button primary"
            onClick={handleExportBpmn}
            disabled={nodes.length === 0}
            title="BPMN XML をダウンロード"
          >
            <FiDownload />
            BPMN
          </button>
        </div>
      </div>

      {/* Validation Panel */}
      {showValidation && (
        <div className="validation-panel">
          <div className="validation-header">
            <h3>検証結果</h3>
            <button className="close-button" onClick={() => setShowValidation(false)}>
              ×
            </button>
          </div>
          
          {validation.errors.length > 0 && (
            <div className="validation-section error-section">
              <h4>❌ エラー ({validation.errors.length})</h4>
              <ul>
                {validation.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          
          {validation.warnings.length > 0 && (
            <div className="validation-section warning-section">
              <h4>⚠️ 警告 ({validation.warnings.length})</h4>
              <ul>
                {validation.warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          )}
          
          {validation.errors.length === 0 && validation.warnings.length === 0 && (
            <div className="validation-section success-section">
              <h4>✅ 検証成功</h4>
              <p>ワークフローは正常です。エラーや警告はありません。</p>
            </div>
          )}
        </div>
      )}

      {/* XML Preview Modal */}
      {showPreview && (
        <XmlPreviewModal
          xml={bpmnXml}
          fileName={generateBpmnFileName(workflowName)}
          onClose={() => setShowPreview(false)}
        />
      )}

      {/* Save Dialog */}
      {showSaveDialog && (
        <SaveDialog
          onClose={() => setShowSaveDialog(false)}
          onSave={handleSave}
          initialName={currentWorkflow?.name || workflowName}
          initialDescription={currentWorkflow?.description}
        />
      )}

      {/* Workflow List Modal */}
      {showWorkflowList && (
        <WorkflowListModal
          onClose={() => setShowWorkflowList(false)}
          onLoadWorkflow={handleLoadWorkflow}
          onEditWorkflow={handleEditWorkflow}
        />
      )}

      {/* Edit Metadata Dialog */}
      {showEditDialog && editWorkflowId && (
        <EditMetadataDialog
          workflowId={editWorkflowId}
          initialName={getWorkflowById(editWorkflowId)?.name || ''}
          initialDescription={getWorkflowById(editWorkflowId)?.description}
          onClose={() => {
            setShowEditDialog(false);
            setShowWorkflowList(true);
          }}
          onSave={handleMetadataSaved}
        />
      )}
    </>
  );
};

export default Toolbar;
