import * as React from 'react';
import * as RadixAvatar from '@radix-ui/react-avatar';
import { cn } from '@/lib/cn';

const PATTERN_MAP: Record<string, string> = {
  admin:       'avs-pattern-ndop-sultan',
  curator:     'avs-pattern-kente-royale',
  contributor: 'avs-pattern-wax-dakar',
  viewer:      'avs-pattern-bogolan-fanga',
  default:     'avs-pattern-adinkra-sankofa',
};

interface AvsAvatarProps {
  src?:      string;
  name:      string;
  role?:     string;
  size?:     'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZES = { xs: 'h-6 w-6 text-[10px]', sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-12 w-12 text-base', xl: 'h-16 w-16 text-lg' };

export const AvsAvatar: React.FC<AvsAvatarProps> = ({ src, name, role = 'default', size = 'md', className }) => {
  const pattern = PATTERN_MAP[role] ?? PATTERN_MAP['default']!;
  const initials = name.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase();
  return (
    <RadixAvatar.Root className={cn('relative overflow-hidden rounded-full border-2 border-avs-secondary', SIZES[size], className)}>
      <RadixAvatar.Image src={src} alt={name} className="h-full w-full object-cover" />
      <RadixAvatar.Fallback className={cn(pattern, 'flex h-full w-full items-center justify-center')}>
        <div className="absolute inset-0 bg-avs-accent/30" />
        <span className="relative font-display font-black text-avs-secondary drop-shadow">{initials}</span>
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  );
};
