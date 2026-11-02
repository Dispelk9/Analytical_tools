import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import IpLookup, { IpLookupResponse } from '../../pages/IpLookup';

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const result: IpLookupResponse = {
  query: '195.34.67.210',
  hostname: null,
  resolved_ips: [],
  ip: '195.34.67.210',
  version: 4,
  owner: 'Huize Holdings LLC',
  network: {
    name: 'NET-CA',
    handle: '195.34.67.0 - 195.34.67.255',
    cidr: '195.34.67.0/24',
    start: '195.34.67.0',
    end: '195.34.67.255',
  },
  registry: 'RIPE',
  country: 'CA',
  asn: { number: 400992, holder: 'ZHOUYISAT-COMMUNICATIONS', prefix: '195.34.67.0/22' },
  location: { country: 'CA', city: 'Vancouver', latitude: 49.28, longitude: -123.04, source: 'MaxMind GeoLite2 via RIPEstat' },
  reverse_dns: 'host.example.net',
  abuse_email: 'abuse@example.net',
  warnings: ['No reverse DNS (PTR) data found'],
};

const submit = (value: string) => {
  fireEvent.change(screen.getByPlaceholderText('e.g. 195.34.67.210 or example.com'), {
    target: { value },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Lookup' }));
};

describe('pages/IpLookup.tsx', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  // AC-8
  it('looks up an IP and renders owner, network, AS, location, PTR and abuse contact', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(result));

    render(<IpLookup />);
    submit(' 195.34.67.210 ');

    expect(await screen.findByText('Huize Holdings LLC')).toBeInTheDocument();
    expect(screen.getByText('NET-CA')).toBeInTheDocument();
    expect(screen.getByText('195.34.67.0/24')).toBeInTheDocument();
    expect(screen.getByText('RIPE')).toBeInTheDocument();
    expect(screen.getByText('AS400992 — ZHOUYISAT-COMMUNICATIONS')).toBeInTheDocument();
    expect(screen.getByText('Vancouver, CA')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'map' })).toHaveAttribute(
      'href',
      expect.stringContaining('openstreetmap.org/?mlat=49.28&mlon=-123.04'),
    );
    expect(screen.getByText('host.example.net')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'abuse@example.net' })).toHaveAttribute('href', 'mailto:abuse@example.net');
    expect(screen.getByText('No reverse DNS (PTR) data found')).toBeInTheDocument();

    const [url, init] = vi.mocked(fetch).mock.calls[0];
    expect(String(url)).toContain('/api/iplookup');
    expect(JSON.parse(String((init as RequestInit).body))).toEqual({ query: '195.34.67.210' });
  });

  // AC-8 / AC-11
  it('shows the resolved addresses for a hostname lookup', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ ...result, query: 'example.com', hostname: 'example.com', resolved_ips: ['195.34.67.210'] }),
    );

    render(<IpLookup />);
    submit('example.com');

    expect(await screen.findByText('example.com → 195.34.67.210')).toBeInTheDocument();
  });

  // AC-9
  it('shows the backend error message', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ error: 'Not a public IP address' }, 400));

    render(<IpLookup />);
    submit('10.0.0.1');

    expect(await screen.findByText('Not a public IP address')).toBeInTheDocument();
  });

  it('asks for input before calling the backend', () => {
    render(<IpLookup />);
    fireEvent.click(screen.getByRole('button', { name: 'Lookup' }));

    expect(screen.getByText('Please enter an IP address or hostname.')).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });
});
