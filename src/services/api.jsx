import axios from 'axios';

const BASE_URL = 'https://dev.api.neuropassword.com/api/';
const FOLDERS_STORAGE_KEY = 'np_folders';


const tokenUtils = {
  getToken: () => localStorage.getItem('access_token'),
  setTokens: (tokens) => {
    if (tokens.access) {
      localStorage.setItem('access_token', tokens.access);
      api.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;
    }
    if (tokens.refresh) {
      localStorage.setItem('refresh_token', tokens.refresh);
    }
  },
  removeTokens: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    delete api.defaults.headers.common['Authorization'];
  },
  isValidToken: (token) => {
    return token && typeof token === 'string' && token.length > 0;
  }
};

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('isAuthenticated');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


export const folderService = {
  
  getFolders: async () => {
    try {
      const response = await api.get('folders/');
      const folders = Array.isArray(response.data) ? response.data : [];
      localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders));
      return folders;
    } catch (error) {
      console.error('Error fetching folders:', error);
      
      const cachedFolders = localStorage.getItem(FOLDERS_STORAGE_KEY);
      return cachedFolders ? JSON.parse(cachedFolders) : [];
    }
  },


  createFolder: async (folderData) => {
    try {
      const response = await api.post('folders/', {
        title: folderData.title,
        created_at: new Date().toISOString()
      });
      
      const cachedFolders = JSON.parse(localStorage.getItem(FOLDERS_STORAGE_KEY) || '[]');
      const updatedFolders = [...cachedFolders, response.data];
      localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(updatedFolders));
      
      return response.data;
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  },

  updateFolder: async (id, folderData) => {
    try {
      const response = await api.put(`folders/${id}/`, folderData);
      
      const cachedFolders = JSON.parse(localStorage.getItem(FOLDERS_STORAGE_KEY) || '[]');
      const updatedFolders = cachedFolders.map(folder => 
        folder.id === id ? { ...folder, ...response.data } : folder
      );
      localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(updatedFolders));
      
      return response.data;
    } catch (error) {
      console.error('Error updating folder:', error);
      throw error;
    }
  },

   
  deleteFolder: async (id) => {
    try {
      await api.delete(`folders/${id}/`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting folder:', error);
      throw error;
    }
  },

  renameFolder: async (id, newTitle) => {
    return folderService.updateFolder(id, { title: newTitle });
  }
};

export const authService = {
  generateSeed: async () => {
    try {
      const response = await api.post('user/generate-pass-phrase/');
      return { seedPhrase: response.data.pass_phrase };
    } catch (error) {
      console.error('Error generating seed:', error);
      throw error;
    }
  },

  validateSeed: async (pass_phrase) => {
    try {
      const response = await api.post('user/generate-token/', { pass_phrase });
      
      if (response.data && response.data.access) {
        const { access, refresh } = response.data;
        tokenUtils.setTokens({ access, refresh });
        localStorage.setItem('isAuthenticated', 'true');
        
        return { 
          valid: true, 
          tokens: { access, refresh }
        };
      }
      return { valid: false };
    } catch (error) {
      console.error('Error validating seed:', error);
      tokenUtils.removeTokens();
      throw error;
    }
  },

  logout: () => {
    tokenUtils.removeTokens();
    localStorage.removeItem('seedPhrase');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('folders');
  },

  isAuthenticated: () => {
    const token = tokenUtils.getToken();
    return tokenUtils.isValidToken(token) && localStorage.getItem('isAuthenticated') === 'true';
  }
};

export { api, tokenUtils };

