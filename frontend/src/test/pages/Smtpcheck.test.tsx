import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Smtpcheck from '../../pages/Smtpcheck';

describe('pages/Smtpcheck.tsx', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('submits smtp checks and renders results', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          host: 'mail.example.com',
          results: [
            { port: 25, service: 'SMTP', open: true, noop_response: '250 OK' },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    );

    render(<Smtpcheck />);

    fireEvent.change(screen.getByPlaceholderText('e.g. mail.example.com'), {
      target: { value: 'mail.example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Test SMTP' }));

    expect(await screen.findByText('Results for mail.example.com:')).toBeInTheDocument();
    expect(screen.getByText('250 OK')).toBeInTheDocument();
  });
});
