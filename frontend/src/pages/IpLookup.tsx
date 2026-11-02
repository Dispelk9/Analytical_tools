import React, { useState, FormEvent, ChangeEvent } from 'react';
import {
  PButton,
  PTextFieldWrapper,
  PText,
} from '@porsche-design-system/components-react';
import LatticeLoader from '../components/LatticeLoader';
import '../App.css';
import { authFetch } from '../auth/auth';

interface NetworkInfo {
  name: string | null;
  handle: string | null;
  cidr: string | null;
  start: string | null;
  end: string | null;
}

interface AsnInfo {
  number: number;
  holder: string | null;
  prefix: string | null;
}

interface LocationInfo {
  country: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  source: string;
}

export interface IpLookupResponse {
  query: string;
  hostname: string | null;
  resolved_ips: string[];
  ip: string;
  version: 4 | 6;
  owner: string | null;
  network: NetworkInfo;
  registry: string | null;
  country: string | null;
  asn: AsnInfo | null;
  location: LocationInfo | null;
  reverse_dns: string | null;
  abuse_email: string | null;
  warnings: string[];
}

interface ErrorResponse {
  error?: string;
}

const EMPTY = '—';

const formatAsn = (asn: AsnInfo | null): string =>
  asn ? `AS${asn.number}${asn.holder ? ` — ${asn.holder}` : ''}` : EMPTY;

const formatLocation = (location: LocationInfo | null): string => {
  if (!location) return EMPTY;
  const place = [location.city, location.country].filter(Boolean).join(', ');
  return place || EMPTY;
};

const mapUrl = (location: LocationInfo | null): string | null => {
  if (!location || location.latitude === null || location.longitude === null) return null;
  const { latitude, longitude } = location;
  return `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=8/${latitude}/${longitude}`;
};

interface ResultRowProps {
  label: string;
  children: React.ReactNode;
}

const ResultRow: React.FC<ResultRowProps> = ({ label, children }) => (
  <tr>
    <th scope="row">{label}</th>
    <td>{children}</td>
  </tr>
);

const LookupResult: React.FC<{ data: IpLookupResponse }> = ({ data }) => {
  const map = mapUrl(data.location);
  return (
    <div className="lookup-result">
      <table className="lookup-table">
        <tbody>
          {data.hostname && (
            <ResultRow label="Hostname">
              {data.hostname} → {data.resolved_ips.join(', ')}
            </ResultRow>
          )}
          <ResultRow label="IP address">{data.ip} (IPv{data.version})</ResultRow>
          <ResultRow label="Owner">{data.owner || EMPTY}</ResultRow>
          <ResultRow label="Network">
            {data.network.name || EMPTY}
            {data.network.cidr && <span className="lookup-secondary"> {data.network.cidr}</span>}
          </ResultRow>
          <ResultRow label="Registry">{data.registry || EMPTY}</ResultRow>
          <ResultRow label="Registered country">{data.country || EMPTY}</ResultRow>
          <ResultRow label="Origin AS">
            {formatAsn(data.asn)}
            {data.asn?.prefix && <span className="lookup-secondary"> {data.asn.prefix}</span>}
          </ResultRow>
          <ResultRow label="Location (approx.)">
            {formatLocation(data.location)}
            {map && (
              <>
                {' '}
                <a className="lookup-link" href={map} target="_blank" rel="noopener noreferrer">
                  map
                </a>
              </>
            )}
          </ResultRow>
          <ResultRow label="Reverse DNS">{data.reverse_dns || EMPTY}</ResultRow>
          <ResultRow label="Abuse contact">
            {data.abuse_email ? (
              <a className="lookup-link" href={`mailto:${data.abuse_email}`}>{data.abuse_email}</a>
            ) : EMPTY}
          </ResultRow>
        </tbody>
      </table>

      {data.location && <p className="lookup-note">Location source: {data.location.source}</p>}
      {data.warnings.length > 0 && (
        <ul className="lookup-note lookup-warnings">
          {data.warnings.map(warning => <li key={warning}>{warning}</li>)}
        </ul>
      )}
    </div>
  );
};

const IpLookup: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState<boolean>(false);
  const [data, setData] = useState<IpLookupResponse | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setData(null);

    if (!query.trim()) {
      setError('Please enter an IP address or hostname.');
      return;
    }

    setRunning(true);
    try {
      const resp = await authFetch('/api/iplookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      });
      const payload: IpLookupResponse & ErrorResponse = await resp.json();
      if (!resp.ok) {
        throw new Error(payload.error || `Server returned ${resp.status}`);
      }
      setData(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="outer-container">
      <div className="inner-container">
        <h1 className="form-title">IP Lookup</h1>

        <form onSubmit={handleSubmit} className="form-wrapper">
          <PTextFieldWrapper theme="auto" label="IP address or hostname:">
            <input
              type="text"
              value={query}
              maxLength={253}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              placeholder="e.g. 195.34.67.210 or example.com"
              className="form-input"
            />
          </PTextFieldWrapper>

          <PButton
            theme="auto"
            variant="secondary"
            type="submit"
            style={{ marginTop: 20 }}
            disabled={running}
          >
            Lookup
          </PButton>

          {running && (
            <div style={{ marginTop: '1rem' }}>
              <LatticeLoader status="working" label="Looking up" showTimer={false} />
            </div>
          )}

          {error && (
            <div className="response-message response-error" style={{ marginTop: '1rem' }}>
              <PText theme="auto" color="inherit">{error}</PText>
            </div>
          )}
        </form>

        {data && <LookupResult data={data} />}
      </div>
    </div>
  );
};

export default IpLookup;
