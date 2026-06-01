## Tarea: US-000 [SPIKE] — Modelado del grafo del tablero Chiví Korá

### Contexto del proyecto
Chiví Korá (Yaguareté Korá, "Ajedrez Guaraní") es un juego de tablero ancestral de las comunidades mbya guaraní de Misiones. Estamos construyendo una SPA con React 18 + TypeScript strict + Vite + SVG + Vercel. Sin backend, sin BD. Todo en memoria del navegador.

### El tablero (dato crítico)
El tablero NO es una matriz 2D. Es un GRAFO de nodos e intersecciones. Combina:
- Zona principal: 4 cuadrados tipo ta-te-ti (3x3 con diagonales) dispuestos en 2x2, formando una grilla de 4x4 con diagonales internas. Aprox 16-20 nodos.
- Zona cueva (Korá): triángulo adyacente al centro inferior de la grilla principal. Agrega ~3 nodos.
- Total: ~25 nodos jugables. Las piezas se mueven únicamente por las líneas (aristas) trazadas entre nodos.

### Posición inicial
- 15 perros (Checupe): ocupan las 2 primeras filas completas del tablero (parte superior)
- 1 yaguareté: en la cueva (vértice del triángulo inferior)

### Reglas de movimiento (ya verificadas con fuentes primarias)
- Perros: se mueven de a uno por turno, un paso, a lo largo de las líneas. NO pueden moverse hacia atrás (solo avanzan hacia el yaguareté o lateralmente). NO capturan.
- Yaguareté: se mueve en TODAS las direcciones. Captura perros saltando por encima de uno a la intersección vacía inmediata siguiente. Una captura por turno.

### Objetivo del spike (US-000)
Crear los archivos del motor de juego:

1. `/home/leonardo/projects/chivi-kora/src/engine/types.ts` con todas las interfaces TypeScript
2. `/home/leonardo/projects/chivi-kora/src/engine/graph.ts` con:
   - Definición de nodos (~25) con id, coordenadas x/y, zone (main|cueva)
   - Definición de aristas (~60) con from, to, direction (forward|backward|lateral|diagonal)
   - Función getValidMoves(gameState, nodeId): number[]
   - Función createInitialGameState(): GameState

### Tipos necesarios
```typescript
export type Player = 'yaguarete' | 'perros';
export interface Node { id: number; x: number; y: number; zone: 'main' | 'cueva'; }
export interface Edge { from: number; to: number; direction?: 'forward' | 'backward' | 'lateral' | 'diagonal'; }
export interface Piece { type: 'yaguarete' | 'perro'; nodeId: number; captured: boolean; }
export interface GameState { nodes: Node[]; edges: Edge[]; pieces: Piece[]; currentTurn: Player; status: 'playing' | 'perros_win' | 'yaguarete_win'; }
```

### Tests a implementar (TDD: RED -> GREEN -> REFACTOR)
Crear `/home/leonardo/projects/chivi-kora/tests/engine/graph.test.ts` con Vitest:

1. T01: Perro en borde superior solo avanza - getValidMoves() no incluye nodos hacia atrás
2. T02: Perro bloqueado por otro perro - no incluye el nodo bloqueado
3. T03: Yaguareté con captura disponible - incluye nodo de captura (salto)
4. T04: Yaguareté sin captura (nodo detrás ocupado) - solo movimientos normales
5. T05: Pieza rodeada completamente - retorna []
6. T06: Turno incorrecto - llamar con pieza que NO es del turno actual retorna []
7. T07: createInitialGameState() - verifica 15 perros, 1 yaguareté, posiciones correctas, turno inicial = yaguareté

### Setup del proyecto
Si no existe package.json, inicializar con Vite + React + TypeScript e instalar Vitest.

### Restricciones
- TypeScript strict mode
- Motor PURO, sin imports de React
- Funciones puras (sin side effects)
- Usar Vitest para testing

### Output esperado
Al finalizar: `npm test` debe pasar los 7 tests.
Trabajar con TDD estricto: empezar por el test más simple (T07) y subir desde ahí.
