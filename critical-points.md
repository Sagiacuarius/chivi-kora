# Critical Points: Chiví Korá

> Define qué fallos son P1, P2 o P3 para el MVP. El Error Handler en runtime lee este documento para clasificar y actuar ante errores.

---

```yaml
project: chivi-kora
version: 1.0.0
critical_points:

  # ============================================================
  # P1 — BLOQUEANTE: la app no funciona o el juego no se puede jugar
  # ============================================================

  - id: CP-001
    name: tablero_no_renderiza
    severity: P1
    description: El tablero no se renderiza en pantalla (SVG roto, error de JS, bundle corrupto)
    impact: El usuario no puede jugar. App muerta.
    detection:
      pattern: "error.*render|white screen|blank page|SVG.*error|Failed to fetch|ChunkLoadError"
    playbook:
      auto_fix: null  # Requiere intervención manual
      manual:
        - Verificar build en Vercel: ¿el deploy fue exitoso?
        - Revisar console errors en producción
        - Rollback al último deploy funcional si es necesario
        - Verificar que `graph.ts` exporta correctamente los nodos/aristas

  - id: CP-002
    name: motor_no_valida_movimientos
    severity: P1
    description: El motor de reglas permite movimientos ilegales (perro retrocede, salto inválido, turno incorrecto)
    impact: El juego pierde integridad. La experiencia se rompe. Posible bug crítico en producción.
    detection:
      pattern: "getValidMoves.*\\[\\].*cuando debería|perro.*backward|captura.*invalida|turno.*incorrecto"
    playbook:
      auto_fix: null
      manual:
        - Ejecutar suite de tests: `npm test -- engine/rules`
        - Verificar regresión: ¿se modificó `rules.ts` recientemente?
        - Revisar `graph.ts`: ¿las aristas tienen dirección correcta?
        - Si es una regresión, revertir el commit ofensor

  - id: CP-003
    name: ia_no_responde
    severity: P1
    description: La IA no devuelve movimiento (timeout, worker caído, loop infinito en minimax)
    impact: El jugador no puede continuar la partida contra la IA. App inusable en modo single-player.
    detection:
      pattern: "worker.*error|minimax.*timeout|ai.*no.*response|postMessage.*error"
    playbook:
      auto_fix: null
      manual:
        - Verificar Web Worker: ¿se inicializa correctamente?
        - Revisar profundidad: si `depth=5` causa timeout, bajar a 4 temporalmente
        - Implementar fallback: si worker no responde en 3s → movimiento aleatorio legal

  - id: CP-004
    name: deploy_caido
    severity: P1
    description: La URL de producción no carga (Vercel caído, DNS roto, build fallido)
    impact: Nadie puede acceder al juego. Cero usuarios.
    detection:
      pattern: "DNS_PROBE_FINISHED_NXDOMAIN|ERR_CONNECTION_REFUSED|500|deploy.*failed|build.*error"
    playbook:
      auto_fix: null
      manual:
        - Verificar Vercel dashboard: estado del deploy
        - `git push` forzar redeploy si fue error transitorio
        - Activar GitHub Pages como fallback temporal

  # ============================================================
  # P2 — DEGRADADO: la app funciona pero la experiencia está dañada
  # ============================================================

  - id: CP-005
    name: ia_lenta
    severity: P2
    description: La IA responde en > 2 segundos en nivel difícil
    impact: Experiencia degradada. Jugador espera. Puede pensar que se colgó.
    detection:
      pattern: "findBestMove.*>2000ms|ai.*slow|minimax.*profundidad.*5.*lento"
    playbook:
      auto_fix: null
      manual:
        - Bajar profundidad de 5 a 4 en `ai.ts`
        - Activar ordenamiento de movimientos (move ordering) si no está implementado
        - Verificar que el Web Worker no está siendo bloqueado por el thread principal
        - Mostrar indicador visual "IA pensando..." mientras calcula

  - id: CP-006
    name: deteccion_victoria_falla
    severity: P2
    description: La partida no termina cuando debería (falso negativo en acorralamiento o umbral)
    impact: El jugador sigue jugando una partida ya ganada/perdida. Frustrante.
    detection:
      pattern: "acorralado.*no.*detecta|umbral.*7.*no.*dispara|victory.*false.*negative"
    playbook:
      auto_fix: null
      manual:
        - Ejecutar `npm test -- engine/victory`
        - Verificar BFS: ¿está visitando todos los nodos alcanzables?
        - Verificar conteo de perros: ¿filtra correctamente `captured: true`?
        - Forzar recálculo: botón "Verificar estado" en UI de debug (solo dev)

  - id: CP-007
    name: disenio_roto_crossbrowser
    severity: P2
    description: El tablero se ve mal en Safari o Firefox (SVG renderiza distinto, CSS no aplica)
    impact: Usuarios de Safari/Firefox tienen experiencia rota. ~30% del tráfico potencial.
    detection:
      pattern: "safari.*svg.*bug|firefox.*render.*incorrecto|cross-browser.*fail"
    playbook:
      auto_fix: null
      manual:
        - Probar en BrowserStack o Safari físico
        - Verificar viewBox del SVG (Safari es estricto)
        - Agregar vendor prefixes CSS si faltan
        - Si es un bug conocido de Safari SVG, documentar workaround

  # ============================================================
  # P3 — COSMÉTICO: no afecta la jugabilidad, solo molesta
  # ============================================================

  - id: CP-008
    name: animacion_trabada
    severity: P3
    description: Las animaciones de movimiento/captura no son fluidas (lag visual, saltos)
    impact: Molestia visual. No afecta la jugabilidad.
    detection:
      pattern: "animation.*jank|transition.*lag|requestAnimationFrame.*drop"
    playbook:
      auto_fix: null
      manual:
        - Reducir duración de transiciones CSS (300ms → 150ms)
        - Usar `will-change: transform` en piezas animadas
        - Deshabilitar animaciones si el dispositivo es lento (prefers-reduced-motion)

  - id: CP-009
    name: historial_desincronizado
    severity: P3
    description: El historial de movimientos muestra un movimiento incorrecto o se saltea uno
    impact: Molestia menor. No afecta la partida en curso.
    detection:
      pattern: "historial.*falta.*movimiento|moveHistory.*length.*mismatch"
    playbook:
      auto_fix: null
      manual:
        - Verificar que `makeMove()` siempre pushea al array `moveHistory`
        - Revisar que el historial se resetea al iniciar nueva partida
        - Bug de bajo impacto: fix en próximo sprint

  - id: CP-010
    name: texto_cultural_con_errores
    severity: P3
    description: Typo o error factual en el panel de contexto cultural
    impact: Daño reputacional menor. La comunidad guaraní puede notarlo.
    detection:
      pattern: "typo.*cultural|error.*guarani|ortografia.*contexto"
    playbook:
      auto_fix: null
      manual:
        - Revisar contra fuentes del brief (§1)
        - Corregir typo y redeploy
        - Bajo impacto técnico, alto impacto cultural: priorizar aunque sea P3
```

---

## Resumen de Critical Points

| ID | Severidad | Componente | ¿Auto-fix? |
|:--|:--|:--|:--|
| CP-001 | 🔴 P1 | Renderizado del tablero | No |
| CP-002 | 🔴 P1 | Motor de reglas | No |
| CP-003 | 🔴 P1 | IA (Web Worker) | No |
| CP-004 | 🔴 P1 | Deploy / Infra | No |
| CP-005 | 🟡 P2 | IA lenta (> 2s) | No |
| CP-006 | 🟡 P2 | Detección de victoria | No |
| CP-007 | 🟡 P2 | Cross-browser | No |
| CP-008 | 🟢 P3 | Animaciones | No |
| CP-009 | 🟢 P3 | Historial | No |
| CP-010 | 🟢 P3 | Texto cultural | No |

> **Nota:** Todos los critical points requieren intervención manual en MVP. No hay auto-fix implementado porque no hay backend ni sistema de monitoreo. En v2, con observabilidad (Grafana + Prometheus), se pueden agregar auto-fixes para CP-003 (fallback a movimiento aleatorio) y CP-005 (reducir profundidad automáticamente).
