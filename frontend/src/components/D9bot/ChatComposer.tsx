import { ChangeEvent } from 'react';
import PromptBar, { PromptBarModel, PromptBarSendDetail } from '../PromptBar';

const MODELS: PromptBarModel[] = [
  { key: 'gemini', name: 'Gemini', tag: 'AI' },
  { key: 'handbook', name: 'Handbook', tag: 'Local' },
];

type Props = {
  recipient: string;
  isThinking: boolean;
  error: string | null;
  onRecipientChange: (v: string) => void;
  onSend: (text: string, detail: PromptBarSendDetail) => void;
};

export default function ChatComposer({
  recipient,
  isThinking,
  error,
  onRecipientChange,
  onSend,
}: Props) {
  return (
    <div className="d9-composer">
      <div className="d9-composer-recipient">
        <label htmlFor="d9-recipient">Email me the result (optional)</label>
        <input
          id="d9-recipient"
          type="email"
          value={recipient}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onRecipientChange(e.target.value)}
          placeholder="Enter address"
          className="form-input"
        />
      </div>

      <PromptBar
        placeholder="Ask D9bot anything…"
        sources={[]}
        commands={[]}
        models={MODELS}
        defaultModel="gemini"
        efforts={[]}
        busy={isThinking}
        onSend={onSend}
        background="#12161c"
        color="#e2e8f0"
        menuBackground="#1a1f28"
        width={720}
      />

      {error && <div className="d9-error">{error}</div>}
    </div>
  );
}
