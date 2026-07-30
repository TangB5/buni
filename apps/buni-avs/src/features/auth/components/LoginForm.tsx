'use client';

import { useState, useEffect } from 'react';
import { Button } from '@buni/ui';
import { Input } from '@buni/ui';
import Link from 'next/link';
import { useLogin } from '../hooks/useLogin';
import { useGoogleLogin } from '../hooks/useGoogleLogin';
import { useGithubLogin } from '../hooks/useGithubLogin';
import { useToast, BuniLoader } from '@buni/ui';
import { GoogleLoginButton } from '@buni/auth';
import { useTheme } from 'next-themes';

export function LoginForm() {
  const { mutate, isPending, error } = useLogin();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { add } = useToast();
  
  const googleLogin = useGoogleLogin();
  const githubLogin = useGithubLogin();

  // Handle GitHub token from URL callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const githubToken = urlParams.get('github_token');
    
    if (githubToken) {
      githubLogin.mutate(githubToken, {
        onSuccess: () => {
          add({ 
            variant: 'success', 
            title: 'Connexion réussie', 
            message: 'Bienvenue ! Vous êtes maintenant connecté avec GitHub.' 
          });
        },
        onError: () => {
          add({ 
            variant: 'error', 
            title: 'Échec de la connexion', 
            message: 'Erreur lors de la connexion avec GitHub.' 
          });
        }
      });
      // Clean URL
      window.history.replaceState({}, '', '/auth/login');
    }
  }, []);

  const handleGoogleLogin = (token: string) => {
    googleLogin.mutate(token, {
      onSuccess: () => {
        add({ 
          variant: 'success', 
          title: 'Connexion réussie', 
          message: 'Bienvenue ! Vous êtes maintenant connecté avec Google.' 
        });
      },
      onError: () => {
        add({ 
          variant: 'error', 
          title: 'Échec de la connexion', 
          message: 'Erreur lors de la connexion avec Google.' 
        });
      }
    });
  };

  const handleGoogleError = () => {
    add({ 
      variant: 'error', 
      title: 'Échec de la connexion', 
      message: 'Erreur lors de l\'authentification Google.' 
    });
  };

  const handleGithubLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/api/auth/github/callback`;
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email`;
    window.location.href = githubAuthUrl;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData, {
      onSuccess: () => {
        add({
          variant: 'success',
          title: 'Connexion réussie',
          message: 'Bienvenue ! Vous êtes maintenant connecté.'
        });
      },
      onError: (err) => {
        add({
          variant: 'error',
          title: 'Échec de la connexion',
          message: err?.message || 'Email ou mot de passe incorrect. Veuillez réessayer.'
        });
      }
    });
  };

  return (
    <div className="relative w-full max-w-md space-y-6">
      {/* Motif de fond subtil */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.30]"
        style={{
          backgroundImage: `url(${theme === 'dark' ? '/motif_fond_noire.png' : '/motif_fond_blanc.png'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        aria-hidden
      />
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <p className="text-muted-foreground text-sm">Sign in to your AVS account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={isPending}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            disabled={isPending}
            required
          />
        </div>

        {error && <p className="text-sm text-red-500">{error.message}</p>}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <div className="flex items-center gap-2">
              <BuniLoader size={16} showText={false} theme="dark" />
              <span>Connexion...</span>
            </div>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <GoogleLoginButton
          disabled={googleLogin.isPending || githubLogin.isPending}
          onSuccess={handleGoogleLogin}
          onError={handleGoogleError}
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleGithubLogin}
          disabled={googleLogin.isPending || githubLogin.isPending}
          className="gap-2"
        >
          {githubLogin.isPending ? (
            <BuniLoader size={16} showText={false} theme="dark" />
          ) : (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          )}
          GitHub
        </Button>
      </div>

      <p className="text-muted-foreground text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/auth/register" className="font-medium hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}

