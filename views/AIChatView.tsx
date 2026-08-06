import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { AppDestination } from '../types';
import { getLocalMathSuggestion, MATH_CS_SYSTEM_INSTRUCTION } from '../services/geminiService';
import { CosmicPageHeader } from '../components/cosmic/CosmicPageHeader';

interface AIChatViewProps { context?: AppDestination; onNavigate?: (destination: AppDestination) => void; }

export const AIChatView: React.FC<AIChatViewProps> = ({ context }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    { role: 'assistant', text: 'I am the Math-CS Assistant. I support Mathematical Analysis and Linear Algebra & Geometry with one step at a time. Show your attempt, and I will help diagnose the next step.' },
  ]);
  const send = (event: React.FormEvent) => {
    event.preventDefault();
    const message = input.trim();
    if (!message) return;
    setMessages((current) => [...current, { role: 'user', text: message }, { role: 'assistant', text: getLocalMathSuggestion(message) }]);
    setInput('');
  };

  return (
    <div data-testid="assistant-shell" className="cosmic-console-shell mx-auto max-w-4xl">
      <CosmicPageHeader title="Math-CS Assistant" eyebrow="Local bounded guidance" description={context?.topicId ? `Active topic: ${context.topicId.replaceAll('-', ' ')}` : 'One careful step at a time across the approved curriculum.'} accent="blue" />
      <div className="cosmic-glass mt-5 space-y-3 rounded-2xl p-5" aria-live="polite">{messages.map((message, index) => <div key={index} className={`max-w-[85%] rounded-xl border p-3 text-sm leading-6 ${message.role === 'assistant' ? 'border-blue-300/10 bg-blue-300/7 text-blue-50' : 'ml-auto border-white/8 bg-white/8 text-white'}`}>{message.text}</div>)}</div>
      <form onSubmit={send} className="mt-4 flex gap-2"><label className="sr-only" htmlFor="assistant-message">Your mathematics question</label><input id="assistant-message" value={input} onChange={(event) => setInput(event.target.value)} className="focus-ring min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-950/90 p-3 text-white" placeholder="Show your attempted step…" /><button className="focus-ring cosmic-button rounded-xl bg-gradient-to-r from-blue-400 to-cyan-300 px-4 text-slate-950" aria-label="Send message"><Send size={18} /></button></form>
      <details className="mt-4 text-xs text-slate-500"><summary>Assistant scope</summary><p className="mt-2">{MATH_CS_SYSTEM_INSTRUCTION}</p></details>
    </div>
  );
};
