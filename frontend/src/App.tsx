import React, { ReactNode, useEffect, useState, FormEvent, Suspense } from 'react'
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
import FullPageSpinner from './components/FullPageSpinner';

import Adduct from './pages/Adduct';
import Compound from './pages/Compound';
import CollisionPlot from './pages/ACT_Math';
import Smtpcheck from './pages/Smtpcheck';
import Login from './login/Login'
import D9bot from './pages/D9bot'

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
      marginBottom: 200
      }}>
      <PLinkTile
        href="/D9bot"
        label="D9bot"
        description="Dispelk9 Bot"
        compact={true}
      >
        <PTag slot="header" theme="dark" color="background-frosted" compact={true}>
          #Gemini#LLM#AI
        </PTag>
        <img src="./assets/AI.jpg" alt="Adduct" />
      </PLinkTile>
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
        href="https://certcheck.dispelk9.de/"
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
        href="https://analytical.dispelk9.de/check_mk/"
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
        href="/smtpcheck"
        label=""
        description="SMTP/SMTPS/SMTPstarttls"
        compact={true}
      >
        <PTag slot="header" theme="dark" color="background-frosted" compact={true}>
          ##Port 25,465 or 587
        </PTag>
        <img src="./assets/in_dev.png" alt="Mailing" />
      </PLinkTile>
      <PLinkTile
        href="https://app.terraform.io/app/dispelk9_org/workspaces"
        label="HCP Terraform"
        description="Remote State TF Management"
        compact={true}
      >
        <PTag slot="header" theme="dark" color="background-frosted" compact={true}>
          ##HCP Terraform
        </PTag>
        <img src="./assets/HCTF.png" alt="IaC" />
      </PLinkTile>
            <PLinkTile
        href="https://dash.cloudflare.com/login"
        label="Cloudflare"
        description="Routing/Analytic"
        compact={true}
      >
        <PTag slot="header" theme="dark" color="background-frosted" compact={true}>
          ##Cloudflare
        </PTag>
        <img src="./assets/cloudflare.jpg" alt="CF" />
      </PLinkTile>
    </div>

    {/* Main Content */}
    <main className="flex-1 overflow-auto p-8 sm:p-20">
        <Routes>
          <Route path="/adduct" element={<Adduct />} />
          <Route path="/compound" element={<Compound />} />
          <Route path="/math" element={<CollisionPlot />} />
          <Route path="/smtpcheck" element={<Smtpcheck />} />
          <Route path="/D9bot" element={<D9bot />} />
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
      <p className="text-sm text-white">Copyright 2025 - Ai Viet Hoang x Dispelk9</p>
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
        <Suspense fallback={<FullPageSpinner />}>
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
        </Suspense>
        </BrowserRouter>
      </QueryClientProvider>
    </PorscheDesignSystemProvider>
  );
}

export default App;



