import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import HandbookSearch from '../../pages/HandbookSearch';

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const renderSearch = (query: string) =>
  render(
    <MemoryRouter initialEntries={[`/handbook/search?q=${encodeURIComponent(query)}`]}>
      <Routes>
        <Route path="/handbook/search" element={<HandbookSearch />} />
        <Route path="/handbook" element={<div>Handbook viewer page</div>} />
      </Routes>
    </MemoryRouter>,
  );

describe('pages/HandbookSearch.tsx', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('renders matching results as links to the file viewer', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse([
        { path: 'guides/onboarding.md', name: 'onboarding.md', line: 2, snippet: 'Welcome.' },
      ]),
    );

    renderSearch('welcome');

    expect(await screen.findByText('guides/onboarding.md')).toBeInTheDocument();
    expect(screen.getByText('Welcome.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /guides\/onboarding\.md/ })).toHaveAttribute(
      'href',
      '/handbook?path=guides%2Fonboarding.md',
    );
  });

  it('shows a message when there are no matches', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse([]));

    renderSearch('nonexistent');

    expect(await screen.findByText('No matches found.')).toBeInTheDocument();
  });

  it('shows a prompt when no query is given', () => {
    render(
      <MemoryRouter initialEntries={['/handbook/search']}>
        <HandbookSearch />
      </MemoryRouter>,
    );

    expect(screen.getByText('Enter a search term above.')).toBeInTheDocument();
  });

  it('shows an error message when the search request fails', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response('nope', { status: 500 }));

    renderSearch('welcome');

    expect(await screen.findByText('Could not search the handbook.')).toBeInTheDocument();
  });
});
