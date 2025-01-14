import React, { useState } from 'react';
import { X } from 'lucide-react';
import { folderService } from '../services/api'; 

export function AddFolderPopup({ onClose, onFolderAdded }) {
  const [folderName, setFolderName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!folderName.trim()) {
      setError('Folder name cannot be empty');
      return;
    }

    try {
      setIsSubmitting(true);
      const newFolder = await folderService.createFolder({ 
        title: folderName.trim(),
        created_at: new Date().toISOString()
      });
      
      if (newFolder) {
        onFolderAdded(newFolder);
        onClose();
      } else {
        setError('Failed to create folder. Please try again.');
      }
    } catch (err) {
      console.error('Error creating folder:', err);
      setError(err.message || 'Failed to create folder. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1a1b3e] rounded-lg p-6 w-96 max-w-[90vw]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Add New Folder</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter folder name"
              className="w-full px-3 py-2 bg-[#0a0b2e] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
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
              onClick={onClose}
              className="px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Folder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

