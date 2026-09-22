// vite.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import {
  getComponentChunkLinks,
  getFontFaceStyles,
  getFontLinks,
  getIconLinks,
  getInitialStyles,
  getMetaTagsAndIconLinks,
} from '@porsche-design-system/components-react/partials';

const transformIndexHtmlPlugin = () => ({
  name: 'pds-partials',
  transformIndexHtml(html: string) {
    const headPartials = [
      getInitialStyles(),
      getFontFaceStyles(),
      getFontLinks(),
      getComponentChunkLinks(),
      getIconLinks(),
      getMetaTagsAndIconLinks({ appTitle: 'Dispelk9 Tools' }),
    ].join('');

    // getMetaTagsAndIconLinks() injects its own <link rel="icon"> tags, which are
    // appended after index.html's own favicon link and win the tab icon in most
    // browsers. Strip them so our act.png favicon (see index.html) isn't shadowed.
    const headPartialsWithoutIcon = headPartials.replace(/<link rel=icon[^>]*>/g, '');

    return html.replace(/<\/head>/, `${headPartialsWithoutIcon}</head>`);
  },
});

export default defineConfig({
  plugins: [react(), transformIndexHtmlPlugin()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.tsx',
    css: true,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
