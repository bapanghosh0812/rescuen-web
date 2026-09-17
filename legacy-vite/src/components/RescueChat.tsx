import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, User, HelpCircle, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';

export default function RescueChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'ai', text: 'Hello! I am RESCUEN AI Assistant, your 24/7 personal safety companion. Ask me any emergency guidance question or how to configure your radar dashboard safely.', timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const samplePrompts = [
    "What to do if I'm being followed?",
    "How does the 1KM radar work?",
    "Tips on battery optimization for safety apps"
  ];

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-6).map(m => ({ // send last 6 messages
            sender: m.sender,
            text: m.text
          }))
        })
      });

      const data = await response.json();
      
      const aiResponseText = data.reply || "I encountered an error generating an answer. Please check your network or try again.";
      
      setMessages(prev => [...prev, {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date()
      }]);
    } catch (err: any) {
      console.error("AI Assistant Chat Error:", err);
      // Graceful local fallback to avoid breaking the UI
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: `ai_${Date.now()}`,
          sender: 'ai',
          text: `Offline responder: I sensed an error reaching the server, but here is a safety tip: If you feel immediate danger, please deploy the long-press SOS button on this page of your RESCUEN account, which bypasses server connections by arming silent client-side dispatches, and trigger the wailing Acoustic Siren immediately.`,
          timestamp: new Date()
        }]);
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  return (
    <div id="rescue-chat-container" className="bg-surface-container border border-white/10 rounded-2xl p-6 flex flex-col h-[460px] overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-orange-500/20 text-orange-400 rounded-lg">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-headline-md text-base text-on-surface font-semibold flex items-center gap-1.5">
              RESCUEN AI Assistant
              <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
            </h4>
            <p className="text-[10px] text-on-surface-variant leading-none">Powered by Gemini NLP Core</p>
          </div>
        </div>
        <span className="text-[9px] uppercase tracking-wider font-mono text-orange-400 font-bold bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
          NLP LIVE CHATBOT
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1.5 scrollbar-thin select-none"
      >
        {messages.map(msg => (
          <div 
            key={msg.id} 
            className={`flex gap-2 w-full max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
          >
            <div className={`p-2 rounded-lg shrink-0 ${msg.sender === 'user' ? 'bg-blue-600/20 text-blue-400' : 'bg-orange-500/10 text-orange-400'}`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            
            <div className={`rounded-xl p-3 text-xs leading-relaxed ${
              msg.sender === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white/5 text-on-surface border border-white/10 rounded-tl-none whitespace-pre-wrap'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2 mr-auto w-full max-w-[85%]">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            
            <div className="rounded-xl p-3 bg-white/5 border border-white/10 text-xs text-on-surface-variant flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-400" />
              <span>Analyzing emergency logs, routing response vectors...</span>
            </div>
          </div>
        )}
      </div>

      {/* Presets and Chat input */}
      <div className="shrink-0 space-y-3">
        {/* Preset Prompt Chips */}
        {messages.length === 1 && !isLoading && (
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="text-[10px] bg-white/5 hover:bg-white/10 border border-white/10 text-on-surface-variant hover:text-on-surface px-2.5 py-1.5 rounded-lg transition-all text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="flex gap-2">
          <input
            type="text"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-white leading-normal"
            placeholder="Type a safety question or report incident..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-500 text-white px-3.5 py-2 rounded-xl transition-all flex items-center justify-center disabled:opacity-50 cursor-pointer"
            disabled={isLoading || !inputText.trim()}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
