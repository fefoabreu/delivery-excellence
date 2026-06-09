import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Bot, Send, FileText, Activity, Zap, RotateCcw } from 'lucide-react';
import { agentApi } from '../api/client';
import Header from '../components/layout/Header';
import GlassPanel from '../components/shared/GlassPanel';

interface Message { role: 'user' | 'assistant'; content: string; timestamp: string; }

const QUICK_PROMPTS = [
  { label: 'Draft SOW', prompt: 'Help me draft a Statement of Work for a cloud migration engagement.', icon: FileText },
  { label: 'Health Analysis', prompt: 'Analyze the delivery health of this project and give me your top recommendations.', icon: Activity },
  { label: 'Pricing Guidance', prompt: 'What is the typical price range for a Dynamics 365 F&O implementation for a mid-market company?', icon: Zap },
  { label: 'Risk Assessment', prompt: 'What are the top 5 risks in an Azure Sentinel deployment and how should we mitigate them?', icon: Activity },
];

export default function Agent() {
  const [searchParams] = useSearchParams();
  const contextType = searchParams.get('context') || '';
  const contextId = searchParams.get('id') || '';
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: "Hello. I'm your Delivery Excellence AI — senior delivery leader perspective across pre-sales, contracting, and execution. What do you need?",
    timestamp: new Date().toISOString(),
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    const userMsg: Message = { role: 'user', content: msg, timestamp: new Date().toISOString() };
    setMessages(m => [...m, userMsg]);
    setLoading(true);
    try {
      const r = await agentApi.chat({ message: msg, context_type: contextType || undefined, context_id: contextId || undefined });
      setMessages(m => [...m, { role: 'assistant', content: r.data.response, timestamp: new Date().toISOString() }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: '⚠️ Agent unavailable. Ensure ANTHROPIC_API_KEY is set in the backend environment.', timestamp: new Date().toISOString() }]);
    } finally { setLoading(false); }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)]">
      <Header
        eyebrow="Agentic AI · Delivery Copilot"
        title="Delivery Agent"
        subtitle="AI-powered delivery leader — pre-sales, contracts, delivery health"
        actions={
          <>
            <span className="live-chip"><span className="signal-dot" /> Agent online</span>
            <button onClick={() => setMessages([{ role: 'assistant', content: "Hello. I'm your Delivery Excellence AI. What do you need?", timestamp: new Date().toISOString() }])} className="btn-ghost flex items-center gap-1 text-ink-soft">
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          </>
        }
      />

      {contextType && contextId && (
        <GlassPanel tint="cyan" className="mb-4 px-4 py-2 text-xs text-ink-soft flex items-center gap-2">
          <Bot className="w-3 h-3" /> Context loaded: {contextType} {contextId.slice(0, 8)}...
        </GlassPanel>
      )}

      {/* Quick Prompts */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {QUICK_PROMPTS.map(qp => {
          const Icon = qp.icon;
          return (
            <button key={qp.label} onClick={() => send(qp.prompt)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-ink-soft hover:border-flux hover:text-flux transition-colors">
              <Icon className="w-3 h-3" /> {qp.label}
            </button>
          );
        })}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === 'assistant' ? 'bg-flux' : 'bg-gray-200'}`}>
              {m.role === 'assistant' ? <Bot className="w-4 h-4 text-white" /> : <span className="text-xs font-bold text-ink-soft">You</span>}
            </div>
            {m.role === 'assistant' ? (
              <GlassPanel tint="blue" className="max-w-[75%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap text-ink">
                {m.content}
              </GlassPanel>
            ) : (
              <div className="max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap bg-flux text-white">
                {m.content}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-flux flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <GlassPanel tint="blue" className="px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
              </div>
            </GlassPanel>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="flex gap-3 items-end">
        <textarea
          ref={inputRef}
          className="flex-1 input resize-none"
          rows={2}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask about pre-sales strategy, SOW structure, pricing, delivery health, risk mitigation... (Shift+Enter for newline)"
          disabled={loading}
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() || loading}
          className="btn-primary h-10 w-10 flex items-center justify-center flex-shrink-0 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
