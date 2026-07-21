'use client';

import { useState } from 'react';
import { Button } from '@buni/ui';
import { Input } from '@buni/ui';
import Link from 'next/link';
import { useLogin } from '../hooks/useLogin';
import { useToast, BuniLoader } from '@buni/ui';

export function LoginForm() {
  const { mutate, isPending, error } = useLogin();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { add } = useToast();

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
      onError: () => {
        add({ 
          variant: 'error', 
          title: 'Échec de la connexion', 
          message: 'Email ou mot de passe incorrect. Veuillez réessayer.' 
        });
      }
    });
  };

  return (
    <div className="w-full max-w-md space-y-6">
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
              <BuniLoader size={16} showText={false} />
              <span>Connexion...</span>
            </div>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>

      <p className="text-muted-foreground text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/auth/register" className="font-medium hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
