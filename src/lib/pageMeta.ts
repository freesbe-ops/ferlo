import type { Lang } from './lang.ts'

export interface PageMeta {
  title: string
  description: string
}

/** Titles + meta descriptions of the legal pages (not part of the locale files). */
export const LEGAL_META: Record<'privacy' | 'legal' | 'cookies', Record<Lang, PageMeta>> = {
  privacy: {
    es: {
      title: 'Política de Privacidad | FERLO SL Tordera',
      description:
        'Política de privacidad de FERLO SL. Protección de datos, RGPD y derechos de los usuarios.',
    },
    ca: {
      title: 'Política de Privacitat | FERLO SL Tordera',
      description:
        'Política de privacitat de FERLO SL. Protecció de dades, RGPD i drets de les persones usuàries.',
    },
  },
  legal: {
    es: {
      title: 'Aviso Legal | FERLO SL Tordera',
      description:
        'Aviso legal de FERLO SL: datos identificativos, condiciones de uso y propiedad intelectual.',
    },
    ca: {
      title: 'Avís Legal | FERLO SL Tordera',
      description:
        "Avís legal de FERLO SL: dades identificatives, condicions d'ús i propietat intel·lectual.",
    },
  },
  cookies: {
    es: {
      title: 'Política de Cookies | FERLO SL Tordera',
      description:
        'Política de cookies de FERLO SL: qué cookies utilizamos, base legal y cómo desactivarlas.',
    },
    ca: {
      title: 'Política de Cookies | FERLO SL Tordera',
      description:
        'Política de cookies de FERLO SL: quines cookies fem servir, base legal i com desactivar-les.',
    },
  },
}
