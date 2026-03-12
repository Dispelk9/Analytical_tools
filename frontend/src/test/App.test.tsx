import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';

describe('App.tsx', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('renders login when auth check is rejected', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response('{}', { status: 401 }));
    window.history.pushState({}, '', '/');

    render(<App />);

    expect(await screen.findByText('Welcome to my Playground')).toBeInTheDocument();
  });

  it('logs out from the app layout when authenticated', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(new Response('{}', { status: 200 }))
      .mockResolvedValueOnce(new Response('{}', { status: 200 }));

    window.history.pushState({}, '', '/');
    render(<App />);

    expect(await screen.findByText('Dispelk9 Tools')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Logout' }));

    expect(await screen.findByText('Welcome to my Playground')).toBeInTheDocument();
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      '/api/logout',
      expect.objectContaining({ method: 'POST' }),
    );
  });
});
