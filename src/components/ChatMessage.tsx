import React from 'react';
import { ChatMessage as ChatMessageType } from '../types';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === 'model';

  return (
    <div className={`flex ${isModel ? 'justify-start' : 'justify-end'} group`}>
      <div
        className={`max-w-[85%] rounded-3xl px-5 py-4 shadow-sm relative transition-all ${
          isModel
            ? 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
            : 'bg-emerald-600 text-white rounded-tr-none shadow-emerald-100'
        }`}
      >
        <div className={`text-[10px] font-black uppercase tracking-tighter mb-1.5 opacity-60 flex items-center gap-1.5 ${isModel ? 'text-emerald-600' : 'text-emerald-100'}`}>
          {isModel ? (
            <>
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              PickMe AI Support
            </>
          ) : (
            'You'
          )}
        </div>
        <div className="text-[14px] leading-relaxed font-medium whitespace-pre-wrap">
          {message.text}
        </div>
        <div className={`text-[9px] mt-2 font-bold opacity-40 text-right uppercase tracking-widest`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;