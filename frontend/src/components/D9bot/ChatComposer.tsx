import { FormEvent } from 'react';

type Props = {
  prompt: string;
  recipient: string;
  isThinking: boolean;
  error: string | null;
  onPromptChange: (v: string) => void;
  onRecipientChange: (v: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;

  // ✅ new
  useGemini: boolean;
  onUseGeminiChange: (v: boolean) => void;
};

export default function ChatComposer({
  prompt,
  recipient,
  isThinking,
  error,
  onPromptChange,
  onRecipientChange,
  onSubmit,
  useGemini,
  onUseGeminiChange,
}: Props) {
  return (
    <form className="d9-composer" onSubmit={onSubmit}>
      {/* ... your existing inputs ... */}

      {/* Email input (existing) */}
      <input
        className="d9-input"
        type="email"
        placeholder="Email (optional)"
        value={recipient}
        onChange={(e) => onRecipientChange(e.target.value)}
      />

      {/* ✅ Porsche-design-ish switch under email */}
      <div className="d9-mode-row">
        <span className="d9-mode-label">Mode</span>

        <button
          type="button"
          className={`pd-switch ${useGemini ? 'is-on' : 'is-off'}`}
          role="switch"
          aria-checked={useGemini}
          onClick={() => onUseGeminiChange(!useGemini)}
          disabled={isThinking}
          title={useGemini ? 'Gemini mode' : 'Handbook grep mode'}
        >
          <span className="pd-switch-track" />
          <span className="pd-switch-thumb" />
          <span className="pd-switch-text">
            <span className={`pd-switch-pill ${useGemini ? 'active' : ''}`}>Gemini</span>
            <span className={`pd-switch-pill ${!useGemini ? 'active' : ''}`}>Grep</span>
          </span>
        </button>
      </div>

      {/* Prompt textarea/input (existing) */}
      <textarea
        className="d9-textarea"
        placeholder="Type your message..."
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
      />

      {/* Error (existing) */}
      {error ? <div className="d9-error">{error}</div> : null}

      {/* Submit (existing) */}
      <button className="d9-send" type="submit" disabled={isThinking}>
        {isThinking ? 'Thinking…' : 'Send'}
      </button>
    </form>
  );
}