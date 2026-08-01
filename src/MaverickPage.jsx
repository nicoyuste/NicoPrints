import { useEffect } from 'react'
import {
  ArrowDown,
  ArrowRight,
  Banknote,
  Check,
  ChevronRight,
  CircleDollarSign,
  Crown,
  ExternalLink,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  Target,
  Trophy,
  Users,
  Zap,
} from 'lucide-react'
import './maverick.css'

const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

const whatsappGroup = 'https://chat.whatsapp.com/Dea64L80s38FjJO6WPL2Ns?s=qt&p=i&ilr=4'

const stats = [
  { value: '19', label: 'jornadas por vuelta' },
  { value: '20 €', label: 'entrada por vuelta' },
  { value: '100%', label: 'destinado a premios' },
]

const economy = [
  { icon: <Banknote />, amount: '500.000 €', title: 'Por jornada', text: 'Todos los jugadores reciben esta cantidad al terminar cada jornada.' },
  { icon: <Target />, amount: '30.000 €', title: 'Por punto Fantasy', text: 'Si haces 60 puntos, ingresas 1.800.000 € para reforzar tu equipo.' },
  { icon: <Zap />, amount: '100.000 €', title: 'Por jugador en el Peor XI', text: 'Una pequeña compensación por cada jugador incluido en el Peor XI de Biwenger.' },
]

function SectionTitle({ eyebrow, children, intro }) {
  return (
    <div className="ml-section-title">
      <p className="ml-eyebrow">{eyebrow}</p>
      <h2>{children}</h2>
      {intro && <p>{intro}</p>}
    </div>
  )
}

export default function MaverickPage() {
  useEffect(() => {
    const previousTitle = document.title
    const previousLang = document.documentElement.lang
    const description = document.querySelector('meta[name="description"]')
    const previousDescription = description?.content
    const robots = document.querySelector('meta[name="robots"]')
    const createdRobots = !robots
    const robotsMeta = robots || document.createElement('meta')
    const previousRobots = robotsMeta.content

    document.title = 'Maverick League — Fantasy LaLiga en Biwenger'
    document.documentElement.lang = 'es'
    if (description) description.content = 'Liga Fantasy privada de LaLiga en Biwenger: 19 jornadas, clausulazos, premios y reset.'
    robotsMeta.name = 'robots'
    robotsMeta.content = 'noindex, nofollow'
    if (createdRobots) document.head.appendChild(robotsMeta)

    return () => {
      document.title = previousTitle
      document.documentElement.lang = previousLang
      if (description && previousDescription) description.content = previousDescription
      if (createdRobots) robotsMeta.remove()
      else robotsMeta.content = previousRobots
    }
  }, [])

  return (
    <div className="ml-page">
      <header className="ml-header">
        <a className="ml-brand" href="#inicio" aria-label="Maverick League, volver al inicio">
          <img src={asset('maverick/logo.jpg')} alt="" />
          <span>Maverick League</span>
        </a>
        <a className="ml-header-cta" href="#participar">Quiero jugar <ChevronRight size={17} /></a>
      </header>

      <main>
        <section className="ml-hero" id="inicio">
          <img className="ml-hero-image" src={asset('maverick/portada.jpg')} alt="Balón de fútbol con sombrero Maverick en un estadio iluminado" />
          <div className="ml-hero-shade" />
          <div className="ml-hero-content">
            <p className="ml-kicker"><span /> Fantasy LaLiga · Biwenger Ultra</p>
            <img className="ml-hero-logo" src={asset('maverick/logo.jpg')} alt="Maverick League" />
            <h1>Maverick League</h1>
            <p className="ml-hero-line">19 jornadas. 20 €. Clausulazos. Premios. Reset. <strong>Y volvemos a empezar.</strong></p>
            <div className="ml-hero-actions">
              <a className="ml-button ml-button-gold" href="#participar">Quiero jugar <ArrowRight size={19} /></a>
              <a className="ml-button ml-button-ghost" href="#formato">Cómo funciona <ArrowDown size={19} /></a>
            </div>
          </div>
          <p className="ml-powered">Powered by <strong>Capia 3D</strong></p>
        </section>

        <div className="ml-stats" aria-label="Datos principales de la liga">
          {stats.map((stat) => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}
        </div>

        <section className="ml-section ml-intro">
          <div>
            <p className="ml-eyebrow">Aquí se viene a competir</p>
            <h2>Una liga Fantasy que no se acaba en octubre.</h2>
          </div>
          <div className="ml-intro-copy">
            <p>Maverick League es una competición privada de Fantasy LaLiga jugada en Biwenger. Mercado agresivo, decisiones de verdad y dos oportunidades para ganar.</p>
            <p>La temporada se divide en dos campeonatos independientes. Si una vuelta se tuerce, no pasas meses mirando cómo gana otro: cobramos premios, reiniciamos todo y vuelve a empezar la pelea.</p>
          </div>
        </section>

        <section className="ml-section" id="formato">
          <SectionTitle eyebrow="Dos campeonatos, dos oportunidades" intro="Cada vuelta tiene su propia competición, entrada, clasificación y premios. Puedes jugar una o apuntarte a las dos.">La temporada, partida por la mitad.</SectionTitle>
          <div className="ml-rounds">
            <article className="ml-round-card">
              <span className="ml-round-number">01</span>
              <p className="ml-card-label">Primera vuelta</p>
              <h3>Jornadas 1–19</h3>
              <ul>
                <li><Check size={18} /> Entrada de 20 €</li>
                <li><Check size={18} /> Clasificación y premios propios</li>
                <li><Check size={18} /> Reset total al terminar</li>
              </ul>
            </article>
            <div className="ml-reset"><RefreshCw /><span>Reset total</span></div>
            <article className="ml-round-card ml-round-card-gold">
              <span className="ml-round-number">02</span>
              <p className="ml-card-label">Segunda vuelta</p>
              <h3>Jornadas 20–38</h3>
              <ul>
                <li><Check size={18} /> Nueva entrada de 20 €</li>
                <li><Check size={18} /> Equipos y dinero desde cero</li>
                <li><Check size={18} /> Nueva oportunidad de ganar</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="ml-prizes">
          <div className="ml-section ml-prizes-inner">
            <SectionTitle eyebrow="El bote se queda en el campo" intro="El 100% de las inscripciones se reparte en cada vuelta. Con 10 participantes, el bote sería de 200 €.">Tres puestos. Todo en premios.</SectionTitle>
            <div className="ml-podium">
              <article className="ml-podium-card ml-second"><span>2º</span><Trophy /><strong>30%</strong><small>60 € con 10 jugadores</small></article>
              <article className="ml-podium-card ml-first"><Crown /><span>1º</span><strong>50%</strong><small>100 € con 10 jugadores</small></article>
              <article className="ml-podium-card ml-third"><span>3º</span><Trophy /><strong>20%</strong><small>40 € con 10 jugadores</small></article>
            </div>
            <p className="ml-prize-note"><ShieldCheck size={20} /> Biwenger Ultra lo paga Capia 3D aparte. No se descuenta ni un euro del bote.</p>
          </div>
        </section>

        <section className="ml-join" id="participar">
          <div className="ml-join-copy">
            <p className="ml-eyebrow">Entra en la liga</p>
            <h2>Dos pasos. Ya estás dentro de la pelea.</h2>
            <p>La entrada es de <strong>20 € por cada vuelta</strong> que quieras disputar.</p>
          </div>
          <div className="ml-join-steps">
            <article>
              <span className="ml-step-number">1</span>
              <div>
                <p className="ml-card-label">Haz el Bizum</p>
                <h3>20 € al <a href="tel:+34679042365">679 042 365</a></h3>
                <p>Corresponde a la inscripción de una vuelta.</p>
              </div>
              <CircleDollarSign aria-hidden="true" />
            </article>
            <article>
              <span className="ml-step-number">2</span>
              <div>
                <p className="ml-card-label">Pide acceso al grupo</p>
                <h3>Únete en WhatsApp</h3>
                <p>Entra al grupo para coordinar tu participación.</p>
              </div>
              <MessageCircle aria-hidden="true" />
            </article>
          </div>
          <a className="ml-button ml-button-whatsapp" href={whatsappGroup} target="_blank" rel="noreferrer">Solicitar acceso al grupo <ExternalLink size={18} /></a>
        </section>

        <section className="ml-sponsor">
          <div className="ml-sponsor-logo"><img src={asset('maverick/capia3d-logo.png')} alt="Capia 3D" /></div>
          <div><p className="ml-eyebrow">Patrocinador oficial</p><h2>Más fútbol. Cero anuncios.</h2><p>Capia 3D cubre íntegramente Biwenger Ultra para que todos disfruten de sus funciones y jueguen sin publicidad. Ese coste va por nuestra cuenta: el 100% de las inscripciones sigue destinado a premios.</p></div>
        </section>

        <section className="ml-section">
          <SectionTitle eyebrow="Una economía con pólvora" intro="No regalamos puntos. Damos recursos para que puedas reconstruir, atacar el mercado y volver a competir.">Dinero para moverse. Motivos para no rendirse.</SectionTitle>
          <div className="ml-economy-grid">
            {economy.map(({ icon, amount, title, text }) => (
              <article key={title}>{icon}<strong>{amount}</strong><h3>{title}</h3><p>{text}</p></article>
            ))}
          </div>
          <div className="ml-comeback">
            <div className="ml-comeback-copy"><Users /><div><p className="ml-card-label">Ayuda según la clasificación general</p><h3>Cuanto más abajo, más munición para remontar.</h3><p>Estas ayudas se calculan después de cada jornada según la clasificación global, no por el resultado de esa jornada.</p></div></div>
            <div className="ml-comeback-values">
              <div><span>3º por la cola</span><strong>+1 M €</strong></div>
              <div><span>2º por la cola</span><strong>+2 M €</strong></div>
              <div><span>Último</span><strong>+3 M €</strong></div>
            </div>
          </div>
        </section>

        <section className="ml-section ml-clauses">
          <div className="ml-clauses-visual"><span>CLÁUSULA</span><strong>¡PAGADA!</strong><Zap /></div>
          <div className="ml-clauses-copy">
            <p className="ml-eyebrow">Clausulazos activados</p>
            <h2>Aquí, tu estrella nunca está del todo a salvo.</h2>
            <p>Puedes fichar a un jugador de otro participante pagando su cláusula, sin necesitar su aprobación. Decide si gastas, ahorras, blindas a los tuyos o atacas la plantilla rival.</p>
            <div className="ml-rule"><ShieldCheck /><p><strong>Regla clave:</strong> un jugador adquirido mediante clausulazo debe permanecer en su nuevo equipo durante al menos una jornada completa.</p></div>
          </div>
        </section>

        <section className="ml-section ml-details">
          <SectionTitle eyebrow="Lo esencial, sin letra pequeña">Las reglas que definen Maverick.</SectionTitle>
          <div className="ml-details-grid">
            <article><span>01</span><h3>Competición hasta el final</h3><p>Dos vueltas independientes mantienen cada jornada viva y abren una nueva oportunidad a mitad de temporada.</p></article>
            <article><span>02</span><h3>Mercado con interacción</h3><p>Compras, ahorro, cláusulas y ataques a rivales convierten cada decisión financiera en estrategia.</p></article>
            <article><span>03</span><h3>Remontadas, no regalos</h3><p>Los últimos reciben más dinero, nunca puntos artificiales. Para remontar todavía hay que fichar bien.</p></article>
            <article><span>04</span><h3>Configuración en preparación</h3><p>Los detalles finales de plantilla, mercado, protección y puntuación se comunicarán antes de empezar.</p></article>
          </div>
        </section>

        <section className="ml-final">
          <img src={asset('maverick/portada.jpg')} alt="" />
          <div className="ml-final-shade" />
          <div className="ml-final-content">
            <p className="ml-eyebrow">¿Tienes lo que hace falta?</p>
            <h2>Diecinueve jornadas.<br />Una sola misión.</h2>
            <p>Prepara tu plantilla. Protege a tus estrellas. Elige bien cuándo desenfundar.</p>
            <a className="ml-button ml-button-gold" href="#participar">Quiero jugar <ArrowRight size={19} /></a>
          </div>
        </section>
      </main>

      <footer className="ml-footer"><img src={asset('maverick/logo.jpg')} alt="Maverick League" /><p>Maverick League · Fantasy LaLiga en Biwenger</p><span>Powered by Capia 3D</span></footer>
    </div>
  )
}
