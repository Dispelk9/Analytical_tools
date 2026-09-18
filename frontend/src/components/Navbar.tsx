import React, { FormEvent, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { PButton, PSpinner } from '@porsche-design-system/components-react'
import { toolThemes, isExternalHref } from '../data/toolThemes'
import { logoutFromAuthProvider } from '../auth/auth'
import './Navbar.css'

const Navbar: React.FC = () => {
  const [openThemeId, setOpenThemeId] = useState<string | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState('')
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenThemeId(null)
      }
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenThemeId(null)
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  const toggleTheme = (id: string) => {
    setOpenThemeId(current => (current === id ? null : id))
  }

  const handleLogout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      setIsLoggingOut(true)
      await logoutFromAuthProvider()
    } catch (err) {
      console.error('Error logout', err)
      setLogoutError('Failed to logout')
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="navbar" ref={navRef}>
      <Link to="/" className="navbar-brand" onClick={() => setOpenThemeId(null)}>
        Dispelk9 Tools
      </Link>

      <nav className="navbar-nav" aria-label="Tool categories">
        {toolThemes.map(theme => (
          <div className="nav-item" key={theme.id}>
            <button
              type="button"
              className="nav-item-trigger"
              aria-haspopup="menu"
              aria-expanded={openThemeId === theme.id}
              onClick={() => toggleTheme(theme.id)}
            >
              {theme.title}
              <span className="nav-item-caret" aria-hidden="true">▾</span>
            </button>

            {openThemeId === theme.id && (
              <div className="nav-dropdown" role="menu">
                {theme.tiles.map(tile =>
                  isExternalHref(tile.href) ? (
                    <a
                      key={tile.href}
                      href={tile.href}
                      role="menuitem"
                      className="nav-dropdown-item"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setOpenThemeId(null)}
                    >
                      <span className="nav-dropdown-item-label">{tile.label}</span>
                      <span className="nav-dropdown-item-desc">{tile.description}</span>
                    </a>
                  ) : (
                    <Link
                      key={tile.href}
                      to={tile.href}
                      role="menuitem"
                      className="nav-dropdown-item"
                      onClick={() => setOpenThemeId(null)}
                    >
                      <span className="nav-dropdown-item-label">{tile.label}</span>
                      <span className="nav-dropdown-item-desc">{tile.description}</span>
                    </Link>
                  ),
                )}
              </div>
            )}
          </div>
        ))}
      </nav>

      <form className="navbar-actions" onSubmit={handleLogout}>
        {logoutError && <span className="navbar-logout-error">{logoutError}</span>}
        {isLoggingOut && <PSpinner size="small" aria={{ 'aria-label': 'Logging out' }} />}
        <PButton type="submit" variant="secondary" compact={true}>Logout</PButton>
      </form>
    </header>
  )
}

export default Navbar
