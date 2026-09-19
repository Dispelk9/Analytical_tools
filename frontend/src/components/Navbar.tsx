import React, { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import LatticeLoader from './LatticeLoader'
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
        {isLoggingOut && <LatticeLoader status="working" label="Logging out" showTimer={false} grid={3} cellSize={5} fontSize={12} />}
        <button type="submit" className="nav-item-trigger">Logout</button>
      </form>
    </header>
  )
}

export default Navbar
