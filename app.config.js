// Dynamic Expo config to inject the current Git commit hash into extra.gitCommit
// Priority: EXPO_PUBLIC_GIT_COMMIT env var > current git HEAD > existing app.json value > 'unknown'

const { execSync } = require('child_process');

function getGitShortHash() {
  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch (_) {
    return null;
  }
}

module.exports = ({ config }) => {
  const envHash = process.env.EXPO_PUBLIC_GIT_COMMIT || null;
  const gitHash = envHash || getGitShortHash();
  const existing = (config.extra && (config.extra.gitCommit || config.extra.commitHash)) || null;

  const gitCommit = gitHash || existing || 'unknown';

  return {
    ...config,
    extra: {
      ...(config.extra || {}),
      gitCommit,
    },
  };
};
