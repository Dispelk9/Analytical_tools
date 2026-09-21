import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import HandbookViewer from '../../pages/HandbookViewer';

const renderViewer = (path: string) =>
  render(
    <MemoryRouter initialEntries={[`/handbook?path=${encodeURIComponent(path)}`]}>
      <Routes>
        <Route path="/handbook" element={<HandbookViewer />} />
      </Routes>
    </MemoryRouter>,
  );

describe('pages/HandbookViewer.tsx', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
  });

  it('renders markdown/text files as plain text', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response('# Welcome\nRead me.', { status: 200, headers: { 'Content-Type': 'text/markdown' } }),
    );

    renderViewer('guides/onboarding.md');

    expect(await screen.findByText(/# Welcome/)).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      '/api/handbook/file?path=guides%2Fonboarding.md',
      expect.objectContaining({ credentials: 'include' }),
    );
  });

  it('renders a PDF in an embed element', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(new Blob(['%PDF-1.4']), { status: 200, headers: { 'Content-Type': 'application/pdf' } }),
    );

    const { container } = renderViewer('policy.pdf');

    await waitFor(() => {
      expect(container.querySelector('embed')).not.toBeNull();
    });
    expect(container.querySelector('embed')).toHaveAttribute('src', 'blob:mock');
  });

  it('shows an error message when the request fails', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response('nope', { status: 404 }));

    renderViewer('missing.md');

    expect(await screen.findByText('Could not load this file.')).toBeInTheDocument();
  });

  it('shows a message when no file is selected', () => {
    render(
      <MemoryRouter initialEntries={['/handbook']}>
        <HandbookViewer />
      </MemoryRouter>,
    );

    expect(screen.getByText('No file selected.')).toBeInTheDocument();
  });
});
