import React, { ReactNode, useEffect, useState, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PorscheDesignSystemProvider } from '@porsche-design-system/components-react';
import FullPageSpinner from './components/FullPageSpinner';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import SideRays from './components/SideRays';

import Dashboard from './pages/Dashboard';
import Adduct from './pages/Adduct';
import Compound from './pages/Compound';
import CollisionPlot from './pages/ACT_Math';
import Smtpcheck from './pages/Smtpcheck';
import Login from './login/Login'
import D9bot from './pages/D9bot'
import { authFetch } from './auth/auth'

interface RequireAuthProps {
  children: ReactNode
}

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


const AppLayout: React.FC = () => (
  <div className="app-shell">
    <Navbar />

    <div className="app-body">
      <Sidebar />

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/adduct" element={<Adduct />} />
          <Route path="/compound" element={<Compound />} />
          <Route path="/math" element={<CollisionPlot />} />
          <Route path="/smtpcheck" element={<Smtpcheck />} />
          <Route path="/D9bot" element={<D9bot />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>

    <footer className="app-footer">
      <p>Copyright 2025 - Ai Viet Hoang x Dispelk9</p>
    </footer>
  </div>
);

function App() {
  const queryClient = new QueryClient();
  return (
    <PorscheDesignSystemProvider>
      <SideRays
        className="app-background"
        speed={1.2}
        intensity={1.4}
        opacity={0.6}
        origin="top-right"
      />
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
