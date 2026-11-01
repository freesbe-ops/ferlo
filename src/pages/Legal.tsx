import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import Seo, { hreflangUrls } from '../components/Seo'
import LegalShell, { LEGAL_STYLES as S } from '../components/LegalShell'
import { DEFAULT_LANG, isLang, legalPath, normalizeLang, privacyPath, type Lang } from '../lib/lang'

function CatalanContent() {
  return (
    <>
      <h1 style={S.h1}>Avís legal</h1>
      <p style={S.updated}>Última actualització: 1 de gener de 2026</p>

      <h2 style={S.h2}>1. Dades identificatives del titular</h2>
      <p style={S.p}>
        En compliment de l'article 10 de la Llei 34/2002, d'11 de juliol, de serveis de la societat de la informació i
        de comerç electrònic (LSSI-CE), s'informa que aquest lloc web és titularitat de:<br />
        <strong style={S.strong}>Denominació social:</strong> FERLO SL<br />
        <strong style={S.strong}>NIF:</strong> [PENDENT D'INTRODUIR]<br />
        <strong style={S.strong}>Domicili social:</strong> Carrer Ramon Llull, 1 – P. 3 Pta. 2, 08490 Tordera (Barcelona)<br />
        <strong style={S.strong}>Telèfon:</strong> 692 586 863<br />
        <strong style={S.strong}>Correu electrònic:</strong> info@ferlo.es<br />
        <strong style={S.strong}>Activitat:</strong> construcció, reformes integrals, cuines, banys i obra nova.
      </p>

      <h2 style={S.h2}>2. Objecte</h2>
      <p style={S.p}>
        Aquest lloc web té com a finalitat informar sobre els serveis de construcció i reforma que ofereix FERLO SL i
        facilitar el contacte amb persones interessades. L'accés al lloc és gratuït i no requereix registre previ.
      </p>

      <h2 style={S.h2}>3. Condicions d'ús</h2>
      <p style={S.p}>
        La persona usuària es compromet a fer un ús adequat dels continguts i a no emprar-los per a activitats
        il·lícites, contràries a la bona fe o que puguin perjudicar drets de tercers. Queda prohibida qualsevol
        utilització que alteri, inutilitzi o sobrecarregui el funcionament del lloc web.
      </p>

      <h2 style={S.h2}>4. Propietat intel·lectual i industrial</h2>
      <p style={S.p}>
        Els textos, fotografies, dissenys, codi font, marques i logotips d'aquest lloc web són propietat de FERLO SL o
        se'n té llicència d'ús. No se'n permet la reproducció, distribució ni transformació sense autorització escrita.
      </p>

      <h2 style={S.h2}>5. Exempció de responsabilitat</h2>
      <p style={S.p}>
        La informació publicada té caràcter orientatiu. Els pressupostos, terminis i preus concrets es determinen sempre
        mitjançant una proposta escrita i personalitzada. FERLO SL no es responsabilitza dels danys derivats de l'ús de
        la informació continguda en aquest lloc web ni d'eventuals interrupcions del servei.
      </p>
      <p style={S.p}>
        Els enllaços a webs de tercers es faciliten només a títol informatiu; FERLO SL no controla ni assumeix
        responsabilitat sobre els seus continguts.
      </p>

      <h2 style={S.h2}>6. Protecció de dades</h2>
      <p style={S.p}>
        El tractament de dades personals es regeix per la nostra{' '}
        <a href={privacyPath('ca')} style={{ color: '#00326B' }}>política de privacitat</a>.
      </p>

      <h2 style={S.h2}>7. Legislació aplicable i jurisdicció</h2>
      <p style={S.p}>
        Aquest avís legal es regeix per la legislació espanyola. Per a qualsevol controvèrsia derivada de l'ús del lloc
        web, les parts se sotmeten als jutjats i tribunals del domicili de la persona consumidora o, si no en té, als de
        Barcelona.
      </p>
    </>
  )
}

function SpanishContent() {
  return (
    <>
      <h1 style={S.h1}>Aviso legal</h1>
      <p style={S.updated}>Última actualización: 1 de enero de 2026</p>

      <h2 style={S.h2}>1. Datos identificativos del titular</h2>
      <p style={S.p}>
        En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de servicios de la sociedad de la información
        y de comercio electrónico (LSSI-CE), se informa de que este sitio web es titularidad de:<br />
        <strong style={S.strong}>Denominación social:</strong> FERLO SL<br />
        <strong style={S.strong}>NIF:</strong> [PENDIENTE DE INTRODUCIR]<br />
        <strong style={S.strong}>Domicilio social:</strong> Calle Ramon Llull, 1 – P. 3 Pta. 2, 08490 Tordera (Barcelona)<br />
        <strong style={S.strong}>Teléfono:</strong> 692 586 863<br />
        <strong style={S.strong}>Correo electrónico:</strong> info@ferlo.es<br />
        <strong style={S.strong}>Actividad:</strong> construcción, reformas integrales, cocinas, baños y obra nueva.
      </p>

      <h2 style={S.h2}>2. Objeto</h2>
      <p style={S.p}>
        Este sitio web tiene como finalidad informar sobre los servicios de construcción y reforma que ofrece FERLO SL y
        facilitar el contacto con personas interesadas. El acceso al sitio es gratuito y no requiere registro previo.
      </p>

      <h2 style={S.h2}>3. Condiciones de uso</h2>
      <p style={S.p}>
        La persona usuaria se compromete a hacer un uso adecuado de los contenidos y a no emplearlos para actividades
        ilícitas, contrarias a la buena fe o que puedan perjudicar derechos de terceros. Queda prohibido cualquier uso
        que altere, inutilice o sobrecargue el funcionamiento del sitio web.
      </p>

      <h2 style={S.h2}>4. Propiedad intelectual e industrial</h2>
      <p style={S.p}>
        Los textos, fotografías, diseños, código fuente, marcas y logotipos de este sitio web son propiedad de FERLO SL o
        se cuenta con licencia de uso. No se permite su reproducción, distribución ni transformación sin autorización
        escrita.
      </p>

      <h2 style={S.h2}>5. Exención de responsabilidad</h2>
      <p style={S.p}>
        La información publicada tiene carácter orientativo. Los presupuestos, plazos y precios concretos se determinan
        siempre mediante una propuesta escrita y personalizada. FERLO SL no se responsabiliza de los daños derivados del
        uso de la información contenida en este sitio web ni de eventuales interrupciones del servicio.
      </p>
      <p style={S.p}>
        Los enlaces a webs de terceros se facilitan solo a título informativo; FERLO SL no controla ni asume
        responsabilidad sobre sus contenidos.
      </p>

      <h2 style={S.h2}>6. Protección de datos</h2>
      <p style={S.p}>
        El tratamiento de datos personales se rige por nuestra{' '}
        <a href={privacyPath('es')} style={{ color: '#00326B' }}>política de privacidad</a>.
      </p>

      <h2 style={S.h2}>7. Legislación aplicable y jurisdicción</h2>
      <p style={S.p}>
        Este aviso legal se rige por la legislación española. Para cualquier controversia derivada del uso del sitio
        web, las partes se someten a los juzgados y tribunales del domicilio de la persona consumidora o, si no lo
        tiene, a los de Barcelona.
      </p>
    </>
  )
}

export default function Legal() {
  const { i18n } = useTranslation()
  const { lang: langParam } = useParams<{ lang?: string }>()
  const navigate = useNavigate()

  const currentLang: Lang = isLang(langParam) ? langParam : normalizeLang(i18n.language)

  const changeLanguage = (value: string) => {
    const next = normalizeLang(value)
    i18n.changeLanguage(next)
    localStorage.setItem('i18nextLng', next)
    navigate(legalPath(next), { replace: false })
  }

  const canonical = legalPath(isLang(langParam) ? langParam : DEFAULT_LANG)
  const isCa = currentLang === 'ca'

  const title = isCa ? 'Avís Legal | FERLO SL Tordera' : 'Aviso Legal | FERLO SL Tordera'
  const description = isCa
    ? "Avís legal de FERLO SL: dades identificatives, condicions d'ús i propietat intel·lectual."
    : 'Aviso legal de FERLO SL: datos identificativos, condiciones de uso y propiedad intelectual.'

  return (
    <>
      <Seo lang={currentLang} path={canonical} title={title} description={description} alternates={hreflangUrls(canonical)} />
      <LegalShell currentLang={currentLang} onLanguageChange={changeLanguage}>
        {isCa ? <CatalanContent /> : <SpanishContent />}
      </LegalShell>
    </>
  )
}
