
import React, { useState } from 'react';
import { MessageSquare, Search, User, Bot, Clock } from 'lucide-react';
import { getDb } from '../services/mockDb';
import { Conversation } from '../types';

export const Conversations: React.FC = () => {
  const [db] = useState(getDb());
  const [selectedId, setSelectedId] = useState<string | null>(db.conversations[0]?.id || null);

  const selectedConv = db.conversations.find(c => c.id === selectedId);

  return (
    <div className="h-[calc(100vh-160px)] flex bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      {/* List */}
      <div className="w-80 border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Chats</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-100 bg-slate-50 outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {db.conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedId(conv.id)}
              className={`w-full p-4 flex items-start space-x-3 text-left transition-colors ${
                selectedId === conv.id ? 'bg-emerald-50 border-r-4 border-emerald-500' : 'hover:bg-slate-50'
              }`}
            >
              <div className="w-10 h-10 flex-shrink-0 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold">
                {conv.customerName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-800 truncate">{conv.customerName}</span>
                  <span className="text-[10px] text-slate-400">{new Date(conv.lastSeen).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <p className="text-xs text-slate-500 truncate">{conv.lastMessage}</p>
                <div className="flex items-center mt-2 space-x-2">
                   {conv.handledBy === 'ai' ? (
                     <span className="flex items-center text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                       <Bot size={10} className="mr-1" /> AI Agent
                     </span>
                   ) : (
                     <span className="flex items-center text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                       <User size={10} className="mr-1" /> Human
                     </span>
                   )}
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
            <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
                  {selectedConv.customerName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{selectedConv.customerName}</h3>
                  <p className="text-xs text-slate-500">{selectedConv.customerWhatsapp}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                 <button className="text-xs font-medium text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                   Take over as Human
                 </button>
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
                      ? 'bg-white text-slate-800 rounded-tl-none' 
                      : 'bg-emerald-600 text-white rounded-tr-none'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <div className={`text-[10px] mt-2 flex items-center ${
                      msg.sender === 'customer' ? 'text-slate-400' : 'text-emerald-100'
                    }`}>
                      <Clock size={10} className="mr-1" />
                      {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      {msg.sender === 'ai' && (
                        <span className="ml-2 bg-emerald-700/50 px-1 rounded flex items-center">
                           <Bot size={8} className="mr-1" /> AI
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-white border-t border-slate-200">
               <div className="flex items-center space-x-2 text-xs text-slate-400 mb-2 italic">
                 <Bot size={14} />
                 <span>AI Agent is handling this conversation...</span>
               </div>
               <div className="flex items-center space-x-2">
                 <input 
                   disabled
                   placeholder="Human intervention is disabled in auto-mode" 
                   className="flex-1 px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-400"
                 />
               </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <MessageSquare size={48} className="mb-2 opacity-20" />
            <p>Select a conversation to view history</p>
          </div>
        )}
      </div>
    </div>
  );
};
