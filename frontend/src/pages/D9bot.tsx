import { FormEvent, useState } from 'react';
import reactLogo from '../../public/vite.svg';
import '../components/D9bot/d9bot.css';

import ChatList from '../components/D9bot/ChatList';
import ChatComposer from '../components/D9bot/ChatComposer';
import { ChatMessage } from '../components/D9bot/type';

import { PSwitch, type SwitchUpdateEventDetail } from '@porsche-design-system/components-react';

function newId(prefix: string) {
  return (crypto?.randomUUID?.() ?? `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`);
}

export default function D9bot() {
  const [prompt, setPrompt] = useState('');
  const [recipient, setRecipient] = useState('');
  const [handbookOnly, setHandbookOnly] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'bot', text: 'Hi! Ask me anything.', createdAt: Date.now() },
  ]);

  const [error, setError] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  const onModeToggle = (e: CustomEvent<SwitchUpdateEventDetail>) => {
    setHandbookOnly(e.detail.checked);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const raw = prompt;
    const check = raw.trim();

    if (!check) {
      setError('Please enter a prompt for D9 Bot');
      return;
    }

    setMessages((prev) => [
      ...prev,
      { id: newId('u'), role: 'user', text: raw, createdAt: Date.now() },
    ]);

    setPrompt('');

    try {
      setIsThinking(true);

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Prompt_string: raw,
          Email: recipient,
          Mode: handbookOnly ? 'handbook_only' : 'auto',
          TopK: 5,
        }),
      });

      if (!response.ok) throw new Error('Server error');

      const data: any = await response.json();

      const isHandbook =
        data?._mode === 'handbook_only' ||
        data?._mode === 'handbook_fallback';

      let botText = '';

      if (isHandbook) {
        const results = Array.isArray(data?.results) ? data.results : [];
        if (results.length === 0) {
          botText =
            data?.handbook_error
              ? `No handbook results.\n\n${data.handbook_error}`
              : 'No handbook results found.';
        } else {
          botText = results
            .slice(0, 5)
            .map((r: any, i: number) => {
              const src = r.path ? `\nsource: ${r.path}` : '';
              return `[#${i + 1}]${src}\n${(r.text ?? '').trim()}`;
            })
            .join('\n\n---\n\n');
        }
      } else {
        // Gemini
        botText =
          (data?.candidates ?? [])
            .flatMap((c: any) => c.content?.parts ?? [])
            .map((p: any) => p.text)
            .filter(Boolean)
            .join('\n\n') ||
          'No response received.';
      }

      setMessages((prev) => [
        ...prev,
        { id: newId('b'), role: 'bot', text: botText, createdAt: Date.now() },
      ]);
    } catch (err) {
      console.error(err);
      setError('Error processing your request.');
      setMessages((prev) => [
        ...prev,
        {
          id: newId('s'),
          role: 'system',
          text: '⚠️ Something went wrong. Please try again.',
          createdAt: Date.now(),
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="d9-chat-page">
      <div className="d9-chat-header">
        <a href="https://dispelk9.de" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="Act logo" />
        </a>
        <div>
          <h1 className="d9-title">D9bot</h1>
          <div className="d9-subtitle">Conversation mode</div>

          <div style={{ marginTop: 8 }}>
            <PSwitch checked={handbookOnly} onUpdate={onModeToggle}>
              Handbook-only (no Gemini)
            </PSwitch>
          </div>
        </div>
      </div>

      <ChatList messages={messages} isThinking={isThinking} />

      <ChatComposer
        prompt={prompt}
        recipient={recipient}
        isThinking={isThinking}
        error={error}
        onPromptChange={setPrompt}
        onRecipientChange={setRecipient}
        onSubmit={handleSubmit}
      />
    </div>
  );
}