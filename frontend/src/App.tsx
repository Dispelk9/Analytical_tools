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

    <div
      className="p-8 bg-gray-100"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gridTemplateRows: 'repeat(3, auto)',
        gap: '16px',
        // Centers each tile within its cell
        placeItems: 'center',
      }}
    >
      {/* Row 1, Col 1: Home tile */}
      <PLinkTile
        label="Home"
        description="Go to homepage"
        compact={true}
        href="/"
        style={{ gridColumn: '1', gridRow: '1' }}
      >
        <PTag slot="header" theme="dark" color="background-frosted" compact={true}>
          #About
        </PTag>
        <img src="/assets/devop.jpg" alt="Home" />
      </PLinkTile>

      {/* Row 1, Col 2 is intentionally empty */}
      {/* (If you omit any tile here, the next row automatically goes to row 2) */}

      {/* Row 2, Col 1: Adduct */}
      <PLinkTile
        href="/adduct"
        label="Adduct"
        description="ACT Adduct"
        compact={true}
        style={{ gridColumn: '1', gridRow: '2' }}
      >
        <PTag slot="header" theme="dark" color="background-frosted" compact={true}>
          #Python#React#Js
        </PTag>
        <img src="./assets/adduct.jpg" alt="Adduct" />
      </PLinkTile>

      {/* Row 2, Col 2: Compound */}
      <PLinkTile
        href="/compound"
        label="Compound"
        description="ACT Compound"
        compact={true}
        style={{ gridColumn: '2', gridRow: '2' }}
      >
        <PTag slot="header" theme="dark" color="background-frosted" compact={true}>
          #Python#React#Js
        </PTag>
        <img src="./assets/compound.png" alt="Compound" />
      </PLinkTile>

      {/* Row 3, Col 1: Certcheck */}
      <PLinkTile
        href="https://analytical.dispelk9.de:8443/"
        label="Certcheck"
        description="For SMTP Certfetcher"
        compact={true}
        style={{ gridColumn: '1', gridRow: '3' }}
      >
        <PTag slot="header" theme="dark" color="background-frosted" compact={true}>
          #Go#Js
        </PTag>
        <img src="./assets/ssl.jpg" alt="Certcheck" />
      </PLinkTile>

      {/* Row 3, Col 2: Mailing */}
      <PLinkTile
        href="https://mail.dispelk9.de/s"
        label="Mailing"
        description="Mailserver with Postfix/Dovecot"
        compact={true}
        style={{ gridColumn: '2', gridRow: '3' }}
      >
        <PTag slot="header" theme="dark" color="background-frosted" compact={true}>
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

