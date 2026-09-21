import React, { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LatticeLoader from './LatticeLoader'
import { logoutFromAuthProvider } from '../auth/auth'
import { handbookSearchHref } from '../data/handbook'
import './Navbar.css'

const Navbar: React.FC = () => {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
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

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    navigate(handbookSearchHref(trimmed))
  }

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        Dispelk9 Tools
      </Link>

      <form className="navbar-search" onSubmit={handleSearch} role="search">
        <input
          type="search"
          className="navbar-search-input"
          placeholder="Search handbook…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search handbook"
        />
        <button type="submit" className="nav-item-trigger">Search</button>
      </form>

      <form className="navbar-actions" onSubmit={handleLogout}>
        {logoutError && <span className="navbar-logout-error">{logoutError}</span>}
        {isLoggingOut && <LatticeLoader status="working" label="Logging out" showTimer={false} grid={3} cellSize={5} fontSize={12} />}
        <button type="submit" className="nav-item-trigger">Logout</button>
      </form>
    </header>
  )
}

export default Navbar
