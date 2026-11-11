/**
 * Mapa central d'imatges. Cada slot lògic apunta a un fitxer de /public.
 * Per canviar una foto: editar aquí (1 línia), no als components.
 *
 * Convenció de noms: <tipus><pàgina>
 *   heroHome, sliderAbansBanys, servei1Cuines, ogReformes, etc.
 */

export const IMAGES = {
  // ── Home ────────────────────────────────────────────────────
  heroHome: '/hero.webp',
  servei1Home: '/hero.webp', // Reformes integrals card
  servei2Home: '/despres.webp', // Cuines card
  servei3Home: '/antes.webp', // Banys card
  sobreHome: '/hero.webp', // secció "Sobre"

  // ── Reformes ────────────────────────────────────────────────
  heroReformes: '/hero.webp',
  sliderAbansReformes: '/antes.webp',
  sliderDespresReformes: '/despres.webp',
  servei1Reformes: '/hero.webp', // Enderroc
  servei2Reformes: '/despres.webp', // Lampisteria
  servei3Reformes: '/antes.webp', // Paviments
  servei4Reformes: '/hero.webp', // Coordinació

  // ── Cuines ──────────────────────────────────────────────────
  heroCuines: '/hero.webp',
  servei1Cuines: '/despres.webp', // Disseny
  servei2Cuines: '/hero.webp', // Instal·lacions
  servei3Cuines: '/despres.webp', // Taulells
  servei4Cuines: '/antes.webp', // Muntatge

  // ── Banys ───────────────────────────────────────────────────
  heroBanys: '/hero.webp',
  sliderAbansBanys: '/antes.webp',
  sliderDespresBanys: '/despres.webp',
  servei1Banys: '/hero.webp', // Banyera→dutxa
  servei2Banys: '/antes.webp', // Rajoles
  servei3Banys: '/despres.webp', // Lampisteria
  servei4Banys: '/hero.webp', // Il·luminació

  // ── Social / OG (per a xarxes) ─────────────────────────────
  ogHome: '/og-image.jpg',
  ogReformes: '/og-image.jpg',
  ogCuines: '/og-image.jpg',
  ogBanys: '/og-image.jpg',
} as const

export type ImageKey = keyof typeof IMAGES
