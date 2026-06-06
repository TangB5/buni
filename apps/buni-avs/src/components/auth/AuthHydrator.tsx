'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@buni/auth';
import { authService } from '../../features/auth/services/auth.service';

/**
 * Hydrator component - restores auth session from server on initial mount
 * IMPORTANT: Only runs once on app mount, not on route changes
 * Route changes will use persisted Zustand state from localStorage
 */
export function AuthHydrator() {
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    if (hasRun) return;

    const hydrateAuth = async () => {
      try {
        // Extract token from cookie if available
        const tokenFromCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('avs_session='))
          ?.split('=')[1];

        if (tokenFromCookie) {
          useAuthStore.setState({ token: tokenFromCookie });
        }

        // Validate session with server
        const response = await authService.getMe();
        useAuthStore.setState({
          user: response.data,
          isHydrated: true,
        });
      } catch {
        // Session invalid/expired or network error
        // Clear user but still mark as hydrated
        useAuthStore.setState({
          user: null,
          token: null,
          isHydrated: true,
        });
      } finally {
        setHasRun(true);
      }
    };

    hydrateAuth();
  }, [hasRun]);

  return null;
}
