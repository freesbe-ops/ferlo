import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Seo from '../components/Seo'
import LegalShell, { LEGAL_STYLES as S } from '../components/LegalShell'
import { SERVICE_KEYS, homePath, isLang, normalizeLang, servicePath, type Lang } from '../lib/lang'

const COPY = {
  es: {
    code: '404',
    title: 'Página no encontrada',
    text: 'La página que buscas no existe o ha cambiado de dirección. Puedes volver al inicio o consultar nuestros servicios de reforma en Tordera y el Maresme.',
    home: 'Ir al inicio',
    services: 'Ver servicios',
    servicesTitle: 'Servicios de reforma',
    links: {
      reformes: 'Reformas integrales',
      cuines: 'Reforma de cocinas',
      banys: 'Reforma de baños',
      obraNova: 'Obra nueva',
    },
  },
  ca: {
    code: '404',
    title: 'Pàgina no trobada',
    text: "La pàgina que busques no existeix o ha canviat d'adreça. Pots tornar a l'inici o consultar els nostres serveis de reforma a Tordera i el Maresme.",
    home: "Torna a l'inici",
    services: 'Veure serveis',
    servicesTitle: 'Serveis de reforma',
    links: {
      reformes: 'Reformes integrals',
      cuines: 'Reforma de cuines',
      banys: 'Reforma de banys',
      obraNova: 'Obra nova',
    },
  },
} as const

export default function NotFound() {
  const { i18n } = useTranslation()
  const { lang: langParam } = useParams<{ lang?: string }>()
  const navigate = useNavigate()

  const currentLang: Lang = isLang(langParam) ? langParam : normalizeLang(i18n.language)
  const copy = COPY[currentLang]

  const changeLanguage = (value: string) => {
    const next = normalizeLang(value)
    i18n.changeLanguage(next)
    localStorage.setItem('i18nextLng', next)
    navigate(homePath(next), { replace: true })
  }

  const buttonStyle = {
    display: 'inline-block',
    padding: '12px 26px',
    borderRadius: 40,
    fontSize: 14,
    fontWeight: 500,
    textDecoration: 'none',
  } as const

  return (
    <>
      <Seo
        lang={currentLang}
        path={homePath(currentLang)}
        title={`${copy.title} | FERLO SL`}
        description={copy.text}
        noindex
      />
      <LegalShell currentLang={currentLang} onLanguageChange={changeLanguage}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(72px, 16vw, 140px)', fontWeight: 700, color: '#00326B', lineHeight: 1, opacity: 0.15 }}>
            {copy.code}
          </div>
          <h1 style={{ ...S.h1, marginTop: -24 }}>{copy.title}</h1>
          <p style={{ ...S.p, maxWidth: 560, margin: '0 auto 32px' }}>{copy.text}</p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56 }}>
            <Link to={homePath(currentLang)} style={{ ...buttonStyle, backgroundColor: '#00326B', color: '#FFFFFF' }}>
              {copy.home}
            </Link>
            <a href="#serveis" style={{ ...buttonStyle, backgroundColor: '#F5F5F5', color: '#00326B' }}>
              {copy.services}
            </a>
          </div>

          <div id="serveis" style={{ textAlign: 'left', borderTop: '1px solid #E5E5E5', paddingTop: 32 }}>
            <h2 style={{ ...S.h2, marginTop: 0, borderTop: 'none', paddingTop: 0 }}>{copy.servicesTitle}</h2>
            <ul style={S.ul}>
              {SERVICE_KEYS.map(key => (
                <li key={key} style={S.li}>
                  <Link to={servicePath(currentLang, key)} style={{ color: '#00326B', textDecoration: 'underline' }}>
                    {copy.links[key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </LegalShell>
    </>
  )
}
