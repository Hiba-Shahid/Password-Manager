import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { DataTable } from '../components/DataTable';

const FOLDERS_STORAGE_KEY = 'np_folders';

export default function Dashboard() {
  const [folders, setFolders] = useState(() => {
    const savedFolders = localStorage.getItem(FOLDERS_STORAGE_KEY);
    return savedFolders ? JSON.parse(savedFolders) : [];
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [operationInProgress, setOperationInProgress] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders));
  }, [folders]);

  const handleFolderAdded = useCallback((newFolder) => {
    try {
      
      const folderToAdd = {
        id: newFolder.id || Date.now().toString(),
        title: newFolder.title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setFolders(prevFolders => {
        const updatedFolders = [...prevFolders, folderToAdd];
        localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(updatedFolders));
        return updatedFolders;
      });

      return Promise.resolve(folderToAdd);
    } catch (error) {
      console.error('Failed to add folder:', error);
      setError('Failed to add folder. Please try again.');
      return Promise.reject(error);
    }
  }, []);

  const handleFolderRenamed = useCallback((folderId, newTitle) => {
    try {
      setOperationInProgress(true);
      

      if (!folderId || !newTitle) {
        throw new Error('Invalid folder ID or title');
      }

      setFolders(prevFolders => {
        const folderExists = prevFolders.some(folder => folder.id === folderId);
        if (!folderExists) {
          throw new Error('No folder matches the given query.');
        }

        const updatedFolders = prevFolders.map(folder => 
          folder.id === folderId 
            ? { 
                ...folder, 
                title: newTitle,
                updatedAt: new Date().toISOString()
              } 
            : folder
        );
        localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(updatedFolders));
        return updatedFolders;
      });

      return Promise.resolve(true);
    } catch (error) {
      console.error('Failed to rename folder:', error);
      setError(error.message || 'Failed to rename folder. Please try again.');
      return Promise.reject(error);
    } finally {
      setOperationInProgress(false);
    }
  }, []);

  const handleFolderDeleted = useCallback((folderId) => {
    try {
      setOperationInProgress(true);

    
      if (!folderId) {
        throw new Error('Invalid folder ID');
      }

      setFolders(prevFolders => {
        const folderExists = prevFolders.some(folder => folder.id === folderId);
        if (!folderExists) {
          throw new Error('No folder matches the given query.');
        }

        const updatedFolders = prevFolders.filter(folder => folder.id !== folderId);
        localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(updatedFolders));
        return updatedFolders;
      });

      return Promise.resolve(true);
    } catch (error) {
      console.error('Failed to delete folder:', error);
      setError(error.message || 'Failed to delete folder. Please try again.');
      return Promise.reject(error);
    } finally {
      setOperationInProgress(false);
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('seedPhrase');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem(FOLDERS_STORAGE_KEY);
    navigate('/login');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0a0b2e]">
      <Header 
        onFolderAdded={handleFolderAdded} 
        disabled={operationInProgress}
      />
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar 
          folders={folders} 
          onFolderRenamed={handleFolderRenamed}
          onFolderDeleted={handleFolderDeleted}
          onLogout={handleLogout}
          isLoading={loading}
          disabled={operationInProgress}
        />
        <main className="flex-1 overflow-hidden">
          <DataTable 
            folders={folders} 
            isLoading={loading}
          />
          {error && (
            <div className="fixed bottom-4 right-4 p-4 bg-red-500/10 text-red-500 rounded-md shadow-lg">
              <div className="flex items-center space-x-2">
                <span>{error}</span>
                <button 
                  onClick={() => setError(null)}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

