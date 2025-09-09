# TotalPeaks App

![CI](https://github.com/suarezfdz/totalpeaksapp/actions/workflows/ci.yml/badge.svg)

Aplicación móvil hecha con Expo/React Native y Expo Router. Permite explorar desafíos, ver mapas y gestionar hitos/milestones.

## Requisitos
- Node.js 20
- npm
- Dispositivos/Emuladores: Android Studio o Xcode (opcional si solo usas Expo Go)

## Inicio rápido
```bash
npm install
npm run start   # abre Expo (tunnel)
# Opcional
npm run android
npm run ios
npm run web
```

## Scripts
- `start`: inicia Expo con tunnel
- `android`: compila/lanza Android (expo run:android)
- `ios`: compila/lanza iOS (expo run:ios)
- `web`: inicia Expo Web
- `start-web-dev`: inicia Expo Web con logs de depuración
- `lint`: ejecuta ESLint (expo lint)

## Stack
- React 19, React Native 0.79, Expo 53
- Expo Router 5
- Zustand para estado
- TanStack Query para data fetching/cache
- NativeWind para estilos

## Estructura
- `app/`: rutas de la app con Expo Router
- `components/`: componentes UI reutilizables
- `hooks/`: stores y hooks (e.g. Zustand)
- `types/`: tipos TypeScript
- `mocks/`: datos de ejemplo

## CI y calidad
- GitHub Actions (`.github/workflows/ci.yml`):
  - `lint`: `npm run lint`
  - `typecheck`: `tsc --noEmit`
- Protección de rama en `main`: requiere 1 review y que pasen `lint` y `typecheck`.

## Licencia
Este proyecto está bajo licencia MIT. Ver `LICENSE`.
