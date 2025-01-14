import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { authService } from '../services/api';

export default function Login() {
  const [keySeed, setKeySeed] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    if (token && isAuthenticated === 'true') {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (isLoading || !keySeed.trim()) return;
    
    setError('');
    setIsLoading(true);

    try {
      const cleanedSeed = keySeed.trim();
      const response = await authService.validateSeed(cleanedSeed);
      
      if (response && response.valid && response.tokens) {
        localStorage.setItem('seedPhrase', cleanedSeed);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('access_token', response.tokens.access);
        localStorage.setItem('refresh_token', response.tokens.refresh);
        navigate('/dashboard', { replace: true });
      } else {
        setError('Invalid seed phrase. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.detail || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [keySeed, isLoading, navigate]);

  const handleInputChange = useCallback((e) => {
    setKeySeed(e.target.value);
    setError('');
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0b2e] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-[#1a1b3e] rounded-full flex items-center justify-center mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">Log In</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="keySeed" className="block text-sm font-medium text-white mb-2">
              Key Seed
            </label>
            <input
              id="keySeed"
              type="text"
              value={keySeed}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-[#1a1b3e] text-white rounded-lg focus:outline-none focus:ring-2 ${
                error ? 'ring-2 ring-red-500 focus:ring-red-500' : 'focus:ring-purple-500'
              }`}
              placeholder="Enter your key seed..."
              required
              disabled={isLoading}
            />
            {error && (
              <p className="mt-2 text-sm text-red-500 bg-red-500/10 p-2 rounded">
                {error}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className={`flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </div>
        </form>

        <p className="text-center">
          <Link to="/register" className="text-purple-400 hover:text-purple-300">
            Don't have an account? Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

