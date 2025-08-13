import React, { useState, FormEvent, ChangeEvent } from 'react';
import reactLogo from '../../public/assets/react.svg';
import {
  PButton,
  PSpinner,
  PTextFieldWrapper,
  PTextarea,
} from "@porsche-design-system/components-react";
import '../App.css';

type TextBlock =
  | { type: 'code'; lang?: string; content: string }
  | { type: 'text'; content: string };

function splitIntoBlocks(input: string): TextBlock[] {
  const blocks: TextBlock[] = [];
  const re = /```([a-zA-Z0-9_-]+)?\s*\n([\s\S]*?)```/g;
  let last = 0, m: RegExpExecArray | null;

  while ((m = re.exec(input)) !== null) {
    if (m.index > last) {
      blocks.push({ type: 'text', content: input.slice(last, m.index) });
    }
    blocks.push({
      type: 'code',
      lang: (m[1] || '').trim() || undefined,
      content: m[2],
    });
    last = re.lastIndex;
  }
  if (last < input.length) {
    blocks.push({ type: 'text', content: input.slice(last) });
  }
  return blocks;
}


type D9Response = {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>;
      role: string;            // e.g. "model"
    };
    finishReason: string;       // e.g. "STOP"
    avgLogprobs: number;
  }>;
};

const D9bot: React.FC = () => {
  const [Prompt, setPrompt] = useState<string>('');
  const [Recipient, setRecipient] = useState<string>('');

  const [result, setResult] = useState<D9Response | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // Input handlers
  const handleChangeB = (e: ChangeEvent<HTMLInputElement>) => setRecipient(e.target.value);


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!Prompt.trim()) {
      setError('Please enter a prompt for D9 Bot');
      return;
    }

    try {
      setIsCalculating(true);

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Prompt_string: Prompt,
          Email: Recipient,
        }),
      });

      if (!response.ok) {
        throw new Error('Server error');
      }

      const data: D9Response = await response.json();
      if (!Array.isArray(data.candidates)) {
        throw new Error('Unexpected response format');
      }

      setResult(data);
    } catch (err) {
      console.error('Error:', err);
      setError('Error processing your request.');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="outer-container">
      <div className="inner-container">
        <a href="https://info.dispelk9.de" target="_blank">
          <img src={reactLogo} className="logo react" alt="Act logo" />
        </a>

        <h1 className="form-title">D9: How can I help you?</h1>
        <div className="form-wrapper">
          <form onSubmit={handleSubmit}>
            <PTextarea
            name="Prompt-box"
            theme="dark"
            label="Prompt"
            description="Communication goes here"
            value={Prompt}
            onInput={(e) => setPrompt((e.target as any).value)}
            />


            <PTextFieldWrapper theme="dark" label="Recipient address:" description="Allowed send result to your address">
              <input
                type="email"
                value={Recipient}
                onChange={handleChangeB}
                placeholder="Enter address"
                className="form-input"
              />
            </PTextFieldWrapper>

            <PButton theme="dark"  variant="secondary" type="submit" style={{ marginTop: '50px' }}>
              Prompt
            </PButton>

            {isCalculating && (
              <div style={{ marginTop: '1rem' }}>
                <PSpinner size="small" aria={{ 'aria-label': 'Loading result' }} />
              </div>
            )}
          </form>
        </div>
        {result !== null && (
            <div className="result-container">
                <h3>D9 Bot</h3>
                <div className="result-content">
                {result.candidates?.flatMap((c, ci) => (c.content?.parts ?? []).map((p, pi) => (
                    <React.Fragment key={`${ci}-${pi}`}>
                    {splitIntoBlocks(p.text).map((b, bi) =>
                        b.type === 'code' ? (
                        <pre key={`${ci}-${pi}-code-${bi}`} className="code-box" data-lang={b.lang}>
                            <code>{b.content}</code>
                        </pre>
                        ) : (
                        b.content.trim() ? (
                            <p key={`${ci}-${pi}-text-${bi}`} style={{ whiteSpace: 'pre-line', margin: 0 }}>
                            {b.content}
                            </p>
                        ) : null
                        )
                    )}
                    </React.Fragment>
                )))}
                </div>
            </div>
            )}



        {error && (
          <div className="response-message response-error">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default D9bot;
