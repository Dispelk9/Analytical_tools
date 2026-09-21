import React, { useEffect, useState, FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  PButton,
  PText,
} from "@porsche-design-system/components-react";
import LatticeLoader from '../components/LatticeLoader'
import {
  completeKeycloakLogin,
  hasKeycloakCallbackParams,
  startKeycloakLogin,
} from '../auth/auth'

const Login: React.FC = () => {
  const [error, setError] = useState<string>('')
  const navigate = useNavigate()
  const location = useLocation()
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const routeState = location.state as { returnPath?: string } | null
  const returnPath = routeState?.returnPath || '/'

  useEffect(() => {
    if (!hasKeycloakCallbackParams()) return

    let mounted = true

    const completeLogin = async () => {
      try {
        setIsCalculating(true)
        const redirectPath = await completeKeycloakLogin()
        if (mounted) navigate(redirectPath || '/', { replace: true })
      } catch (err) {
        console.error('Keycloak authentication failed:', err)
        if (mounted) {
          setError('Failed to authenticate with Keycloak')
          setIsCalculating(false)
        }
      }
    }

    completeLogin()

    return () => {
      mounted = false
    }
  }, [navigate])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setIsCalculating(true);
      await startKeycloakLogin(returnPath)
    } catch (err) {
      setIsCalculating(false);
      console.error('Keycloak redirect failed:', err);
      setError('Failed to start Keycloak login');
    }
  }

  return (
    <div className="login-screen">
    <div className="form-wrapper">
    <form onSubmit={handleSubmit}>
      <div>
        <PText theme="dark" style={{ textAlign: 'justify' }}>
          <h2 className="text-2xl">Welcome to my Playground</h2>
          Sign in with Keycloak to continue to Analytical Tools.
        </PText >
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
        {isCalculating && (
          <div style={{ marginTop: '1rem' }}>
            <LatticeLoader status="working" label="Signing in" showTimer={false} />
          </div>
        )}
        <PButton type="submit" style={{ marginTop: '50px' }}>Sign in with Keycloak</PButton>
    </form>

    {/* Footer */}
    <footer className="h-16 flex items-center justify-center bg-gray-800" style={{ marginTop: '200px' }}>
      <p className="text-sm text-white">Copyright 2026 - Ai Viet Hoang x Dispelk9</p>
    </footer>
    </div>
    </div>
  )
}

export default Login
