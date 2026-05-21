/*
 * Runtime configuration, read from environment variables.
 * Sensible defaults keep local development zero-config.
 */
export const config = {
  port: Number(process.env.PORT ?? 3001),
  databaseUrl:
    process.env.DATABASE_URL ?? 'postgres://localhost:5432/snabbit_dash',
  /** When set together with githubRepo, the CI/CD adapter goes live. */
  githubToken: process.env.GITHUB_TOKEN ?? '',
  /** owner/repo, e.g. "snabbit/changelog-automation". */
  githubRepo: process.env.GITHUB_REPO ?? '',
}
