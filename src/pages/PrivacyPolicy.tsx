import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import Seo, { hreflangUrls } from '../components/Seo'
import LegalShell, { LEGAL_STYLES as S } from '../components/LegalShell'
import { DEFAULT_LANG, cookiesPath, isLang, normalizeLang, privacyPath, type Lang } from '../lib/lang'

export { privacyPath }

const LAST_UPDATE = '1 de gener de 2026'

function Responsable({ lang }: { lang: Lang }) {
  if (lang === 'ca') {
    return (
      <p style={S.p}>
        <strong style={S.strong}>Titular:</strong> FERLO SL<br />
        <strong style={S.strong}>NIF:</strong> [PENDENT D'INTRODUIR]<br />
        <strong style={S.strong}>Activitat:</strong> Construcció, reformes integrals, cuines, banys i obra nova.<br />
        <strong style={S.strong}>Adreça:</strong> Carrer Ramon Llull, 1 – P. 3 Pta. 2, 08490 Tordera (Barcelona)<br />
        <strong style={S.strong}>Telèfon:</strong> 692 586 863<br />
        <strong style={S.strong}>Correu electrònic:</strong> info@ferlo.es<br />
        <strong style={S.strong}>Lloc web:</strong> https://ferlo.es
      </p>
    )
  }
  return (
    <p style={S.p}>
      <strong style={S.strong}>Titular:</strong> FERLO SL<br />
      <strong style={S.strong}>NIF:</strong> [PENDIENTE DE INTRODUCIR]<br />
      <strong style={S.strong}>Actividad:</strong> Construcción, reformas integrales, cocinas, baños y obra nueva.<br />
      <strong style={S.strong}>Dirección:</strong> Calle Ramon Llull, 1 – P. 3 Pta. 2, 08490 Tordera (Barcelona)<br />
      <strong style={S.strong}>Teléfono:</strong> 692 586 863<br />
      <strong style={S.strong}>Correo electrónico:</strong> info@ferlo.es<br />
      <strong style={S.strong}>Sitio web:</strong> https://ferlo.es
    </p>
  )
}

function CatalanContent() {
  return (
    <>
      <h1 style={S.h1}>Política de privacitat</h1>
      <p style={S.updated}>Última actualització: {LAST_UPDATE}</p>

      <p style={S.p}>
        A FERLO SL ens prenem seriosament la protecció de les teves dades personals. Aquesta política explica quines
        dades recollim, per a què les fem servir, sobre quina base legal ho fem i quins drets tens com a persona
        usuària, d'acord amb el Reglament (UE) 2016/679 (RGPD) i la Llei Orgànica 3/2018 (LOPDGDD).
      </p>

      <h2 style={S.h2}>1. Responsable del tractament</h2>
      <Responsable lang="ca" />

      <h2 style={S.h2}>2. Finalitats del tractament</h2>
      <p style={S.p}>Tractem les dades personals que ens facilitis per a les finalitats següents:</p>
      <ul style={S.ul}>
        <li style={S.li}>Atendre les sol·licituds d'informació i els pressupostos que ens demanis.</li>
        <li style={S.li}>Gestionar la relació comercial derivada de la contractació d'una obra o reforma.</li>
        <li style={S.li}>Coordinar la visita tècnica, l'execució dels treballs i el servei postvenda.</li>
        <li style={S.li}>Complir les obligacions legals, comptables i fiscals que ens siguin aplicables.</li>
        <li style={S.li}>Enviar comunicacions comercials sobre els nostres serveis, només si ens ho has autoritzat.</li>
      </ul>
      <p style={S.p}>
        No elaborem perfils automatitzats amb efectes jurídics sobre tu ni prenem decisions automatitzades que et puguin
        afectar de manera significativa.
      </p>

      <h2 style={S.h2}>3. Base legal</h2>
      <ul style={S.ul}>
        <li style={S.li}>
          <strong style={S.strong}>Consentiment:</strong> quan ens escrius pel formulari de contacte, per correu
          electrònic o per WhatsApp, i quan acceptes rebre comunicacions comercials.
        </li>
        <li style={S.li}>
          <strong style={S.strong}>Execució d'un contracte:</strong> quan contractes una obra o reforma amb nosaltres.
        </li>
        <li style={S.li}>
          <strong style={S.strong}>Interès legítim:</strong> per respondre consultes prèvies i millorar els nostres
          serveis.
        </li>
        <li style={S.li}>
          <strong style={S.strong}>Obligació legal:</strong> per conservar la documentació comptable i fiscal.
        </li>
      </ul>

      <h2 style={S.h2}>4. Dades que recollim</h2>
      <p style={S.p}>
        Només recollim les dades necessàries: nom i cognoms, telèfon, correu electrònic, població on es farà l'obra,
        tipus de projecte i el missatge que ens enviïs. Si ens facilites fotos o plànols, els tractem únicament per
        elaborar el pressupost.
      </p>
      <p style={S.p}>
        No recollim dades especialment protegides (salut, ideologia, religió, etc.). Si ens les facilites
        voluntàriament, les tractarem amb el màxim de cura i només per a la finalitat per a la qual ens les has enviat.
      </p>

      <h2 style={S.h2}>5. Destinataris i encarregats del tractament</h2>
      <p style={S.p}>
        Les teves dades no es cedeixen a tercers, excepte per obligació legal o quan sigui imprescindible per executar
        l'obra. Poden accedir-hi els nostres proveïdors de serveis tecnològics (allotjament web, correu electrònic i
        analítica), que actuen com a encarregats del tractament amb contracte i garanties adequades.
      </p>
      <p style={S.p}>
        Alguns d'aquests proveïdors poden estar ubicats fora de l'Espai Econòmic Europeu. En aquest cas, la
        transferència es fa amb les garanties previstes al RGPD (clàusules contractuals tipus o decisions d'adequació).
      </p>

      <h2 style={S.h2}>6. Termini de conservació</h2>
      <p style={S.p}>
        Conservem les dades de contacte mentre duri la relació comercial o fins que en sol·licitis la supressió. Les
        dades vinculades a factures i contractes es conserven durant els terminis legals exigits per la normativa
        comptable i fiscal (amb caràcter general, sis anys).
      </p>

      <h2 style={S.h2}>7. Els teus drets</h2>
      <p style={S.p}>En qualsevol moment pots exercir els drets següents:</p>
      <ul style={S.ul}>
        <li style={S.li}><strong style={S.strong}>Accés:</strong> saber quines dades tenim sobre tu.</li>
        <li style={S.li}><strong style={S.strong}>Rectificació:</strong> corregir dades inexactes o incompletes.</li>
        <li style={S.li}><strong style={S.strong}>Supressió:</strong> demanar que eliminem les teves dades.</li>
        <li style={S.li}><strong style={S.strong}>Limitació:</strong> restringir el tractament en els supòsits legals.</li>
        <li style={S.li}><strong style={S.strong}>Portabilitat:</strong> rebre les teves dades en format estructurat.</li>
        <li style={S.li}><strong style={S.strong}>Oposició:</strong> oposar-te al tractament i a les comunicacions comercials.</li>
      </ul>
      <p style={S.p}>
        Per exercir-los, escriu-nos a <strong style={S.strong}>info@ferlo.es</strong> indicant el dret que vols
        exercir i adjuntant una còpia d'un document que acrediti la teva identitat. Et responem en el termini màxim
        d'un mes.
      </p>

      <h2 style={S.h2}>8. Reclamacions</h2>
      <p style={S.p}>
        Si consideres que no hem atès correctament els teus drets, pots presentar una reclamació davant l'Autoritat
        Catalana de Protecció de Dades o davant l'Agència Espanyola de Protecció de Dades, a través de
        https://www.aepd.es.
      </p>

      <h2 style={S.h2}>9. Menors d'edat</h2>
      <p style={S.p}>
        No tractem deliberadament dades de persones menors de 14 anys. Si ets menor, no ens enviïs dades sense el
        consentiment dels teus pares o tutors.
      </p>

      <h2 style={S.h2}>10. Seguretat de les dades</h2>
      <p style={S.p}>
        Hem implantat mesures tècniques i organitzatives adequades per protegir les teves dades personals contra
        accessos no autoritzats, pèrdues o alteracions, d'acord amb l'estat de la tècnica.
      </p>

      <h2 style={S.h2}>11. Cookies</h2>
      <p style={S.p}>
        Aquest lloc web utilitza cookies tècniques i analítiques per mesurar l'ús del lloc i millorar l'experiència.
        Pots configurar o bloquejar les cookies des del teu navegador. En cap cas no fem servir cookies per obtenir
        dades personals identificables. Trobes tota la informació a la{' '}
        <a href={cookiesPath('ca')} style={{ color: '#00326B' }}>política de cookies</a>.
      </p>

      <h2 style={S.h2}>12. Modificacions de la política</h2>
      <p style={S.p}>
        Ens reservem el dret de modificar aquesta política de privacitat per adaptar-la a canvis legals o tècnics. La
        versió vigent serà sempre la publicada en aquest lloc web.
      </p>
    </>
  )
}

function SpanishContent() {
  return (
    <>
      <h1 style={S.h1}>Política de privacidad</h1>
      <p style={S.updated}>Última actualización: {LAST_UPDATE}</p>

      <p style={S.p}>
        En FERLO SL nos tomamos muy en serio la protección de tus datos personales. Esta política explica qué datos
        recogemos, para qué los utilizamos, sobre qué base legal lo hacemos y qué derechos tienes como persona usuaria,
        de acuerdo con el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD).
      </p>

      <h2 style={S.h2}>1. Responsable del tratamiento</h2>
      <Responsable lang="es" />

      <h2 style={S.h2}>2. Finalidades del tratamiento</h2>
      <p style={S.p}>Tratamos los datos personales que nos facilites para las siguientes finalidades:</p>
      <ul style={S.ul}>
        <li style={S.li}>Atender las solicitudes de información y los presupuestos que nos pidas.</li>
        <li style={S.li}>Gestionar la relación comercial derivada de la contratación de una obra o reforma.</li>
        <li style={S.li}>Coordinar la visita técnica, la ejecución de los trabajos y el servicio posventa.</li>
        <li style={S.li}>Cumplir las obligaciones legales, contables y fiscales que nos sean aplicables.</li>
        <li style={S.li}>Enviar comunicaciones comerciales sobre nuestros servicios, solo si nos lo has autorizado.</li>
      </ul>
      <p style={S.p}>
        No elaboramos perfiles automatizados con efectos jurídicos sobre ti ni tomamos decisiones automatizadas que
        puedan afectarte de forma significativa.
      </p>

      <h2 style={S.h2}>3. Base legal</h2>
      <ul style={S.ul}>
        <li style={S.li}>
          <strong style={S.strong}>Consentimiento:</strong> cuando nos escribes por el formulario de contacto, por correo
          electrónico o por WhatsApp, y cuando aceptas recibir comunicaciones comerciales.
        </li>
        <li style={S.li}>
          <strong style={S.strong}>Ejecución de un contrato:</strong> cuando contratas una obra o reforma con nosotros.
        </li>
        <li style={S.li}>
          <strong style={S.strong}>Interés legítimo:</strong> para responder consultas previas y mejorar nuestros
          servicios.
        </li>
        <li style={S.li}>
          <strong style={S.strong}>Obligación legal:</strong> para conservar la documentación contable y fiscal.
        </li>
      </ul>

      <h2 style={S.h2}>4. Datos que recogemos</h2>
      <p style={S.p}>
        Solo recogemos los datos necesarios: nombre y apellidos, teléfono, correo electrónico, población donde se hará la
        obra, tipo de proyecto y el mensaje que nos envíes. Si nos facilitas fotos o planos, los tratamos únicamente
        para elaborar el presupuesto.
      </p>
      <p style={S.p}>
        No recogemos datos especialmente protegidos (salud, ideología, religión, etc.). Si nos los facilitas
        voluntariamente, los trataremos con el máximo cuidado y solo para la finalidad para la que nos los has enviado.
      </p>

      <h2 style={S.h2}>5. Destinatarios y encargados del tratamiento</h2>
      <p style={S.p}>
        Tus datos no se ceden a terceros, salvo por obligación legal o cuando sea imprescindible para ejecutar la obra.
        Pueden acceder a ellos nuestros proveedores de servicios tecnológicos (alojamiento web, correo electrónico y
        analítica), que actúan como encargados del tratamiento con contrato y garantías adecuadas.
      </p>
      <p style={S.p}>
        Algunos de estos proveedores pueden estar ubicados fuera del Espacio Económico Europeo. En ese caso, la
        transferencia se realiza con las garantías previstas en el RGPD (cláusulas contractuales tipo o decisiones de
        adecuación).
      </p>

      <h2 style={S.h2}>6. Plazo de conservación</h2>
      <p style={S.p}>
        Conservamos los datos de contacto mientras dure la relación comercial o hasta que solicites su supresión. Los
        datos vinculados a facturas y contratos se conservan durante los plazos legales exigidos por la normativa
        contable y fiscal (con carácter general, seis años).
      </p>

      <h2 style={S.h2}>7. Tus derechos</h2>
      <p style={S.p}>En cualquier momento puedes ejercer los siguientes derechos:</p>
      <ul style={S.ul}>
        <li style={S.li}><strong style={S.strong}>Acceso:</strong> saber qué datos tenemos sobre ti.</li>
        <li style={S.li}><strong style={S.strong}>Rectificación:</strong> corregir datos inexactos o incompletos.</li>
        <li style={S.li}><strong style={S.strong}>Supresión:</strong> pedir que eliminemos tus datos.</li>
        <li style={S.li}><strong style={S.strong}>Limitación:</strong> restringir el tratamiento en los supuestos legales.</li>
        <li style={S.li}><strong style={S.strong}>Portabilidad:</strong> recibir tus datos en formato estructurado.</li>
        <li style={S.li}><strong style={S.strong}>Oposición:</strong> oponerte al tratamiento y a las comunicaciones comerciales.</li>
      </ul>
      <p style={S.p}>
        Para ejercerlos, escríbenos a <strong style={S.strong}>info@ferlo.es</strong> indicando el derecho que deseas
        ejercer y adjuntando una copia de un documento que acredite tu identidad. Te respondemos en el plazo máximo de un
        mes.
      </p>

      <h2 style={S.h2}>8. Reclamaciones</h2>
      <p style={S.p}>
        Si consideras que no hemos atendido correctamente tus derechos, puedes presentar una reclamación ante la Agencia
        Española de Protección de Datos, a través de https://www.aepd.es.
      </p>

      <h2 style={S.h2}>9. Menores de edad</h2>
      <p style={S.p}>
        No tratamos deliberadamente datos de personas menores de 14 años. Si eres menor, no nos envíes datos sin el
        consentimiento de tus padres o tutores.
      </p>

      <h2 style={S.h2}>10. Seguridad de los datos</h2>
      <p style={S.p}>
        Hemos implantado medidas técnicas y organizativas adecuadas para proteger tus datos personales contra accesos no
        autorizados, pérdidas o alteraciones, de acuerdo con el estado de la técnica.
      </p>

      <h2 style={S.h2}>11. Cookies</h2>
      <p style={S.p}>
        Este sitio web utiliza cookies técnicas y analíticas para medir el uso del sitio y mejorar la experiencia. Puedes
        configurar o bloquear las cookies desde tu navegador. En ningún caso utilizamos cookies para obtener datos
        personales identificables. Encuentras toda la información en la{' '}
        <a href={cookiesPath('es')} style={{ color: '#00326B' }}>política de cookies</a>.
      </p>

      <h2 style={S.h2}>12. Modificaciones de la política</h2>
      <p style={S.p}>
        Nos reservamos el derecho de modificar esta política de privacidad para adaptarla a cambios legales o técnicos.
        La versión vigente será siempre la publicada en este sitio web.
      </p>
    </>
  )
}

export default function PrivacyPolicy() {
  const { i18n } = useTranslation()
  const { lang: langParam } = useParams<{ lang?: string }>()
  const navigate = useNavigate()

  const currentLang: Lang = isLang(langParam) ? langParam : normalizeLang(i18n.language)

  const changeLanguage = (value: string) => {
    const next = normalizeLang(value)
    i18n.changeLanguage(next)
    localStorage.setItem('i18nextLng', next)
    navigate(privacyPath(next), { replace: false })
  }

  const canonical = privacyPath(isLang(langParam) ? langParam : DEFAULT_LANG)
  const isCa = currentLang === 'ca'

  const title = isCa
    ? 'Política de Privacitat | FERLO SL Tordera'
    : 'Política de Privacidad | FERLO SL Tordera'
  const description = isCa
    ? 'Política de privacitat de FERLO SL. Protecció de dades, RGPD i drets de les persones usuàries.'
    : 'Política de privacidad de FERLO SL. Protección de datos, RGPD y derechos de los usuarios.'

  return (
    <>
      <Seo lang={currentLang} path={canonical} title={title} description={description} alternates={hreflangUrls(canonical)} />
      <LegalShell currentLang={currentLang} onLanguageChange={changeLanguage}>
        {isCa ? <CatalanContent /> : <SpanishContent />}
      </LegalShell>
    </>
  )
}
