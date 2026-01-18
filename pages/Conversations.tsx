
import React, { useState, useEffect } from 'react';
import { MessageSquare, Search, User, Bot, Clock, ToggleLeft, ToggleRight } from 'lucide-react';
import { getDb, toggleConversationHandling } from '../services/mockDb';
import { Conversation } from '../types';

export const Conversations: React.FC = () => {
  const [db, setDb] = useState(getDb());
  const [selectedId, setSelectedId] = useState<string | null>(db.conversations[0]?.id || null);

  useEffect(() => {
    const interval = setInterval(() => setDb(getDb()), 3000); // Polling for live simulator updates
    return () => clearInterval(interval);
  }, []);

  const selectedConv = db.conversations.find(c => c.id === selectedId);

  const handleHandoffToggle = (id: string, currentMode: 'ai' | 'human') => {
    const newMode = currentMode === 'ai' ? 'human' : 'ai';
    toggleConversationHandling(id, newMode);
    setDb(getDb());
  };

  return (
    <div className="h-[calc(100vh-160px)] flex bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* List */}
      <div className="w-80 border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Conversations</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search chats..." 
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {db.conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedId(conv.id)}
              className={`w-full p-4 flex items-start space-x-3 text-left transition-all ${
                selectedId === conv.id ? 'bg-emerald-50 border-r-4 border-emerald-500 shadow-inner' : 'hover:bg-slate-50'
              }`}
            >
              <div className="relative">
                <div className="w-10 h-10 flex-shrink-0 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold border border-slate-300">
                  {conv.customerName.charAt(0)}
                </div>
                {conv.handledBy === 'human' && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 border-2 border-white rounded-full flex items-center justify-center">
                    <User size={8} className="text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-800 truncate">{conv.customerName}</span>
                  <span className="text-[10px] text-slate-400">{new Date(conv.lastSeen).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <p className="text-xs text-slate-500 truncate">{conv.lastMessage}</p>
                <div className="flex items-center mt-2">
                   <div className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                     conv.handledBy === 'ai' ? 'text-emerald-600 bg-emerald-100' : 'text-blue-600 bg-blue-100'
                   }`}>
                     {conv.handledBy}
                   </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat View */}
      <div className="flex-1 flex flex-col bg-slate-50">
        {selectedConv ? (
          <>
            <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center shadow-sm z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
                  {selectedConv.customerName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{selectedConv.customerName}</h3>
                  <p className="text-xs text-slate-500">{selectedConv.customerWhatsapp}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 mr-4">
                  <span className="text-xs font-semibold text-slate-500">AI Agent</span>
                  <button onClick={() => handleHandoffToggle(selectedConv.id, selectedConv.handledBy)}>
                    {selectedConv.handledBy === 'ai' ? (
                      <ToggleLeft className="text-slate-300" size={32} />
                    ) : (
                      <ToggleRight className="text-blue-600" size={32} />
                    )}
                  </button>
                  <span className="text-xs font-semibold text-blue-600">Human</span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {selectedConv.messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[70%] rounded-2xl p-4 shadow-sm relative ${
                    msg.sender === 'customer' 
                      ? 'bg-white text-slate-800 rounded-tl-none border border-slate-100' 
                      : msg.sender === 'ai'
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-blue-600 text-white rounded-tr-none'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <div className={`text-[10px] mt-2 flex items-center ${
                      msg.sender === 'customer' ? 'text-slate-400' : 'text-white/80'
                    }`}>
                      <Clock size={10} className="mr-1" />
                      {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      {msg.sender === 'ai' && <span className="ml-2 font-bold">[AI Agent]</span>}
                      {msg.sender === 'human' && <span className="ml-2 font-bold">[You]</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-white border-t border-slate-200">
               {selectedConv.handledBy === 'ai' ? (
                 <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-center space-x-2">
                    <Bot size={18} className="text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-800 italic">AI Agent is active. Switch to Human mode to reply manually.</span>
                 </div>
               ) : (
                 <div className="flex items-center space-x-2">
                    <input 
                      placeholder="Type your message to customer..." 
                      className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
                      Send
                    </button>
                 </div>
               )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <div className="bg-slate-100 p-6 rounded-full mb-4">
              <MessageSquare size={64} className="opacity-20" />
            </div>
            <p className="font-medium">Choose a chat to start responding</p>
          </div>
        )}
      </div>
    </div>
  );
};
