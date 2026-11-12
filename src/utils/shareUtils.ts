import { ARCHETYPE_CATALOG, VALUE_DEFINITIONS } from '../data/storyData';
import { ArchetypeResult, ValueKey } from '../types/story';

export interface SharedDiscoveryPayload {
  n: string; // characterName
  o: string; // originTitle
  a: string; // archetypeId
  s: Record<ValueKey, number>; // scores
}

function toBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(b64: string): string {
  const padded = b64.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

export function buildInviteUrl(): string {
  return `${window.location.origin}${window.location.pathname}`;
}

export function buildSharedDiscoveryUrl(payload: SharedDiscoveryPayload): string {
  const encoded = toBase64Url(JSON.stringify(payload));
  return `${window.location.origin}${window.location.pathname}?descoberta=${encoded}`;
}

export function parseSharedDiscoveryFromUrl(): {
  payload: SharedDiscoveryPayload;
  archetype: ArchetypeResult;
} | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('descoberta');
    if (!raw) return null;

    const decoded = JSON.parse(fromBase64Url(raw)) as SharedDiscoveryPayload;
    if (!decoded || !decoded.n || !decoded.a || !decoded.s) return null;

    const archetype = ARCHETYPE_CATALOG[decoded.a];
    if (!archetype) return null;

    return { payload: decoded, archetype };
  } catch {
    return null;
  }
}

export function clearSharedDiscoveryUrl(): void {
  const cleanUrl = `${window.location.origin}${window.location.pathname}`;
  window.history.replaceState({}, '', cleanUrl);
}

export function buildWhatsAppShareUrl(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let i = 0; i < words.length; i++) {
    const testLine = line ? `${line} ${words[i]}` : words[i];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line, x, currentY);
      line = words[i];
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) {
    ctx.fillText(line, x, currentY);
    currentY += lineHeight;
  }
  return currentY;
}

export function downloadDiscoveryCardPng(params: {
  characterName: string;
  originTitle: string;
  archetype: ArchetypeResult;
  scores: Record<ValueKey, number>;
}): void {
  const width = 1080;
  const height = 1350;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Archival paper background
  ctx.fillStyle = '#F8F7F4';
  ctx.fillRect(0, 0, width, height);

  // Subtle inner frame
  ctx.strokeStyle = '#E5E2DC';
  ctx.lineWidth = 2;
  ctx.strokeRect(48, 48, width - 96, height - 96);

  // Kicker
  ctx.fillStyle = '#57534E';
  ctx.font = '500 24px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText(
    `TRAVESSIA · ESPELHO DAS ESCOLHAS  |  ${params.characterName.toUpperCase()}`,
    96,
    126
  );

  // Hairline rule
  ctx.strokeStyle = '#E5E2DC';
  ctx.beginPath();
  ctx.moveTo(96, 156);
  ctx.lineTo(width - 96, 156);
  ctx.stroke();

  // Archetype title
  ctx.fillStyle = '#1C1917';
  ctx.font = '500 68px "Fraunces", Georgia, serif';
  let y = wrapCanvasText(ctx, params.archetype.title, 96, 250, width - 192, 78);

  // Subtitle
  ctx.fillStyle = '#44403C';
  ctx.font = '400 30px "Plus Jakarta Sans", system-ui, sans-serif';
  y = wrapCanvasText(ctx, params.archetype.subtitle, 96, y + 18, width - 192, 42);

  // Quote box
  y += 32;
  ctx.strokeStyle = '#E5E2DC';
  ctx.beginPath();
  ctx.moveTo(96, y);
  ctx.lineTo(width - 96, y);
  ctx.stroke();

  ctx.fillStyle = '#1E3A8A';
  ctx.font = 'italic 36px "Fraunces", Georgia, serif';
  y = wrapCanvasText(
    ctx,
    `“${params.archetype.lifePerspective}”`,
    96,
    y + 62,
    width - 192,
    48
  );

  ctx.strokeStyle = '#E5E2DC';
  ctx.beginPath();
  ctx.moveTo(96, y + 20);
  ctx.lineTo(width - 96, y + 20);
  ctx.stroke();

  // Values bars
  const sorted = VALUE_DEFINITIONS.map((def) => ({
    label: def.label,
    score: params.scores[def.key] ?? 0,
  })).sort((a, b) => b.score - a.score);

  y += 86;
  ctx.fillStyle = '#57534E';
  ctx.font = '600 22px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('BÚSSOLA DE VALORES', 96, y);

  y += 42;
  for (const item of sorted) {
    ctx.fillStyle = '#1C1917';
    ctx.font = '600 26px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(item.label, 96, y);

    ctx.fillStyle = '#1E3A8A';
    ctx.font = '600 26px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`${item.score}%`, width - 96, y);
    ctx.textAlign = 'left';

    // Track
    ctx.fillStyle = '#E5E2DC';
    ctx.fillRect(96, y + 14, width - 192, 10);

    // Fill
    ctx.fillStyle = '#1E3A8A';
    ctx.fillRect(96, y + 14, ((width - 192) * item.score) / 100, 10);

    y += 66;
  }

  // Footer invitation
  ctx.fillStyle = '#57534E';
  ctx.font = '400 22px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText(
    `Origem: ${params.originTitle} · Crie sua própria história e descubra seus valores.`,
    96,
    height - 96
  );

  const link = document.createElement('a');
  link.download = `travessia-${params.characterName.toLowerCase().replace(/\s+/g, '-')}.png`;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
