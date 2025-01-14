import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { authService } from '../services/api';


export default function Register() {
  const [showSeed, setShowSeed] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const generateSeed = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await authService.generateSeed();
      if (response && response.seedPhrase) {
        setSeedPhrase(response.seedPhrase);
        setShowSeed(true);
      } else {
        setError('Failed to generate seed phrase');
      }
    } catch (error) {
      console.error('Failed to generate seed:', error);
      setError('Failed to generate seed phrase. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(seedPhrase);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0b2e] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-[#1a1b3e] rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Register Account</h2>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        {!showSeed ? (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-white font-medium mb-4">Important Note:</h3>
              <p className="text-gray-300 text-center">
                On the next page you will see a series of words. This is your unique and private
                seed phrase and it is the ONLY way to recover your wallet in case of loss. It
                is your responsibility to write it down and store it in a safe place outside of the
                password manager app.
              </p>
            </div>

            <button
              onClick={generateSeed}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Generating seed phrase...' : 'I understand, show my seed'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-[#1a1b3e] p-6 rounded-lg">
              <h3 className="text-white font-medium mb-4">Your Seed Phrase:</h3>
              <p className="text-purple-400 break-words font-mono">
                {seedPhrase}
              </p>
            </div>

            <div className="space-y-4">
            <button
                onClick={() => navigate('/login')}
                className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors">
                I've saved my seed phrase
              </button>
              <button
                onClick={handleCopyToClipboard}
                className="w-full py-3 px-4 bg-[#1a1b3e] hover:bg-[#2a2b4e] text-white font-medium rounded-lg transition-colors"
              >
                Copy To ClipBoard
              </button>
            </div>
          </div>
        )}

        <p className="text-center">
          <Link to="/login" className="text-purple-400 hover:text-purple-300">
            Already have account? Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

