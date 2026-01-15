import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  docUrl?: string | null;
  title?: string;
}

const DocumentPreviewModal: React.FC<Props> = ({ isOpen, onClose, docUrl, title }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded shadow-lg w-4/5 h-4/5 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="text-lg font-medium">{title || 'Aperçu du document'}</h3>
          <button onClick={onClose} className="px-3 py-1 rounded hover:bg-gray-100">X</button>
        </div>
        <div className="flex-1">
          {docUrl ? (
            <iframe src={docUrl} className="w-full h-full" title={title || 'document-preview'} />
          ) : (
            <div className="p-4">Aucun document à afficher.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;
