'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { locales, defaultLocale } from '../config';

export function useLocale() {
  const router = useRouter();
  const pathname = usePathname();
  
  // Extract current locale from pathname
  const getCurrentLocale = (): string => {
    const segments = pathname.split('/');
    const potentialLocale = segments[1];
    return locales.includes(potentialLocale as any) ? potentialLocale! : defaultLocale;
  };

  const [locale, setLocaleState] = useState(getCurrentLocale);

  useEffect(() => {
    setLocaleState(getCurrentLocale());
  }, [pathname]);

  const setLocale = (newLocale: string) => {
    const segments = pathname.split('/');
    
    // If current path has a locale, replace it
    if (locales.includes(segments[1] as any)) {
      segments[1] = newLocale;
      router.push(segments.join('/'));
    } else {
      // If no locale in path, add it
      segments.splice(1, 0, newLocale);
      router.push(segments.join('/'));
    }
  };

  return { locale, setLocale };
}
