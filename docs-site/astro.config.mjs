import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';
import starlightImageZoom from 'starlight-image-zoom';
import starlightVersions from 'starlight-versions';

const versions = JSON.parse(
  readFileSync(new URL('./versions.json', import.meta.url), 'utf-8'),
);

export default defineConfig({
  site: 'https://gunashekharp.github.io',
  base: '/sdlc-sample-worflow',
  integrations: [
    mermaid({ theme: 'default', autoTheme: true }),
    starlight({
      title: 'Snabbit Agent Console',
      description: 'Documentation for the Snabbit Agent Console',
      plugins: [
        starlightImageZoom(),
        ...(versions.length > 0 ? [starlightVersions({ versions })] : []),
      ],
      // Component overrides:
      //   PageTitle — wraps the default <h1> with the Mintlify-style
      //               ContextualMenu (Copy page / Open in ChatGPT / …).
      //   Search    — wraps the default search button and adds an
      //               "Ask AI" header button + modal (AskAI.astro).
      components: {
        PageTitle: './src/components/PageTitle.astro',
        Search: './src/components/Search.astro',
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
