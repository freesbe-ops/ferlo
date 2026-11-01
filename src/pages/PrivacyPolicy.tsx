import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Seo, { hreflangUrls } from '../components/Seo'
import {
  DEFAULT_LANG,
  LANG_LABELS,
  LANGS,
  isLang,
  normalizeLang,
  privacyPath,
  type Lang,
} from '../lib/lang'

// Ruta localitzada de la política de privacitat (src/lib/lang.ts).
export { privacyPath }

// "Torna a l'inici" del header de la pàgina legal.
const BACK_HOME: Record<Lang, string> = {
  ca: 'Torna a la pàgina principal',
  es: 'Volver al inicio',
  en: 'Back to home',
  fr: 'Retour à l’accueil',
}

const SECTION_STYLES = {
  container: {
    maxWidth: 860,
    margin: '0 auto',
    padding: '120px 24px 80px',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    color: '#1A1714',
    lineHeight: 1.8,
  },
  h1: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(32px, 5vw, 48px)',
    fontWeight: 700,
    color: '#00326B',
    margin: '0 0 12px',
    lineHeight: 1.15,
  },
  updated: {
    fontSize: 13,
    color: '#6B6258',
    fontStyle: 'italic',
    marginBottom: 36,
  },
  h2: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(22px, 3vw, 28px)',
    fontWeight: 700,
    color: '#00326B',
    margin: '44px 0 14px',
    paddingTop: 8,
    borderTop: '1px solid #E5E5E5',
  },
  p: { fontSize: 15.5, color: '#3A342E', marginBottom: 14 },
  ul: { paddingLeft: 22, marginBottom: 14, fontSize: 15.5, color: '#3A342E' },
  li: { marginBottom: 8 },
  strong: { color: '#1A1714' },
} as const

function HeaderBar({ currentLang, onLanguageChange }: { currentLang: Lang; onLanguageChange: (l: string) => void }) {
  return (
    <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, padding: '0 24px', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid #EEEEEE' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <Link to={`/${currentLang}`} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/logo-lizana.webp" alt="Manteniments Lizana - Reparacions a Girona" width={128} height={128} style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }} />
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 14, color: '#1A1714', lineHeight: 1.1 }}>Manteniments</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: 11, color: '#5C5348', letterSpacing: '0.08em' }}>LIZANA</div>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <select
            value={currentLang}
            onChange={e => onLanguageChange(e.target.value)}
            aria-label="Idioma / Language / Idioma / Langue"
            style={{ background: 'transparent', border: 'none', color: '#00326B', fontWeight: 700, textDecoration: 'underline', fontSize: 12, fontFamily: "'DM Sans', system-ui, sans-serif", letterSpacing: '0.12em', textTransform: 'uppercase', outline: 'none', cursor: 'pointer', padding: 0, appearance: 'none', WebkitAppearance: 'none' }}
          >
            {LANGS.map(l => (
              <option key={l} value={l} style={{ color: '#1A1714', textTransform: 'uppercase' }}>{LANG_LABELS[l]}</option>
            ))}
          </select>
          <Link to={`/${currentLang}`} style={{ padding: '8px 18px', backgroundColor: '#00326B', color: '#FFFFFF', borderRadius: 40, textDecoration: 'none', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap' }}>
            {BACK_HOME[currentLang]}
          </Link>
        </div>
      </div>
    </header>
  )
}

function Footer({ currentLang }: { currentLang: Lang }) {
  const { t } = useTranslation()
  return (
    <footer style={{ padding: '60px 24px 40px', backgroundColor: '#F5F5F5' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ borderTop: '1px solid #E5E5E5', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logo-lizana.webp" alt="Manteniments Lizana" width={128} height={128} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
            <span style={{ fontSize: 13, color: '#6B6258' }}>Manteniments Lizana · {t('footer.legal')}</span>
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <Link to={privacyPath(currentLang)} style={{ fontSize: 12, color: '#6B6258', textDecoration: 'none' }}>{t('footer.politica_privacitat')}</Link>
            <Link to={`/${currentLang}`} style={{ fontSize: 12, color: '#6B6258', textDecoration: 'none' }}>{t('footer.inici')}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function CatalanContent() {
  return (
    <>
      <h1 style={SECTION_STYLES.h1}>Política de privacitat</h1>
      <p style={SECTION_STYLES.updated}>Última actualització: 27 d'agost de 2026</p>

      <p style={SECTION_STYLES.p}>
        A Manteniments Lizana ens prenem molt seriosament la protecció de les teves dades personals. Aquesta política
        explica quines dades recollim, per a què les utilitzem, sobre quina base legal ho fem i quins drets tens com a
        persona usuària, d'acord amb el Reglament (UE) 2016/679 (RGPD) i la Llei Orgànica 3/2018 (LOPDGDD).
      </p>

      <h2 style={SECTION_STYLES.h2}>1. Responsable del tractament</h2>
      <p style={SECTION_STYLES.p}>
        <strong style={SECTION_STYLES.strong}>Titular:</strong> Aleix Lizana Martínez (Manteniments Lizana)<br />
        <strong style={SECTION_STYLES.strong}>Activitat:</strong> Servei integral de manteniment, reparacions, jardineria,
        piscines i instal·lacions a Girona, Maresme i Costa Brava.<br />
        <strong style={SECTION_STYLES.strong}>Adreça:</strong> Carrer d'Aleix Lizana Martínez, Girona<br />
        <strong style={SECTION_STYLES.strong}>Telèfon:</strong> 677 218 303<br />
        <strong style={SECTION_STYLES.strong}>Email:</strong> mantenimentlizana@gmail.com
      </p>

      <h2 style={SECTION_STYLES.h2}>2. Quines dades recollim</h2>
      <p style={SECTION_STYLES.p}>Recollim únicament les dades estrictament necessàries per atendre la teva sol·licitud:</p>
      <ul style={SECTION_STYLES.ul}>
        <li><strong style={SECTION_STYLES.strong}>Dades del formulari de contacte:</strong> nom, telèfon, email, localitat, tipus de servei i missatge.</li>
        <li><strong style={SECTION_STYLES.strong}>Dades de navegació:</strong> a través de Google Analytics (GA4) recollim dades agregades i anònimes sobre l'ús del lloc web (pàgines visitades, durada de la visita, origen).</li>
      </ul>

      <h2 style={SECTION_STYLES.h2}>3. Per a què utilitzem les teves dades</h2>
      <ul style={SECTION_STYLES.ul}>
        <li>Atendre les teves sol·licituds de pressupost i consultes, i respondre-hi.</li>
        <li>Gestionar la prestació de tots els serveis de l'empresa: <strong style={SECTION_STYLES.strong}>manteniment general i reparacions de la llar</strong> (fontaneria bàsica, electricitat, muntatge de mobles, petites reformes i fusteria); <strong style={SECTION_STYLES.strong}>manteniment de piscines</strong> (neteja, tractament d'aigua, depuradores, obertura i tancament de temporada); <strong style={SECTION_STYLES.strong}>jardineria</strong> (poda, manteniment de gespa, sistemes de reg, disseny de jardins, eliminació de males herbes i tractaments fitosanitaris); i <strong style={SECTION_STYLES.strong}>instal·lacions</strong> (cuines, punts de llum, ventiladors, llums, endolls i interruptors).</li>
        <li>Gestionar la facturació i el cobrament dels serveis contractats.</li>
        <li>Enviar-te comunicacions comercials sobre els nostres serveis (només si ens ho has autoritzat expressament).</li>
        <li>Millorar la qualitat del servei i analitzar estadísticament l'ús del lloc web.</li>
      </ul>

      <h2 style={SECTION_STYLES.h2}>4. Legitimació del tractament</h2>
      <ul style={SECTION_STYLES.ul}>
        <li><strong style={SECTION_STYLES.strong}>El teu consentiment exprés</strong> en enviar el formulari de contacte (art. 6.1.a RGPD).</li>
        <li><strong style={SECTION_STYLES.strong}>L'execució d'un contracte o precontracte</strong> per a la prestació dels serveis sol·licitats (art. 6.1.b RGPD).</li>
        <li><strong style={SECTION_STYLES.strong}>El nostre interès legítim</strong> per millorar el servei i garantir la seguretat (art. 6.1.f RGPD).</li>
        <li><strong style={SECTION_STYLES.strong}>El compliment d'obligacions legals</strong> de facturació i fiscals (art. 6.1.c RGPD).</li>
      </ul>

      <h2 style={SECTION_STYLES.h2}>5. Destinataris de les dades</h2>
      <p style={SECTION_STYLES.p}>
        No cedim les teves dades personals a tercers, excepte:
      </p>
      <ul style={SECTION_STYLES.ul}>
        <li><strong style={SECTION_STYLES.strong}>Proveïdors de serveis necessaris</strong> per al funcionament del lloc web: allotjament web i eines de Google (Google Forms i Google Sheets per gestionar el formulari de contacte, i Google Analytics per a l'anàlisi estadística).</li>
        <li>Quan hi hagi una <strong style={SECTION_STYLES.strong}>obligació legal</strong> (per exemple, hisenda o autoritats competents).</li>
      </ul>

      <h2 style={SECTION_STYLES.h2}>6. Transferències internacionals</h2>
      <p style={SECTION_STYLES.p}>
        Algunes eines de Google (Google Analytics, Google Workspace) poden implicar transferències de dades a servidors
        situats als Estats Units. Aquestes transferències es regeixen per les <strong style={SECTION_STYLES.strong}>clàusules contractuals tipus</strong>
        aprovades per la Comissió Europea, que garanteixen un nivell adequat de protecció.
      </p>

      <h2 style={SECTION_STYLES.h2}>7. Conservació de les dades</h2>
      <ul style={SECTION_STYLES.ul}>
        <li>Les dades del formulari de contacte es conserven mentre sigui necessari per atendre la teva sol·licitud.</li>
        <li>Les dades de facturació i comptables es conserven durant el termini legalment exigible (entre 4 i 6 anys, segons la normativa fiscal).</li>
        <li>En qualsevol cas, fins que sol·licitis la seva supressió.</li>
      </ul>

      <h2 style={SECTION_STYLES.h2}>8. Els teus drets</h2>
      <p style={SECTION_STYLES.p}>Tens dret a:</p>
      <ul style={SECTION_STYLES.ul}>
        <li><strong style={SECTION_STYLES.strong}>Accedir</strong> a les teves dades personals.</li>
        <li><strong style={SECTION_STYLES.strong}>Rectificar-les</strong> si són inexactes.</li>
        <li><strong style={SECTION_STYLES.strong}>Suprimir-les</strong> quan ja no siguin necessàries.</li>
        <li><strong style={SECTION_STYLES.strong}>Oposar-te</strong> al seu tractament.</li>
        <li><strong style={SECTION_STYLES.strong}>Limitar-ne el tractament</strong> en determinats supòsits.</li>
        <li><strong style={SECTION_STYLES.strong}>Sol·licitar la portabilitat</strong> de les teves dades.</li>
      </ul>
      <p style={SECTION_STYLES.p}>
        Pots exercir aquests drets enviant un email a <strong style={SECTION_STYLES.strong}>mantenimentlizana@gmail.com</strong>,
        indicant el dret que vols exercir i adjuntant una còpia del teu document d'identitat.
        Si no estàs d'acord amb la nostra resposta, tens dret a presentar una reclamació davant
        l'<strong style={SECTION_STYLES.strong}>Agència Espanyola de Protecció de Dades</strong> (www.aepd.es).
      </p>

      <h2 style={SECTION_STYLES.h2}>9. Menors d'edat</h2>
      <p style={SECTION_STYLES.p}>
        No tractem de manera deliberada dades personals de menors de 14 anys. Si ets menor d'edat, no ens enviïs les teves
        dades sense el consentiment dels teus pares o tutors.
      </p>

      <h2 style={SECTION_STYLES.h2}>10. Seguretat de les dades</h2>
      <p style={SECTION_STYLES.p}>
        Hem implementat mesures tècniques i organitzatives adequades per protegir les teves dades personals contra
        l'accés no autoritzat, la pèrdua o l'alteració, d'acord amb l'estat de la tècnica.
      </p>

      <h2 style={SECTION_STYLES.h2}>11. Cookies</h2>
      <p style={SECTION_STYLES.p}>
        Aquest lloc web utilitza cookies tècniques i analítiques (Google Analytics) per mesurar l'ús del lloc i millorar-ne
        l'experiència. Pots configurar o bloquejar les cookies des del teu navegador. En cap cas utilitzem cookies per
        obtenir dades personals identificables.
      </p>

      <h2 style={SECTION_STYLES.h2}>12. Modificacions de la política</h2>
      <p style={SECTION_STYLES.p}>
        Ens reservem el dret de modificar aquesta política de privacitat per adaptar-la a canvis legals o tècnics. La
        versió vigent serà sempre la publicada en aquest lloc web.
      </p>
    </>
  )
}

function SpanishContent() {
  return (
    <>
      <h1 style={SECTION_STYLES.h1}>Política de privacidad</h1>
      <p style={SECTION_STYLES.updated}>Última actualización: 27 de agosto de 2026</p>

      <p style={SECTION_STYLES.p}>
        En Manteniments Lizana nos tomamos muy en serio la protección de tus datos personales. Esta política explica qué
        datos recogemos, para qué los utilizamos, sobre qué base legal lo hacemos y qué derechos tienes como persona
        usuaria, de acuerdo con el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD).
      </p>

      <h2 style={SECTION_STYLES.h2}>1. Responsable del tratamiento</h2>
      <p style={SECTION_STYLES.p}>
        <strong style={SECTION_STYLES.strong}>Titular:</strong> Aleix Lizana Martínez (Manteniments Lizana)<br />
        <strong style={SECTION_STYLES.strong}>Actividad:</strong> Servicio integral de mantenimiento, reparaciones, jardinería,
        piscinas e instalaciones en Girona, Maresme y Costa Brava.<br />
        <strong style={SECTION_STYLES.strong}>Dirección:</strong> Carrer d'Aleix Lizana Martínez, Girona<br />
        <strong style={SECTION_STYLES.strong}>Teléfono:</strong> 677 218 303<br />
        <strong style={SECTION_STYLES.strong}>Email:</strong> mantenimentlizana@gmail.com
      </p>

      <h2 style={SECTION_STYLES.h2}>2. Qué datos recogemos</h2>
      <p style={SECTION_STYLES.p}>Recogemos únicamente los datos estrictamente necesarios para atender tu solicitud:</p>
      <ul style={SECTION_STYLES.ul}>
        <li><strong style={SECTION_STYLES.strong}>Datos del formulario de contacto:</strong> nombre, teléfono, email, localidad, tipo de servicio y mensaje.</li>
        <li><strong style={SECTION_STYLES.strong}>Datos de navegación:</strong> a través de Google Analytics (GA4) recogemos datos agregados y anónimos sobre el uso del sitio web (páginas visitadas, duración de la visita, origen).</li>
      </ul>

      <h2 style={SECTION_STYLES.h2}>3. Para qué utilizamos tus datos</h2>
      <ul style={SECTION_STYLES.ul}>
        <li>Atender tus solicitudes de presupuesto y consultas, y responder a ellas.</li>
        <li>Gestionar la prestación de todos los servicios de la empresa: <strong style={SECTION_STYLES.strong}>mantenimiento general y reparaciones del hogar</strong> (fontanería básica, electricidad, montaje de muebles, pequeñas reformas y carpintería); <strong style={SECTION_STYLES.strong}>mantenimiento de piscinas</strong> (limpieza, tratamiento del agua, depuradoras, apertura y cierre de temporada); <strong style={SECTION_STYLES.strong}>jardinería</strong> (poda, mantenimiento de césped, sistemas de riego, diseño de jardines, eliminación de malas hierbas y tratamientos fitosanitarios); e <strong style={SECTION_STYLES.strong}>instalaciones</strong> (cocinas, puntos de luz, ventiladores, lámparas, enchufes e interruptores).</li>
        <li>Gestionar la facturación y el cobro de los servicios contratados.</li>
        <li>Enviarte comunicaciones comerciales sobre nuestros servicios (solo si nos lo has autorizado expresamente).</li>
        <li>Mejorar la calidad del servicio y analizar estadísticamente el uso del sitio web.</li>
      </ul>

      <h2 style={SECTION_STYLES.h2}>4. Legitimación del tratamiento</h2>
      <ul style={SECTION_STYLES.ul}>
        <li><strong style={SECTION_STYLES.strong}>Tu consentimiento expreso</strong> al enviar el formulario de contacto (art. 6.1.a RGPD).</li>
        <li><strong style={SECTION_STYLES.strong}>La ejecución de un contrato o precontrato</strong> para la prestación de los servicios solicitados (art. 6.1.b RGPD).</li>
        <li><strong style={SECTION_STYLES.strong}>Nuestro interés legítimo</strong> para mejorar el servicio y garantizar la seguridad (art. 6.1.f RGPD).</li>
        <li><strong style={SECTION_STYLES.strong}>El cumplimiento de obligaciones legales</strong> de facturación y fiscales (art. 6.1.c RGPD).</li>
      </ul>

      <h2 style={SECTION_STYLES.h2}>5. Destinatarios de los datos</h2>
      <p style={SECTION_STYLES.p}>
        No cedemos tus datos personales a terceros, excepto:
      </p>
      <ul style={SECTION_STYLES.ul}>
        <li><strong style={SECTION_STYLES.strong}>Proveedores de servicios necesarios</strong> para el funcionamiento del sitio web: alojamiento web y herramientas de Google (Google Forms y Google Sheets para gestionar el formulario de contacto, y Google Analytics para el análisis estadístico).</li>
        <li>Cuando exista una <strong style={SECTION_STYLES.strong}>obligación legal</strong> (por ejemplo, hacienda o autoridades competentes).</li>
      </ul>

      <h2 style={SECTION_STYLES.h2}>6. Transferencias internacionales</h2>
      <p style={SECTION_STYLES.p}>
        Algunas herramientas de Google (Google Analytics, Google Workspace) pueden implicar transferencias de datos a
        servidores situados en Estados Unidos. Estas transferencias se rigen por las <strong style={SECTION_STYLES.strong}>cláusulas
        contractuales tipo</strong> aprobadas por la Comisión Europea, que garantizan un nivel adecuado de protección.
      </p>

      <h2 style={SECTION_STYLES.h2}>7. Conservación de los datos</h2>
      <ul style={SECTION_STYLES.ul}>
        <li>Los datos del formulario de contacto se conservan mientras sea necesario para atender tu solicitud.</li>
        <li>Los datos de facturación y contables se conservan durante el plazo legalmente exigible (entre 4 y 6 años, según la normativa fiscal).</li>
        <li>En cualquier caso, hasta que solicites su supresión.</li>
      </ul>

      <h2 style={SECTION_STYLES.h2}>8. Tus derechos</h2>
      <p style={SECTION_STYLES.p}>Tienes derecho a:</p>
      <ul style={SECTION_STYLES.ul}>
        <li><strong style={SECTION_STYLES.strong}>Acceder</strong> a tus datos personales.</li>
        <li><strong style={SECTION_STYLES.strong}>Rectificarlos</strong> si son inexactos.</li>
        <li><strong style={SECTION_STYLES.strong}>Suprimirlos</strong> cuando ya no sean necesarios.</li>
        <li><strong style={SECTION_STYLES.strong}>Oponerte</strong> a su tratamiento.</li>
        <li><strong style={SECTION_STYLES.strong}>Limitar su tratamiento</strong> en determinados supuestos.</li>
        <li><strong style={SECTION_STYLES.strong}>Solicitar la portabilidad</strong> de tus datos.</li>
      </ul>
      <p style={SECTION_STYLES.p}>
        Puedes ejercer estos derechos enviando un email a <strong style={SECTION_STYLES.strong}>mantenimentlizana@gmail.com</strong>,
        indicando el derecho que quieres ejercer y adjuntando una copia de tu documento de identidad.
        Si no estás de acuerdo con nuestra respuesta, tienes derecho a presentar una reclamación ante la
        <strong style={SECTION_STYLES.strong}> Agencia Española de Protección de Datos</strong> (www.aepd.es).
      </p>

      <h2 style={SECTION_STYLES.h2}>9. Menores de edad</h2>
      <p style={SECTION_STYLES.p}>
        No tratamos de manera deliberada datos personales de menores de 14 años. Si eres menor de edad, no nos envíes tus
        datos sin el consentimiento de tus padres o tutores.
      </p>

      <h2 style={SECTION_STYLES.h2}>10. Seguridad de los datos</h2>
      <p style={SECTION_STYLES.p}>
        Hemos implementado medidas técnicas y organizativas adecuadas para proteger tus datos personales contra el acceso
        no autorizado, la pérdida o la alteración, de acuerdo con el estado de la técnica.
      </p>

      <h2 style={SECTION_STYLES.h2}>11. Cookies</h2>
      <p style={SECTION_STYLES.p}>
        Este sitio web utiliza cookies técnicas y analíticas (Google Analytics) para medir el uso del sitio y mejorar la
        experiencia. Puedes configurar o bloquear las cookies desde tu navegador. En ningún caso utilizamos cookies para
        obtener datos personales identificables.
      </p>

      <h2 style={SECTION_STYLES.h2}>12. Modificaciones de la política</h2>
      <p style={SECTION_STYLES.p}>
        Nos reservamos el derecho de modificar esta política de privacidad para adaptarla a cambios legales o técnicos. La
        versión vigente será siempre la publicada en este sitio web.
      </p>
    </>
  )
}

function EnglishContent() {
  return (
    <>
      <h1 style={SECTION_STYLES.h1}>Privacy Policy</h1>
      <p style={SECTION_STYLES.updated}>Last updated: 27 August 2026</p>

      <p style={SECTION_STYLES.p}>
        At Manteniments Lizana we take the protection of your personal data very seriously. This policy explains what
        data we collect, what we use it for, on what legal basis we do so and what rights you have as a user, in
        accordance with Regulation (EU) 2016/679 (GDPR) and Spanish Organic Law 3/2018 (LOPDGDD).
      </p>

      <h2 style={SECTION_STYLES.h2}>1. Data controller</h2>
      <p style={SECTION_STYLES.p}>
        <strong style={SECTION_STYLES.strong}>Owner:</strong> Aleix Lizana Martínez (Manteniments Lizana)<br />
        <strong style={SECTION_STYLES.strong}>Activity:</strong> comprehensive maintenance, repair, gardening, pool and
        installation services in Girona, Maresme and Costa Brava.<br />
        <strong style={SECTION_STYLES.strong}>Address:</strong> Carrer d’Aleix Lizana Martínez, Girona<br />
        <strong style={SECTION_STYLES.strong}>Phone:</strong> 677 218 303<br />
        <strong style={SECTION_STYLES.strong}>Email:</strong> mantenimentlizana@gmail.com
      </p>

      <h2 style={SECTION_STYLES.h2}>2. What data we collect</h2>
      <p style={SECTION_STYLES.p}>We only collect the data strictly necessary to deal with your request:</p>
      <ul style={SECTION_STYLES.ul}>
        <li><strong style={SECTION_STYLES.strong}>Contact form data:</strong> name, phone, email, town, type of service and message.</li>
        <li><strong style={SECTION_STYLES.strong}>Browsing data:</strong> through Google Analytics (GA4) we collect aggregated and anonymous data about the use of the website (pages visited, visit duration, origin).</li>
      </ul>

      <h2 style={SECTION_STYLES.h2}>3. What we use your data for</h2>
      <ul style={SECTION_STYLES.ul}>
        <li>Handling and answering your quote requests and enquiries.</li>
        <li>Managing the provision of all the company’s services: <strong style={SECTION_STYLES.strong}>general home maintenance and repairs</strong> (basic plumbing, electrical work, furniture assembly, small renovations and carpentry); <strong style={SECTION_STYLES.strong}>pool maintenance</strong> (cleaning, water treatment, filtration, seasonal opening and closing); <strong style={SECTION_STYLES.strong}>gardening</strong> (pruning, lawn care, irrigation systems, garden design, weed removal and phytosanitary treatments); and <strong style={SECTION_STYLES.strong}>installations</strong> (kitchens, light points, fans, lamps, sockets and switches).</li>
        <li>Managing invoicing and collection for the services contracted.</li>
        <li>Sending you commercial communications about our services (only if you have expressly authorised us to do so).</li>
        <li>Improving service quality and statistically analysing the use of the website.</li>
      </ul>

      <h2 style={SECTION_STYLES.h2}>4. Legal basis for processing</h2>
      <ul style={SECTION_STYLES.ul}>
        <li><strong style={SECTION_STYLES.strong}>Your express consent</strong> when submitting the contact form (art. 6.1.a GDPR).</li>
        <li><strong style={SECTION_STYLES.strong}>Performance of a contract or pre-contract</strong> for the provision of the services requested (art. 6.1.b GDPR).</li>
        <li><strong style={SECTION_STYLES.strong}>Our legitimate interest</strong> in improving the service and guaranteeing security (art. 6.1.f GDPR).</li>
        <li><strong style={SECTION_STYLES.strong}>Compliance with legal</strong> invoicing and tax obligations (art. 6.1.c GDPR).</li>
      </ul>

      <h2 style={SECTION_STYLES.h2}>5. Data recipients</h2>
      <p style={SECTION_STYLES.p}>
        We do not transfer your personal data to third parties, except:
      </p>
      <ul style={SECTION_STYLES.ul}>
        <li><strong style={SECTION_STYLES.strong}>Service providers required</strong> to run the website: web hosting and Google tools (Google Forms and Google Sheets to manage the contact form, and Google Analytics for statistical analysis).</li>
        <li>Where there is a <strong style={SECTION_STYLES.strong}>legal obligation</strong> (for example, tax authorities or competent public bodies).</li>
      </ul>

      <h2 style={SECTION_STYLES.h2}>6. International transfers</h2>
      <p style={SECTION_STYLES.p}>
        Some Google tools (Google Analytics, Google Workspace) may involve transfers of data to servers located in the
        United States. These transfers are governed by the <strong style={SECTION_STYLES.strong}>standard contractual
        clauses</strong> approved by the European Commission, which guarantee an adequate level of protection.
      </p>

      <h2 style={SECTION_STYLES.h2}>7. Data retention</h2>
      <ul style={SECTION_STYLES.ul}>
        <li>Contact form data is kept for as long as necessary to deal with your request.</li>
        <li>Invoicing and accounting data is kept for the legally required period (between 4 and 6 years, depending on tax regulations).</li>
        <li>In any case, until you request its deletion.</li>
      </ul>

      <h2 style={SECTION_STYLES.h2}>8. Your rights</h2>
      <p style={SECTION_STYLES.p}>You have the right to:</p>
      <ul style={SECTION_STYLES.ul}>
        <li><strong style={SECTION_STYLES.strong}>Access</strong> your personal data.</li>
        <li><strong style={SECTION_STYLES.strong}>Rectify it</strong> if it is inaccurate.</li>
        <li><strong style={SECTION_STYLES.strong}>Delete it</strong> when it is no longer necessary.</li>
        <li><strong style={SECTION_STYLES.strong}>Object</strong> to its processing.</li>
        <li><strong style={SECTION_STYLES.strong}>Restrict its processing</strong> in certain cases.</li>
        <li><strong style={SECTION_STYLES.strong}>Request portability</strong> of your data.</li>
      </ul>
      <p style={SECTION_STYLES.p}>
        You can exercise these rights by sending an email to <strong style={SECTION_STYLES.strong}>mantenimentlizana@gmail.com</strong>,
        stating the right you wish to exercise and attaching a copy of your identity document.
        If you disagree with our response, you have the right to lodge a complaint with the
        <strong style={SECTION_STYLES.strong}> Spanish Data Protection Agency</strong> (www.aepd.es).
      </p>

      <h2 style={SECTION_STYLES.h2}>9. Minors</h2>
      <p style={SECTION_STYLES.p}>
        We do not deliberately process the personal data of anyone under 14 years of age. If you are under age, please
        do not send us your data without the consent of your parents or guardians.
      </p>

      <h2 style={SECTION_STYLES.h2}>10. Data security</h2>
      <p style={SECTION_STYLES.p}>
        We have implemented appropriate technical and organisational measures to protect your personal data against
        unauthorised access, loss or alteration, in accordance with the state of the art.
      </p>

      <h2 style={SECTION_STYLES.h2}>11. Cookies</h2>
      <p style={SECTION_STYLES.p}>
        This website uses technical and analytical cookies (Google Analytics) to measure use of the site and improve the
        experience. You can configure or block cookies from your browser. Under no circumstances do we use cookies to
        obtain identifiable personal data.
      </p>

      <h2 style={SECTION_STYLES.h2}>12. Changes to this policy</h2>
      <p style={SECTION_STYLES.p}>
        We reserve the right to modify this privacy policy in order to adapt it to legal or technical changes. The
        version in force will always be the one published on this website.
      </p>
    </>
  )
}

function FrenchContent() {
  return (
    <>
      <h1 style={SECTION_STYLES.h1}>Politique de confidentialité</h1>
      <p style={SECTION_STYLES.updated}>Dernière mise à jour : 27 août 2026</p>

      <p style={SECTION_STYLES.p}>
        Chez Manteniments Lizana, nous prenons très au sérieux la protection de vos données personnelles. Cette politique
        explique quelles données nous collectons, dans quel but, sur quelle base légale et quels sont vos droits en tant
        qu’utilisateur, conformément au règlement (UE) 2016/679 (RGPD) et à la loi organique 3/2018 (LOPDGDD).
      </p>

      <h2 style={SECTION_STYLES.h2}>1. Responsable du traitement</h2>
      <p style={SECTION_STYLES.p}>
        <strong style={SECTION_STYLES.strong}>Titulaire :</strong> Aleix Lizana Martínez (Manteniments Lizana)<br />
        <strong style={SECTION_STYLES.strong}>Activité :</strong> service intégral de maintenance, réparations, jardinage,
        piscines et installations à Girona, Maresme et Costa Brava.<br />
        <strong style={SECTION_STYLES.strong}>Adresse :</strong> Carrer d’Aleix Lizana Martínez, Girona<br />
        <strong style={SECTION_STYLES.strong}>Téléphone :</strong> 677 218 303<br />
        <strong style={SECTION_STYLES.strong}>E-mail :</strong> mantenimentlizana@gmail.com
      </p>

      <h2 style={SECTION_STYLES.h2}>2. Quelles données nous collectons</h2>
      <p style={SECTION_STYLES.p}>Nous ne collectons que les données strictement nécessaires pour traiter votre demande :</p>
      <ul style={SECTION_STYLES.ul}>
        <li><strong style={SECTION_STYLES.strong}>Données du formulaire de contact :</strong> nom, téléphone, e-mail, localité, type de service et message.</li>
        <li><strong style={SECTION_STYLES.strong}>Données de navigation :</strong> via Google Analytics (GA4), nous collectons des données agrégées et anonymes sur l’utilisation du site web (pages visitées, durée de la visite, origine).</li>
      </ul>

      <h2 style={SECTION_STYLES.h2}>3. Dans quel but nous utilisons vos données</h2>
      <ul style={SECTION_STYLES.ul}>
        <li>Répondre à vos demandes de devis et à vos questions.</li>
        <li>Gérer la prestation de tous les services de l’entreprise : <strong style={SECTION_STYLES.strong}>maintenance générale et réparations de la maison</strong> (plomberie de base, électricité, montage de meubles, petits travaux et menuiserie) ; <strong style={SECTION_STYLES.strong}>entretien de piscine</strong> (nettoyage, traitement de l’eau, filtration, ouverture et fermeture de saison) ; <strong style={SECTION_STYLES.strong}>jardinage</strong> (taille, entretien de la pelouse, systèmes d’arrosage, création de jardins, désherbage et traitements phytosanitaires) ; et <strong style={SECTION_STYLES.strong}>installations</strong> (cuisines, points lumineux, ventilateurs, luminaires, prises et interrupteurs).</li>
        <li>Gérer la facturation et l’encaissement des services souscrits.</li>
        <li>Vous envoyer des communications commerciales sur nos services (uniquement si vous nous y avez autorisés expressément).</li>
        <li>Améliorer la qualité du service et analyser statistiquement l’utilisation du site web.</li>
      </ul>

      <h2 style={SECTION_STYLES.h2}>4. Base légale du traitement</h2>
      <ul style={SECTION_STYLES.ul}>
        <li><strong style={SECTION_STYLES.strong}>Votre consentement explicite</strong> lors de l’envoi du formulaire de contact (art. 6.1.a RGPD).</li>
        <li><strong style={SECTION_STYLES.strong}>L’exécution d’un contrat ou d’un contrat préliminaire</strong> pour la prestation des services demandés (art. 6.1.b RGPD).</li>
        <li><strong style={SECTION_STYLES.strong}>Notre intérêt légitime</strong> à améliorer le service et à garantir la sécurité (art. 6.1.f RGPD).</li>
        <li><strong style={SECTION_STYLES.strong}>Le respect des obligations légales</strong> de facturation et fiscales (art. 6.1.c RGPD).</li>
      </ul>

      <h2 style={SECTION_STYLES.h2}>5. Destinataires des données</h2>
      <p style={SECTION_STYLES.p}>
        Nous ne cédons pas vos données personnelles à des tiers, sauf :
      </p>
      <ul style={SECTION_STYLES.ul}>
        <li><strong style={SECTION_STYLES.strong}>Prestataires de services nécessaires</strong> au fonctionnement du site web : hébergement web et outils Google (Google Forms et Google Sheets pour gérer le formulaire de contact, et Google Analytics pour l’analyse statistique).</li>
        <li>En cas d’<strong style={SECTION_STYLES.strong}>obligation légale</strong> (par exemple, l’administration fiscale ou les autorités compétentes).</li>
      </ul>

      <h2 style={SECTION_STYLES.h2}>6. Transferts internationaux</h2>
      <p style={SECTION_STYLES.p}>
        Certains outils Google (Google Analytics, Google Workspace) peuvent impliquer des transferts de données vers des
        serveurs situés aux États-Unis. Ces transferts sont régis par les <strong style={SECTION_STYLES.strong}>clauses
        contractuelles types</strong> approuvées par la Commission européenne, qui garantissent un niveau de protection adéquat.
      </p>

      <h2 style={SECTION_STYLES.h2}>7. Conservation des données</h2>
      <ul style={SECTION_STYLES.ul}>
        <li>Les données du formulaire de contact sont conservées aussi longtemps que nécessaire pour traiter votre demande.</li>
        <li>Les données de facturation et comptables sont conservées pendant la durée légalement exigée (entre 4 et 6 ans, selon la réglementation fiscale).</li>
        <li>Dans tous les cas, jusqu’à ce que vous demandiez leur suppression.</li>
      </ul>

      <h2 style={SECTION_STYLES.h2}>8. Vos droits</h2>
      <p style={SECTION_STYLES.p}>Vous avez le droit de :</p>
      <ul style={SECTION_STYLES.ul}>
        <li><strong style={SECTION_STYLES.strong}>Accéder</strong> à vos données personnelles.</li>
        <li><strong style={SECTION_STYLES.strong}>Les rectifier</strong> si elles sont inexactes.</li>
        <li><strong style={SECTION_STYLES.strong}>Les supprimer</strong> lorsqu’elles ne sont plus nécessaires.</li>
        <li><strong style={SECTION_STYLES.strong}>Vous opposer</strong> à leur traitement.</li>
        <li><strong style={SECTION_STYLES.strong}>Limiter leur traitement</strong> dans certains cas.</li>
        <li><strong style={SECTION_STYLES.strong}>Demander la portabilité</strong> de vos données.</li>
      </ul>
      <p style={SECTION_STYLES.p}>
        Vous pouvez exercer ces droits en envoyant un e-mail à <strong style={SECTION_STYLES.strong}>mantenimentlizana@gmail.com</strong>,
        en précisant le droit que vous souhaitez exercer et en joignant une copie de votre pièce d’identité.
        Si vous n’êtes pas d’accord avec notre réponse, vous avez le droit d’introduire une réclamation auprès de
        l’<strong style={SECTION_STYLES.strong}>Agencia Española de Protección de Datos</strong> (www.aepd.es).
      </p>

      <h2 style={SECTION_STYLES.h2}>9. Mineurs</h2>
      <p style={SECTION_STYLES.p}>
        Nous ne traitons pas délibérément les données personnelles des personnes de moins de 14 ans. Si vous êtes mineur,
        ne nous envoyez pas vos données sans le consentement de vos parents ou tuteurs.
      </p>

      <h2 style={SECTION_STYLES.h2}>10. Sécurité des données</h2>
      <p style={SECTION_STYLES.p}>
        Nous avons mis en place des mesures techniques et organisationnelles appropriées pour protéger vos données
        personnelles contre tout accès non autorisé, toute perte ou toute altération, conformément à l’état de la technique.
      </p>

      <h2 style={SECTION_STYLES.h2}>11. Cookies</h2>
      <p style={SECTION_STYLES.p}>
        Ce site web utilise des cookies techniques et analytiques (Google Analytics) pour mesurer l’utilisation du site et
        améliorer l’expérience. Vous pouvez configurer ou bloquer les cookies depuis votre navigateur. Nous n’utilisons en
        aucun cas les cookies pour obtenir des données personnelles identifiables.
      </p>

      <h2 style={SECTION_STYLES.h2}>12. Modifications de la politique</h2>
      <p style={SECTION_STYLES.p}>
        Nous nous réservons le droit de modifier cette politique de confidentialité afin de l’adapter à des changements
        légaux ou techniques. La version en vigueur sera toujours celle publiée sur ce site web.
      </p>
    </>
  )
}

export default function PrivacyPolicy() {
  const { i18n } = useTranslation()
  const { lang: langParam } = useParams<{ lang?: string }>()
  const navigate = useNavigate()

  const urlLang = isLang(langParam) ? langParam : null
  const currentLang = urlLang ?? normalizeLang(i18n.language)

  // Si arribem amb una URL no vàlida, redirigim a la política en l'idioma per defecte
  if (!isLang(langParam)) {
    navigate(privacyPath(DEFAULT_LANG), { replace: true })
  }

  const changeLanguage = (value: string) => {
    i18n.changeLanguage(value)
    localStorage.setItem('i18nextLng', value)
    navigate(privacyPath(normalizeLang(value)), { replace: false })
  }

  // Cada idioma té la seva pròpia pàgina de privacitat i el seu slug.
  const isCa = currentLang === 'ca'
  const isFr = currentLang === 'fr'
  const seoLang: Lang = currentLang

  const title = isCa
    ? 'Política de Privacitat | Manteniments Lizana Girona'
    : isFr
      ? 'Politique de Confidentialité | Manteniments Lizana'
      : currentLang === 'en'
        ? 'Privacy Policy | Manteniments Lizana Girona'
        : 'Política de Privacidad | Mantenimientos Lizana Girona'
  const description = isCa
    ? 'Política de privacitat de Manteniments Lizana (Aleix Lizana Martínez). Protecció de dades, RGPD i drets de les persones usuàries.'
    : isFr
      ? 'Politique de confidentialité de Manteniments Lizana (Aleix Lizana Martínez). Protection des données, RGPD et droits des utilisateurs.'
      : currentLang === 'en'
        ? 'Privacy policy of Manteniments Lizana (Aleix Lizana Martínez). Data protection, GDPR and the rights of website users.'
        : 'Política de privacidad de Manteniments Lizana (Aleix Lizana Martínez). Protección de datos, RGPD y derechos de los usuarios.'
  const privacyCanonical = privacyPath(currentLang)
  // Els quatre idiomes tenen pàgina pròpia, així que els alternates (ca, es, en,
  // fr i x-default) surten directament del mapa de rutes compartit.
  const privacyHreflang = hreflangUrls(privacyCanonical)

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", backgroundColor: '#FFFFFF', color: '#1A1714', minHeight: '100vh' }}>
      <Seo
        lang={seoLang}
        path={privacyCanonical}
        title={title}
        description={description}
        alternates={privacyHreflang}
      />

      <HeaderBar currentLang={currentLang} onLanguageChange={changeLanguage} />

      <div style={SECTION_STYLES.container as React.CSSProperties}>
        {isCa ? (
          <CatalanContent />
        ) : isFr ? (
          <FrenchContent />
        ) : currentLang === 'en' ? (
          <EnglishContent />
        ) : (
          <SpanishContent />
        )}
      </div>

      <Footer currentLang={currentLang} />
    </div>
  )
}
