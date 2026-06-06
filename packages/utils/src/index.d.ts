import { type ClassValue } from 'clsx';
export declare const cn: (...inputs: ClassValue[]) => string;
export declare const formatNumber: (n: number, locale?: string) => string;
export declare const formatDate: (iso: string, locale?: string) => string;
export declare const timeAgo: (iso: string, locale?: string) => string;
export declare const slugify: (str: string) => string;
export declare const capitalize: (str: string) => string;
export declare const truncate: (str: string, n: number) => string;
export declare const sleep: (ms: number) => Promise<void>;
export { useDarkMode } from './useDarkMode';
//# sourceMappingURL=index.d.ts.map