import React, { useState } from 'react';
import { X } from 'lucide-react';
import { folderService } from '../services/api';

export function RenameFolderDialog({ isOpen, onClose, onRename, folderName = '', folderId }) {
  const [newName, setNewName] = useState(folderName);
  const [isRenaming, setIsRenaming] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newName.trim()) {
      setError('Folder name cannot be empty');
      return;
    }

    try {
      setIsRenaming(true);
      setError('');
      
      await folderService.renameFolder(folderId, newName.trim());
      onRename(newName.trim());
      onClose();
    } catch (error) {
      console.error('Error renaming folder:', error);
      setError(error.response?.data?.message || 'Failed to rename folder. Please try again.');
    } finally {
      setIsRenaming(false);
    }
  };

  const handleClose = () => {
    if (!isRenaming) {
      setError('');
      setNewName(folderName);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1a1b3e] rounded-lg p-6 w-96 max-w-[90vw]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Rename Folder</h2>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={isRenaming}
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                setError('');
              }}
              className={`w-full px-3 py-2 bg-[#0a0b2e] text-white rounded-md focus:outline-none focus:ring-2 ${
                error ? 'ring-2 ring-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
              }`}
              placeholder="Enter new folder name"
              disabled={isRenaming}
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-red-500">
                {error}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
              disabled={isRenaming}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={isRenaming}
            >
              {isRenaming ? 'Renaming...' : 'Rename'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

