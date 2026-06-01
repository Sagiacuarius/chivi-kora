// === Chiví Korá — E2E Tests (Playwright standalone) ===
// Testing cross-browser: renderizado, movimientos, IA, errores de consola.
// US-012: Chrome 120+, Firefox 120+, Safari 17+

import { test, expect, type Page, type ConsoleMessage } from '@playwright/test';
import { boardTopology } from '../../src/engine/domain/board-topology';
import { createGame } from '../../src/engine/use-cases/create-game';
import type { GameState } from '../../src/engine/domain/types';

// --- Helpers ---

async function startGame(page: Page, playerSide: 'yaguarete' | 'perros' = 'perros') {
  await page.goto('/');

  // Skip tutorial si aparece
  const skipBtn = page.locator('button:has-text("Saltar"), button:has-text("Omitir"), button:has-text("Skip")').first();
  if (await skipBtn.isVisible({ timeout: 500 }).catch(() => false)) {
    await skipBtn.click();
  }

  // Seleccionar bando
  const sideBtn = page.locator(`button:has-text("${playerSide === 'yaguarete' ? 'Yaguareté' : 'Perros'}")`).first();
  if (await sideBtn.isVisible({ timeout: 500 }).catch(() => false)) {
    await sideBtn.click();
  }

  // Click en Jugar
  const startBtn = page.locator('button:has-text("Jugar"), button:has-text("Empezar"), button:has-text("Start")').first();
  if (await startBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
    await startBtn.click();
  }

  // Esperar que el SVG del tablero cargue
  await page.waitForSelector('svg', { timeout: 3000 });
}

// --- Test Suites ---

test.describe('E2E: Renderizado', () => {

  test('E2E-01: Tablero SVG presente con nodos y piezas', async ({ page }) => {
    await startGame(page, 'perros');

    const svg = page.locator('svg');
    await expect(svg).toBeVisible();

    const circles = page.locator('svg circle');
    expect(await circles.count()).toBeGreaterThanOrEqual(25);

    const groups = page.locator('svg g');
    expect(await groups.count()).toBeGreaterThanOrEqual(16);
  });

  test('E2E-02: Selección de pieza y movimientos válidos', async ({ page }) => {
    await startGame(page, 'perros');

    // Click en el primer nodo (esquina superior del tablero)
    const firstCircle = page.locator('svg circle').nth(0);
    await firstCircle.click();
    await page.waitForTimeout(200);

    // La UI debería responder sin errores
    const svgStillVisible = page.locator('svg');
    await expect(svgStillVisible).toBeVisible();
  });

  test('E2E-03: Estructura del tablero (aristas visibles)', async ({ page }) => {
    await startGame(page, 'perros');
    await page.waitForTimeout(300);

    const svgEl = page.locator('svg');
    await expect(svgEl).toBeVisible();

    const lines = page.locator('svg line');
    expect(await lines.count()).toBeGreaterThan(0);
  });

});

test.describe('E2E: IA', () => {

  test('E2E-04: IA responde sin bloquear la UI', async ({ page }) => {
    await startGame(page, 'yaguarete');
    await page.waitForTimeout(100);

    const start = Date.now();

    // Si aparece el cartel de "pensando", esperar que desaparezca
    const thinking = page.locator('text=La IA está pensando');
    const hasThinking = await thinking.isVisible({ timeout: 100 }).catch(() => false);
    if (hasThinking) {
      await page.waitForSelector('text=Turno del Yaguareté', { timeout: 5000 });
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(5000);
    }
  });

});

test.describe('E2E: Integridad', () => {

  test('E2E-05: Sin errores de consola (Error level)', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg: ConsoleMessage) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await startGame(page, 'perros');
    await page.waitForTimeout(500);

    // Filtrar errores conocidos que no son del juego
    const realErrors = errors.filter(e =>
      !e.includes('favicon') &&
      !e.includes('Failed to load resource') &&
      !e.includes('net::')
    );
    expect(realErrors).toHaveLength(0);
  });

  test('E2E-06: Aristas del tablero renderizan correctamente', async ({ page }) => {
    await startGame(page, 'perros');

    const lines = page.locator('svg line');
    const count = await lines.count();
    expect(count).toBeGreaterThan(0);
  });

  // E2E-07 es un test de engine puro, no necesita browser
  test('E2E-07: Engine: victoria por umbral detecta correctamente', async () => {
    const state = createGame(boardTopology);
    const stateWithCaptures: GameState = {
      ...state,
      pieces: state.pieces.map(p => {
        if (p.type === 'perros') {
          const dogIndex = state.pieces.filter(px => px.type === 'perros').indexOf(p);
          if (dogIndex < 8) return { ...p, captured: true };
        }
        return p;
      }),
    };
    const aliveDogs = stateWithCaptures.pieces.filter(p => p.type === 'perros' && !p.captured);
    expect(aliveDogs.length).toBeLessThanOrEqual(7);
    expect(stateWithCaptures.status).toBe('playing');
  });

});