import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';

vi.mock('../auth/auth', () => ({
  authFetch: vi.fn((input: RequestInfo | URL, init?: RequestInit) => fetch(input, init)),
  completeKeycloakLogin: vi.fn(),
  hasKeycloakCallbackParams: vi.fn(() => false),
  logoutFromAuthProvider: vi.fn(() => Promise.resolve()),
  startKeycloakLogin: vi.fn(() => Promise.resolve()),
}));

describe('App.tsx', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    vi.clearAllMocks();
  });

  it('renders login when auth check is rejected', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response('{}', { status: 401 }));
    window.history.pushState({}, '', '/');

    render(<App />);

    expect(await screen.findByText('Welcome to my Playground')).toBeInTheDocument();
  });

  it('renders the navbar and dashboard once authenticated', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response('{}', { status: 200 }));
    window.history.pushState({}, '', '/');

    render(<App />);

    expect(await screen.findByText('Dispelk9 Tools')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Infrastructure' }).length).toBeGreaterThan(0);
  });

  it('redirects an unknown authenticated route back to the dashboard', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response('{}', { status: 200 }));
    window.history.pushState({}, '', '/does-not-exist');

    render(<App />);

    expect(await screen.findByRole('heading', { name: 'Overview' })).toBeInTheDocument();
  });
});
