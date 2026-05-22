import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { docsVersionsLoader } from 'starlight-versions/loader';

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  // Required by starlight-versions: reads the archived version configs
  // from src/content/versions/<slug>.json (generated automatically).
  versions: defineCollection({ loader: docsVersionsLoader() }),
};
