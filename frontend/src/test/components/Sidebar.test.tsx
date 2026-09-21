import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Sidebar from '../../components/Sidebar';

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const renderSidebar = () =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <Sidebar />
      <Routes>
        <Route path="/" element={<div>Home page</div>} />
        <Route path="/D9bot" element={<div>D9bot page</div>} />
        <Route path="/handbook" element={<div>Handbook page</div>} />
      </Routes>
    </MemoryRouter>,
  );

describe('components/Sidebar.tsx', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse([])));
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

  it('lists Grafana and Prometheus under Infrastructure', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    renderSidebar();

    fireEvent.click(screen.getByRole('button', { name: 'Infrastructure' }));
    fireEvent.click(screen.getByRole('button', { name: 'Grafana' }));
    fireEvent.click(screen.getByRole('button', { name: 'Prometheus' }));

    expect(openSpy).toHaveBeenNthCalledWith(1, 'https://grafana.dispelk9.de', '_blank', 'noopener,noreferrer');
    expect(openSpy).toHaveBeenNthCalledWith(2, 'https://prometheus.dispelk9.de', '_blank', 'noopener,noreferrer');
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

  it('renders the handbook tree once it loads', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse([
        {
          name: 'guides',
          path: 'guides',
          type: 'dir',
          children: [{ name: 'onboarding.md', path: 'guides/onboarding.md', type: 'file' }],
        },
        { name: 'policy.pdf', path: 'policy.pdf', type: 'file' },
      ]),
    );

    renderSidebar();

    expect(await screen.findByRole('button', { name: 'guides' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'policy.pdf' })).toBeInTheDocument();
  });

  it('navigates to the handbook viewer when a file is selected', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse([
        {
          name: 'guides',
          path: 'guides',
          type: 'dir',
          children: [{ name: 'onboarding.md', path: 'guides/onboarding.md', type: 'file' }],
        },
      ]),
    );

    renderSidebar();

    fireEvent.click(await screen.findByRole('button', { name: 'guides' }));
    fireEvent.click(screen.getByRole('button', { name: 'onboarding.md' }));

    expect(await screen.findByText('Handbook page')).toBeInTheDocument();
  });

  it('shows a message when the handbook fails to load', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('network down'));

    renderSidebar();

    expect(await screen.findByText('Could not load handbook')).toBeInTheDocument();
  });
});
