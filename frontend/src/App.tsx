import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  PorscheDesignSystemProvider,
  PLinkTile,
  PTag,
} from '@porsche-design-system/components-react';
import Home from './pages/Home';
import Adduct from './pages/Adduct';
import Compound from './pages/Compound';

const queryClient = new QueryClient();

const AppLayout = () => (
  <div className="min-h-screen flex flex-col">
    {/* Header */}
    <header className="h-16 flex items-center justify-center bg-gray-800">
      <h1 className="text-white text-xl">Dispelk9 Tools</h1>
    </header>

    {/* LinkTiles for Tools */}
    <div
      className="p-8 bg-gray-100"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gridTemplateRows: 'auto auto auto', // 3 rows
        gap: '16px',
      }}
    >
      {/* 1st row: Home tile (spanning both columns) */}
      <PLinkTile
        href="/"
        label="Home"
        description="Go to homepage"
        compact
        style={{ gridColumn: '1 / span 2', gridRow: '1' }}
      >
        <PTag slot="header" theme="dark" color="background-frosted" compact>
          #About
        </PTag>
        <img src="/assets/devop.jpg" alt="Home" />
      </PLinkTile>

      {/* 2nd row, col 1: Adduct */}
      <PLinkTile
        href="/adduct"
        label="Adduct"
        description="ACT Adduct"
        compact
        style={{ gridColumn: '1', gridRow: '2' }}
      >
        <PTag slot="header" theme="dark" color="background-frosted" compact>
          #Python#React#Js
        </PTag>
        <img src="./assets/adduct.jpg" alt="Adduct" />
      </PLinkTile>

      {/* 2nd row, col 2: Compound */}
      <PLinkTile
        href="/compound"
        label="Compound"
        description="ACT Compound"
        compact
        style={{ gridColumn: '2', gridRow: '2' }}
      >
        <PTag slot="header" theme="dark" color="background-frosted" compact>
          #Python#React#Js
        </PTag>
        <img src="./assets/compound.png" alt="Compound" />
      </PLinkTile>

      {/* 3rd row, col 1: Certcheck */}
      <PLinkTile
        href="https://analytical.dispelk9.de:8443/"
        label="Certcheck"
        description="For SMTP Certfetcher"
        compact
        style={{ gridColumn: '1', gridRow: '3' }}
      >
        <PTag slot="header" theme="dark" color="background-frosted" compact>
          #Go#Js
        </PTag>
        <img src="./assets/ssl.jpg" alt="Certcheck" />
      </PLinkTile>

      {/* 3rd row, col 2: Mailing */}
      <PLinkTile
        href="https://mail.dispelk9.de"
        label="Mailing"
        description="Mailserver with Postfix/Dovecot"
        compact
        style={{ gridColumn: '2', gridRow: '3' }}
      >
        <PTag slot="header" theme="dark" color="background-frosted" compact>
          #Docker#Mailcow#SoGo#Postfix
        </PTag>
        <img src="./assets/sogo.png" alt="Mailing" />
      </PLinkTile>
    </div>


    {/* Main Content */}
    <main className="flex-1 overflow-auto p-8 sm:p-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/adduct" element={<Adduct />} />
          <Route path="/compound" element={<Compound />} />
        </Routes>
    </main>

    {/* Footer */}
    <footer className="h-16 flex items-center justify-center bg-gray-800">
      <p className="text-sm text-white">Copyright 2025 - Porsche Design x Dispelk9</p>
    </footer>
  </div>
);

function App() {
  return (
    <PorscheDesignSystemProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </QueryClientProvider>
    </PorscheDesignSystemProvider>
  );
}

export default App;

