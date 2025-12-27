# ADR 003: Penggunaan Zustand untuk State Management Frontend

- **Status**: Diterima
- **Tanggal**: 2025-01-15
- **Konteks**: Frontend memerlukan state management solution untuk mengelola state global aplikasi

## Konteks

Aplikasi React memerlukan state management untuk:
- User authentication state
- Asset data caching
- Request data management
- UI state (modals, loading states)
- Notification state

Alternatif yang dipertimbangkan:
1. **Redux Toolkit**: Solusi industry standard, tetapi memiliki boilerplate yang banyak
2. **Zustand**: Lightweight, minimal boilerplate, API sederhana
3. **Context API**: Built-in React, tetapi tidak optimal untuk frequent updates
4. **Jotai/Recoil**: Atomic state management, tetapi learning curve lebih tinggi

## Keputusan

Kami memutuskan untuk menggunakan **Zustand** untuk state management di frontend.

## Konsekuensi

### Keuntungan (Positif)

- **Minimal Boilerplate**: Setup sangat sederhana, tidak perlu providers atau actions
- **Performance**: Hanya re-render komponen yang menggunakan state yang berubah
- **TypeScript Support**: Excellent type inference
- **Persistence**: Built-in support untuk localStorage/sessionStorage
- **DevTools**: Support untuk Redux DevTools
- **Small Bundle Size**: ~1KB gzipped
- **Simple API**: Mudah dipelajari dan digunakan

### Kerugian (Negatif)

- **Ecosystem**: Lebih kecil dibandingkan Redux (tetapi cukup untuk kebutuhan)
- **Pattern Consistency**: Developer perlu disiplin untuk maintain consistency (tidak ada enforced pattern seperti Redux)

## Implementasi

### Store Structure

Setiap domain memiliki store sendiri:
- `useAuthStore`: Authentication state
- `useAssetStore`: Asset data
- `useRequestStore`: Request data
- `useUIStore`: UI state
- `useNotificationStore`: Notifications

### Example Store

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      login: async (email, password) => {
        const user = await api.loginUser(email, password);
        set({ currentUser: user });
      },
      logout: () => {
        set({ currentUser: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

---

**Related ADRs**: None

