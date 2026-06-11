import { fireEvent, render, screen, within } from '@testing-library/react';
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

  it('groups the main tools by theme in the requested row order', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response('{}', { status: 200 }));

    window.history.pushState({}, '', '/');
    render(<App />);

    expect(await screen.findByText('Dispelk9 Tools')).toBeInTheDocument();

    const expectedThemes = [
      {
        testId: 'infrastructure-theme',
        title: 'Infrastructure',
        labels: ['Checkmk', 'HCP Terraform'],
      },
      {
        testId: 'smtp-theme',
        title: 'SMTP',
        labels: ['Certcheck', 'Mailing', 'SMTP Check'],
      },
      {
        testId: 'dns-theme',
        title: 'DNS',
        labels: ['Cloudflare'],
      },
      {
        testId: 'ai-agent-theme',
        title: 'AI / Agent',
        labels: ['D9bot'],
      },
      {
        testId: 'act-theme',
        title: 'ACT Chemistry',
        labels: ['Adduct', 'Compound', 'Math'],
      },
    ];

    const headings = expectedThemes.map(theme =>
      within(screen.getByTestId(theme.testId)).getByRole('heading', { name: theme.title }),
    );

    expect(headings.map(heading => heading.textContent)).toEqual(
      expectedThemes.map(theme => theme.title),
    );

    headings.slice(1).forEach((heading, index) => {
      expect(
        headings[index].compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    });

    expectedThemes.forEach(theme => {
      const section = within(screen.getByTestId(theme.testId));

      theme.labels.forEach(label => {
        expect(section.getAllByText(label).length).toBeGreaterThan(0);
      });
    });
  });
});
