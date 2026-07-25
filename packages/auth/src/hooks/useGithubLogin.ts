"use client";

type GithubLoginOptions = {
  onSuccess?: (code: string) => void;
  onError?: () => void;
};


export function useGithubLogin(options: GithubLoginOptions = {}) {
  const { onSuccess, onError } = options;

  const login = async () => {
    if (typeof window === 'undefined') return;

    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID ?? process.env.GITHUB_CLIENT_ID;

    if (!clientId) {
      console.error('GitHub Client ID manquant');
      onError?.();
      return;
    }

    const redirectUri = `${window.location.origin}/api/auth/github/callback`;
    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email`;

    window.location.href = url;
    onSuccess?.('redirect');
  };

  return {
    login,
  };
}