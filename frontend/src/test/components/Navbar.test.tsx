import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { logoutFromAuthProvider } from '../../auth/auth';
import Navbar from '../../components/Navbar';

vi.mock('../../auth/auth', () => ({
  logoutFromAuthProvider: vi.fn(() => Promise.resolve()),
}));

const renderNavbar = () =>
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>,
  );

describe('components/Navbar.tsx', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the brand link', () => {
    renderNavbar();

    expect(screen.getByRole('link', { name: 'Dispelk9 Tools' })).toHaveAttribute('href', '/');
  });

  it('renders a logout button', () => {
    renderNavbar();

    expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
  });

  it('logs out through logoutFromAuthProvider when Logout is submitted', () => {
    renderNavbar();

    fireEvent.click(screen.getByRole('button', { name: 'Logout' }));

    expect(logoutFromAuthProvider).toHaveBeenCalledOnce();
  });

  it('shows an error message when logout fails', async () => {
    vi.mocked(logoutFromAuthProvider).mockRejectedValueOnce(new Error('boom'));
    renderNavbar();

    fireEvent.click(screen.getByRole('button', { name: 'Logout' }));

    expect(await screen.findByText('Failed to logout')).toBeInTheDocument();
  });
});
