import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

export const formatNumber = (n: number, locale = 'fr-FR'): string =>
  new Intl.NumberFormat(locale).format(n);

export const formatDate = (iso: string, locale = 'fr-FR'): string =>
  new Date(iso).toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric' });

export const timeAgo = (iso: string, locale = 'fr-FR'): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const rtf  = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  if (diff < 60000)    return rtf.format(-Math.round(diff / 1000), 'second');
  if (diff < 3600000)  return rtf.format(-Math.round(diff / 60000), 'minute');
  if (diff < 86400000) return rtf.format(-Math.round(diff / 3600000), 'hour');
  return rtf.format(-Math.round(diff / 86400000), 'day');
};

export const slugify = (str: string): string =>
  str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const truncate = (str: string, n: number): string =>
  str.length > n ? str.slice(0, n - 1) + '…' : str;

export const sleep = (ms: number): Promise<void> =>
  new Promise(res => setTimeout(res, ms));

export { useDarkMode } from './useDarkMode';
