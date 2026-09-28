import { StrictMode } from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Login from '../../login/Login';

const TOKEN_KEY = 'analytical-tools.auth.tokens';

const tokenResponse = () =>
  new Response(JSON.stringify({ access_token: 'access', expires_in: 300, token_type: 'Bearer' }), {
    status: 200,
  });

// Keycloak rejects a reused authorization code, so every exchange after the
// first one fails, like the real token endpoint.
const mockTokenEndpoint = () => {
  let exchanges = 0;
  const fetchMock = vi.fn(async () => {
    exchanges += 1;
    return exchanges === 1
      ? tokenResponse()
      : new Response('{"error":"invalid_grant"}', { status: 400 });
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};

describe('login/Login.tsx Keycloak callback', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    sessionStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  it('exchanges the code once and navigates home under StrictMode', async () => {
    window.history.replaceState({}, '', '/login?code=abc&state=expected-state');
    sessionStorage.setItem('analytical-tools.auth.pkce.state', 'expected-state');
    sessionStorage.setItem('analytical-tools.auth.pkce.verifier', 'verifier');
    const fetchMock = mockTokenEndpoint();

    render(
      <StrictMode>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<p>Dashboard</p>} />
          </Routes>
        </MemoryRouter>
      </StrictMode>,
    );

    expect(await screen.findByText('Dashboard')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(sessionStorage.getItem(TOKEN_KEY)).toContain('"accessToken":"access"');
    expect(screen.queryByText('Failed to authenticate with Keycloak')).not.toBeInTheDocument();
  });
});
