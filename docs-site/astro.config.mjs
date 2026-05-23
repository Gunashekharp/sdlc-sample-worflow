import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';
import starlightImageZoom from 'starlight-image-zoom';

export default defineConfig({
  site: 'https://gunashekharp.github.io',
  base: '/sdlc-sample-worflow',
  integrations: [
    // Renders mermaid fenced code blocks as diagrams; autoTheme keeps
    // diagram colours in sync with Starlight light/dark mode.
    mermaid({
      theme: 'default',
      autoTheme: true,
    }),
    starlight({
      title: 'Snabbit Agent Console',
      description: 'Documentation for the Snabbit Agent Console',
      // Click-to-zoom for images, including embedded Figma designs.
      plugins: [starlightImageZoom()],
      // Override the Footer to mount the "Ask the docs" chat widget on
      // every page (see src/components/ChatWidget.astro).
      components: {
        Footer: './src/components/Footer.astro',
      },
      customCss: ['./src/styles/snabbit.css'],
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/Gunashekharp/sdlc-sample-worflow',
        },
      ],
      editLink: {
        baseUrl:
          'https://github.com/Gunashekharp/sdlc-sample-worflow/edit/main/docs-site/src/content/docs/',
      },
    }),
  ],
});
