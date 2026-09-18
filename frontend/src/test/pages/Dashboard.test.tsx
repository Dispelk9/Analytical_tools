import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Dashboard from '../../pages/Dashboard';

const renderDashboard = () =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/D9bot" element={<div>D9bot page</div>} />
      </Routes>
    </MemoryRouter>,
  );

describe('pages/Dashboard.tsx', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders an overview heading', () => {
    renderDashboard();

    expect(screen.getByRole('heading', { name: 'Overview' })).toBeInTheDocument();
  });

  it('renders a section for every tool category', () => {
    renderDashboard();

    ['Infrastructure', 'SMTP', 'DNS', 'AI / Agent', 'ACT Chemistry'].forEach(title => {
      expect(screen.getByRole('button', { name: title })).toBeInTheDocument();
    });
  });

  it('navigates to an internal tool when it is selected', () => {
    renderDashboard();

    fireEvent.click(screen.getByRole('button', { name: 'D9bot' }));

    expect(screen.getByText('D9bot page')).toBeInTheDocument();
  });

  it('opens an external tool in a new tab when it is selected', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    renderDashboard();

    fireEvent.click(screen.getByRole('button', { name: 'Checkmk' }));

    expect(openSpy).toHaveBeenCalledWith(
      'https://analytical.dispelk9.de/check_mk/',
      '_blank',
      'noopener,noreferrer',
    );
  });
});
