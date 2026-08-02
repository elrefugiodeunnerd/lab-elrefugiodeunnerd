/**
 * Single source of truth for project state.
 *
 * Projects are alive: they run, stall, sleep for months, come back, occasionally
 * finish. Nothing is ever archived. Every status therefore needs its own visual
 * identity — and that identity is never colour alone (each badge also carries a
 * distinct glyph, so the state survives greyscale and colour-blindness).
 *
 * Adding a status means adding one entry here plus one `--status-*` colour pair
 * in `tokens.css`. Nothing else reads the raw string.
 */
export const STATUSES = [
  'en-curso',
  'retomado',
  'abandonado-temporalmente',
  'abandonado-largo-plazo',
  'finalizado',
] as const;

export type Status = (typeof STATUSES)[number];

export interface StatusMeta {
  /** Spanish label shown on the badge. */
  readonly label: string;
  /** Longer form used as the badge's tooltip/description. */
  readonly description: string;
  /** Non-colour differentiator. Decorative — always paired with the label. */
  readonly glyph: string;
  /**
   * Default sort rank: what's alive floats, what's finished settles.
   * Lower sorts earlier.
   */
  readonly weight: number;
}

export const STATUS_META: Readonly<Record<Status, StatusMeta>> = {
  'en-curso': {
    label: 'En curso',
    description: 'Trabajando en esto ahora mismo',
    glyph: '●',
    weight: 0,
  },
  retomado: {
    label: 'Retomado',
    description: 'Aparcado un tiempo y de vuelta sobre la mesa',
    glyph: '◐',
    weight: 1,
  },
  'abandonado-temporalmente': {
    label: 'Abandonado temporalmente',
    description: 'Parado temporalmente, con intención de volver',
    glyph: '◗',
    weight: 2,
  },
  'abandonado-largo-plazo': {
    label: 'Abandonado a largo plazo',
    description: 'Parado desde hace mucho, pero nunca descartado',
    glyph: '○',
    weight: 3,
  },
  finalizado: {
    label: 'Finalizado',
    description: 'Terminado, aunque siempre puede volver',
    glyph: '✓',
    weight: 4,
  },
};

export function statusMeta(status: Status): StatusMeta {
  return STATUS_META[status];
}

/** Statuses in display order — drives the filter bar. */
export const STATUSES_BY_WEIGHT: readonly Status[] = [...STATUSES].sort(
  (a, b) => STATUS_META[a].weight - STATUS_META[b].weight,
);
