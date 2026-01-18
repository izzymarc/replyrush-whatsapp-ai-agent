
import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Zap } from 'lucide-react';

interface AuthProps {
  onLogin: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Mesh Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>

      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-[0_24px_64px_rgba(0,0,0,0.4)] p-10 relative z-10 border border-slate-200">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-indigo-600 text-white p-4 rounded-2xl mb-4 shadow-xl shadow-indigo-200">
            <Zap size={32} fill="currentColor" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">ReplyRush</h1>
          <p className="text-slate-500 text-center mt-3 font-medium">
            Next-gen AI Sales Infrastructure for modern commerce.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Identity</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                required 
                type="email" 
                placeholder="work@domain.com" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-medium text-slate-900"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Credentials</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                required 
                type="password" 
                placeholder="••••••••" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-medium text-slate-900"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-indigo-100 flex items-center justify-center space-x-2 transition-all active:scale-[0.98] mt-6"
          >
            <span>{isLogin ? 'Enter Workspace' : 'Create Workspace'}</span>
            <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-slate-400 text-sm font-bold hover:text-indigo-600 transition-colors"
          >
            {isLogin ? "New here? Get Started" : 'Already part of the rush? Sign In'}
          </button>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-100 text-center">
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Enterprise AI Infrastructure</span>
        </div>
      </div>
    </div>
  );
};
