'use client';

import { useState, useEffect } from 'react';
import { Button } from '@buni/ui';
import { Input } from '@buni/ui';
import Link from 'next/link';
import { useRegister } from '../hooks/useRegister';
import { useGoogleLogin } from '../hooks/useGoogleLogin';
import { useGithubLogin } from '../hooks/useGithubLogin';
import { useToast, BuniLoader } from '@buni/ui';
import { GoogleLoginButton } from '@buni/auth';

export function RegisterForm() {
  const { mutate, isPending, error } = useRegister();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
            title: 'Compte créé', 
            message: 'Bienvenue ! Votre compte a été créé avec GitHub.' 
          });
        },
        onError: () => {
          add({ 
            variant: 'error', 
            title: 'Échec de la création', 
            message: 'Erreur lors de la création du compte avec GitHub.' 
          });
        }
      });
      // Clean URL
      window.history.replaceState({}, '', '/auth/register');
    }
  }, []);

  const handleGoogleLogin = (token: string) => {
    googleLogin.mutate(token, {
      onSuccess: () => {
        add({ 
          variant: 'success', 
          title: 'Compte créé', 
          message: 'Bienvenue ! Votre compte a été créé avec Google.' 
        });
      },
      onError: () => {
        add({ 
          variant: 'error', 
          title: 'Échec de la création', 
          message: 'Erreur lors de la création du compte avec Google.' 
        });
      }
    });
  };

  const handleGoogleError = () => {
    add({ 
      variant: 'error', 
      title: 'Échec de la création', 
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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      add({
        variant: 'error',
        title: 'Validation error',
        message: 'Les mots de passe ne correspondent pas.',
      });
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      add({
        variant: 'error',
        title: 'Validation error',
        message: 'Le mot de passe doit contenir au moins 8 caractères.',
      });
      return;
    }

    if (!/[A-Z]/.test(formData.password)) {
      add({
        variant: 'error',
        title: 'Validation error',
        message: 'Le mot de passe doit contenir au moins une majuscule.',
      });
      return;
    }

    if (!/[0-9]/.test(formData.password)) {
      add({
        variant: 'error',
        title: 'Validation error',
        message: 'Le mot de passe doit contenir au moins un chiffre.',
      });
      return;
    }

    mutate(formData, {
      onSuccess: () => {
        add({
          variant: 'success',
          title: 'Compte créé',
          message: 'Votre compte a été créé avec succès. Bienvenue dans la communauté AVS !'
        });
      },
      onError: (err) => {
        add({
          variant: 'error',
          title: 'Échec de la création',
          message: err?.message || 'Une erreur est survenue lors de la création du compte. Veuillez réessayer.'
        });
      }
    });
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p className="text-muted-foreground text-sm">Join the AVS community</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Full Name
          </label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={isPending}
            required
            minLength={2}
          />
        </div>

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
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              disabled={isPending}
              required
              minLength={8}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isPending}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-muted-foreground text-xs">
            Minimum 8 characters, 1 uppercase, 1 number
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm Password
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              disabled={isPending}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isPending}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {error && typeof error === 'string' && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <div className="flex items-center gap-2">
              <BuniLoader size={16} showText={false} />
              <span>Création...</span>
            </div>
          ) : (
            'Create Account'
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
            <BuniLoader size={16} showText={false} />
          ) : (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          )}
          GitHub
        </Button>
      </div>

      <p className="text-muted-foreground text-center text-sm">
        Already have an account?{' '}
        <Link href="/auth/login" className="font-medium hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
