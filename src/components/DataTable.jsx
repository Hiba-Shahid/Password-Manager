import React from 'react';

export function DataTable({ folders = [], isLoading = false }) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <div className="w-32 h-32 mb-6 relative">
          <div className="absolute inset-0 bg-blue-500 opacity-20 rounded-full animate-pulse"></div>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Loading...
        </h3>
      </div>
    );
  }

  if (!Array.isArray(folders) || folders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <div className="w-32 h-32 mb-6 relative">
          <div className="absolute inset-0 bg-blue-500 opacity-20 rounded-full"></div>
          <img 
            src="https://neuropassword.com/securityLogo.png"
            alt="Security Shield" 
            className="w-full h-full object-contain"
          />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Secure Your First Password with Us
        </h3>
        <p className="text-gray-400 text-center max-w-md">
          Take the first step towards safeguarding your digital world. Add your first password now and
          experience top-notch security, ease of access, and peace of mind. Start building your vault and
          protect what matters most.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-[#1a1b3e] text-white">
            <th className="w-8 p-3">
              <input type="checkbox" className="rounded" />
            </th>
            <th className="p-3 text-left">TITLE</th>
            <th className="p-3 text-left">USERNAME</th>
            <th className="p-3 text-left">URL</th>
            <th className="p-3 text-left">FOLDERS</th>
            <th className="p-3 text-left">MODIFIED</th>
          </tr>
        </thead>
        <tbody>
          {folders.map((folder) => (
            <tr key={folder?.id || Math.random()} className="border-b border-[#1a1b3e] text-white">
              <td className="p-3">
                <input type="checkbox" className="rounded" />
              </td>
              <td className="p-3">-</td>
              <td className="p-3">-</td>
              <td className="p-3">-</td>
              <td className="p-3">{folder?.title || 'Untitled'}</td>
              <td className="p-3">
                {folder?.createdAt ? new Date(folder.createdAt).toLocaleDateString() : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

