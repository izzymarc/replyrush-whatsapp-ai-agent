
import React, { useState, useRef, useEffect } from 'react';
import { Send, Smartphone, Info, RefreshCw, CheckCircle2, Zap } from 'lucide-react';
import { generateAIResponse } from '../services/geminiService';
import { getDb, updateConversation, addOrder } from '../services/mockDb';
import { Conversation, Message, Order, OrderStatus } from '../types';

export const Simulator: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'm1', sender: 'ai', content: 'Good day boss! How can I help you today?', timestamp: new Date().toISOString() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOrderToast, setShowOrderToast] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleReset = () => {
    setMessages([{ id: 'm1', sender: 'ai', content: 'Good day boss! How can I help you today?', timestamp: new Date().toISOString() }]);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const db = getDb();
    const customerMsg: Message = {
      id: `sim-m-${Date.now()}`,
      sender: 'customer',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, customerMsg]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.sender === 'customer' ? 'user' as const : 'model' as const,
      text: m.content
    }));

    const result = await generateAIResponse(input, history, {
      business: db.business,
      products: db.products,
      faqs: db.faqs
    });

    const aiMsg: Message = {
      id: `sim-m-${Date.now() + 1}`,
      sender: 'ai',
      content: result.reply_message,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, aiMsg]);

    if (result.order_intent && result.extracted_order_fields) {
      const { customerName, deliveryAddress, items } = result.extracted_order_fields;
      if (customerName && deliveryAddress && items?.length > 0) {
        
        const orderItems = items.map((item: any) => {
          const product = db.products.find(p => p.name.toLowerCase().includes(item.name.toLowerCase()));
          return {
            productId: product?.id || 'unknown',
            name: product?.name || item.name,
            quantity: item.quantity || 1,
            price: product?.price || 0
          };
        });

        const subtotal = orderItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
        
        const newOrder: Order = {
          id: `ord-${Date.now()}`,
          customerName,
          customerWhatsapp: '+234000SIMULATOR',
          items: orderItems,
          totalAmount: subtotal + db.business.deliveryFee,
          deliveryAddress,
          status: OrderStatus.PENDING,
          createdAt: new Date().toISOString()
        };

        addOrder(newOrder);
        setShowOrderToast(true);
        setTimeout(() => setShowOrderToast(false), 5000);
      }
    }

    const updatedConv: Conversation = {
      id: 'sim-conv-1',
      customerName: 'Test Simulator',
      customerWhatsapp: '+234000SIMULATOR',
      lastMessage: aiMsg.content,
      lastSeen: new Date().toISOString(),
      handledBy: 'ai',
      messages: [...messages, customerMsg, aiMsg]
    };
    updateConversation(updatedConv);
    
    setIsLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">AI Sandbox</h1>
            <p className="text-slate-500 font-medium">Test your automated sales workflows.</p>
          </div>
          <button 
            onClick={handleReset}
            className="flex items-center space-x-2 text-slate-400 hover:text-indigo-600 transition-colors text-xs font-bold uppercase tracking-widest"
          >
            <RefreshCw size={14} />
            <span>Reset Flow</span>
          </button>
        </header>

        {showOrderToast && (
          <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center justify-between border border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-500 p-1.5 rounded-lg">
                <CheckCircle2 size={18} />
              </div>
              <span className="font-bold">Conversion Detected: Order #SIM-1 created.</span>
            </div>
          </div>
        )}

        {/* Modern Flagship Phone Frame */}
        <div className="bg-slate-900 rounded-[3rem] p-3.5 border-[10px] border-slate-800 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] relative mx-auto w-full max-w-[340px] aspect-[9/18.5]">
          {/* Dynamic Island */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-950 rounded-full z-20"></div>
          
          <div className="bg-[#FFFFFF] w-full h-full rounded-[2.2rem] overflow-hidden flex flex-col relative border border-slate-800 shadow-inner">
            {/* WhatsApp Inspired Header (Minimal) */}
            <div className="bg-[#F7F7F7] border-b border-slate-100 p-5 pt-12 flex items-center space-x-3">
              <div className="w-9 h-9 bg-indigo-100 rounded-full flex-shrink-0 flex items-center justify-center text-indigo-600 text-xs font-black">
                {getDb().business.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">{getDb().business.name}</p>
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Support Active</p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F0F2F5]">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-[13px] shadow-sm relative leading-relaxed ${
                    msg.sender === 'customer' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                  }`}>
                    {msg.content}
                    <p className={`text-[9px] mt-1.5 flex justify-end font-bold ${
                      msg.sender === 'customer' ? 'text-indigo-200' : 'text-slate-400'
                    }`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl text-xs shadow-sm flex items-center space-x-3 italic text-slate-400 font-medium">
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                    <span>AI Reasoning...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-white flex items-center space-x-2 border-t border-slate-50">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Say something..." 
                className="flex-1 bg-slate-100 px-5 py-3 rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-100 active:scale-90"
              >
                <Send size={16} fill="white" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 text-indigo-600 mb-6">
            <Zap size={20} fill="currentColor" />
            <h2 className="font-black uppercase tracking-widest text-xs">Test Commands</h2>
          </div>
          <div className="space-y-4">
            <div className="group">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Order Intent</p>
              <button 
                onClick={() => setInput("Hello boss, I need the iPhone 15 Pro Max and AirPods Pro 2. Please deliver to Plot 12, Lekki Epe Expressway, Lagos. Name is Segun.")}
                className="w-full text-left text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all font-medium text-slate-600"
              >
                "Complex Order @ Lekki..."
              </button>
            </div>
            <div className="group">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Policy Lookup</p>
              <button 
                onClick={() => setInput("How long does delivery take to Abuja?")}
                className="w-full text-left text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all font-medium text-slate-600"
              >
                "Delivery to Abuja?"
              </button>
            </div>
          </div>
        </div>

        <div className="bg-indigo-600 p-8 rounded-[2rem] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
           <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full -mb-10 -mr-10"></div>
           <h3 className="font-black text-lg leading-tight tracking-tight">Intelligence Mode</h3>
           <p className="text-xs mt-3 opacity-90 leading-relaxed font-medium">
             Using <b>Gemini 3 Pro</b>. The agent now utilizes Thinking Budgets to resolve ambiguous Nigerian addresses and handle local bargaining culture gracefully.
           </p>
        </div>
      </div>
    </div>
  );
};
