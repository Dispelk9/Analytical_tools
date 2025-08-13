// src/Adduct.tsx
import React, { useState, FormEvent, ChangeEvent } from 'react';
import reactLogo from '../../public/assets/react.svg';
import RenderObject from './RenderObject';
import {
  PButton,
  PSpinner,
  PTextFieldWrapper,
  PTextarea,
} from "@porsche-design-system/components-react";
import '../App.css';


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
  const handleChangeA = (e: ChangeEvent<HTMLInputElement>) => setPrompt(e.target.value);
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
            <PTextarea name="Prompt-box" theme="dark" label="Prompt" description="Communication goes here">
              <input
                type="text"
                value={Prompt}
                onChange={handleChangeA}
                placeholder="Ask it anything"
                className="form-input"
              />
            </PTextarea>

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
            <h3>What I found</h3>
            <div className="result-content">
              <RenderObject data={result} />
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
