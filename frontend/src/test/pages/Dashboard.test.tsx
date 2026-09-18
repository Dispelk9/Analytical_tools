import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Dashboard from '../../pages/Dashboard';

describe('pages/Dashboard.tsx', () => {
  it('renders an overview heading pointing at the sidebar', () => {
    render(<Dashboard />);

    expect(screen.getByRole('heading', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByText('Pick a tool from the menu on the left to get started.')).toBeInTheDocument();
  });
});
