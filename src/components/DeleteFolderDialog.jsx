import React from 'react';
import { X } from 'lucide-react';

export function DeleteFolderDialog({ isOpen, onClose, onConfirm, folderName, isDeleting }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1a1b3e] rounded-lg p-6 w-96 max-w-[90vw]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Delete Folder</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={isDeleting}
          >
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <p className="text-white">
            Are you sure you want to delete the folder "{folderName}"? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

