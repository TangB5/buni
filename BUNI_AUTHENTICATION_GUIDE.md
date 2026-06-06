# Guide Complet de l'Authentification Buni

## 📋 Table des matières
1. [Vue d'ensemble](#vue-densemble)
2. [Architecture générale](#architecture-générale)
3. [Authentification dans buni-avs](#authentification-dans-buni-avs)
4. [Backend (avs-backend)](#backend-avs-backend)
5. [Intégration dans buni-mode](#intégration-dans-buni-mode)
6. [Flux complet](#flux-complet)
7. [Sécurité](#sécurité)

---

## Vue d'ensemble

Le système d'authentification de Buni utilise une **architecture centralisée** avec:
- **Frontend**: React/Next.js avec Zustand pour la gestion d'état
- **Backend**: Node.js Express avec JWT et cookies HttpOnly
- **Package partagé**: `@buni/auth` contenant les types et hooks réutilisables

### Stack technique
- **JWT**: Authentification par tokens
- **Zustand**: Gestion d'état client
- **Zod**: Validation de schémas
- **React Query**: Gestion des mutations API
- **Express.js**: Backend API
- **Prisma**: ORM/Base de données

---

## Architecture générale

```
┌─────────────────────────────────────────────────────────────┐
│                     COUCHE FRONTEND (buni-avs)              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ useAuth() / useAuthStore() hooks                      │   │
│  │ → Récupère état user, token, permissions             │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ useLogin() / useRegister() mutations                 │   │
│  │ → Envoie credentials à /api/auth/{login|register}    │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ AuthHydrator.tsx                                      │   │
│  │ → Récupère la session du serveur au démarrage         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓↑
         /api/auth/{login|register|logout|refresh}
                              
┌─────────────────────────────────────────────────────────────┐
│              COUCHE PROXY (Next.js API Routes)              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Transmet requêtes au backend (avs-backend)           │   │
│  │ Gère cookies HttpOnly                                 │   │
│  │ Env: NEXT_PUBLIC_API_URL = http://localhost:4000     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓↑
        POST /api/v1/auth/{login|register|logout|refresh}
                              
┌─────────────────────────────────────────────────────────────┐
│              COUCHE BACKEND (avs-backend)                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ AuthController                                        │   │
│  │ - login(email, password) → JWT + Cookies             │   │
│  │ - register(email, password, name) → JWT + Cookies    │   │
│  │ - logout() → Clear cookies                           │   │
│  │ - refreshToken() → New JWT                           │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ AuthService                                           │   │
│  │ - Validation des credentials (bcrypt)                │   │
│  │ - Génération JWT (access + refresh)                  │   │
│  │ - Gestion des tokens                                 │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Middleware: authenticate() + requireRole()           │   │
│  │ - Vérifie JWT depuis cookies HttpOnly                │   │
│  │ - Vérifie les rôles/permissions                      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Authentification dans buni-avs

### 1. **Package @buni/auth** (partagé entre apps)

#### Types (`packages/auth/src/types/index.ts`)
```typescript
// Rôles disponibles
export type UserRole = 'viewer' | 'contributor' | 'curator' | 'admin';

// Structure utilisateur
export type User = {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
};

// Validation des logins/registrations
export type LoginDto = { email: string; password: string };
export type RegisterDto = { name: string; email: string; password: string; role?: UserRole };

// État Zustand
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isHydrated: boolean;
  error: string | null;
}
```

#### Store Zustand (`packages/auth/src/store/useAuthStore.ts`)

Stocke l'état d'authentification en mémoire + localStorage (via Zustand):
```typescript
const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isHydrated: false,
      error: null,
      
      // Actions
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: () => set(initial),
      
      // Vérifications de rôles
      isAdmin: () => get().user?.role === 'admin',
      isCurator: () => ['admin', 'curator'].includes(get().user?.role ?? ''),
      canContribute: () => ['admin', 'curator', 'contributor'].includes(...)
    })
  )
);
```

**Avantages:**
- Persistance automatique via Zustand (localStorage par défaut)
- Redux DevTools pour debugging
- État centralisé et réactif

#### Hooks (`packages/auth/src/hooks/useAuth.ts`)

**`useAuth()` - Hook principal pour lire l'état:**
```typescript
export function useAuth() {
  const { user, isLoading, isHydrated, error, logout, isAdmin, isCurator, canContribute } = 
    useAuthStore();
  
  return {
    user,
    isLoading,
    isHydrated,
    error,
    isAuthenticated: !!user,
    isAdmin: isAuthenticated && isAdmin(),
    isCurator: isAuthenticated && isCurator(),
    canContribute: isAuthenticated && canContribute(),
    logout
  };
}
```

**Exemple d'utilisation:**
```typescript
'use client';
import { useAuth } from '@buni/auth';

export function Dashboard() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) return <Redirect to="/login" />;
  
  return (
    <div>
      <h1>Bienvenue {user?.name}</h1>
      {isAdmin && <AdminPanel />}
    </div>
  );
}
```

---

### 2. **Frontend - buni-avs**

#### Service API (`apps/buni-avs/src/features/auth/services/auth.service.ts`)

Wrapper autour des API HTTP:
```typescript
export const authService = {
  async register(dto: RegisterDto) {
    return post<AuthResponse>('/api/v1/auth/register', dto);
  },
  
  async login(dto: LoginDto) {
    return post<AuthResponse>('/api/v1/auth/login', dto);
  },
  
  async logout() {
    return post('/api/v1/auth/logout');
  },
  
  async getMe() {
    return get<UserResponse>('/api/v1/users/me');
  },
  
  async refreshToken() {
    return post<AuthResponse>('/api/v1/auth/refresh');
  }
};
```

#### Hook de Login (`apps/buni-avs/src/features/auth/hooks/useLogin.ts`)

```typescript
export const useLogin = () => {
  const { setUser, setToken } = useAuthStore();
  const router = useRouter();
  
  const mutation = useMutation({
    mutationFn: async (data: LoginDto) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include', // Important: envoie les cookies
      });
      
      if (!res.ok) throw new Error('Login failed');
      return res.json();
    },
    onSuccess: (data) => {
      // Met à jour le store Zustand
      setUser(data.data.user);
      setToken(data.data.tokens?.accessToken ?? null);
      // Redirige vers dashboard
      router.push('/dashboard');
    },
  });
  
  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
  };
};
```

**Flux du login:**
```
LoginForm (composant)
    ↓
useLogin.mutate({email, password})
    ↓
POST /api/auth/login (Next.js proxy)
    ↓
Backend: POST /api/v1/auth/login
    ↓
Validation + JWT + Cookies
    ↓
Response + Set-Cookie headers
    ↓
useAuthStore.setUser() + setToken()
    ↓
Redirect to /dashboard
```

#### AuthHydrator (`apps/buni-avs/src/components/auth/AuthHydrator.tsx`)

**Composant critique** qui restaure la session au démarrage de l'app:

```typescript
export function AuthHydrator() {
  const [hasRun, setHasRun] = useState(false);
  
  useEffect(() => {
    if (hasRun) return;
    
    const hydrateAuth = async () => {
      try {
        // 1. Extrait le token du cookie (si disponible côté client)
        const tokenFromCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('avs_session='))
          ?.split('=')[1];
        
        if (tokenFromCookie) {
          useAuthStore.setState({ token: tokenFromCookie });
        }
        
        // 2. Valide la session avec le serveur backend
        const response = await authService.getMe();
        useAuthStore.setState({
          user: response.data,
          isHydrated: true,
        });
      } catch {
        // Session invalide/expirée
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
```

**Points importants:**
- S'exécute une **seule fois** au démarrage (grâce à `hasRun`)
- Les changements de route utilisent l'état Zustand persisté (pas de re-hydration)
- Valide la session avec le backend pour s'assurer que le token est toujours valide
- Marque `isHydrated = true` même si la session est invalide (pour afficher les pages)

#### Intégration dans le layout principal

```typescript
// apps/buni-avs/src/app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthHydrator />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

#### Routes API Proxy (`apps/buni-avs/src/app/api/auth/`)

**login/route.ts** et **register/route.ts** transmettent les requêtes au backend et gèrent les cookies:

```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    
    // 1. Transmet à backend
    const backendRes = await fetch(`${apiUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include', // Important!
    });
    
    const data = await backendRes.json();
    
    if (!backendRes.ok) {
      return NextResponse.json(data, { status: backendRes.status });
    }
    
    // 2. Propage les cookies du backend
    const response = NextResponse.json(data, { status: 200 });
    const setCookieHeader = backendRes.headers.get('set-cookie');
    if (setCookieHeader) {
      response.headers.set('set-cookie', setCookieHeader);
    }
    
    return response;
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}
```

---

## Backend (avs-backend)

### 1. **AuthService** (`src/modules/auth/application/auth.service.ts`)

Logique métier pour l'authentification:

```typescript
export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET!;
  private readonly accessExpiry = '24h';
  private readonly refreshExpiry = '7d';
  
  constructor(private readonly userRepository: PrismaUserRepository) {}
  
  // REGISTER
  async register(dto: RegisterDto): Promise<AuthResponse> {
    // 1. Vérifie que l'email n'existe pas
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) throw new ConflictError('Email already registered');
    
    // 2. Hash du password avec bcrypt
    const passwordHash = await bcrypt.hash(dto.password, 10);
    
    // 3. Crée l'utilisateur en BD
    const user = await this.userRepository.create({
      email: dto.email,
      name: dto.name,
      passwordHash,
      role: dto.role || 'VIEWER',
    });
    
    // 4. Génère JWT et retourne
    return this.generateAuthResponse(user);
  }
  
  // LOGIN
  async login(dto: LoginDto): Promise<AuthResponse> {
    // 1. Trouve l'utilisateur par email
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user || !user.passwordHash) {
      throw new UnauthorizedError('Invalid email or password');
    }
    
    // 2. Valide le password avec bcrypt
    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedError('Invalid email or password');
    }
    
    // 3. Génère JWT et retourne
    return this.generateAuthResponse(user);
  }
  
  // CORE: Génération des tokens
  private generateAuthResponse(user: User): AuthResponse {
    const accessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      this.jwtSecret,
      { expiresIn: this.accessExpiry }
    );
    
    const refreshToken = jwt.sign(
      { userId: user.id },
      this.jwtSecret,
      { expiresIn: this.refreshExpiry }
    );
    
    return {
      user: { ...user, passwordHash: undefined }, // Ne retourne pas le hash!
      tokens: { accessToken, refreshToken, expiresIn: 24 * 60 * 60 }
    };
  }
}
```

**Points de sécurité:**
- ✅ Passwords hashés avec bcrypt (salt=10)
- ✅ Les tokens ne contiennent que userId, email, role (pas password)
- ✅ JWT signé avec secret depuis .env
- ✅ Tokens avec expiration

### 2. **AuthController** (`src/modules/auth/auth.controller.ts`)

Gère les requêtes HTTP:

```typescript
export class AuthController {
  // LOGIN
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = LoginSchema.parse(req.body); // Validation Zod
      const result = await this.service.login(data);
      
      this.setAuthCookies(res, result.tokens); // Set HttpOnly cookies
      
      res.json(ok({ user: result.user }, 'Login successful'));
    } catch (err) {
      next(err);
    }
  };
  
  // COOKIES MANAGEMENT
  private setAuthCookies(res: Response, tokens: any) {
    const isProd = process.env.NODE_ENV === 'production';
    
    res.cookie('avs_access', tokens.accessToken, {
      httpOnly: true,      // Pas accessible depuis JavaScript
      secure: isProd,      // HTTPS only en production
      sameSite: 'strict',  // CSRF protection
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
    });
    
    res.cookie('avs_refresh', tokens.refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
      path: '/',
    });
  }
  
  private clearAuthCookies(res: Response) {
    res.clearCookie('avs_access', { /* ... */ });
    res.clearCookie('avs_refresh', { /* ... */ });
  }
}
```

### 3. **Middleware d'Authentification** (`src/shared/middlewares/auth.middleware.ts`)

Protège les routes privées:

```typescript
export interface JwtPayload {
  userId: string;
  email: string;
  role: 'viewer' | 'contributor' | 'curator' | 'admin';
  iat: number;
  exp: number;
}

// Ajoute le JWT au req.user
export const authenticate: RequestHandler = (req, _res, next) => {
  try {
    const token = req.cookies?.avs_access;
    
    if (!token) {
      throw new UnauthorizedError('Token manquant');
    }
    
    const secret = process.env.JWT_SECRET;
    const payload = jwt.verify(token, secret) as JwtPayload;
    req.user = payload;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedError('Token expiré'));
    } else if (err instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Token invalide'));
    } else {
      next(err);
    }
  }
};

// Guard par rôle
export const requireRole = (...roles: JwtPayload['role'][]): RequestHandler =>
  (req, _res, next) => {
    if (!req.user) return next(new UnauthorizedError());
    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError(`Rôle requis : ${roles.join(' ou ')}`));
    }
    next();
  };

// Helpers
export const requireCurator = requireRole('curator', 'admin');
export const requireAdmin = requireRole('admin');
```

**Utilisation:**
```typescript
// routes/videos.ts
router.post(
  '/api/v1/videos',
  authenticate,      // Doit être connecté
  requireCurator,    // Doit être curator ou admin
  controller.createVideo
);
```

---

## Intégration dans buni-mode

### Plan d'intégration pour `buni-mode` (app similaire à buni-avs)

#### Step 1: Réutiliser @buni/auth

Le package `@buni/auth` est **conçu pour être réutilisable** dans toutes les apps:

```json
// buni-mode/package.json
{
  "dependencies": {
    "@buni/auth": "*",
    "@buni/api": "*",
    "zustand": "^4.x",
    "react-query": "^3.x"
  }
}
```

#### Step 2: Copier la structure de buni-avs

Structure à copier dans `buni-mode/src/`:

```
buni-mode/src/
├── features/
│   ├── auth/
│   │   ├── hooks/
│   │   │   ├── useLogin.ts
│   │   │   ├── useRegister.ts
│   │   │   └── useAuth.ts (optionnel, réenveloppe @buni/auth)
│   │   ├── services/
│   │   │   └── auth.service.ts (similaire à buni-avs)
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   └── types/
│   │       └── index.ts (ou réutilise @buni/auth)
│   └── auth/
│       ├── LoginForm.tsx
│       ├── RegisterForm.tsx
│       └── types.ts
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── login/route.ts (proxy vers backend)
│   │       ├── register/route.ts
│   │       ├── logout/route.ts
│   │       └── refresh/route.ts
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   ├── layout.tsx
│   └── page.tsx
└── components/
    └── auth/
        └── AuthHydrator.tsx
```

#### Step 3: Code minimal pour buni-mode

**`buni-mode/src/components/auth/AuthHydrator.tsx`:**
```typescript
'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@buni/auth';

export function AuthHydrator() {
  const [hasRun, setHasRun] = useState(false);
  
  useEffect(() => {
    if (hasRun) return;
    
    const hydrateAuth = async () => {
      try {
        const tokenFromCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('mode_session='))
          ?.split('=')[1];
        
        if (tokenFromCookie) {
          useAuthStore.setState({ token: tokenFromCookie });
        }
        
        // Appel au backend pour valider la session
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        });
        
        if (response.ok) {
          const user = await response.json();
          useAuthStore.setState({
            user: user.data,
            isHydrated: true,
          });
        } else {
          throw new Error('Invalid session');
        }
      } catch {
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
```

**`buni-mode/src/app/api/auth/login/route.ts`:**
```typescript
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    
    const backendRes = await fetch(`${apiUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include',
    });
    
    const data = await backendRes.json();
    
    if (!backendRes.ok) {
      return NextResponse.json(data, { status: backendRes.status });
    }
    
    const response = NextResponse.json(data, { status: 200 });
    const setCookieHeader = backendRes.headers.get('set-cookie');
    if (setCookieHeader) {
      response.headers.set('set-cookie', setCookieHeader);
    }
    
    return response;
  } catch (err) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
```

**`buni-mode/src/features/auth/hooks/useLogin.ts`:**
```typescript
'use client';

import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@buni/auth';
import { useRouter } from 'next/navigation';
import type { LoginDto } from '@buni/auth';

export const useLogin = () => {
  const { setUser, setToken } = useAuthStore();
  const router = useRouter();
  
  const mutation = useMutation({
    mutationFn: async (data: LoginDto) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      
      if (!res.ok) throw new Error('Login failed');
      return res.json();
    },
    onSuccess: (data) => {
      setUser(data.data.user);
      setToken(data.data.tokens?.accessToken ?? null);
      router.push('/dashboard');
    },
  });
  
  return mutation;
};
```

**`buni-mode/src/app/auth/login/page.tsx`:**
```typescript
'use client';

import { useState } from 'react';
import { useLogin } from '@/features/auth/hooks/useLogin';
import type { LoginDto } from '@buni/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { mutate: login, isPending, error } = useLogin();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password } as LoginDto);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Connecting...' : 'Login'}
      </button>
      {error && <p className="error">{error.message}</p>}
    </form>
  );
}
```

#### Step 4: Configuration .env

```bash
# buni-mode/.env.local
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## Flux complet

### Scénario: Login utilisateur dans buni-avs

```
1. UTILISATEUR OUVRE L'APP
   ↓
   AuthHydrator.tsx se monte
   ↓
   Appel GET /api/auth/me (via authService.getMe())
   ↓
   Backend valide le cookie avs_access
   ↓
   Si valide: retourne User
   ↓
   useAuthStore.setState({ user, isHydrated: true })
   ↓
   App affiche le dashboard
   
2. UTILISATEUR CLIQUE "LOGIN"
   ↓
   LoginForm appelé useLogin.mutate({ email, password })
   ↓
   POST /api/auth/login (route Next.js)
   ↓
   Next.js envoie au backend: POST /api/v1/auth/login
   ↓
   Backend:
     - Trouve user via email
     - Valide password (bcrypt.compare)
     - Génère access_token (24h) et refresh_token (7j)
     - Set cookies HttpOnly
     ↓
   Backend retourne: { user, tokens }
   ↓
   Next.js propage les cookies au client
   ↓
   Client reçoit la réponse
   ↓
   useAuthStore.setUser(user) + setToken(accessToken)
   ↓
   Router.push('/dashboard')
   
3. UTILISATEUR NAVIGATE (ex: /dashboard → /profile)
   ↓
   Cookie avs_access persiste automatiquement
   ↓
   useAuthStore reste en mémoire (localStorage via Zustand)
   ↓
   Pas de re-hydration
   ↓
   useAuth() retourne l'état du store
   
4. UTILISATEUR CLICK "LOGOUT"
   ↓
   useLogout() appelé
   ↓
   POST /api/auth/logout
   ↓
   Backend clear les cookies
   ↓
   Client clear Zustand state
   ↓
   Router.push('/')
```

---

## Sécurité

### 🔐 Points clés implémentés

| Aspect | Implémentation | Bénéfice |
|--------|-----------------|----------|
| **Password Storage** | bcrypt (salt=10) | Impossible de déchiffrer les passwords |
| **Token Storage** | Cookies HttpOnly | JS ne peut pas accéder aux tokens |
| **Token Expiration** | Access 24h, Refresh 7j | Limite la durée de validité d'un token volé |
| **CSRF Protection** | SameSite=strict | Empêche les attaques cross-site |
| **Token Signing** | JWT + Secret | Garantit que le token n'a pas été modifié |
| **Token Validation** | Middleware authenticate() | Chaque requête privée valide le JWT |
| **Role-Based Access** | requireRole/requireAdmin | Autorise les actions selon le rôle |
| **HTTPS in Prod** | secure: isProd flag | Chiffre la transmission des tokens |

### ⚠️ Recommandations

1. **Refresh Token Rotation**: Générer un nouveau refresh token à chaque utilisation
   ```typescript
   // Dans auth.service.ts
   async refreshToken(token: string) {
     const payload = jwt.verify(token, this.jwtSecret);
     // ... validation ...
     const response = this.generateAuthResponse(user);
     // ✅ Nouveau refresh token généré
     return response;
   }
   ```

2. **Token Blacklist** (pour logout rapide):
   ```typescript
   // Redis cache: tokenId → blacklisted
   async logout(req: Request) {
     const tokenId = req.user?.jti;
     await redis.set(`blacklist:${tokenId}`, true, { ex: 24 * 60 * 60 });
   }
   ```

3. **Rate Limiting** sur login/register:
   ```typescript
   import rateLimit from 'express-rate-limit';
   
   const loginLimiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 min
     max: 5, // 5 tentatives
     message: 'Trop de tentatives, réessayez plus tard'
   });
   
   router.post('/login', loginLimiter, authController.login);
   ```

4. **2FA (optionnel)**: Implémenter après le MVP

---

## Résumé

### Package @buni/auth (Réutilisable)
- ✅ Types (User, LoginDto, RegisterDto, AuthState)
- ✅ Store Zustand (useAuthStore)
- ✅ Hook useAuth() + useLogout()

### App buni-avs (Frontend)
- ✅ AuthHydrator: restaure session au démarrage
- ✅ useLogin/useRegister: mutations React Query
- ✅ API Proxy routes (/api/auth/*)
- ✅ AuthListener: écoute les changements

### Backend avs-backend
- ✅ AuthService: login/register/refresh logic
- ✅ AuthController: HTTP handlers
- ✅ authenticate middleware: valide JWT
- ✅ requireRole/requireAdmin: authorization guards

### Pour buni-mode
1. Ajouter `@buni/auth` comme dépendance
2. Copier la structure auth/ de buni-avs
3. Adapter le nom des cookies (mode_session au lieu de avs_session)
4. Configurer NEXT_PUBLIC_API_URL
5. Intégrer AuthHydrator dans le layout racine

---

**Dernière mise à jour**: Juin 2026  
**Version**: 1.0
