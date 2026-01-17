import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage as ChatMessageType } from './types';
import { getChatResponse } from './services/geminiService';
import ChatMessage from './components/ChatMessage';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      role: 'model',
      text: "Hello! Welcome to PickMe Official Support. 👋\nHow can we help you with your trip or delivery today?\n\nආයුබෝවන්! PickMe නිල සහය සේවාව වෙත සාදරයෙන් පිළිගනිමු. ඔබගේ ගමන හෝ ඇණවුම සම්බන්ධයෙන් අපට ඔබට සහය විය හැක්කේ කෙසේද?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input.trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessageType = {
      role: 'user',
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const history = messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));

    const responseText = await getChatResponse(textToSend, history);

    const modelMessage: ChatMessageType = {
      role: 'model',
      text: responseText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, modelMessage]);
    setIsLoading(false);
  };

  const quickActions = [
    { label: "Trip Complaint", icon: "🚗" },
    { label: "Lost Item", icon: "🎒" },
    { label: "Refund Issue", icon: "💸" },
    { label: "Driver Behavior", icon: "👤" }
  ];

  return (
    <div className="flex flex-col h-[100dvh] max-w-2xl mx-auto bg-slate-50 overflow-hidden md:h-[95vh] md:my-[2.5vh] md:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-200">
      {/* Premium Header */}
      <header className="bg-[#00AA55] px-6 py-5 flex items-center justify-between text-white relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        
        <div className="flex items-center gap-4 z-10">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-1.5 shadow-lg border border-emerald-400 rotate-2">
             <img 
               src="https://upload.wikimedia.org/wikipedia/en/b/b3/PickMe_Logo.png" 
               alt="PickMe" 
               className="w-full h-full object-contain"
               onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x100/00AA55/white?text=PM' }}
             />
          </div>
          <div>
            <h1 className="font-black text-xl leading-none mb-1">PickMe Support</h1>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">AI Assistant Online</span>
            </div>
          </div>
        </div>
        
        <div className="text-right z-10 hidden sm:block">
          <div className="text-[10px] font-bold opacity-70 uppercase">Urgent Hotline</div>
          <div className="text-lg font-black text-yellow-300">1331</div>
        </div>
      </header>

      {/* Main Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#F8FAFC] space-y-6 scroll-smooth"
      >
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 rounded-2xl px-5 py-3 shadow-sm flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Typing...</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions Scroll */}
      {!isLoading && messages.length < 5 && (
        <div className="px-4 py-3 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto no-scrollbar">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => handleSend(action.label)}
              className="flex-shrink-0 bg-emerald-50 text-emerald-700 border border-emerald-100 px-4 py-2 rounded-full text-xs font-bold hover:bg-emerald-500 hover:text-white transition-all active:scale-95 flex items-center gap-2"
            >
              <span>{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
      )}

      {/* Modern Input Field */}
      <div className="p-4 bg-white border-t border-slate-100 pb-6 md:pb-8">
        <div className="relative group max-w-3xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Describe your issue clearly..."
            className="w-full rounded-2xl border-2 border-slate-100 focus:border-[#00AA55] focus:ring-0 min-h-[58px] max-h-32 py-4 pl-5 pr-14 resize-none transition-all text-sm font-medium placeholder:text-slate-400 shadow-sm"
            rows={1}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className={`absolute right-2.5 bottom-2.5 p-2 rounded-xl transition-all ${
              !input.trim() || isLoading 
                ? 'bg-slate-50 text-slate-300' 
                : 'bg-[#00AA55] text-white shadow-lg shadow-emerald-200 hover:bg-emerald-600 active:scale-95'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
        <p className="mt-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Secured Official Support Portal
        </p>
      </div>
    </div>
  );
};

export default App;