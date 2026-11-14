/**
 * Mapa central d'imatges. Cada slot apunta a un fitxer de /public.
 * Per canviar una foto: editar aquí (1 línia), no als components.
 */

export const IMAGES = {
  // ── Home ────────────────────────────────────────────────────
  heroHome: '/INICIO/main-main.webp',
  servei1Home: '/REFORMAS/hero-reformas.webp',
  servei2Home: '/COCINA/hero-cocina.webp',
  servei3Home: '/BANO/banner-bano.webp',
  sobreHome: '/INICIO/ferlo.webp',

  // ── Reformes ────────────────────────────────────────────────
  heroReformes: '/REFORMAS/hero-reformas.webp',
  sliderAbansReformes: '/REFORMAS/reformas-antes.webp',
  sliderDespresReformes: '/REFORMAS/reformas-despues.webp',
  servei1Reformes: '/REFORMAS/derribos-reformas.webp',
  servei2Reformes: '/REFORMAS/electricidad-reformas.webp',
  servei3Reformes: '/REFORMAS/alicatados-reformas.webp',
  servei4Reformes: '/REFORMAS/limpieza-reformas.webp',

  // ── Cuines ──────────────────────────────────────────────────
  heroCuines: '/COCINA/hero-cocina.webp',
  servei1Cuines: '/COCINA/diseno-distribucion.webp',
  servei2Cuines: '/COCINA/instalaciones-cocina.webp',
  servei3Cuines: '/COCINA/encimeras-cocina.webp',
  servei4Cuines: '/COCINA/montajes-cocina.webp',

  // ── Banys ───────────────────────────────────────────────────
  heroBanys: '/BANO/banner-bano.webp',
  sliderAbansBanys: '/BANO/bano-antes.webp',
  sliderDespresBanys: '/BANO/bano-dp.webp',
  servei1Banys: '/BANO/bano-plato-ducha.webp',
  servei2Banys: '/BANO/bano-alicatado.webp',
  servei3Banys: '/BANO/bano-fontaneria.webp',
  servei4Banys: '/BANO/bano-iluminacion.webp',

  // ── Social / OG ─────────────────────────────────────────────
  ogHome: '/og-image.jpg',
  ogReformes: '/og-image.jpg',
  ogCuines: '/og-image.jpg',
  ogBanys: '/og-image.jpg',
} as const

export type ImageKey = keyof typeof IMAGES
