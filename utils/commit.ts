import Constants from 'expo-constants';

export function getCommitHash(): string {
  // Prefer EXPO_PUBLIC_ env var set during build/run
  const envHash = (process as any)?.env?.EXPO_PUBLIC_GIT_COMMIT as string | undefined;
  // Fallback to app.json extra fields if provided
  const extra = (Constants.expoConfig?.extra || {}) as any;
  const extraHash = extra.gitCommit || extra.commitHash || extra.GIT_COMMIT;
  return envHash || extraHash || 'unknown';
}

export function getAppInfo() {
  const name = Constants.expoConfig?.name || 'App';
  const version = Constants.expoConfig?.version || '0.0.0';
  const slug = (Constants.expoConfig as any)?.slug || '';
  return { name, version, slug };
}
