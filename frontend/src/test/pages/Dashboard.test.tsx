import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Dashboard from '../../pages/Dashboard';

describe('pages/Dashboard.tsx', () => {
  it('renders an overview heading pointing at the sidebar', () => {
    render(<Dashboard />);

    expect(screen.getByRole('heading', { name: 'Overview' })).toBeInTheDocument();
  });

  it('lists every external tool as a quick link that opens in a new tab', () => {
    render(<Dashboard />);

    const checkmk = screen.getByRole('link', { name: 'Checkmk' });
    expect(checkmk).toHaveAttribute('href', 'https://analytical.dispelk9.de/check_mk/');
    expect(checkmk).toHaveAttribute('target', '_blank');
    expect(checkmk.getAttribute('rel')).toContain('noopener');

    ['HCP Terraform', 'Grafana', 'Prometheus', 'Certcheck', 'Mailing', 'Cloudflare'].forEach(label => {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument();
    });
  });

  it('does not list internal tools as quick links', () => {
    render(<Dashboard />);

    expect(screen.queryByRole('link', { name: 'D9bot' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'SMTP Check' })).not.toBeInTheDocument();
  });
});
