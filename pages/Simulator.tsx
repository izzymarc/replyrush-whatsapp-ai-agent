
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Smartphone, Info } from 'lucide-react';
import { generateAIResponse } from '../services/geminiService';
import { getDb, updateConversation, addOrder } from '../services/mockDb';
import { Conversation, Message, Order, OrderStatus } from '../types';

export const Simulator: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'm1', sender: 'ai', content: 'Good day! How can I help you today?', timestamp: new Date().toISOString() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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

    // Prepare history for AI
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

    // Handle order creation if AI detected intent
    if (result.order_intent && result.extracted_order_fields) {
      const { customerName, deliveryAddress, items } = result.extracted_order_fields;
      if (customerName && deliveryAddress && items?.length > 0) {
        
        // Find products in DB to get real info
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
      }
    }

    // Save to conversation logs
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">WhatsApp Simulator</h1>
          <p className="text-slate-500">Test how your AI agent behaves before going live.</p>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] p-4 border-[8px] border-slate-800 shadow-2xl relative mx-auto w-full max-w-sm aspect-[9/18.5]">
          {/* Phone Screen */}
          <div className="bg-[#e5ddd5] w-full h-full rounded-[1.8rem] overflow-hidden flex flex-col relative">
            {/* Header */}
            <div className="bg-[#075e54] text-white p-4 pt-8 flex items-center space-x-3">
              <div className="w-8 h-8 bg-slate-300 rounded-full flex-shrink-0"></div>
              <div>
                <p className="text-sm font-bold">{getDb().business.name}</p>
                <p className="text-[10px] opacity-80 italic">Typically replies instantly</p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2 pb-16">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-2 px-3 rounded-lg text-xs shadow-sm ${
                    msg.sender === 'customer' ? 'bg-[#dcf8c6] text-slate-800' : 'bg-white text-slate-800'
                  }`}>
                    {msg.content}
                    <p className="text-[8px] text-slate-400 text-right mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-2 px-3 rounded-lg text-xs shadow-sm flex space-x-1">
                    <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="absolute bottom-0 left-0 right-0 p-2 bg-slate-100 flex items-center space-x-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..." 
                className="flex-1 bg-white px-4 py-2 rounded-full text-xs focus:outline-none"
              />
              <button 
                type="submit" 
                disabled={isLoading}
                className="bg-[#075e54] text-white p-2 rounded-full hover:bg-[#128c7e] transition-colors disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 text-emerald-600 mb-4">
            <Info size={20} />
            <h2 className="font-bold">How it works</h2>
          </div>
          <ul className="text-sm text-slate-600 space-y-3">
            <li className="flex items-start">
              <span className="bg-slate-100 text-slate-700 w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold mr-2 mt-0.5">1</span>
              The AI uses your <b>Product Catalog</b> and <b>FAQs</b> to answer questions.
            </li>
            <li className="flex items-start">
              <span className="bg-slate-100 text-slate-700 w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold mr-2 mt-0.5">2</span>
              If it detects an order, it automatically extracts details into your <b>Orders</b> table.
            </li>
            <li className="flex items-start">
              <span className="bg-slate-100 text-slate-700 w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold mr-2 mt-0.5">3</span>
              It maintains a polite Nigerian business tone.
            </li>
          </ul>
        </div>

        <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
           <h3 className="text-emerald-800 font-bold mb-2">Try these prompts:</h3>
           <div className="space-y-2">
              {['"How much is the iPhone 15?"', '"Where is your shop?"', '"I want to buy a MacBook. My name is Tolu and I stay at Gbagada."'].map((p, i) => (
                <button 
                  key={i}
                  onClick={() => setInput(p.replace(/"/g, ''))}
                  className="w-full text-left text-xs bg-white p-2 rounded border border-emerald-100 hover:border-emerald-300 text-emerald-700"
                >
                  {p}
                </button>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};
