import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import D9bot from '../../pages/D9bot';

describe('pages/D9bot.tsx', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('uses the local handbook endpoint when the Handbook model is selected', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          candidates: [{ content: { parts: [{ text: 'From handbook' }] } }],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    );

    render(<D9bot />);

    const textarea = screen.getByRole('textbox', { name: 'Prompt' }) as HTMLTextAreaElement;
    textarea.focus();
    fireEvent.click(screen.getByRole('button', { name: 'Choose model' }));
    fireEvent.click(screen.getByRole('option', { name: /Handbook/ }));
    fireEvent.change(textarea, { target: { value: 'How do I deploy?' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

    expect(await screen.findByText('From handbook')).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      '/api/handbook',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          Prompt_string: 'How do I deploy?',
        }),
      }),
    );
  });

  it('uses Gemini chat by default', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          candidates: [{ content: { parts: [{ text: 'From Gemini' }] } }],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    );

    render(<D9bot />);

    fireEvent.change(screen.getByRole('textbox', { name: 'Prompt' }), { target: { value: 'Summarize this' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

    expect(await screen.findByText('From Gemini')).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      '/api/chat',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          Prompt_string: 'Summarize this',
          Email: '',
          Mode: 'gemini',
        }),
      }),
    );
  });

  it('disables the send button while the prompt is empty', async () => {
    render(<D9bot />);

    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
    expect(fetch).not.toHaveBeenCalled();
  });
});
