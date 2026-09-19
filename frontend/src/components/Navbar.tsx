import React, { FormEvent, useState } from 'react'
import { useLocation } from 'react-router-dom'
import PillNav from './PillNav'
import ThoughtLine from './ThoughtLine'
import { logoutFromAuthProvider } from '../auth/auth'
import appLogo from '../../public/assets/act.png'
import './Navbar.css'

// PillNav only supports link items (no onClick actions like logout), so it
// covers the primary internal pages here and Logout stays a separate control.
const NAV_ITEMS = [
  { label: 'Overview', href: '/' },
  { label: 'D9bot', href: '/D9bot' },
  { label: 'Adduct', href: '/adduct' },
  { label: 'Compound', href: '/compound' },
  { label: 'Math', href: '/math' },
  { label: 'SMTP Check', href: '/smtpcheck' },
]

const Navbar: React.FC = () => {
  const location = useLocation()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState('')

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
    <header className="navbar">
      <PillNav
        logo={appLogo}
        logoAlt="Dispelk9 Tools"
        items={NAV_ITEMS}
        activeHref={location.pathname}
        baseColor="#12161c"
        pillColor="#1e2530"
        hoveredPillTextColor="#f8fafc"
        pillTextColor="#cbd5e1"
      />

      <form className="navbar-actions" onSubmit={handleLogout}>
        {logoutError && <span className="navbar-logout-error">{logoutError}</span>}
        {isLoggingOut && (
          <ThoughtLine
            working
            label="Logging out"
            showTimer={false}
            collapsible={false}
            glyph="dot"
            fontSize={13}
          />
        )}
        <button type="submit" className="nav-item-trigger">Logout</button>
      </form>
    </header>
  )
}

export default Navbar
