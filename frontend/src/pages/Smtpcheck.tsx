// src/SmtpTest.tsx
import React, { useState, FormEvent, ChangeEvent, useRef, useEffect } from 'react';
import {
  PButton,
  PSpinner,
  PTextFieldWrapper,
  PText,
} from "@porsche-design-system/components-react";
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import { io, Socket } from 'socket.io-client';
import './App.css';

const SOCKET_NAMESPACE = '/terminal';
const SOCKET_URL       = `http://${window.location.hostname}:8080`;

const SmtpTest: React.FC = () => {
  // form state
  const [host,    setHost]    = useState<string>('');
  const [error,   setError]   = useState<string|null>(null);
  const [running, setRunning] = useState<boolean>(false);

  // initialize refs with null
  const termRef      = useRef<Terminal | null>(null);
  const socketRef    = useRef<Socket   | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // mount xterm and socket.io once
  useEffect(() => {
    const term = new Terminal({
      cols: 80, rows: 20,
      cursorBlink: true,
      theme: { background: '#1e1e1e' },
    });
    if (containerRef.current) {
      term.open(containerRef.current);
      term.writeln('\x1b[32m[Ready] enter hostname and click “Test SMTP”.\x1b[0m');
    }

    const socket = io(`${SOCKET_URL}${SOCKET_NAMESPACE}`, {
      transports: ['websocket'],
      path: '/socket.io',
    });

    socket.on('connect', () => {
      term.writeln('\x1b[36m[Socket] connected to backend.\x1b[0m');
    });
    socket.on('terminal_output', (chunk: string) => {
      term.write(chunk);
    });
    socket.on('disconnect', () => {
      term.writeln('\r\n\x1b[31m[Socket] disconnected.\x1b[0m');
    });

    termRef.current   = term;
    socketRef.current = socket;

    return () => {
      socket.disconnect();
      term.dispose();
    };
  }, []);

  // when submit form
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!host.trim()) {
      setError('Please enter a mail-server hostname or IP.');
      return;
    }

    const term = termRef.current;
    if (term) {
      term.clear();
      term.writeln('\x1b[33m[Info] testing SMTP...\x1b[0m');
    }
    setRunning(true);

    socketRef.current?.emit('run_script', { host });
  };

  // listen for finish
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const onFinish = () => {
      setRunning(false);
      termRef.current?.writeln('\r\n\x1b[32m[Done] checks complete.\x1b[0m');
    };
    socket.on('script_finished', onFinish);

    return () => {
      socket.off('script_finished', onFinish);
    };
  }, []);

  return (
    <div className="outer-container">
      <div className="inner-container">
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

          <PButton theme="dark" variant="secondary" type="submit" style={{ marginTop: 20 }}>
            Test SMTP
          </PButton>

          {running && (
            <div style={{ marginTop: '1rem' }}>
              <PSpinner size="small" aria={{ 'aria-label': 'Testing...' }} />
            </div>
          )}

          {error && (
            <div className="response-message response-error" style={{ marginTop: '1rem' }}>
              {error}
            </div>
          )}
        </form>

        {/* xterm.js terminal pane */}
        <div
          ref={containerRef}
          style={{
            width: '100%',
            height: '300px',
            marginTop: '2rem',
            backgroundColor: '#000',
            borderRadius: 4,
            overflow: 'hidden'
          }}
        />

        <PText theme="dark" style={{ marginTop: '1rem' }}>
          This will run your Python SMTP‐testing script on the server (Flask on port 8080) and stream
          back the real-time port checks, NOOP responses, and STARTTLS results into this terminal view.
        </PText>
      </div>
    </div>
  );
};

export default SmtpTest;
