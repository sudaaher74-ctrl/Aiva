import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/axios';

const ChatbotLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/chatbot');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08060d] flex items-center justify-center p-4 chatbot-app m-0 absolute inset-0 z-50">
      <div className="max-w-md w-full bg-[#111] border border-[#c5a059]/30 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#c5a059]/20 blur-3xl rounded-full pointer-events-none" />
        
        <div className="text-center mb-8 relative z-10">
          <h1 className="text-3xl font-bold text-[#c5a059] mb-2">AI BOS</h1>
          <p className="text-gray-400">Secure Access Portal</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Admin Email</label>
            <input 
              type="email" 
              required
              className="w-full bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[#c5a059] transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ceo@aivaenterprises.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[#c5a059] transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#D4AF37] to-[#c5a059] text-black font-semibold rounded-lg px-4 py-3 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? 'Authenticating...' : 'Access AI Assistant'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatbotLogin;
