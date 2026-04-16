import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import D9bot from '../../pages/D9bot';

describe('pages/D9bot.tsx', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('sends chat requests through the unified backend endpoint and appends the bot response', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          candidates: [{ content: { parts: [{ text: 'From handbook' }] } }],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    );

    render(<D9bot />);

    fireEvent.click(screen.getByLabelText('AI Mode'));
    fireEvent.change(screen.getByRole('textbox', { name: /^Message/ }), { target: { value: 'How do I deploy?' } });
    fireEvent.click(screen.getByRole('button', { name: 'Prompt' }));

    expect(await screen.findByText('From handbook')).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      '/api/chat',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          Prompt_string: 'How do I deploy?',
          Email: '',
          Mode: 'handbook',
        }),
      }),
    );
  });

  it('shows a validation error for an empty prompt', async () => {
    render(<D9bot />);

    fireEvent.click(screen.getByRole('button', { name: 'Prompt' }));

    await waitFor(() => {
      expect(screen.getByText('Please enter a prompt for D9 Bot')).toBeInTheDocument();
    });
    expect(fetch).not.toHaveBeenCalled();
  });
});
