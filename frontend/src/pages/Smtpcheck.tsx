// src/SmtpTest.tsx
import React, { useState, FormEvent, ChangeEvent } from 'react';
import {
  PButton,
  PSpinner,
  PTextFieldWrapper,
  PText,
} from "@porsche-design-system/components-react";
import '../App.css';

interface PortResult {
  port: number;
  service: string;
  open: boolean;
  noop_response?: string;
  starttls_supported?: boolean;
  starttls_result?: string;
  error?: string;
}

interface ApiResponse {
  host: string;
  results: PortResult[];
  error?: string;
}

const SmtpTest: React.FC = () => {
  const [host,    setHost]    = useState<string>('');
  const [error,   setError]   = useState<string|null>(null);
  const [running, setRunning] = useState<boolean>(false);
  const [data,    setData]    = useState<ApiResponse|null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setData(null);

    if (!host.trim()) {
      setError('Please enter a mail-server hostname or IP.');
      return;
    }

    setRunning(true);
    try {
      const resp = await fetch('/api/smtp', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ host }),
      });

      const payload: ApiResponse = await resp.json();
      if (!resp.ok) {
        throw new Error(payload.error || `Server returned ${resp.status}`);
      }

      setData(payload);
    } catch (err: any) {
      setError(err.message || 'Unexpected error');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="outer-container">
      <h1 className="form-title">SMTP Connectivity Test</h1>

      <form onSubmit={handleSubmit} className="form-wrapper">
        <PTextFieldWrapper theme="dark" label="Mail server host:">
          <input
            type="text"
            value={host}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setHost(e.target.value)}
            placeholder="e.g. mail.example.com"
            className="form-input"
          />
        </PTextFieldWrapper>

        <PButton
          theme="dark"
          variant="secondary"
          type="submit"
          style={{ marginTop: 20 }}
          disabled={running}
        >
          Test SMTP
        </PButton>

        {running && (
          <div style={{ marginTop: '1rem' }}>
            <PSpinner size="small" aria={{ 'aria-label': 'Testing...' }} />
          </div>
        )}

        {error && (
          <div className="response-message response-error" style={{ marginTop: '1rem' }}>
            <PText>{error}</PText>
          </div>
        )}
      </form>

      {data && (
        <div style={{ marginTop: '2rem' }}>
          <PText>Results for {data.host}:</PText>
          <table className="result-table" style={{ width: '100%', marginTop: '0.5rem' }}>
            <thead>
              <tr>
                <th>Port</th>
                <th>Service</th>
                <th>Status</th>
                <th>NOOP Response</th>
                <th>STARTTLS</th>
                <th>Upgrade Result</th>
                <th>Error</th>
              </tr>
            </thead>
            <tbody>
              {data.results.map((r) => (
                <tr key={r.port}>
                  <td>{r.port}</td>
                  <td>{r.service}</td>
                  <td>{r.open ? 'Open' : 'Closed'}</td>
                  <td>{r.noop_response || '—'}</td>
                  <td>
                    {r.starttls_supported === undefined
                      ? 'n/a'
                      : r.starttls_supported
                        ? 'Yes'
                        : 'No'}
                  </td>
                  <td>{r.starttls_result || '—'}</td>
                  <td>{r.error || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SmtpTest;
