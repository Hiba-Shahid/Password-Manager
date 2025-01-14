import React, { useState } from 'react';
import { Search, Plus, Folder } from 'lucide-react';
import { AddFolderPopup } from './AddFolderPopup';

export function Header({ onFolderAdded }) {
  const [isAddFolderOpen, setIsAddFolderOpen] = useState(false);

  const handleAddFolderClick = () => {
    setIsAddFolderOpen(true);
  };

  const handleClosePopup = () => {
    setIsAddFolderOpen(false);
  };

  return (
    <header className="flex items-center justify-between p-4 bg-[#0a0b2e]">
      <div className="flex items-center gap-2">
        <img 
          src="https://neuropassword.com/logov2.svg" 
          alt="Logo" 
          className="w-10 h-10"
        />
        <h1 className="text-white text-xl font-semibold">Password Manager</h1>
      </div>
      
      <div className="flex-1 mx-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 pl-10 bg-[#1a1b3e] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>
      </div>
      
      <div className="flex gap-4">
        <button className="p-2 text-white bg-[#1a1b3e] rounded-lg hover:bg-[#2a2b4e]">
          <Folder className="w-5 h-5" />
        </button>
        <button 
          className="p-2 text-white bg-[#1a1b3e] rounded-lg hover:bg-[#2a2b4e]"
          onClick={handleAddFolderClick}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {isAddFolderOpen && (
        <AddFolderPopup 
          onClose={handleClosePopup}
          onFolderAdded={onFolderAdded}
        />
      )}
    </header>
  );
}

