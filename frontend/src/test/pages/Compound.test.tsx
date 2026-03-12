import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Compound from '../../pages/Compound';

describe('pages/Compound.tsx', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('submits the form and renders returned compounds', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          compounds: [
            {
              molecular_formula: 'H2O',
              cid: 962,
              exact_mass: '18.01',
              iupac_name: 'water',
              link: 'https://example.com/water',
              foto: 'https://example.com/water.png',
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    );

    render(<Compound />);

    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: '1.0' } });
    fireEvent.change(inputs[1], { target: { value: '120.0' } });
    fireEvent.change(inputs[2], { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: 'Calculate' }));

    expect(await screen.findByText('water')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View Compound' })).toHaveAttribute('href', 'https://example.com/water');
  });
});
