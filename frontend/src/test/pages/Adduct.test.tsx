import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Adduct from '../../pages/Adduct';

describe('pages/Adduct.tsx', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('validates and submits the form', async () => {
    render(<Adduct />);

    fireEvent.click(screen.getByRole('button', { name: 'Calculate' }));
    expect(screen.getByText('Please enter a number for Neutral_mass, Observed, and Mass_error.')).toBeInTheDocument();

    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          result: {
            'Results without Hydro': [{ 'Element Set': ['Na+'], Sum: ['22.99'] }],
            'Results with Hydro': [],
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    );

    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: '100.1' } });
    fireEvent.change(inputs[1], { target: { value: '123.4' } });
    fireEvent.change(inputs[2], { target: { value: '5' } });
    fireEvent.change(screen.getByPlaceholderText('Enter address'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'positive' } });
    fireEvent.click(screen.getByRole('button', { name: 'Calculate' }));

    expect(await screen.findByText('Results without Hydro')).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      '/api/adduct',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          NM: '100.1',
          OB: '123.4',
          ME: '5',
          Email: 'test@example.com',
          operation: 'positive',
        }),
      }),
    );
  });
});
