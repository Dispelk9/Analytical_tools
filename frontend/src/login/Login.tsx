import React, { useEffect, useState, FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  PButton,
  PText,
} from "@porsche-design-system/components-react";
import { useReducedMotion } from 'motion/react'
import LatticeLoader from '../components/LatticeLoader'
import DecryptedText from '../components/DecryptedText'
import {
  completeKeycloakLogin,
  hasKeycloakCallbackParams,
  startKeycloakLogin,
} from '../auth/auth'
import './Login.css'

const WELCOME_TEXT = 'Welcome to my Playground'

const Login: React.FC = () => {
  const [error, setError] = useState<string>('')
  const navigate = useNavigate()
  const location = useLocation()
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const routeState = location.state as { returnPath?: string } | null
  const returnPath = routeState?.returnPath || '/'
  const reduceMotion = useReducedMotion()

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
      <div className="login-card">
        <form className="login-form" onSubmit={handleSubmit}>
          <p className="login-eyebrow">Analytical Tools</p>

          <h1 className="login-title">
            <span className="login-sr-only">{WELCOME_TEXT}</span>
            {reduceMotion ? (
              <span aria-hidden="true">{WELCOME_TEXT}</span>
            ) : (
              <DecryptedText
                aria-hidden="true"
                text={WELCOME_TEXT}
                animateOn="inViewHover"
                sequential
                revealDirection="start"
                speed={45}
                className="login-title-revealed"
                encryptedClassName="login-title-encrypted"
              />
            )}
          </h1>

          <PText theme="auto" color="contrast-high">
            Sign in with Keycloak to continue to Analytical Tools.
          </PText>

          {error && <p className="response-error" role="alert">{error}</p>}

          {isCalculating && (
            <div className="login-status">
              <LatticeLoader status="working" label="Signing in" showTimer={false} />
            </div>
          )}

          <PButton theme="auto" type="submit" className="login-submit" disabled={isCalculating}>
            Sign in with Keycloak
          </PButton>
        </form>
      </div>

      <footer className="login-footer">
        <p>Copyright 2026 - Ai Viet Hoang x Dispelk9</p>
      </footer>
    </div>
  )
}

export default Login
