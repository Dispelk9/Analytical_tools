import { FormEvent, useState } from 'react';
import reactLogo from '../../public/vite.svg';
import '../components/D9bot/d9bot.css';

import ChatList from '../components/D9bot/ChatList';
import ChatComposer from '../components/D9bot/ChatComposer';
import { ChatMessage, D9Response } from '../components/D9bot/type';

function newId(prefix: string) {
  return (crypto?.randomUUID?.() ?? `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`);
}

export default function D9bot() {
  const [prompt, setPrompt] = useState('');
  const [recipient, setRecipient] = useState('');
  const [useGemini, setUseGemini] = useState(true); // ✅ new

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'bot', text: 'Hi! Ask me anything.', createdAt: Date.now() },
  ]);

  const [error, setError] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);

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

      const endpoint = useGemini ? '/api/gemini' : '/api/handbook'; // ✅ switch here

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Prompt_string: raw,
          Email: recipient,
        }),
      });

      if (!response.ok) throw new Error('Server error');

      const data: D9Response = await response.json();
      const botText =
        (data?.candidates ?? [])
          .flatMap((c) => c.content?.parts ?? [])
          .map((p) => p.text)
          .join('\n\n') ||
        'No response received.';

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
    <div>
      <div className="d9-chat-page">
        <div className="d9-chat-header">
          <a href="https://dispelk9.de" target="_blank" rel="noreferrer">
            <img src={reactLogo} className="logo react" alt="Act logo" />
          </a>
          <div>
            <h1 className="d9-title">D9bot</h1>
            <div className="d9-subtitle">Conversation mode</div>
          </div>
        </div>
        <div className="d9-chat-body">
          <ChatList messages={messages} isThinking={isThinking} />
        </div>

        <ChatComposer
          prompt={prompt}
          recipient={recipient}
          isThinking={isThinking}
          error={error}
          onPromptChange={setPrompt}
          onRecipientChange={setRecipient}
          onSubmit={handleSubmit}
          // ✅ new props
          useGemini={useGemini}
          onUseGeminiChange={setUseGemini}
        />
      </div>
    </div>
  );
}