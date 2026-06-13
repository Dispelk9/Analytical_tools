import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { startKeycloakLogin } from '../../auth/auth';
import Login from '../../login/Login';

vi.mock('../../auth/auth', () => ({
  completeKeycloakLogin: vi.fn(),
  hasKeycloakCallbackParams: vi.fn(() => false),
  startKeycloakLogin: vi.fn(() => Promise.resolve()),
}));

describe('login/Login.tsx', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts the Keycloak login flow from the login page', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    expect(screen.queryByLabelText('Username')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Password')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Sign in with Keycloak' }));

    expect(startKeycloakLogin).toHaveBeenCalledWith('/');
  });
});
