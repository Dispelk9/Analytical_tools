import { ChangeEvent, FormEvent, useRef } from 'react';
import {
  PButton,
  PTextFieldWrapper,
  PTextarea,
  PSwitch,
  type SwitchUpdateEventDetail,
} from '@porsche-design-system/components-react';

type Props = {
  prompt: string;
  recipient: string;
  isThinking: boolean;
  error: string | null;
  onPromptChange: (v: string) => void;
  onRecipientChange: (v: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
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
  const formRef = useRef<HTMLFormElement>(null);

  const handleSwitchUpdate = (
    e: CustomEvent<SwitchUpdateEventDetail>
  ) => {
    onUseGeminiChange(e.detail.checked);
  };

  return (
    <div className="d9-composer">
      <form ref={formRef} onSubmit={onSubmit} className="d9-composer-form">
        {/* MAIN MESSAGE AREA */}
        <div className="d9-composer-main">
          <PTextarea
            name="Prompt-box"
            theme="dark"
            label="Message"
            description="Enter to send • Shift+Enter for newline"
            value={prompt}
            onChange={(e) => onPromptChange((e.target as any).value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();

                const v = (e.target as HTMLTextAreaElement).value;
                onPromptChange(v);

                queueMicrotask(() =>
                  formRef.current?.requestSubmit()
                );
              }
            }}
          />
        </div>

        {/* SIDE PANEL */}
        <div className="d9-composer-side">
          {/* EMAIL FIELD */}
          <PTextFieldWrapper
            theme="dark"
            label="Recipient (optional)"
            description="Email the result"
          >
            <input
              type="email"
              value={recipient}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onRecipientChange(e.target.value)
              }
              placeholder="Enter address"
              className="form-input"
            />
          </PTextFieldWrapper>

          {/* MODE SWITCH */}
          <div style={{ marginTop: 20 }}>
            <PSwitch
              theme="dark"
              checked={useGemini}
              onUpdate={handleSwitchUpdate}
              disabled={isThinking}
            >
              AI Mode
            </PSwitch>

            <div style={{ fontSize: 12, opacity: 0.6, marginTop: 6 }}>
              {useGemini ? 'Gemini LLM active' : 'Local handbook search active'}
            </div>
          </div>

          {/* SPACING */}
          <div style={{ height: 40 }} />

          {/* SUBMIT BUTTON */}
          <PButton
            theme="dark"
            variant="secondary"
            type="submit"
            disabled={isThinking}
          >
            {isThinking ? 'Sending…' : 'Prompt'}
          </PButton>

          {error && <div className="d9-error">{error}</div>}
        </div>
      </form>
    </div>
  );
}