import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Sidebar from '../../components/Sidebar';

const renderSidebar = () =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <Sidebar />
      <Routes>
        <Route path="/" element={<div>Home page</div>} />
        <Route path="/D9bot" element={<div>D9bot page</div>} />
      </Routes>
    </MemoryRouter>,
  );

describe('components/Sidebar.tsx', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('starts with every category collapsed', () => {
    renderSidebar();

    ['Infrastructure', 'SMTP', 'DNS', 'AI / Agent', 'ACT Chemistry'].forEach(title => {
      expect(screen.getByRole('button', { name: title })).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('expands a category on click', () => {
    renderSidebar();

    const trigger = screen.getByRole('button', { name: 'Infrastructure' });
    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('navigates to an internal tool when it is selected', () => {
    renderSidebar();

    fireEvent.click(screen.getByRole('button', { name: 'AI / Agent' }));
    fireEvent.click(screen.getByRole('button', { name: 'D9bot' }));

    expect(screen.getByText('D9bot page')).toBeInTheDocument();
  });

  it('opens an external tool in a new tab when it is selected', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    renderSidebar();

    fireEvent.click(screen.getByRole('button', { name: 'Infrastructure' }));
    fireEvent.click(screen.getByRole('button', { name: 'Checkmk' }));

    expect(openSpy).toHaveBeenCalledWith(
      'https://analytical.dispelk9.de/check_mk/',
      '_blank',
      'noopener,noreferrer',
    );
  });

  it('keeps a category open and the menu mounted after navigating to a different tool', () => {
    renderSidebar();

    fireEvent.click(screen.getByRole('button', { name: 'Infrastructure' }));
    fireEvent.click(screen.getByRole('button', { name: 'AI / Agent' }));
    fireEvent.click(screen.getByRole('button', { name: 'D9bot' }));

    expect(screen.getByText('D9bot page')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Infrastructure' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'AI / Agent' })).toHaveAttribute('aria-expanded', 'true');
  });
});
