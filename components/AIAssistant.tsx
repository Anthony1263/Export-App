
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Loader2, Bot, User as UserIcon, Mic, Volume2 } from 'lucide-react';
import { User, SystemModule } from '../types';
import { GoogleGenAI } from "@google/genai";

interface AIAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
  user: User;
  activeModule: SystemModule;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onToggle, user, activeModule }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleVoice = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate voice trigger logic
      setTimeout(() => {
        setIsListening(false);
      }, 3000);
    }
  };

  const getModuleContext = () => {
    switch(activeModule) {
      case 'ifcms': return "The user is currently in the Finance Module. Focus on loans, credit scores, and bank interactions.";
      case 'dedcp': return "The user is currently in the Documentation Module. Focus on export manifests, certificates of origin, and compliance checks.";
      case 'remip': return "The user is currently in the Market Intelligence Module. Focus on commodity prices, buyer demand, and global trends.";
      case 'dashboard': return "The user is on the Main Dashboard. Focus on high-level overview and alerts.";
      default: return "";
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const context = getModuleContext();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `User Context: ${user.name} from ${user.companyName} (${user.role}). ${context} Question: ${userMsg}.`,
        config: {
            systemInstruction: "You are the GEPA Trade Assistant. You help Ghanaian exporters navigate trade, compliance, and finance. You are integrated into the GEPA Portal. Use professional language. Keep answers concise and actionable.",
            thinkingConfig: { thinkingBudget: 1024 }
        }
      });

      setMessages(prev => [...prev, { role: 'bot', text: response.text || "I'm sorry, I couldn't process that request." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Connection error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={onToggle}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-brand flex items-center justify-center z-[100] hover:scale-110 transition-transform active:scale-95 border-4 border-white dark:border-brand-darkbg pointer-events-auto ${isOpen ? 'bg-brand-pistachio' : 'bg-brand-jungle'}`}
      >
        {isOpen ? <X size={24} className="text-brand-jungle" /> : <MessageSquare size={24} className="text-white" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[550px] bg-white/80 dark:bg-brand-darksurface/80 backdrop-blur-xl rounded-[2.5rem] shadow-brand border border-brand-lightgray/20 dark:border-white/10 z-[100] flex flex-col overflow-hidden animate-slide-up pointer-events-auto transition-colors duration-300">
          <div className="bg-brand-jungle p-6 text-white flex items-center justify-between border-b border-white/5">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-brand-pistachio rounded-2xl flex items-center justify-center shadow-lg">
                   <Sparkles size={18} className="text-brand-jungle" />
                </div>
                <div>
                   <h3 className="font-black text-sm uppercase tracking-widest leading-none">GEPA AI</h3>
                   <div className="flex items-center gap-1.5 mt-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full shadow-pistachio-glow ${isListening ? 'bg-red-500 animate-ping' : 'bg-brand-pistachio animate-pulse'}`}></div>
                      <span className="text-[9px] text-brand-lightgray/60 font-black uppercase tracking-widest">{isListening ? 'Listening...' : 'Online'}</span>
                   </div>
                </div>
             </div>
             <button onClick={onToggle} className="text-white/40 hover:text-white transition-colors"><X size={24} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-brand-lightgray/5 dark:bg-white/5" ref={scrollRef}>
             {messages.length === 0 && (
                <div className="text-center py-10 px-6">
                   <div className="w-16 h-16 bg-white dark:bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-soft border border-brand-lightgray/20 dark:border-white/10 transition-colors">
                      <Bot className="text-brand-jungle dark:text-brand-pistachio" size={32} />
                   </div>
                   <h4 className="text-sm font-black text-brand-jungle dark:text-white uppercase tracking-widest tracking-tighter transition-colors">Assistant Active</h4>
                   <p className="text-xs text-brand-hooker dark:text-brand-lightgray/60 mt-2 leading-relaxed font-medium transition-colors">I am your trade advisor. How can I help you facilitate your exports today?</p>
                </div>
             )}
             {messages.map((m, idx) => (
               <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                  <div className={`max-w-[85%] rounded-[1.5rem] p-4 text-xs font-bold leading-relaxed shadow-soft transition-colors ${
                    m.role === 'user' 
                    ? 'bg-brand-jungle dark:bg-brand-pistachio text-white dark:text-brand-jungle rounded-br-none' 
                    : 'bg-white dark:bg-white/10 border border-brand-lightgray/20 dark:border-white/10 text-brand-jungle dark:text-white rounded-bl-none'
                  }`}>
                     {m.text}
                  </div>
               </div>
             ))}
             {isLoading && (
                <div className="flex justify-start">
                   <div className="bg-white dark:bg-white/10 border border-brand-lightgray/20 dark:border-white/10 rounded-[1.5rem] rounded-bl-none p-4 shadow-soft">
                      <Loader2 size={16} className="text-brand-pistachio animate-spin" />
                   </div>
                </div>
             )}
          </div>

          <div className="p-4 bg-white/70 dark:bg-brand-darksurface/70 backdrop-blur-md border-t border-brand-lightgray/10 dark:border-white/5">
             <form onSubmit={handleSend} className="relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="w-full bg-brand-lightgray/10 dark:bg-white/5 border-2 border-brand-lightgray/20 dark:border-white/10 rounded-2xl h-12 pl-4 pr-12 text-xs font-bold outline-none focus:border-brand-jungle dark:focus:border-brand-pistachio text-brand-jungle dark:text-white transition-all placeholder:text-brand-hooker/30 dark:placeholder:text-white/20"
                />
                <button 
                  type="button"
                  onClick={toggleVoice}
                  className={`absolute right-12 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${isListening ? 'text-red-500' : 'text-brand-hooker dark:text-brand-lightgray/40 hover:text-brand-jungle dark:hover:text-white'}`}
                >
                  <Mic size={16} />
                </button>
                <button 
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-jungle dark:bg-brand-pistachio text-white dark:text-brand-jungle rounded-xl hover:bg-brand-hooker dark:hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                   <Send size={14} />
                </button>
             </form>
          </div>
        </div>
      )}
    </>
  );
};
