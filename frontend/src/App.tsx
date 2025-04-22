import React, { ReactNode, useEffect, useState, FormEvent } from 'react'
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  PorscheDesignSystemProvider,
  PLinkTile,
  PTag,
  PButton,
  PSpinner,
} from '@porsche-design-system/components-react';
import { useNavigate } from 'react-router-dom'


import Adduct from './pages/Adduct';
import Compound from './pages/Compound';
import CollisionPlot from './pages/ACT_Math';
import Login from './login/Login'

interface RequireAuthProps {
  children: ReactNode
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [authed, setAuthed] = useState<boolean>(false)

  useEffect(() => {
    fetch('/api/check-auth', { credentials: 'include' })
      .then(res => {
        setAuthed(res.ok)
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading...</div>
  return authed ? <>{children}</> : <Navigate to="/login" />
}


const AppLayout: React.FC = () => {


  const navigate = useNavigate()
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [error, setError] = useState<string>('')



  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setIsCalculating(true);
      const res = await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (res.ok) {
        navigate('/login')
      } else {
        setError('Can not logout')
      }
    } catch (err) {
      console.error('Error logout', err);
      setError('Failed to logout');
    } finally {
      setIsCalculating(false);
    }
  }

  
  return(
  <div className="min-h-screen flex flex-col">
    {/* Header */}
    <header className="h-16 flex items-center justify-center bg-gray-800">
      <h1 className="text-white text-xl">Dispelk9 Tools</h1>
    </header>

    <div   
      style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)', // 4 equal-width columns in one row
      gap: '16px',                           // spacing between columns
      }}>
      <PLinkTile
        href="/adduct"
        label="Adduct"
        description="ACT Adduct"
        compact={true}
      >
        <PTag slot="header" theme="dark" color="background-frosted" compact={true}>
          #Python#React#Js
        </PTag>
        <img src="./assets/adduct.jpg" alt="Adduct" />
      </PLinkTile>
      <PLinkTile
        href="/compound"
        label="Compound"
        description="ACT Compound"
        compact={true}
      >
        <PTag slot="header" theme="dark" color="background-frosted" compact={true}>
          #Python#React#Js
        </PTag>
        <img src="./assets/compound.png" alt="Compound" />
      </PLinkTile>
      <PLinkTile
        href="/math"
        label="Math"
        description="ACT Math"
        compact={true}
      >
        <PTag slot="header" theme="dark" color="background-frosted" compact={true}>
          #Math#Equation
        </PTag>
        <img src="/assets/ACT-math.jpg" alt="Home" />
      </PLinkTile>
      <PLinkTile
        href="https://analytical.dispelk9.de:8443/"
        label="Certcheck"
        description="SMTP Certfetcher"
        compact={true}
      >
        <PTag slot="header" theme="dark" color="background-frosted" compact={true}>
          #Go#Js#Certs
        </PTag>
        <img src="./assets/ssl.jpg" alt="Certcheck" />
      </PLinkTile>
      <PLinkTile
        href="https://mail.dispelk9.de"
        label="Mailing"
        description="MX Postfix/Dovecot"
        compact={true}
      >
        <PTag slot="header" theme="dark" color="background-frosted" compact={true}>
          #Docker#Mailcow
        </PTag>
        <img src="./assets/sogo.png" alt="Mailing" />
      </PLinkTile>
      <PLinkTile
        href="http://analytical.dispelk9.de:8082/"
        label="Checkmk"
        description="Checkmk"
        compact={true}
      >
        <PTag slot="header" theme="dark" color="background-frosted" compact={true}>
          #Monitoring
        </PTag>
        <img src="./assets/checkmk.png" alt="Monitoring" />
      </PLinkTile>
      <PLinkTile
        href="/"
        label="In development"
        description="Next Tool"
        compact={true}
      >
        <PTag slot="header" theme="dark" color="background-frosted" compact={true}>
          ##Incoming
        </PTag>
        <img src="./assets/in_dev.png" alt="Mailing" />
      </PLinkTile>
    </div>

    {/* Main Content */}
    <main className="flex-1 overflow-auto p-8 sm:p-20">
        <Routes>
          <Route path="/adduct" element={<Adduct />} />
          <Route path="/compound" element={<Compound />} />
          <Route path="/math" element={<CollisionPlot />} />
        </Routes>
    </main>



    <div>
    <form onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {isCalculating && (
          <div style={{ marginTop: '1rem' }}>
            <PSpinner size="small" aria={{ 'aria-label': 'Loading result' }} />
          </div>
        )}
        <PButton type="submit" style={{ marginTop: '50px' }}>Logout</PButton>
    </form>
    </div>

    {/* Footer */}
    <footer className="h-16 flex items-center justify-center bg-gray-800" style={{ marginTop: '200px' }}>
      <p className="text-sm text-white">Copyright 2025 - Porsche Design x Dispelk9</p>
    </footer>
  </div>
);

};

function App() {
  const queryClient = new QueryClient();
  return (
    <PorscheDesignSystemProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <RequireAuth>
                <AppLayout />
              </RequireAuth>
            }
          />
        </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </PorscheDesignSystemProvider>
  );
}

export default App;



