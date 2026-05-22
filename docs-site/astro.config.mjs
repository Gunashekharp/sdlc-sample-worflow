import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';
import starlightImageZoom from 'starlight-image-zoom';
import starlightVersions from 'starlight-versions';

// Archived documentation versions. `versions.json` is the single source of
// truth for which versions exist; the `version-docs` workflow appends to it
// whenever a release tag (v*) is pushed. Newest first.
const versions = JSON.parse(
  readFileSync(new URL('./versions.json', import.meta.url), 'utf-8'),
);

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
      plugins: [
        // Click-to-zoom for images, including embedded Figma designs.
        starlightImageZoom(),
        // Documentation versioning: adds a version picker and freezes a
        // snapshot of the docs for each entry in versions.json. The live
        // ("Latest") docs continue to live in src/content/docs/.
        starlightVersions({ versions }),
      ],
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
