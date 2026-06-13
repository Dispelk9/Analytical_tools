import React, { ReactNode, useEffect, useState, FormEvent, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  PorscheDesignSystemProvider,
  PLinkTile,
  PTag,
  PButton,
  PSpinner,
} from '@porsche-design-system/components-react';
import FullPageSpinner from './components/FullPageSpinner';

import Adduct from './pages/Adduct';
import Compound from './pages/Compound';
import CollisionPlot from './pages/ACT_Math';
import Smtpcheck from './pages/Smtpcheck';
import Login from './login/Login'
import D9bot from './pages/D9bot'
import { authFetch, logoutFromAuthProvider } from './auth/auth'

interface RequireAuthProps {
  children: ReactNode
}

interface ToolTile {
  href: string
  label: string
  description: string
  tags: string
  imageSrc: string
  imageAlt: string
}

interface ToolTheme {
  id: string
  title: string
  tiles: ToolTile[]
}

const toolThemes: ToolTheme[] = [
  {
    id: 'infrastructure',
    title: 'Infrastructure',
    tiles: [
      {
        href: 'https://analytical.dispelk9.de/check_mk/',
        label: 'Checkmk',
        description: 'Checkmk',
        tags: '#Monitoring',
        imageSrc: './assets/checkmk.png',
        imageAlt: 'Monitoring',
      },
      {
        href: 'https://app.terraform.io/app/dispelk9_org/workspaces',
        label: 'HCP Terraform',
        description: 'Remote State TF Management',
        tags: '#HCP Terraform',
        imageSrc: './assets/HCTF.png',
        imageAlt: 'IaC',
      },
    ],
  },
  {
    id: 'smtp',
    title: 'SMTP',
    tiles: [
      {
        href: 'https://certcheck.dispelk9.de/',
        label: 'Certcheck',
        description: 'SMTP Certfetcher',
        tags: '#Go#Js#Certs',
        imageSrc: './assets/ssl.jpg',
        imageAlt: 'Certcheck',
      },
      {
        href: 'https://mail.dispelk9.de',
        label: 'Mailing',
        description: 'MX Postfix/Dovecot',
        tags: '#Docker#Mailcow',
        imageSrc: './assets/sogo.png',
        imageAlt: 'Mailing',
      },
      {
        href: '/smtpcheck',
        label: 'SMTP Check',
        description: 'SMTP/SMTPS/SMTPstarttls',
        tags: '#Port 25,465 or 587',
        imageSrc: './assets/in_dev.png',
        imageAlt: 'SMTP check',
      },
    ],
  },
  {
    id: 'dns',
    title: 'DNS',
    tiles: [
      {
        href: 'https://dash.cloudflare.com/login',
        label: 'Cloudflare',
        description: 'Routing/Analytic',
        tags: '#Cloudflare',
        imageSrc: './assets/cloudflare.jpg',
        imageAlt: 'Cloudflare',
      },
    ],
  },
  {
    id: 'ai-agent',
    title: 'AI / Agent',
    tiles: [
      {
        href: '/D9bot',
        label: 'D9bot',
        description: 'Dispelk9 Bot',
        tags: '#Gemini#LLM#AI',
        imageSrc: './assets/AI.jpg',
        imageAlt: 'D9bot',
      },
    ],
  },
  {
    id: 'act',
    title: 'ACT Chemistry',
    tiles: [
      {
        href: '/adduct',
        label: 'Adduct',
        description: 'ACT Adduct',
        tags: '#Python#React#Js',
        imageSrc: './assets/adduct.jpg',
        imageAlt: 'Adduct',
      },
      {
        href: '/compound',
        label: 'Compound',
        description: 'ACT Compound',
        tags: '#Python#React#Js',
        imageSrc: './assets/compound.png',
        imageAlt: 'Compound',
      },
      {
        href: '/math',
        label: 'Math',
        description: 'ACT Math',
        tags: '#Math#Equation',
        imageSrc: '/assets/ACT-math.jpg',
        imageAlt: 'ACT Math',
      },
    ],
  },
]

const ToolThemeTile: React.FC<{ tile: ToolTile }> = ({ tile }) => (
  <PLinkTile
    href={tile.href}
    label={tile.label}
    description={tile.description}
    compact={true}
  >
    <PTag slot="header" theme="dark" color="background-frosted" compact={true}>
      {tile.tags}
    </PTag>
    <img src={tile.imageSrc} alt={tile.imageAlt} />
  </PLinkTile>
)

const ToolThemeSection: React.FC<{ theme: ToolTheme }> = ({ theme }) => (
  <section
    className="tool-theme-section"
    aria-labelledby={`${theme.id}-heading`}
    data-testid={`${theme.id}-theme`}
  >
    <h2 id={`${theme.id}-heading`} className="tool-theme-title">
      {theme.title}
    </h2>
    <div className="tool-theme-grid">
      {theme.tiles.map(tile => (
        <ToolThemeTile key={`${theme.id}-${tile.href}`} tile={tile} />
      ))}
    </div>
  </section>
)

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const location = useLocation()
  const [loading, setLoading] = useState<boolean>(true)
  const [authed, setAuthed] = useState<boolean>(false)

  useEffect(() => {
    authFetch('/api/check-auth')
      .then(res => {
        setAuthed(res.ok)
        setLoading(false)
      })
      .catch(() => {
        setAuthed(false)
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading...</div>
  return authed ? (
    <>{children}</>
  ) : (
    <Navigate
      to="/login"
      replace
      state={{ returnPath: `${location.pathname}${location.search}` }}
    />
  )
}


const AppLayout: React.FC = () => {


  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [error, setError] = useState<string>('')



  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
    try {
      setIsCalculating(true);
      await logoutFromAuthProvider()
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

    <div className="tool-theme-list">
      {toolThemes.map(theme => (
        <ToolThemeSection key={theme.id} theme={theme} />
      ))}
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
