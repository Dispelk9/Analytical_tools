import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CollisionPlot from '../../pages/ACT_Math';

describe('pages/ACT_Math.tsx', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('parses inputs and renders the returned plot', async () => {
    const blob = new Blob(['plot'], { type: 'image/png' });
    const createObjectUrl = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:plot');
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(blob, { status: 200, headers: { 'Content-Type': 'image/png' } }),
    );

    render(<CollisionPlot />);

    fireEvent.change(screen.getByDisplayValue('0.1 0.2 0.3 0.5'), { target: { value: '1,1 2 3' } });
    fireEvent.change(screen.getByDisplayValue('10.45 30.2 20.3 11.1'), { target: { value: '4 5 6' } });
    fireEvent.click(screen.getByRole('button', { name: 'Plot' }));

    expect(await screen.findByAltText('Collision Plot')).toHaveAttribute('src', 'blob:plot');
    expect(fetch).toHaveBeenCalledWith(
      '/api/collision',
      expect.objectContaining({
        body: JSON.stringify({ x: [1.1, 2, 3], y: [4, 5, 6] }),
      }),
    );
    expect(createObjectUrl).toHaveBeenCalled();
  });
});
