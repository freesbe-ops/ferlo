import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import Seo from '../components/Seo'
import LegalShell, { LEGAL_STYLES as S } from '../components/LegalShell'
import { DEFAULT_LANG, cookiesPath, isLang, normalizeLang, pathAlternates, privacyPath, type Lang } from '../lib/lang'
import { LEGAL_META } from '../lib/pageMeta'

function CatalanContent() {
  return (
    <>
      <h1 style={S.h1}>Política de cookies</h1>
      <p style={S.updated}>Última actualització: 1 de gener de 2026</p>

      <p style={S.p}>
        Aquest lloc web utilitza cookies i tecnologies similars per garantir el funcionament correcte de la pàgina i per
        analitzar de forma anònima com s'utilitza. A continuació t'expliquem què són, quines fem servir i com les pots
        gestionar.
      </p>

      <h2 style={S.h2}>1. Què és una cookie?</h2>
      <p style={S.p}>
        Una cookie és un petit fitxer de text que s'emmagatzema al teu navegador quan visites un lloc web. Permet
        recordar informació sobre la teva visita, com l'idioma triat o les pàgines que has consultat.
      </p>

      <h2 style={S.h2}>2. Cookies que utilitzem</h2>
      <ul style={S.ul}>
        <li style={S.li}>
          <strong style={S.strong}>Cookies tècniques (necessàries):</strong> permeten el funcionament bàsic del lloc,
          com recordar l'idioma seleccionat. Estan exemptes de consentiment perquè són imprescindibles.
        </li>
        <li style={S.li}>
          <strong style={S.strong}>Cookies analítiques:</strong> si acceptes, instal·lem cookies de Google Analytics per
          conèixer de forma agregada i anònima quantes persones visiten el lloc, quines pàgines consulten i des de quin
          dispositiu. No s'utilitzen per identificar-te personalment.
        </li>
      </ul>
      <p style={S.p}>
        En cap cas no utilitzem cookies publicitàries, de perfilat ni de xarxes socials per fer seguiment de la teva
        navegació.
      </p>

      <h2 style={S.h2}>3. Base legal</h2>
      <p style={S.p}>
        Les cookies tècniques es fan servir per interès legítim i per a l'execució del servei sol·licitat. Les cookies
        analítiques només s'instal·len amb el teu consentiment previ, que pots retirar en qualsevol moment.
      </p>

      <h2 style={S.h2}>4. Com desactivar o eliminar les cookies</h2>
      <p style={S.p}>
        Pots permetre, bloquejar o eliminar les cookies des de la configuració del teu navegador. Aquí tens els enllaços
        d'ajuda dels navegadors més habituals:
      </p>
      <ul style={S.ul}>
        <li style={S.li}>Google Chrome: chrome://settings/cookies</li>
        <li style={S.li}>Mozilla Firefox: about:preferences#privacy</li>
        <li style={S.li}>Safari: Preferències → Privacitat</li>
        <li style={S.li}>Microsoft Edge: edge://settings/content/cookies</li>
      </ul>
      <p style={S.p}>
        Si bloques totes les cookies, és possible que algunes parts del lloc no funcionin correctament, com la
        memorització de l'idioma.
      </p>

      <h2 style={S.h2}>5. Més informació</h2>
      <p style={S.p}>
        Per a qualsevol dubte sobre aquesta política pots escriure'ns a <strong style={S.strong}>reformasferlo@outlook.es</strong>.
        També pots consultar la nostra{' '}
        <a href={privacyPath('ca')} style={{ color: 'var(--color-primary)' }}>política de privacitat</a>.
      </p>
    </>
  )
}

function SpanishContent() {
  return (
    <>
      <h1 style={S.h1}>Política de cookies</h1>
      <p style={S.updated}>Última actualización: 1 de enero de 2026</p>

      <p style={S.p}>
        Este sitio web utiliza cookies y tecnologías similares para garantizar el correcto funcionamiento de la página y
        para analizar de forma anónima cómo se utiliza. A continuación te explicamos qué son, cuáles utilizamos y cómo
        puedes gestionarlas.
      </p>

      <h2 style={S.h2}>1. ¿Qué es una cookie?</h2>
      <p style={S.p}>
        Una cookie es un pequeño archivo de texto que se almacena en tu navegador cuando visitas un sitio web. Permite
        recordar información sobre tu visita, como el idioma elegido o las páginas que has consultado.
      </p>

      <h2 style={S.h2}>2. Cookies que utilizamos</h2>
      <ul style={S.ul}>
        <li style={S.li}>
          <strong style={S.strong}>Cookies técnicas (necesarias):</strong> permiten el funcionamiento básico del sitio,
          como recordar el idioma seleccionado. Están exentas de consentimiento porque son imprescindibles.
        </li>
        <li style={S.li}>
          <strong style={S.strong}>Cookies analíticas:</strong> si las aceptas, instalamos cookies de Google Analytics
          para conocer de forma agregada y anónima cuántas personas visitan el sitio, qué páginas consultan y desde qué
          dispositivo. No se utilizan para identificarte personalmente.
        </li>
      </ul>
      <p style={S.p}>
        En ningún caso utilizamos cookies publicitarias, de perfilado ni de redes sociales para hacer seguimiento de tu
        navegación.
      </p>

      <h2 style={S.h2}>3. Base legal</h2>
      <p style={S.p}>
        Las cookies técnicas se utilizan por interés legítimo y para la ejecución del servicio solicitado. Las cookies
        analíticas solo se instalan con tu consentimiento previo, que puedes retirar en cualquier momento.
      </p>

      <h2 style={S.h2}>4. Cómo desactivar o eliminar las cookies</h2>
      <p style={S.p}>
        Puedes permitir, bloquear o eliminar las cookies desde la configuración de tu navegador. Aquí tienes los enlaces
        de ayuda de los navegadores más habituales:
      </p>
      <ul style={S.ul}>
        <li style={S.li}>Google Chrome: chrome://settings/cookies</li>
        <li style={S.li}>Mozilla Firefox: about:preferences#privacy</li>
        <li style={S.li}>Safari: Preferencias → Privacidad</li>
        <li style={S.li}>Microsoft Edge: edge://settings/content/cookies</li>
      </ul>
      <p style={S.p}>
        Si bloqueas todas las cookies, es posible que algunas partes del sitio no funcionen correctamente, como la
        memorización del idioma.
      </p>

      <h2 style={S.h2}>5. Más información</h2>
      <p style={S.p}>
        Para cualquier duda sobre esta política puedes escribirnos a <strong style={S.strong}>reformasferlo@outlook.es</strong>.
        También puedes consultar nuestra{' '}
        <a href={privacyPath('es')} style={{ color: 'var(--color-primary)' }}>política de privacidad</a>.
      </p>
    </>
  )
}

export default function Cookies() {
  const { i18n } = useTranslation()
  const { lang: langParam } = useParams<{ lang?: string }>()
  const navigate = useNavigate()

  const currentLang: Lang = isLang(langParam) ? langParam : normalizeLang(i18n.language)

  const changeLanguage = (value: string) => {
    const next = normalizeLang(value)
    i18n.changeLanguage(next)
    localStorage.setItem('i18nextLng', next)
    navigate(cookiesPath(next), { replace: false })
  }

  const canonical = cookiesPath(isLang(langParam) ? langParam : DEFAULT_LANG)
  const isCa = currentLang === 'ca'
  const { title, description } = LEGAL_META.cookies[currentLang]

  return (
    <>
      <Seo lang={currentLang} path={canonical} title={title} description={description} alternates={pathAlternates(canonical)} />
      <LegalShell currentLang={currentLang} onLanguageChange={changeLanguage}>
        {isCa ? <CatalanContent /> : <SpanishContent />}
      </LegalShell>
    </>
  )
}
