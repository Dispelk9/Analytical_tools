import { ChangeEvent, FormEvent, useRef } from 'react';
import { PButton, PTextFieldWrapper, PTextarea } from '@porsche-design-system/components-react';

type Props = {
  prompt: string;
  recipient: string;
  isThinking: boolean;
  error: string | null;
  onPromptChange: (v: string) => void;
  onRecipientChange: (v: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export default function ChatComposer({
  prompt,
  recipient,
  isThinking,
  error,
  onPromptChange,
  onRecipientChange,
  onSubmit,
}: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="d9-composer">
      <form ref={formRef} onSubmit={onSubmit} className="d9-composer-form">
        <div className="d9-composer-main">

          <PTextarea
            name="Prompt-box"
            theme="dark"
            label="Message"
            description="Enter to send • Shift+Enter for newline"
            value={prompt}
            onChange={(e) => onPromptChange((e.target as any).value)} // ✅ onChange, not onInput
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();

                // ✅ grab the real current value (prevents losing last char like '?')
                const v = (e.target as HTMLTextAreaElement).value;
                onPromptChange(v);

                // ✅ submit after state is updated
                queueMicrotask(() => formRef.current?.requestSubmit());
              }
            }}
          />
        </div>

        <div className="d9-composer-side">
          <PTextFieldWrapper theme="dark" label="Recipient (optional)" description="Email the result">
            <input
              type="email"
              value={recipient}
              onChange={(e: ChangeEvent<HTMLInputElement>) => onRecipientChange(e.target.value)}
              placeholder="Enter address"
              className="form-input"
            />
          </PTextFieldWrapper>

          <div style={{ height: 100 }} />

          <PButton theme="dark" variant="secondary" type="submit" disabled={isThinking}>
            {isThinking ? 'Sending…' : 'Prompt'}
          </PButton>

          {error && <div className="d9-error">{error}</div>}
        </div>
      </form>
    </div>
  );
}
