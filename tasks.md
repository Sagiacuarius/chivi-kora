# Backlog: Chiví Korá — Plataforma Web Interactiva

> **Versión:** 1.0 — MVP · **Semanas:** 7 · **Stack:** React + SVG + Vercel · **Score Gate:** 5/5 PATH A

---

## Epic 0: Discovery & Setup (F1 · Semana 1)

### [SPIKE] US-000: Modelado del grafo del tablero
**Como** Arquitecto/Dev  
**Quiero** prototipar el grafo de nodos y aristas del tablero Chiví Korá  
**Para** validar la complejidad técnica antes de estimar el motor y la IA

**Criterios de aceptación:**
- [ ] Grafo modelado con ~25 nodos y sus conexiones válidas (grilla 4×4 alquerque + triángulo cueva)
- [ ] Función `get_valid_moves(node_id, piece_type)` que retorne movimientos diferenciados por rol (perro: avance/lateral sin retroceso; yaguareté: omnidireccional + salto)
- [ ] Detección de captura del yaguareté: `can_capture(yaguarete_node, direction)` → captura si hay perro adyacente + nodo vacío detrás
- [ ] Script de prueba que imprima el grafo y valide movimientos básicos
- [ ] Documentar hallazgos para ajustar estimaciones de US-001 y US-003

**Prioridad:** Must have  
**Estimación:** 3 story points  
**Dependencias:** Ninguna  
**Notas:** [SPIKE] Crítico. El brief lo exige en F1. Define la viabilidad del proyecto. Output: `spike-grafo.md` + prototipo en `/src/engine/graph.ts`.

---

## Epic 1: Motor de Juego (F3 · Semanas 2-3.5)

### US-001: Tablero interactivo — renderizado del grafo
**Como** jugador  
**Quiero** ver el tablero del Chiví Korá renderizado en pantalla con sus nodos, aristas, la cueva y las piezas en posición inicial  
**Para** visualizar el estado del juego y empezar a jugar

**Criterios de aceptación:**
- [ ] El tablero se renderiza como un grafo de ~25 nodos con aristas visibles (SVG)
- [ ] La cueva (triángulo inferior) está conectada correctamente a la grilla principal
- [ ] Las piezas iniciales se muestran: 15 perros (filas superiores) + 1 yaguareté (cueva)
- [ ] Las piezas se diferencian visualmente (color/forma) — placeholder aceptable en este punto
- [ ] El tablero es responsive ≥ 768px
- [ ] DADO que cargo la página, CUANDO se renderiza, ENTONCES veo el tablero completo con piezas en posición inicial

**Prioridad:** Must have (P0 · Crítico)  
**Estimación:** 5 story points  
**Dependencias:** US-000 (spike del grafo)  
**Notas:** Usar SVG interactivo (no Canvas en esta etapa). Cada nodo es un `<circle>`, cada arista una `<line>`.

---

### US-002: Motor de reglas — movimientos y validación
**Como** jugador  
**Quiero** seleccionar una pieza y ver sus movimientos válidos resaltados, y que el sistema valide cada movimiento según las reglas del Chiví Korá  
**Para** jugar sin poder hacer trampa ni mover piezas ilegalmente

**Criterios de aceptación:**
- [ ] Click en pieza → resalta nodos de destino válidos
- [ ] Movimiento de perros: solo avance (hacia el yaguareté) o lateral, un paso por turno, sin retroceso
- [ ] Movimiento del yaguareté: omnidireccional (cualquier dirección), un paso por turno
- [ ] Captura del yaguareté: salto sobre perro adyacente a nodo vacío. Perro capturado se retira.
- [ ] Captura simple por turno (no múltiple)
- [ ] DADO que es el turno de los perros, CUANDO intento mover un perro hacia atrás, ENTONCES el sistema rechaza el movimiento
- [ ] DADO que el yaguareté tiene un perro adyacente con nodo vacío detrás, CUANDO selecciona saltar, ENTONCES el perro es capturado y retirado

**Prioridad:** Must have (P0 · Crítico)  
**Estimación:** 8 story points  
**Dependencias:** US-000, US-001  
**Notas:** El motor debe ser puro (sin UI acoplada). Funciones exportables: `getValidMoves()`, `makeMove()`, `getGameState()`.

---

### US-003: Condiciones de victoria — acorralamiento y umbral
**Como** jugador  
**Quiero** que el sistema detecte automáticamente cuándo ganan los perros (yaguareté acorralado) o el yaguareté (7 perros o menos)  
**Para** que la partida termine correctamente sin ambigüedades

**Criterios de aceptación:**
- [ ] Detección de acorralamiento: BFS/DFS desde el nodo del yaguareté. Si no tiene movimientos válidos → ganan perros
- [ ] Detección de umbral: si quedan ≤ 7 perros en el tablero → gana el yaguareté
- [ ] Al detectar victoria: se muestra mensaje de resultado, se bloquean movimientos
- [ ] DADO que el yaguareté no tiene movimientos válidos, CUANDO termina su turno, ENTONCES se declara ganador a los perros
- [ ] DADO que quedan 7 perros en el tablero, CUANDO se captura el 8vo, ENTONCES se declara ganador al yaguareté

**Prioridad:** Must have (P0 · Crítico)  
**Estimación:** 5 story points  
**Dependencias:** US-002  
**Notas:** El algoritmo de alcanzabilidad (BFS/DFS) ya fue validado en US-000.

---

## Epic 2: IA Asimétrica (F4 · Semanas 3.5-5.5)

### US-004: IA Minimax con poda alfa-beta y heurística dual
**Como** jugador  
**Quiero** jugar contra una IA que tome decisiones estratégicas diferentes si controla al yaguareté o a los perros  
**Para** tener un oponente desafiante sin necesidad de otro humano

**Criterios de aceptación:**
- [ ] Algoritmo Minimax con poda alfa-beta implementado
- [ ] Dos funciones heurísticas diferenciadas:
  - Heurística del yaguareté: maximiza movilidad + capturas disponibles
  - Heurística de los perros: minimiza movilidad del yaguareté + maximiza compresión/flancos
- [ ] Dos niveles de dificultad:
  - Fácil: profundidad 3, sin poda agresiva
  - Difícil: profundidad 5+, con poda alfa-beta completa
- [ ] Tiempo de respuesta < 2 segundos en nivel difícil
- [ ] Jugador elige al inicio si controla al yaguareté o a los perros
- [ ] DADO que elijo nivel difícil controlando los perros, CUANDO la IA (yaguareté) mueve, ENTONCES responde en < 2 segundos
- [ ] DADO que la IA controla los perros en nivel fácil, CUANDO es su turno, ENTONCES comete errores no triviales (no regala piezas obvias)

**Prioridad:** Must have (P0 · Crítico)  
**Estimación:** 8 story points  
**Dependencias:** US-002, US-003  
**Notas:** [SPIKE] La heurística asimétrica es el punto de mayor riesgo técnico. Prototipar con profundidad 3 primero, escalar después. Si difícil no llega a < 2s, usar Web Worker o bajar profundidad a 4.

---

### US-005: Selector de modo de juego
**Como** jugador  
**Quiero** elegir si controlo al yaguareté o a los perros, y seleccionar nivel de dificultad (fácil/difícil)  
**Para** decidir mi experiencia de juego antes de empezar

**Criterios de aceptación:**
- [ ] Pantalla inicial con selector: "Jugar como Yaguareté" / "Jugar como Perros"
- [ ] Selector de dificultad: Fácil / Difícil
- [ ] Botón "Comenzar partida" inicia el juego con la configuración elegida
- [ ] DADO que selecciono "Yaguareté" + "Difícil", CUANDO inicio, ENTONCES la IA controla 15 perros en nivel difícil

**Prioridad:** Must have  
**Estimación:** 2 story points  
**Dependencias:** US-004  
**Notas:** UI simple, sin persistencia de preferencias en MVP.

---

## Epic 3: Diseño Visual y Experiencia (F4 · Semanas 3.5-5.5)

### US-006: Diseño visual — estética selva misionera
**Como** jugador  
**Quiero** que el tablero tenga una estética visual inspirada en la selva misionera, con aspecto artesanal (madera, tierra, jaguares)  
**Para** sentirme inmerso en el contexto cultural del juego

**Criterios de aceptación:**
- [ ] Paleta de colores: tonos tierra, verde selva, marrón madera, dorado/naranja (jaguar)
- [ ] Tablero con textura de madera o tierra (CSS/SVG)
- [ ] Piezas diferenciadas: perros con silueta canina estilizada, yaguareté con silueta felina
- [ ] Sin estereotipos: referencia visual en el tablero real de Lidio Martínez (maderas artesanales)
- [ ] Animaciones suaves en movimientos (transición 300ms)
- [ ] Animación de captura: pieza capturada se desvanece o se retira
- [ ] DADO que muevo una pieza, CUANDO se completa el movimiento, ENTONCES la transición es fluida y la pieza queda en el nodo destino

**Prioridad:** Should have (P1 · Alto)  
**Estimación:** 5 story points  
**Dependencias:** US-001  
**Notas:** Prioridad menor que el motor funcional, pero esencial para la experiencia. Si el motor no está listo, esto espera.

---

### US-007: Pantallas de resultado
**Como** jugador  
**Quiero** ver una pantalla clara cuando la partida termina, indicando quién ganó, cómo ganó y la opción de jugar de nuevo  
**Para** tener cierre en cada partida y poder revancha

**Criterios de aceptación:**
- [ ] Pantalla "¡Ganaron los Perros!" con animación de acorralamiento
- [ ] Pantalla "¡Ganó el Yaguareté!" con animación del jaguar libre
- [ ] Explicación breve del motivo (acorralamiento vs umbral de 7 perros)
- [ ] Botón "Jugar de nuevo" vuelve al selector de modo
- [ ] DADO que el yaguareté es acorralado, CUANDO se detecta victoria, ENTONCES se muestra pantalla de perros ganadores con opción de revancha

**Prioridad:** Should have (P1 · Alto)  
**Estimación:** 3 story points  
**Dependencias:** US-003  
**Notas:** Coordinar con US-006 para consistencia visual.

---

### US-008: Historial de movimientos de la partida
**Como** jugador  
**Quiero** ver una lista de todos los movimientos realizados en la partida actual  
**Para** revisar la partida y analizar jugadas

**Criterios de aceptación:**
- [ ] Panel lateral o inferior con historial en formato notación simple: "P1: Perro (3,2) → (4,2)" / "Y: Yaguareté captura en (5,3)"
- [ ] Scroll automático al último movimiento
- [ ] Se resetea al iniciar nueva partida
- [ ] DADO que se realizan 5 movimientos, CUANDO miro el historial, ENTONCES veo los 5 listados en orden

**Prioridad:** Could have (P2 · Medio)  
**Estimación:** 2 story points  
**Dependencias:** US-002  
**Notas:** Sin persistencia entre sesiones en MVP.

---

## Epic 4: Contexto Cultural y Educación (F4 · Semanas 3.5-5.5)

### US-009: Panel de contexto cultural
**Como** visitante del sitio  
**Quiero** leer información sobre el origen del Chiví Korá, la cultura mbya guaraní, el significado del yaguareté y el Checupe  
**Para** entender el valor cultural del juego que estoy a punto de jugar

**Criterios de aceptación:**
- [ ] Sección "Sobre el juego" con:
  - Origen mbya guaraní (Misiones, Argentina/Paraguay)
  - Significado cultural: "acorralar al yaguareté = expulsarlo de la comunidad"
  - Explicación del Checupe (perro guardián de la oscuridad, raza extinguida)
- [ ] Mención y agradecimiento a Lidio Karai Martínez como referente cultural
- [ ] Citas de fuentes: Canal 12 Misiones, videos de referencia
- [ ] Tono respetuoso, sin apropiación cultural
- [ ] DADO que un visitante nuevo llega al sitio, CUANDO lee el panel cultural, ENTONCES entiende que esto no es solo "un jueguito" sino patrimonio cultural

**Prioridad:** Should have (P1 · Alto)  
**Estimación:** 2 story points  
**Dependencias:** Ninguna  
**Notas:** Texto ya validado en el brief. Solo maquetar. Coordinar con US-006 para estilo visual.

---

### US-010: Tutorial interactivo
**Como** jugador nuevo  
**Quiero** un tutorial paso a paso que me explique las reglas del Chiví Korá con ejemplos visuales interactivos  
**Para** aprender a jugar sin leer un manual

**Criterios de aceptación:**
- [ ] Tutorial secuencial con 5-7 pasos:
  1. Presentación del tablero y zonas (grilla + cueva)
  2. Las piezas: quién es quién
  3. Cómo se mueven los perros (avance/lateral, sin retroceso)
  4. Cómo se mueve el yaguareté (omnidireccional)
  5. Cómo captura el yaguareté (salto)
  6. Cómo ganan los perros (acorralamiento)
  7. Cómo gana el yaguareté (umbral de 7 perros)
- [ ] Animaciones que muestren movimientos de ejemplo en cada paso
- [ ] Botones "Siguiente" / "Anterior" para navegar
- [ ] Botón "Saltar tutorial" para ir directo al juego
- [ ] Al finalizar: botón "Jugar ahora" → selector de modo
- [ ] DADO que soy un jugador nuevo, CUANDO completo el tutorial, ENTONCES entiendo las reglas y puedo jugar sin asistencia

**Prioridad:** Should have (P1 · Alto)  
**Estimación:** 5 story points  
**Dependencias:** US-001, US-002, US-006  
**Notas:** Usar el mismo grafo del tablero para las animaciones. No reinventar.

---

## Epic 5: QA y Pulido (F5 · Semana 6)

### US-011: Testing funcional del motor
**Como** QA  
**Quiero** ejecutar una suite de tests automatizados que cubran todas las reglas del motor de juego  
**Para** garantizar cero bugs críticos en producción

**Criterios de aceptación:**
- [ ] Tests unitarios para:
  - `getValidMoves()`: perros sin retroceso, yaguareté omnidireccional
  - `makeMove()`: movimiento normal + captura
  - `detectVictory()`: acorralamiento (BFS) + umbral (≤ 7)
  - `evaluateBoard()`: heurística dual (yaguareté vs perros)
- [ ] Tests de integración: flujo completo de partida (inicio → movimientos → victoria)
- [ ] Cobertura ≥ 80% en el motor (`/src/engine/`)
- [ ] DADO que ejecuto `npm test`, CUANDO pasan todos los tests, ENTONCES el motor está validado

**Prioridad:** Must have  
**Estimación:** 5 story points  
**Dependencias:** US-002, US-003, US-004  
**Notas:** Usar Vitest (si React + Vite) o Jest. Sin tests no hay deploy.

---

### US-012: Testing cross-browser
**Como** QA  
**Quiero** verificar que la app funciona correctamente en Chrome, Firefox y Safari (últimas 2 versiones)  
**Para** cumplir con los criterios de aceptación del MVP

**Criterios de aceptación:**
- [ ] Tablero renderiza correctamente en Chrome 120+, Firefox 120+, Safari 17+
- [ ] Movimientos, capturas y detección de victoria funcionan en los 3 navegadores
- [ ] IA responde en < 2s en los 3 navegadores
- [ ] Sin errores de consola en ningún navegador

**Prioridad:** Must have  
**Estimación:** 3 story points  
**Dependencias:** US-011  
**Notas:** Si no hay acceso a Safari físico, usar BrowserStack o Lambdatest (free tier).

---

### US-013: Responsive y rendimiento
**Como** jugador  
**Quiero** que la app cargue rápido y se vea bien en desktop y tablet (≥ 768px)  
**Para** poder jugar en distintos dispositivos

**Criterios de aceptación:**
- [ ] Carga inicial < 3 segundos en 4G (Lighthouse: Performance ≥ 80)
- [ ] Tablero funcional en viewports ≥ 768px
- [ ] Sin layout shifts durante el juego
- [ ] Tamaño total de bundle < 500 KB (sin contar assets culturales)
- [ ] DADO que abro la app en una tablet, CUANDO juego, ENTONCES el tablero es usable sin zoom

**Prioridad:** Should have  
**Estimación:** 3 story points  
**Dependencias:** US-001, US-006  
**Notas:** Mobile no es crítico en MVP pero dejar preparado.

---

### US-014: Pruebas con usuarios reales
**Como** Product Owner  
**Quiero** que al menos 3 usuarios reales jueguen una partida completa y den feedback  
**Para** validar que la experiencia es comprensible sin asistencia

**Criterios de aceptación:**
- [ ] 3+ usuarios completan una partida (cualquier modo/dificultad)
- [ ] Ningún usuario necesita asistencia para entender cómo jugar
- [ ] Feedback documentado en `uat-feedback.md`
- [ ] Bugs encontrados → reportados y priorizados

**Prioridad:** Should have  
**Estimación:** 3 story points  
**Dependencias:** US-010, US-011  
**Notas:** No necesitan ser miembros de la comunidad guaraní en MVP. Pueden ser colegas/amigos.

---

## Epic 6: Lanzamiento (F6 · Semana 7)

### US-015: Deploy a producción
**Como** Dev  
**Quiero** deployar la app a Vercel (o Netlify) con un dominio público y CI/CD automático desde `main`  
**Para** que cualquier persona pueda acceder al Chiví Korá

**Criterios de aceptación:**
- [ ] URL pública funcional (ej: `chivi-kora.vercel.app`)
- [ ] CI/CD: push a `main` → build → deploy automático
- [ ] Sin errores en build de producción
- [ ] Variables de entorno configuradas (si las hay)
- [ ] DADO que visito la URL pública, CUANDO cargo la página, ENTONCES veo el tablero y puedo jugar

**Prioridad:** Must have  
**Estimación:** 2 story points  
**Dependencias:** US-011, US-012  
**Notas:** GitHub Pages como alternativa si Vercel tiene problemas. Dominio custom en v2.

---

### US-016: Documentación y handoff
**Como** Product Owner  
**Quiero** tener documentación clara de cómo mantener, extender y desplegar la app  
**Para** que cualquier developer pueda retomar el proyecto en v2 sin fricción

**Criterios de aceptación:**
- [ ] `README.md` con:
  - Descripción del proyecto
  - Stack utilizado
  - Setup local (`npm install && npm run dev`)
  - Estructura del proyecto (`/src/engine/`, `/src/ui/`, etc.)
  - Cómo ejecutar tests
  - Cómo deployar
- [ ] `architecture.md` (del Arquitecto) enlazado desde README
- [ ] `CHANGELOG.md` con versión 1.0.0 y features incluidas
- [ ] Licencia open-source (MIT)

**Prioridad:** Should have  
**Estimación:** 2 story points  
**Dependencias:** US-015

---

## Resumen de Prioridades

| Prioridad | Stories | Story Points |
|:--|:--|:--|
| **Must have** | US-000, US-001, US-002, US-003, US-004, US-005, US-011, US-012, US-015 | 48 |
| **Should have** | US-006, US-007, US-009, US-010, US-013, US-014, US-016 | 23 |
| **Could have** | US-008 | 2 |
| **Total** | **16 stories** | **73 points** |

---

## Dependencias entre Stories

```
US-000 (spike grafo)
  ├─→ US-001 (tablero)
  │     ├─→ US-002 (motor reglas)
  │     │     ├─→ US-003 (victoria)
  │     │     │     ├─→ US-004 (IA) ──→ US-005 (selector)
  │     │     │     └─→ US-007 (resultados)
  │     │     └─→ US-008 (historial)
  │     ├─→ US-006 (diseño visual)
  │     └─→ US-010 (tutorial)
  │
US-002 + US-003 + US-004 ──→ US-011 (testing motor)
US-011 ──→ US-012 (cross-browser) ──→ US-015 (deploy)
US-010 ──→ US-014 (UAT)
US-001 + US-006 ──→ US-013 (responsive)
US-015 ──→ US-016 (docs)
```

---

## Notas para el Arquitecto

1. **US-000 es bloqueante**: no se puede estimar US-001 ni US-003 sin el spike del grafo. Prioridad #1.
2. **La heurística dual de IA (US-004) es el punto más riesgoso**: si no se llega a < 2s en difícil, bajar profundidad o mover a Web Worker.
3. **El tablero es un grafo, no una matriz**: impacto directo en motor e IA. Validar en US-000.
4. **Sin backend en MVP**: todo en memoria del navegador. No hay persistencia, no hay API.
5. **Las stories Should have pueden recortarse si el cronograma aprieta**: el MVP mínimo viable es Must have funcional (48 puntos ≈ 4.5 semanas).
