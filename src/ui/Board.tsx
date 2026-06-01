// === Chiví Korá — UI: Board ===
// Tablero con estética de madera tallada y selva misionera.
// Texturas SVG, triángulo cueva como refugio natural, paleta tierra/verde.

import type { Node, Edge } from '../engine/domain/types';

interface BoardProps {
  nodes: Node[];
  edges: Edge[];
  viewBoxWidth?: number;
  viewBoxHeight?: number;
  children?: React.ReactNode;
}

const SPACING = 90;

export function Board({
  nodes,
  edges,
  children,
}: BoardProps) {
  const mainNodes = nodes.filter(n => n?.zone === 'main');

  // Gradiente de madera para el fondo
  const woodGradientId = 'woodGradient';
  const leafPatternId = 'leafPattern';
  const caveGradientId = 'caveGradient';

  // Marco con 20px de padding encierra el grafo: (-20,-20) → (380,560).
  const graphW = 4 * SPACING;   // 360: ancho real del grafo
  const graphH = 6 * SPACING;   // 540: último nodo cueva (32)
  const pad = 20;
  const frameW = graphW + 2 * pad;  // 400
  const frameH = graphH + 2 * pad;  // 580

  return (
    <svg
      viewBox={`${-pad} ${-pad} ${frameW} ${frameH}`}
      style={{ width: '100%', height: 'auto', maxHeight: '80vh', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.6))' }}
      role="img"
      aria-label="Tablero del Chiví Korá"
    >
      <defs>
        {/* Gradiente de madera oscura */}
        <linearGradient id={woodGradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#3d2b1a" />
          <stop offset="30%"  stopColor="#4a3520" />
          <stop offset="60%"  stopColor="#3d2b1a" />
          <stop offset="100%" stopColor="#2d1f12" />
        </linearGradient>

        {/* Gradiente interior de la cueva */}
        <radialGradient id={caveGradientId} cx="50%" cy="40%" r="60%">
          <stop offset="0%"   stopColor="#2a1a0a" />
          <stop offset="100%" stopColor="#1a0d06" />
        </radialGradient>

        {/* Patrón de veta de madera */}
        <pattern id="woodGrain" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <rect width="60" height="60" fill="#4a3520" />
          <line x1="0" y1="10" x2="60" y2="12" stroke="#3d2b1a" strokeWidth="0.8" opacity="0.5" />
          <line x1="0" y1="25" x2="60" y2="24" stroke="#3d2b1a" strokeWidth="0.5" opacity="0.4" />
          <line x1="0" y1="40" x2="60" y2="42" stroke="#3d2b1a" strokeWidth="0.6" opacity="0.35" />
          <line x1="0" y1="55" x2="60" y2="56" stroke="#3d2b1a" strokeWidth="0.4" opacity="0.3" />
          <line x1="10" y1="0" x2="10" y2="60" stroke="#5c3d1e" strokeWidth="0.3" opacity="0.2" />
          <line x1="35" y1="0" x2="35" y2="60" stroke="#5c3d1e" strokeWidth="0.25" opacity="0.15" />
          <line x1="55" y1="0" x2="55" y2="60" stroke="#5c3d1e" strokeWidth="0.2" opacity="0.1" />
        </pattern>

        {/* Patrón de hojas/vegetación sutil */}
        <pattern id={leafPatternId} x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="30" r="15" fill="rgba(45,90,61,0.06)" />
          <circle cx="80" cy="20" r="10" fill="rgba(45,90,61,0.04)" />
          <circle cx="60" cy="70" r="12" fill="rgba(45,90,61,0.05)" />
          <circle cx="110" cy="90" r="8"  fill="rgba(45,90,61,0.04)" />
          <circle cx="10"  cy="100" r="9" fill="rgba(45,90,61,0.05)" />
          <circle cx="95"  cy="50"  r="6" fill="rgba(45,90,61,0.03)" />
        </pattern>

        {/* Borde dorado sutil */}
        <linearGradient id="borderGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#8b6914" />
          <stop offset="50%"  stopColor="#d4a843" />
          <stop offset="100%" stopColor="#8b6914" />
        </linearGradient>

        {/* Filtro de sombra para el tablero */}
        <filter id="boardShadow" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.5" />
        </filter>

        {/* Filtro de brillo para nodos */}
        <filter id="nodeGlow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Marco exterior del tablero */}
      <rect
        x={-pad}
        y={-pad}
        width={frameW}
        height={frameH}
        fill="url(#woodGradient)"
        stroke="url(#borderGold)"
        strokeWidth={2.5}
        rx={12}
        filter="url(#boardShadow)"
      />

      {/* Capa de textura de madera */}
      <rect
        x={-pad + 10}
        y={-pad + 10}
        width={frameW - 20}
        height={frameH - 20}
        fill="url(#woodGrain)"
        rx={8}
      />

      {/* Capa de vegetación sutil */}
      <rect
        x={-pad + 10}
        y={-pad + 10}
        width={frameW - 20}
        height={frameH - 20}
        fill={`url(#${leafPatternId})`}
        rx={8}
      />

      {/* Fondo interior del área de juego */}
      <rect
        x={-pad + 16}
        y={-pad + 16}
        width={frameW - 32}
        height={frameH - 32}
        fill="#1a2e1c"
        opacity={0.4}
        rx={6}
      />

      {/* Aristas: conexiones principales más visibles */}
      {edges.map((edge, i) => {
        const from = nodes[edge.from];
        const to = nodes[edge.to];
        if (!from || !to) return null;
        return (
          <line
            key={`edge-${i}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="#6b4c2a"
            strokeWidth={2.5}
            opacity={0.7}
            strokeLinecap="round"
          />
        );
      })}

      {/* Segunda capa de aristas: brillo sutil */}
      {edges.map((edge, i) => {
        const from = nodes[edge.from];
        const to = nodes[edge.to];
        if (!from || !to) return null;
        return (
          <line
            key={`edge-shine-${i}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="#9a7840"
            strokeWidth={0.8}
            opacity={0.25}
            strokeLinecap="round"
          />
        );
      })}

      {/* ── Cueva simplificada ── */}
      {/* Coordenadas: 26=(90,450), 27=(180,450), 28=(270,450), 32=(180,540) */}
      {(() => {
        const SP = SPACING;
        const x22 = 2 * SP, y22 = 4 * SP;
        const x26 = 1 * SP, y26 = 5 * SP;
        const x27 = 2 * SP, y27 = 5 * SP;
        const x28 = 3 * SP, y28 = 5 * SP;
        const x30 = 0,       y30 = 6 * SP;
        const x32 = 2 * SP, y32 = 6 * SP;
        const x34 = 4 * SP, y34 = 6 * SP;

        // Polígono unificado de la cueva: 22→26→30→32→34→28
        const cuevaPoly = `${x22},${y22} ${x26},${y26} ${x30},${y30} ${x32},${y32} ${x34},${y34} ${x28},${y28}`;

        return (
        <g>
          {/* Fondo rojizo suave de toda la cueva */}
          <polygon
            points={cuevaPoly}
            fill="rgba(140,35,25,0.12)"
            stroke="#8b5a2b"
            strokeWidth={1.5}
          />
          {/* Líneas interiores */}
          <line x1={x22} y1={y22} x2={x26} y2={y26} stroke="#6b3a2a" strokeWidth={1.2} opacity={0.6} />
          <line x1={x22} y1={y22} x2={x27} y2={y27} stroke="#8b4a2a" strokeWidth={1.5} opacity={0.5} />
          <line x1={x22} y1={y22} x2={x28} y2={y28} stroke="#6b3a2a" strokeWidth={1.2} opacity={0.6} />
          <line x1={x26} y1={y26} x2={x27} y2={y27} stroke="#8b4a2a" strokeWidth={1.5} opacity={0.5} />
          <line x1={x27} y1={y27} x2={x28} y2={y28} stroke="#8b4a2a" strokeWidth={1.5} opacity={0.5} />
          <line x1={x27} y1={y27} x2={x32} y2={y32} stroke="#8b4a2a" strokeWidth={1.5} opacity={0.5} />
          {/* Nodo base central (32) destacado */}
          <circle cx={x32} cy={y32} r={8} fill="#4a3520" stroke="#d4a843" strokeWidth={2} />
          <circle cx={x32} cy={y32} r={4} fill="#6b4c2a" stroke="#8b5a2b" strokeWidth={1} />
          <circle cx={x32 - 1} cy={y32 - 1} r={1.5} fill="rgba(212,168,67,0.4)" />
        </g>
        );
      })()}

      {/* ── Nodos de la grilla principal ── */}
      {mainNodes.map(node => (
        <g key={`node-${node.id}`} filter="url(#nodeGlow)">
          {/* Anillo exterior */}
          <circle
            cx={node.x}
            cy={node.y}
            r={8}
            fill="#3d2b1a"
            stroke="#6b4c2a"
            strokeWidth={1.5}
          />
          {/* Punto central luminoso */}
          <circle
            cx={node.x}
            cy={node.y}
            r={4}
            fill="#5c3d1e"
            stroke="#8b5a2b"
            strokeWidth={1}
          />
          {/* Brillo central */}
          <circle
            cx={node.x - 1}
            cy={node.y - 1}
            r={1.5}
            fill="rgba(212,168,67,0.4)"
          />
        </g>
      ))}

      {/* ── Nodos cueva (intermedios: 26, 27, 28) ── */}
      {nodes.filter(n => n?.zone === 'cueva' && n.id !== 32).map(node => (
        <g key={`node-${node.id}`} filter="url(#nodeGlow)">
          <circle
            cx={node.x}
            cy={node.y}
            r={9}
            fill="#4a3520"
            stroke="#d4a843"
            strokeWidth={2}
          />
          <circle
            cx={node.x}
            cy={node.y}
            r={5}
            fill="#6b4c2a"
            stroke="#8b5a2b"
            strokeWidth={1}
          />
          <circle
            cx={node.x - 1}
            cy={node.y - 1}
            r={2}
            fill="rgba(212,168,67,0.5)"
          />
        </g>
      ))}

      {/* Piezas — se renderizan encima */}
      {children}
    </svg>
  );
}