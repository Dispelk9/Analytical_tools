// vite.config.ts
import { defineConfig } from 'vite';
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

    return html.replace(/<\/head>/, `${headPartials}</head>`);
  },
});

export default defineConfig({
  plugins: [react(), transformIndexHtmlPlugin()],
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
