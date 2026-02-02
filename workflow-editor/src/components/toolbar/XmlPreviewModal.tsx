/**
 * XML Preview Modal Component
 * Displays BPMN XML with syntax highlighting
 */

import { useState } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import xml from 'react-syntax-highlighter/dist/esm/languages/hljs/xml';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { FiX, FiDownload, FiCopy, FiCheck } from 'react-icons/fi';
import './XmlPreviewModal.css';

// Register XML language
SyntaxHighlighter.registerLanguage('xml', xml);

interface XmlPreviewModalProps {
  xml: string;
  fileName: string;
  onClose: () => void;
}

const XmlPreviewModal = ({ xml, fileName, onClose }: XmlPreviewModalProps) => {
  const [copied, setCopied] = useState(false);

  /**
   * Handles copying XML to clipboard
   */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(xml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('クリップボードへのコピーに失敗しました');
    }
  };

  /**
   * Handles downloading XML file
   */
  const handleDownload = () => {
    try {
      const blob = new Blob([xml], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download:', error);
      alert('ダウンロードに失敗しました');
    }
  };

  /**
   * Handles backdrop click
   */
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="xml-preview-modal-backdrop" onClick={handleBackdropClick}>
      <div className="xml-preview-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <h2>BPMN XML プレビュー</h2>
            <span className="file-name">{fileName}</span>
          </div>
          <button className="close-button" onClick={onClose} title="閉じる">
            <FiX />
          </button>
        </div>

        {/* Actions */}
        <div className="modal-actions">
          <button className="action-button" onClick={handleCopy} title="コピー">
            {copied ? <FiCheck /> : <FiCopy />}
            {copied ? 'コピーしました' : 'コピー'}
          </button>
          <button className="action-button primary" onClick={handleDownload} title="ダウンロード">
            <FiDownload />
            ダウンロード
          </button>
        </div>

        {/* XML Content */}
        <div className="modal-content">
          <SyntaxHighlighter
            language="xml"
            style={atomOneDark}
            showLineNumbers
            wrapLines
            customStyle={{
              margin: 0,
              padding: '1.5rem',
              fontSize: '0.875rem',
              lineHeight: '1.5',
              borderRadius: '8px',
              maxHeight: 'calc(80vh - 200px)',
              overflow: 'auto',
            }}
          >
            {xml}
          </SyntaxHighlighter>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <div className="footer-info">
            <span>サイズ: {new Blob([xml]).size.toLocaleString()} bytes</span>
            <span>行数: {xml.split('\n').length.toLocaleString()} lines</span>
          </div>
          <button className="footer-button" onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default XmlPreviewModal;
