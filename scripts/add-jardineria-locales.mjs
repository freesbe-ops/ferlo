import { readFileSync, writeFileSync } from 'fs'

const esJardineria = {
  meta_title: 'Jardinería en Girona | Mantenimientos Lizana',
  meta_description: 'Servicio profesional de jardinería en Girona. Poda, diseño de jardines, riego automático, césped y mantenimiento continuo durante todo el año.',
  carousel: ['JARDINES BIEN CUIDADOS', 'DISEÑO MEDITERRÁNEO', 'RIEGO AUTOMÁTICO', 'MANTENIMIENTO ANUAL', 'TOTAL CONFIANZA'],
  hero: {
    badge: 'Girona y Maresme · Especialistas en jardinería',
    title: 'El jardín que',
    subtitle: 'mereces, cuidado como es debido.',
    description: 'Diseñamos, plantamos y mantenemos jardines mediterráneos con años de experiencia local. Del pequeño patio a la gran parcela.',
    cta: 'Pide presupuesto',
    secondary_cta: 'Ver servicios',
    reviews: 'Más de 350 jardines mantenidos',
    badge_title: 'Respuesta garantizada',
    badge_sub: 'En menos de 2h',
    image_alt: 'Jardín formal con setos geométricos'
  },
  services: {
    title: 'NUESTROS SERVICIOS',
    heading: 'Todo lo que<br /><em>necesita</em><br />tu jardín.',
    subheading: 'Ofrecemos un servicio integral de jardinería: desde el diseño inicial hasta el mantenimiento periódico. Un equipo de profesionales a tu disposición durante todo el año.',
    items: [
      { title: 'Poda y Recorte', description: 'Poda profesional de árboles, arbustos y setos vivos. Mantenimiento periódico para mantener la forma y la salud de las plantas.', img: 'https://images.unsplash.com/photo-1680124744811-f779e4ad6985?w=600&h=400&fit=crop&auto=format', icon: '✂' },
      { title: 'Diseño de Jardines', description: 'Creación y diseño de jardines mediterráneos adaptados al clima local. Selección de plantas resistentes y estéticas.', img: 'https://images.unsplash.com/photo-1783159144730-abbde99fe3ee?w=600&h=400&fit=crop&auto=format', icon: '🌿' },
      { title: 'Riego Automático', description: 'Instalación y mantenimiento de sistemas de riego por goteo y aspersión. Eficiencia hídrica y ahorro garantizados.', img: 'https://images.unsplash.com/photo-1596916783053-b4515643e028?w=600&h=400&fit=crop&auto=format', icon: '💧' },
      { title: 'Césped y Ajardinamiento', description: 'Plantación de césped, nivelación del terreno y ajardinamiento completo de parcelas. Resultados profesionales.', img: 'https://images.unsplash.com/photo-1781458708730-c35e7c7ee998?w=600&h=400&fit=crop&auto=format', icon: '🌳' }
    ]
  },
  benefits: {
    title: 'POR QUÉ NOSOTROS',
    heading: 'Compromiso con<br /><em>cada hoja.</em>',
    subheading: 'Profesionales con años de experiencia en jardines de la zona. Conocemos el clima y las especies autóctonas.',
    items: [
      { title: 'Experiencia local', desc: 'Más de 15 años trabajando en jardines de la zona. Conocemos el clima y las especies autóctonas.' },
      { title: 'Equipo cualificado', desc: 'Profesionales con formación en jardinería, paisajismo y técnicas de riego sostenible.' },
      { title: 'Presupuesto sin compromiso', desc: 'Visita gratuita y presupuesto detallado sin ningún tipo de compromiso.' },
      { title: 'Mantenimiento continuo', desc: 'Contratos de mantenimiento mensuales o estacionales adaptados a tus necesidades.' }
    ]
  },
  seasons: {
    title: 'MANTENIMIENTO ANUAL',
    heading: 'Cada estación,<br /><em>un trabajo.</em>',
    items: [
      { season: 'Primavera', tasks: ['Poda de formación', 'Fertilización', 'Revisión del riego', 'Plantación de flores'] },
      { season: 'Verano', tasks: ['Riego intensivo', 'Control de plagas', 'Siega semanal', 'Poda ligera'] },
      { season: 'Otoño', tasks: ['Recogida de hojas', 'Plantación de bulbos', 'Poda de otoño', 'Preparación invernal'] },
      { season: 'Invierno', tasks: ['Poda de fructificación', 'Tratamientos fitosanitarios', 'Análisis del suelo', 'Planificación anual'] }
    ]
  },
  testimonials: {
    title: 'TESTIMONIOS',
    heading: 'Lo que dicen nuestros<br /><em>clientes de jardinería.</em>',
    items: [
      { name: 'Lluís M.', location: 'Girona', text: 'Transformaron mi jardín por completo. Diseño impresionante y resultados profesionales.' },
      { name: 'Carme P.', location: "Platja d'Aro", text: 'El mantenimiento semanal es impecable. El jardín siempre está perfecto.' },
      { name: 'Joan G.', location: 'Sant Feliu de Guíxols', text: 'Instalaron el riego automático y he ahorrado muchísima agua. Muy recomendables.' }
    ]
  },
  cta: {
    title: 'CONTACTO',
    text: 'Hablemos de tu jardín. Contáctanos para pedir un presupuesto gratuito.',
    button: 'Pide presupuesto',
    secondary: 'Rellena el formulario'
  }
}

const enJardineria = {
  meta_title: 'Gardening in Girona | Manteniments Lizana',
  meta_description: 'Professional gardening service in Girona. Pruning, garden design, automatic irrigation, lawn care and year-round maintenance.',
  carousel: ['WELL-CARED GARDENS', 'MEDITERRANEAN DESIGN', 'AUTOMATIC IRRIGATION', 'ANNUAL MAINTENANCE', 'TOTAL TRUST'],
  hero: {
    badge: 'Girona & Maresme · Gardening specialists',
    title: 'The garden you',
    subtitle: 'deserve, cared for properly.',
    description: 'We design, plant and maintain Mediterranean gardens with years of local experience. From the small patio to the large plot.',
    cta: 'Request a quote',
    secondary_cta: 'View services',
    reviews: 'Over 350 maintained gardens',
    badge_title: 'Guaranteed response',
    badge_sub: 'In less than 2h',
    image_alt: 'Formal garden with geometric hedges'
  },
  services: {
    title: 'OUR SERVICES',
    heading: 'Everything your<br /><em>garden needs.</em>',
    subheading: 'We offer a comprehensive gardening service: from initial design to regular maintenance. A team of professionals at your disposal all year round.',
    items: [
      { title: 'Pruning & Trimming', description: 'Professional pruning of trees, shrubs and hedges. Regular maintenance to keep plants healthy and well-shaped.', img: 'https://images.unsplash.com/photo-1680124744811-f779e4ad6985?w=600&h=400&fit=crop&auto=format', icon: '✂' },
      { title: 'Garden Design', description: 'Creation and design of Mediterranean gardens adapted to the local climate. Selection of resilient and aesthetic plants.', img: 'https://images.unsplash.com/photo-1783159144730-abbde99fe3ee?w=600&h=400&fit=crop&auto=format', icon: '🌿' },
      { title: 'Automatic Irrigation', description: 'Installation and maintenance of drip and sprinkler irrigation systems. Water efficiency and guaranteed savings.', img: 'https://images.unsplash.com/photo-1596916783053-b4515643e028?w=600&h=400&fit=crop&auto=format', icon: '💧' },
      { title: 'Lawn & Landscaping', description: 'Lawn planting, land leveling and complete landscaping of plots. Professional results.', img: 'https://images.unsplash.com/photo-1781458708730-c35e7c7ee998?w=600&h=400&fit=crop&auto=format', icon: '🌳' }
    ]
  },
  benefits: {
    title: 'WHY US',
    heading: 'Commitment to<br /><em>every leaf.</em>',
    subheading: 'Professionals with years of experience in local gardens. We know the climate and native species.',
    items: [
      { title: 'Local experience', desc: 'Over 15 years working in local gardens. We know the climate and native species.' },
      { title: 'Qualified team', desc: 'Professionals trained in gardening, landscaping and sustainable irrigation techniques.' },
      { title: 'No-obligation quote', desc: 'Free visit and detailed quote with no commitment whatsoever.' },
      { title: 'Continuous maintenance', desc: 'Monthly or seasonal maintenance contracts tailored to your needs.' }
    ]
  },
  seasons: {
    title: 'ANNUAL MAINTENANCE',
    heading: 'Each season,<br /><em>a task.</em>',
    items: [
      { season: 'Spring', tasks: ['Formative pruning', 'Fertilisation', 'Irrigation check', 'Flower planting'] },
      { season: 'Summer', tasks: ['Intensive irrigation', 'Pest control', 'Weekly mowing', 'Light pruning'] },
      { season: 'Autumn', tasks: ['Leaf collection', 'Bulb planting', 'Autumn pruning', 'Winter preparation'] },
      { season: 'Winter', tasks: ['Fruiting pruning', 'Phytosanitary treatments', 'Soil analysis', 'Annual planning'] }
    ]
  },
  testimonials: {
    title: 'TESTIMONIALS',
    heading: 'What our gardening<br /><em>clients say.</em>',
    items: [
      { name: 'Lluís M.', location: 'Girona', text: 'They completely transformed my garden. Impressive design and professional results.' },
      { name: 'Carme P.', location: "Platja d'Aro", text: 'The weekly maintenance is impeccable. The garden is always perfect.' },
      { name: 'Joan G.', location: 'Sant Feliu de Guíxols', text: 'They installed automatic irrigation and I have saved so much water. Highly recommended.' }
    ]
  },
  cta: {
    title: 'CONTACT',
    text: 'Let\'s talk about your garden. Contact us for a free quote.',
    button: 'Request quote',
    secondary: 'Fill in the form'
  }
}

for (const [lang, data] of [['es', esJardineria], ['en', enJardineria]]) {
  const file = JSON.parse(readFileSync(`src/locales/${lang}.json`, 'utf8'))
  file.jardineria = data
  writeFileSync(`src/locales/${lang}.json`, JSON.stringify(file, null, 2) + '\n')
  console.log(`${lang}.json updated`)
}