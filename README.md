# 🐆 Chiví Korá — Yaguareté y los Perros

Juego de estrategia ancestral guaraní implementado en TypeScript + React + Vite.

El **Yaguareté** (jaguar) debe capturar a los **Perros** saltando sobre ellos, mientras los perros intentan acorralarlo sin dejarlo mover.

## 🎮 Demo

Próximamente en Vercel.

## 🧠 Reglas

- Tablero de 15 posiciones conectadas
- 1 Yaguareté (naranja) vs 7 Perros (marrón oscuro)
- El Yaguareté mueve 1 casilla en cualquier dirección o captura saltando sobre un perro
- Los Perros mueven 1 casilla hacia adelante o los costados (no retroceden)
- Gana el Yaguareté si captura 4+ perros
- Ganan los Perros si acorralan al Yaguareté (sin movimientos posibles)

## 🏗️ Arquitectura

- **Clean Architecture** con separación de dominio, casos de uso e interfaz
- **Game Engine** con estado inmutable y detección de victoria
- **Tutorial interactivo** paso a paso con highlights y narración
- **Piezas SVG** con diseño de siluetas realistas (felino y canino)

## 🛠️ Stack

| Capa | Tecnología |
|------|-----------|
| UI | React 19 + TypeScript |
| Build | Vite |
| Tests | Vitest + Playwright |
| SVG | Componentes React inline |
| Deploy | Vercel |

## 🚀 Desarrollo

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # Vitest
npm run build    # Producción
```

## 📂 Estructura

```
src/
├── domain/          # Entidades y reglas de negocio
│   ├── Board.ts
│   ├── GameEngine.ts
│   └── Position.ts
├── ui/              # Componentes React
│   ├── Board.tsx
│   ├── Piece.tsx
│   ├── Tutorial.tsx
│   └── ...
└── App.tsx
```

## 📝 Licencia

MIT
