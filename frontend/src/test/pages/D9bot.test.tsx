import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import D9bot from '../../pages/D9bot';

describe('pages/D9bot.tsx', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('sends the prompt to Gemini', async () => {
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
        }),
      }),
    );
  });

  it('does not show a model picker since D9bot only talks to Gemini', () => {
    render(<D9bot />);

    expect(screen.queryByRole('button', { name: 'Choose model' })).not.toBeInTheDocument();
  });

  it('disables the send button while the prompt is empty', () => {
    render(<D9bot />);

    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
    expect(fetch).not.toHaveBeenCalled();
  });
});
