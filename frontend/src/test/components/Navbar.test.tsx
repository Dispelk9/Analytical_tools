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

  it('renders a trigger for every tool category', () => {
    renderNavbar();

    ['Infrastructure', 'SMTP', 'DNS', 'AI / Agent', 'ACT Chemistry'].forEach(title => {
      expect(screen.getByRole('button', { name: new RegExp(title) })).toBeInTheDocument();
    });
  });

  it('opens a dropdown of tools on click and closes it again on a second click', () => {
    renderNavbar();

    const trigger = screen.getByRole('button', { name: /Infrastructure/ });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menuitem', { name: /Checkmk/ })).toBeInTheDocument();

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('menuitem', { name: /Checkmk/ })).not.toBeInTheDocument();
  });

  it('closes an open dropdown when Escape is pressed', () => {
    renderNavbar();

    fireEvent.click(screen.getByRole('button', { name: /Infrastructure/ }));
    expect(screen.getByRole('menu')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('closes an open dropdown when clicking outside the navbar', () => {
    renderNavbar();

    fireEvent.click(screen.getByRole('button', { name: /Infrastructure/ }));
    expect(screen.getByRole('menu')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('opens external tools in a new tab and routes internal tools through the router', () => {
    renderNavbar();

    fireEvent.click(screen.getByRole('button', { name: /Infrastructure/ }));
    const checkmk = screen.getByRole('menuitem', { name: /Checkmk/ });
    expect(checkmk).toHaveAttribute('href', 'https://analytical.dispelk9.de/check_mk/');
    expect(checkmk).toHaveAttribute('target', '_blank');
    expect(checkmk.getAttribute('rel')).toContain('noopener');

    fireEvent.click(screen.getByRole('button', { name: /AI \/ Agent/ }));
    const d9bot = screen.getByRole('menuitem', { name: /D9bot/ });
    expect(d9bot).toHaveAttribute('href', '/D9bot');
    expect(d9bot).not.toHaveAttribute('target');
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
