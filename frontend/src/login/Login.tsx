import React, { useState, FormEvent, KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PButton,
  PSpinner,
  PTextFieldWrapper,
  PText,
} from "@porsche-design-system/components-react";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const navigate = useNavigate()
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setIsCalculating(true);
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      })
      if (res.ok) {
        navigate('/')
      } else {
        setError('Invalid credentials')
      }
    } catch (err) {
      console.error('Error fetching Credential:', err);
      setError('Failed to authenticate');
    } finally {
      setIsCalculating(false);
    }
  }

  // Auto-submit on Enter key
  const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  return (
    <div>
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
      <div>
        <PText theme="dark" style={{ textAlign: 'justify' }}>
          <h2 className="text-2xl">Welcome to my Playground</h2>
        
          This page demonstrates various DevOps skills and small demos showcasing
          Docker, CI/CD, container orchestration, and more.
        </PText >
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
          <PTextFieldWrapper theme="dark" label="Username" description="input testuser if want to test">
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </PTextFieldWrapper>
        </div>
        <div>
          <PTextFieldWrapper theme="dark" label="Password" description="input dispelk9 if want to test">
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </PTextFieldWrapper>
        </div>
        {isCalculating && (
          <div style={{ marginTop: '1rem' }}>
            <PSpinner size="small" aria={{ 'aria-label': 'Loading result' }} />
          </div>
        )}
        <PButton type="submit" style={{ marginTop: '50px' }}>Login</PButton>
    </form>

    {/* Footer */}
    <footer className="h-16 flex items-center justify-center bg-gray-800">
      <p className="text-sm text-white">Copyright 2025 - Porsche Design x Dispelk9</p>
    </footer>
    </div>
  )
}

export default Login