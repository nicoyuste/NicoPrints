import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { ArrowRight, Check, ExternalLink, Instagram, Languages, Menu, MessageCircle, PackageCheck, PenTool, Printer, ShoppingBag, Sparkles, X } from 'lucide-react'
import { AnimatePresence, motion as Motion } from 'framer-motion'
import { content, products, productBySlug, siteLinks } from './content'

const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

function localizedPath(lang, path = '') {
  const normalized = path.replace(/^\//, '')
  return lang === 'en' ? `/en${normalized ? `/${normalized}` : ''}` : `/${normalized}`
}

function ScrollToHash() {
  const { hash, pathname } = useLocation()

  useEffect(() => {
    if (!hash) return
    const sectionId = decodeURIComponent(hash.slice(1))
    requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView()
    })
  }, [hash, pathname])

  return null
}

function HashLink({ to, onClick, children, ...props }) {
  const sectionId = to.split('#')[1]
  const handleClick = (event) => {
    onClick?.(event)
    requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView()
    })
  }

  return <Link to={to} onClick={handleClick} {...props}>{children}</Link>
}

function BuySheet({ open, onClose, lang }) {
  const sheetRef = useRef(null)
  const copy = content[lang].buySheet
  const whatsappMessage = content[lang].whatsappMessage
  const whatsappUrl = `https://wa.me/${siteLinks.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab' || !sheetRef.current) return
      const focusable = [...sheetRef.current.querySelectorAll('button, a[href]')]
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => sheetRef.current?.querySelector('a[href]')?.focus())
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <Motion.div className="sheet-layer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button className="sheet-backdrop" onClick={onClose} aria-label={copy.close} />
          <Motion.section
            ref={sheetRef}
            className="buy-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="buy-sheet-title"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="sheet-handle" />
            <button className="icon-button sheet-close" onClick={onClose} aria-label={copy.close}><X size={20} /></button>
            <p className="eyebrow">{copy.eyebrow}</p>
            <h2 id="buy-sheet-title">{copy.title}</h2>
            <p className="sheet-intro">{copy.intro}</p>
            <div className="buy-options">
              <a href={siteLinks.wallapop} target="_blank" rel="noreferrer" className="buy-option">
                <span className="option-icon wallapop-icon"><ShoppingBag /></span>
                <span><strong>Wallapop</strong><small>{copy.wallapop}</small></span>
                <ExternalLink size={18} />
              </a>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="buy-option">
                <span className="option-icon whatsapp-icon"><MessageCircle /></span>
                <span><strong>WhatsApp</strong><small>{copy.whatsapp}</small></span>
                <ExternalLink size={18} />
              </a>
            </div>
          </Motion.section>
        </Motion.div>
      )}
    </AnimatePresence>
  )
}

function LanguageLink({ lang }) {
  const location = useLocation()
  const targetLang = lang === 'es' ? 'en' : 'es'
  let path = targetLang === 'en' ? '/en' : '/'
  if (lang === 'es' && location.pathname.startsWith('/productos/')) {
    path = `/en/products/${location.pathname.slice('/productos/'.length)}`
  } else if (lang === 'en' && location.pathname.startsWith('/en/products/')) {
    path = `/productos/${location.pathname.slice('/en/products/'.length)}`
  }
  return <Link className="language-link" to={path}><Languages size={17} />{targetLang.toUpperCase()}</Link>
}

function Header({ lang, onBuy }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const nav = content[lang].nav
  const home = localizedPath(lang)

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to={home} className="brand" aria-label="Capia 3D"><img src={asset('capia.svg')} alt="Capia 3D" /></Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          <HashLink to={`${home}#work`}>{nav.work}</HashLink>
          <HashLink to={`${home}#process`}>{nav.process}</HashLink>
          <HashLink to={`${home}#about`}>{nav.about}</HashLink>
          <a href={siteLinks.instagram} target="_blank" rel="noreferrer">Instagram</a>
        </nav>
        <div className="header-actions">
          <LanguageLink lang={lang} />
          <button className="button button-primary header-buy" onClick={onBuy}>{nav.buy}</button>
          <button className="icon-button menu-button" onClick={() => setMenuOpen(true)} aria-label={nav.menu}><Menu /></button>
        </div>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <Motion.div className="mobile-menu" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <button className="icon-button mobile-close" onClick={() => setMenuOpen(false)} aria-label={nav.close}><X /></button>
            <HashLink to={`${home}#work`} onClick={() => setMenuOpen(false)}>{nav.work}</HashLink>
            <HashLink to={`${home}#process`} onClick={() => setMenuOpen(false)}>{nav.process}</HashLink>
            <HashLink to={`${home}#about`} onClick={() => setMenuOpen(false)}>{nav.about}</HashLink>
            <a href={siteLinks.instagram} target="_blank" rel="noreferrer">Instagram</a>
            <button className="button button-primary" onClick={() => { setMenuOpen(false); onBuy() }}>{nav.buy}</button>
          </Motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function Layout({ lang, children }) {
  const [buyOpen, setBuyOpen] = useState(false)
  const footer = content[lang].footer
  return (
    <div className="site-shell">
      <Header lang={lang} onBuy={() => setBuyOpen(true)} />
      <main>{typeof children === 'function' ? children(() => setBuyOpen(true)) : children}</main>
      <footer className="site-footer">
        <div><img src={asset('capia.svg')} alt="Capia 3D" /><p>{footer.tagline}</p></div>
        <div className="footer-links">
          <a href={siteLinks.instagram} target="_blank" rel="noreferrer">Instagram</a>
          <a href={siteLinks.wallapop} target="_blank" rel="noreferrer">Wallapop</a>
          <a href={`mailto:${siteLinks.email}`}>{footer.contact}</a>
        </div>
        <p className="copyright">© {new Date().getFullYear()} Capia 3D</p>
      </footer>
      <BuySheet open={buyOpen} onClose={() => setBuyOpen(false)} lang={lang} />
    </div>
  )
}

function ProductCard({ product, lang }) {
  const item = product[lang]
  return (
    <Link className="work-card" to={localizedPath(lang, `${lang === 'en' ? 'products' : 'productos'}/${product.slug}`)}>
      <div className="work-image"><img src={asset(product.cover)} alt={item.title} /></div>
      <div className="work-meta"><div><p className="eyebrow">{item.kicker}</p><h3>{item.title}</h3><p>{item.short}</p></div><ArrowRight /></div>
    </Link>
  )
}

function InstagramFeed({ lang }) {
  const [posts, setPosts] = useState([])
  const copy = content[lang].instagram

  useEffect(() => {
    let active = true
    fetch(asset('data/instagram.json'))
      .then((response) => response.ok ? response.json() : [])
      .then((data) => active && setPosts(Array.isArray(data) ? data.slice(0, 6) : []))
      .catch(() => {})
    return () => { active = false }
  }, [])

  const fallback = products.flatMap((product) => product.gallery.slice(0, 3).map((image, index) => ({
    id: `${product.slug}-${index}`,
    image: asset(image),
    permalink: siteLinks.instagram,
    caption: product[lang].title,
  }))).slice(0, 6)
  const items = posts.length ? posts : fallback

  return (
    <section className="section instagram-section">
      <div className="section-heading split-heading"><div><p className="eyebrow">Instagram</p><h2>{copy.title}</h2></div><a className="text-link" href={siteLinks.instagram} target="_blank" rel="noreferrer">{copy.link}<ArrowRight /></a></div>
      <div className="instagram-grid">
        {items.map((post) => <a key={post.id} href={post.permalink || siteLinks.instagram} target="_blank" rel="noreferrer"><img src={post.image || post.media_url} alt={post.caption || copy.alt} loading="lazy" /><span><Instagram size={18} /></span></a>)}
      </div>
    </section>
  )
}

function HomePage({ lang }) {
  const copy = content[lang]
  useEffect(() => {
    document.documentElement.lang = lang
    document.title = lang === 'es' ? 'Capia 3D — Objetos personalizados' : 'Capia 3D — Custom objects'
  }, [lang])
  return (
    <Layout lang={lang}>{(openBuy) => <>
      <section className="hero section">
        <Motion.div className="hero-copy" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="eyebrow"><Sparkles size={15} /> {copy.hero.eyebrow}</p>
          <h1>{copy.hero.title}</h1>
          <p className="hero-intro">{copy.hero.intro}</p>
          <div className="hero-actions"><button className="button button-primary" onClick={openBuy}>{copy.nav.buy}<ArrowRight size={18} /></button><a className="button button-secondary" href={siteLinks.instagram} target="_blank" rel="noreferrer"><Instagram size={18} /> Instagram</a></div>
        </Motion.div>
        <Motion.div className="hero-visual" initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .1 }}>
          <img src={asset('products/deck-box-v2-simple/deck-box-v2-simple_other_4.png')} alt={copy.hero.imageAlt} />
          <div className="hero-note"><span>{copy.hero.noteLabel}</span><strong>{copy.hero.note}</strong></div>
        </Motion.div>
      </section>

      <section id="work" className="section work-section">
        <div className="section-heading"><p className="eyebrow">{copy.work.eyebrow}</p><h2>{copy.work.title}</h2><p>{copy.work.intro}</p></div>
        <div className="work-grid">{products.map((product) => <ProductCard key={product.slug} product={product} lang={lang} />)}</div>
      </section>

      <section className="custom-banner section-narrow">
        <p className="eyebrow">{copy.custom.eyebrow}</p><h2>{copy.custom.title}</h2><p>{copy.custom.body}</p><button className="text-link light" onClick={openBuy}>{copy.custom.link}<ArrowRight /></button>
      </section>

      <section id="process" className="section process-section">
        <div className="section-heading"><p className="eyebrow">{copy.process.eyebrow}</p><h2>{copy.process.title}</h2></div>
        <div className="steps">{[MessageCircle, PenTool, Printer, PackageCheck].map((Icon, index) => <div className="step" key={copy.process.steps[index].title}><span><Icon /></span><small>0{index + 1}</small><h3>{copy.process.steps[index].title}</h3><p>{copy.process.steps[index].body}</p></div>)}</div>
      </section>

      <InstagramFeed lang={lang} />

      <section id="about" className="section about-section">
        <div className="about-image"><img src={asset('capia_logo.jpg')} alt="Capia 3D" /></div>
        <div className="about-copy"><p className="eyebrow">{copy.about.eyebrow}</p><h2>{copy.about.title}</h2>{copy.about.paragraphs.map((p) => <p key={p}>{p}</p>)}<a className="text-link" href={siteLinks.instagram} target="_blank" rel="noreferrer">{copy.about.link}<ArrowRight /></a></div>
      </section>

      <section className="final-cta section-narrow"><p className="eyebrow">{copy.final.eyebrow}</p><h2>{copy.final.title}</h2><p>{copy.final.body}</p><button className="button button-light" onClick={openBuy}>{copy.nav.buy}<ArrowRight /></button></section>
    </>}</Layout>
  )
}

function ProductPage({ lang }) {
  const { slug } = useParams()
  const product = productBySlug.get(slug)
  const copy = content[lang]
  const item = product?.[lang]
  const related = useMemo(() => product ? product.related.map((relatedSlug) => productBySlug.get(relatedSlug)).filter(Boolean) : [], [product])

  useEffect(() => {
    window.scrollTo({ top: 0 })
    document.documentElement.lang = lang
    if (item) document.title = `${item.title} — Capia 3D`
  }, [slug, lang, item])
  if (!product) return <Navigate to={localizedPath(lang)} replace />

  return <Layout lang={lang}>{(openBuy) => <>
    <article className="product-page">
      <section className="product-hero section">
        <div className="product-title"><HashLink className="back-link" to={`${localizedPath(lang)}#work`}>← {copy.product.back}</HashLink><p className="eyebrow">{item.kicker}</p><h1>{item.title}</h1><p>{item.intro}</p><button className="button button-primary" onClick={openBuy}>{copy.nav.buy}<ArrowRight /></button></div>
        <div className="product-cover"><img src={asset(product.cover)} alt={item.title} /></div>
      </section>
      <section className="product-story section">
        <div><p className="eyebrow">{copy.product.what}</p><h2>{item.whatTitle}</h2></div><div className="rich-copy">{item.what.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      </section>
      <section className="use-section section"><div className="section-heading"><p className="eyebrow">{copy.product.uses}</p><h2>{item.usesTitle}</h2></div><div className="use-grid">{item.uses.map((use) => <div key={use.title}><span><Check /></span><h3>{use.title}</h3><p>{use.body}</p></div>)}</div></section>
      <section className="examples-section section"><div className="section-heading"><p className="eyebrow">{copy.product.examples}</p><h2>{item.examplesTitle}</h2><p>{item.examplesIntro}</p></div><div className="example-grid">{product.gallery.map((image, index) => <img key={image} src={asset(image)} alt={`${item.title} — ${copy.product.example} ${index + 1}`} loading="lazy" />)}</div></section>
      <section className="personalization section-narrow"><p className="eyebrow">{copy.product.personalized}</p><h2>{item.personalizationTitle}</h2><p>{item.personalization}</p><button className="button button-light" onClick={openBuy}>{copy.nav.buy}<ArrowRight /></button></section>
      <section className="related-section section"><div className="section-heading split-heading"><div><p className="eyebrow">{copy.product.related}</p><h2>{copy.product.relatedTitle}</h2></div></div><div className="work-grid related-grid">{related.map((relatedProduct) => <ProductCard key={relatedProduct.slug} product={relatedProduct} lang={lang} />)}</div></section>
    </article>
  </>}</Layout>
}

export default function App() {
  return <>
    <ScrollToHash />
    <Routes>
      <Route path="/" element={<HomePage lang="es" />} />
      <Route path="/en" element={<HomePage lang="en" />} />
      <Route path="/productos/:slug" element={<ProductPage lang="es" />} />
      <Route path="/en/products/:slug" element={<ProductPage lang="en" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </>
}
