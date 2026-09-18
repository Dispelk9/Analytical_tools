import React, { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { PSpinner } from '@porsche-design-system/components-react'
import { logoutFromAuthProvider } from '../auth/auth'
import './Navbar.css'

const Navbar: React.FC = () => {
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
      <Link to="/" className="navbar-brand">
        Dispelk9 Tools
      </Link>

      <form className="navbar-actions" onSubmit={handleLogout}>
        {logoutError && <span className="navbar-logout-error">{logoutError}</span>}
        {isLoggingOut && <PSpinner size="small" aria={{ 'aria-label': 'Logging out' }} />}
        <button type="submit" className="nav-item-trigger">Logout</button>
      </form>
    </header>
  )
}

export default Navbar
