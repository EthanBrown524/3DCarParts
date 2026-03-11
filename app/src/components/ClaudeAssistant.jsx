import { useState, useRef, useEffect } from 'react';
import useStore from '../store/useStore';

export default function ClaudeAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const selectedCar = useStore((s) => s.selectedCar);
  const selectedParts = useStore((s) => s.selectedParts);
  const costBreakdown = useStore((s) => s.costBreakdown);

  // Build a context string from the current configurator state
  const getBuildContext = () => {
    if (!selectedCar) return null;
    const header = `Vehicle: ${selectedCar.year} ${selectedCar.make} ${selectedCar.model} ${selectedCar.trim}`;
    if (selectedParts.length === 0) return `${header}\nNo parts selected yet.`;
    const partLines = selectedParts
      .map((p) => {
        const total = p.priceUnit === 'each' ? p.price * p.quantity : p.price;
        return `- ${p.brand} ${p.name} ($${total.toLocaleString()} + $${p.laborCost ?? 0} labor)`;
      })
      .join('\n');
    const totalLine = costBreakdown
      ? `Total (parts + labor + 8% tax): $${costBreakdown.total.toFixed(2)}`
      : '';
    return `${header}\nSelected parts:\n${partLines}\n${totalLine}`.trim();
  };

  const sendMessage = async () => {
    if (!input.trim() || streaming) return;

    const userMsg = { role: 'user', content: input.trim() };
    const history = [...messages, userMsg];
    setMessages([...history, { role: 'assistant', content: '' }]);
    setInput('');
    setStreaming(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history.map((m) => ({ role: m.role, content: m.content })),
          buildContext: getBuildContext(),
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Server error' }));
        throw new Error(err.error || `HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const lines = decoder.decode(value).split('\n');
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const payload = line.slice(6);
          if (payload === '[DONE]') break;
          try {
            const parsed = JSON.parse(payload);
            if (parsed.error) throw new Error(parsed.error);
            if (parsed.text) {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                updated[updated.length - 1] = { ...last, content: last.content + parsed.text };
                return updated;
              });
            }
          } catch (e) {
            if (e.message !== 'Unexpected end of JSON input') throw e;
          }
        }
      }
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          content: `Error: ${err.message}. Make sure the server is running (cd server && npm start).`,
          error: true,
        };
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  };

  // Scroll to bottom on new content
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const placeholder = selectedCar
    ? `Ask about your ${selectedCar.model}...`
    : 'Ask me anything about car mods...';

  return (
    <>
      {/* Floating action button */}
      <button
        className="claude-fab"
        onClick={() => setOpen((o) => !o)}
        title={open ? 'Close AI Advisor' : 'Open AI Mod Advisor'}
        aria-label={open ? 'Close AI Advisor' : 'Open AI Mod Advisor'}
      >
        {open ? '✕' : '🤖'}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="claude-panel">
          <div className="claude-panel-header">
            <div>
              <span className="claude-panel-title">AI Mod Advisor</span>
              {selectedCar && (
                <span className="claude-panel-car">
                  {selectedCar.year} {selectedCar.make} {selectedCar.model}
                </span>
              )}
            </div>
            <span className="claude-powered">Powered by Claude</span>
          </div>

          <div className="claude-messages">
            {messages.length === 0 && (
              <div className="claude-welcome">
                <p className="claude-welcome-title">Hey, I'm your AI car mod advisor.</p>
                <p>
                  {selectedCar
                    ? `You've selected a ${selectedCar.year} ${selectedCar.make} ${selectedCar.model}. Ask me what to build next, fitment questions, or anything about modding.`
                    : 'Select a car to get started, then ask me about the best parts for your goals and budget.'}
                </p>
                <div className="claude-suggestions">
                  {[
                    'What wheels should I get?',
                    'Best bang-for-buck mods?',
                    'Will these wheels fit?',
                    'Build me an aggressive aero setup',
                  ].map((s) => (
                    <button
                      key={s}
                      className="claude-suggestion"
                      onClick={() => {
                        setInput(s);
                        inputRef.current?.focus();
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`claude-msg claude-msg-${msg.role}${msg.error ? ' claude-msg-error' : ''}`}>
                {msg.role === 'assistant' && (
                  <span className="claude-msg-label">Claude</span>
                )}
                <div className="claude-msg-content">
                  {msg.content || (streaming && i === messages.length - 1 ? '▍' : '')}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="claude-input-row">
            <input
              ref={inputRef}
              className="claude-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder={placeholder}
              disabled={streaming}
            />
            <button
              className="claude-send"
              onClick={sendMessage}
              disabled={!input.trim() || streaming}
              aria-label="Send message"
            >
              {streaming ? '⏳' : '↑'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
