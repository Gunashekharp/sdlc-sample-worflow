import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://gunashekharp.github.io',
  base: '/sdlc-sample-worflow',
  integrations: [
    starlight({
      title: 'Snabbit Agent Console',
      description: 'Documentation for the Snabbit Agent Console',
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
