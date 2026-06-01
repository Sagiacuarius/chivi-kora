# 🐆 Chiví Korá — Yaguareté y los Perros

Juego de estrategia ancestral guaraní implementado en TypeScript + React + Vite.

**Chiví Korá** significa "el corral del jaguar" en guaraní (*chiví* = jaguar, *korá* = corral/cercado).

El **Yaguareté** 🐆 debe capturar a los **Perros** 🐕 saltando sobre ellos, mientras los perros intentan acorralarlo sin dejarlo mover.

## 🎮 Demo

🔗 **[chivi-kora.vercel.app](https://chivi-kora.vercel.app)**

## 🧠 Reglas

- Tablero: grafo de 34 nodos conectados
- 1 Yaguareté 🐆 vs 15 Perros 🐕
- El Yaguareté mueve 1 casilla en cualquier dirección o captura saltando sobre un perro
- Los Perros mueven 1 casilla en cualquier dirección (incluyendo retroceso y diagonal)
- Gana el Yaguareté si reduce los perros a 6 (captura 9)
- Ganan los Perros si acorralan al Yaguareté (sin movimientos posibles)

## 🏗️ Arquitectura

- **Clean Architecture** con separación de dominio, casos de uso e interfaz
- **Game Engine** con estado inmutable y detección de victoria
- **Tutorial interactivo** paso a paso con highlights y narración
- **Piezas SVG** con diseño de siluetas realistas (🐆 felino y 🐕 canino)

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
├── engine/
│   ├── domain/               # Reglas de negocio
│   │   ├── board-topology.ts # Grafo de 34 nodos
│   │   ├── game-rules.ts     # Movimientos y capturas
│   │   ├── heuristic.ts      # Evaluación de posiciones
│   │   └── types.ts          # Tipos inmutables
│   ├── use-cases/            # Casos de uso
│   │   ├── create-game.ts    # Inicializar partida
│   │   ├── execute-move.ts   # Ejecutar jugada
│   │   └── validate-move.ts  # Validar movimiento
│   ├── ai.ts                 # Motor de IA
│   └── index.ts
├── ui/                       # Componentes React
│   ├── Board.tsx             # Tablero SVG
│   ├── Piece.tsx             # Piezas SVG (🐆🐕)
│   ├── Tutorial.tsx          # Tutorial interactivo
│   ├── GameOver.tsx          # Pantalla de victoria
│   ├── GameSetup.tsx         # Configuración inicial
│   ├── MoveHistory.tsx       # Historial de jugadas
│   ├── CulturalPanel.tsx     # Contenido cultural
│   ├── useAI.ts              # Hook de IA
│   ├── useGame.ts            # Hook de estado
│   ├── useGameSetup.ts       # Hook de setup
│   ├── useSound.ts           # Hook de sonido
│   └── App.tsx
└── main.tsx                  # Entry point
```

## 📝 Licencia

MIT
