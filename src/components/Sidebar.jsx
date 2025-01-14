import React, { useState, useCallback } from 'react';
import { Folder, LogOut, Edit2, Trash2 } from 'lucide-react';
import { RenameFolderDialog } from './RenameFolderDialog';
import { DeleteFolderDialog } from './DeleteFolderDialog';
import { useNavigate } from 'react-router-dom';

export function Sidebar({ 
  folders = [], 
  onFolderRenamed, 
  onFolderDeleted, 
  onLogout,
  isLoading = false 
}) {
  const [renamingFolder, setRenamingFolder] = useState(null);
  const [deletingFolder, setDeletingFolder] = useState(null);
  const [deletingFolderId, setDeletingFolderId] = useState(null);
  const navigate = useNavigate(); 

  const handleRename = useCallback((folderId, newName) => {
    onFolderRenamed?.(folderId, newName);
    setRenamingFolder(null);
  }, [onFolderRenamed]);

  const handleDelete = useCallback(async (folderId) => {
    try {
      setDeletingFolderId(folderId);
      await onFolderDeleted?.(folderId);
    } finally {
      setDeletingFolderId(null);
      setDeletingFolder(null);
    }
  }, [onFolderDeleted]);

  const handleLogout = () => {
    onLogout?.(); 
    navigate('/login'); 
  };

  return (
    <div className="w-64 h-full bg-[#0a0b2e] border-r border-[#1a1b3e] flex flex-col">
      <div className="p-4">
        <h2 className="text-white text-lg font-semibold flex items-center gap-2">
          <Folder className="w-5 h-5" />
          Folders
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-gray-400">Loading folders...</div>
        ) : Array.isArray(folders) && folders.length > 0 ? (
          folders.map((folder) => (
            <div 
              key={folder?.id} 
              className={`px-4 py-2 text-white hover:bg-[#1a1b3e] cursor-pointer flex items-center justify-between group ${
                deletingFolderId === folder?.id ? 'opacity-50' : ''
              }`}
            >
              <span className="truncate flex-1">{folder?.title || 'Untitled'}</span>
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setRenamingFolder(folder)}
                  className="text-gray-400 hover:text-blue-500"
                  title="Rename folder"
                  disabled={deletingFolderId === folder?.id}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeletingFolder(folder)}
                  className="text-gray-400 hover:text-red-500"
                  title="Delete folder"
                  disabled={deletingFolderId === folder?.id}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-gray-400">No folders found</div>
        )}
      </div>
      
      <button  
        className="p-4 flex items-center gap-2 text-white hover:bg-[#1a1b3e] transition-colors"
        onClick={handleLogout}
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>

      {renamingFolder && (
        <RenameFolderDialog
          isOpen={!!renamingFolder}
          onClose={() => setRenamingFolder(null)}
          onRename={(newName) => handleRename(renamingFolder?.id, newName)}
          folderName={renamingFolder?.title || ''}
          folderId={renamingFolder?.id}
        />
      )}

      {deletingFolder && (
        <DeleteFolderDialog
          isOpen={!!deletingFolder}
          onClose={() => setDeletingFolder(null)}
          onConfirm={() => handleDelete(deletingFolder?.id)}
          folderName={deletingFolder?.title || ''}
          isDeleting={deletingFolderId === deletingFolder?.id}
        />
      )}
    </div>
  );
}
