import { useEffect, useState, useRef } from 'react'
import { ShoppingCart, Trash2, Package, Mail, Menu } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// shadcn/ui
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import Taller from '@/collections/Taller'
import Magic from '@/collections/Magic'
import ProductDetail from '@/components/ProductDetail'
import PayPalIcon from '@/components/icons/PayPalIcon'
import CustomOrderForm from '@/components/CustomOrderForm'
import { CONTACT_EMAIL, PAYPAL_BUSINESS_EMAIL, SHIPPING_FEE_EUR, WHATSAPP_PHONE, WHATSAPP_DEFAULT_MESSAGE } from '@/config'
import { trackEventGA4 } from '@/lib/utils'
import useLocalStorage from '@/lib/useLocalStorage'
import { formatPrice } from '@/lib/format'
import { Badge } from '@/components/ui/badge'
import { COLORS } from '@/colors'


export default function Shop3D() {
  const [cart, setCart] = useLocalStorage('cart3d', [])
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const shipping = cart.length > 0 ? SHIPPING_FEE_EUR : 0
  const grandTotal = total + shipping
  const [checkoutStatus, setCheckoutStatus] = useState('none') // 'none' | 'success' | 'cancel'
  const [currentCollectionId, setCurrentCollectionId] = useState(null)
  const [currentProductSlug, setCurrentProductSlug] = useState(null)
  const [collectionsOpen, setCollectionsOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const collectionsMenuRef = useRef(null)

  // Microtask scheduler to avoid blocking state updates
  const scheduleMicrotask = (cb) => {
    try {
      if (typeof queueMicrotask === 'function') { queueMicrotask(cb); return }
    } catch(_) {}
    Promise.resolve().then(cb)
  }

  function addToCart(prod, arg2, material) {
    setCart(prev => {
      const productId = prod.slug || prod.id
      const primaryImg = (prod.images && prod.images.length > 0)
        ? (typeof prod.images[0] === 'string' ? prod.images[0] : (prod.images[0]?.src || null))
        : null

      // Nueva firma: onAdd(product, selections[])
      if (Array.isArray(arg2)) {
        const selections = (arg2 || []).map(s => ({
          partId: s.partId,
          partLabel: s.partLabel || s.partId,
          material: s.material || null,
          colorValue: s.colorValue || null,
          colorLabel: s.colorLabel || null,
        }))
        const serialized = selections
          .slice()
          .sort((a, b) => (a.partId || '').localeCompare(b.partId || ''))
          .map(s => `${s.partId}:${s.material || ''}:${s.colorValue || ''}`)
          .join(';')
        const lineKey = `${productId}|${serialized}`
        const idx = prev.findIndex(i => i.lineKey === lineKey)
        if (idx >= 0) { const copy = [...prev]; copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 }; return copy }
        scheduleMicrotask(() => {
          trackEventGA4('add_to_cart', {
            currency: prod.currency || 'EUR',
            value: prod.price || 0,
            items: [{
              item_id: productId,
              item_name: prod.name,
              quantity: 1,
            }]
          })
        })
        return [...prev, { id: productId, lineKey, name: prod.name, price: prod.price, currency: prod.currency, img: primaryImg, qty: 1, selections }]
      }

      // Compat: firma antigua onAdd(product, colorObj, material)
      const colorObj = arg2
      const colorValue = colorObj?.value || null
      const colorLabel = colorObj?.label || null
      const materialValue = material || null
      const lineKey = `${productId}|${materialValue || ''}|${colorValue || ''}`
      const idx = prev.findIndex(i => i.lineKey === lineKey)
      if (idx >= 0) { const copy = [...prev]; copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 }; return copy }
      scheduleMicrotask(() => {
        trackEventGA4('add_to_cart', {
          currency: prod.currency || 'EUR',
          value: prod.price || 0,
          items: [{
            item_id: productId,
            item_name: prod.name,
            quantity: 1,
          }]
        })
      })
      return [...prev, { id: productId, lineKey, name: prod.name, price: prod.price, currency: prod.currency, img: primaryImg, qty: 1, colorValue, colorLabel, material: materialValue }]
    })
  }
  function removeFromCart(lineKey) { setCart(prev => prev.filter(i => i.lineKey !== lineKey)) }
  function updateQty(lineKey, qty) { setCart(prev => prev.map(i => (i.lineKey === lineKey ? { ...i, qty: Math.max(1, qty) } : i))) }
  function clearCart() { setCart([]) }

  function checkoutPayPal() {
    const itemsCount = cart.reduce((a, b) => a + b.qty, 0)
    const lines = cart.map(i => {
      if (Array.isArray(i.selections) && i.selections.length > 0) {
        const parts = i.selections.map(p => `${p.partLabel || p.partId}: ${p.colorLabel || p.colorValue || '—'}${p.material ? ` [${p.material}]` : ''}`).join('; ')
        return `#${i.id} (${parts}) x${i.qty}`
      }
      return `#${i.id}${i.material ? ` [${i.material}]` : ''}${i.colorLabel ? ` (${i.colorLabel})` : ''} x${i.qty}`
    }).join(' | ')
    const itemName = encodeURIComponent(`Pedido NicoPrints: ${lines}`)
    const amount = (Math.round(grandTotal * 100) / 100).toFixed(2) // 2 decimales con punto
    const currency = 'EUR'
    const business = encodeURIComponent(PAYPAL_BUSINESS_EMAIL)
    const baseUrl = window.location.origin + import.meta.env.BASE_URL
    const returnUrl = encodeURIComponent(baseUrl + '#gracias')
    const cancelUrl = encodeURIComponent(baseUrl + '#cancelado')

    const url = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${business}&item_name=${itemName}&amount=${amount}&currency_code=${currency}&no_note=1&no_shipping=0&return=${returnUrl}&cancel_return=${cancelUrl}`
    try { trackEventGA4('pay_with_paypal', { value: parseFloat(amount), currency, items: cart.map(i => ({ item_id: i.id, item_name: i.name, quantity: i.qty })) }) } catch (_) {}
    window.location.href = url
  }

  
  function checkoutEmail() {
    const subject = encodeURIComponent('Pedido Tienda 3D')
    const lines = cart.map(i => {
      if (Array.isArray(i.selections) && i.selections.length > 0) {
        const parts = i.selections.map(p => `${p.partLabel || p.partId}: ${p.colorLabel || p.colorValue || '—'}${p.material ? ` [${p.material}]` : ''}`).join('; ')
        return `• ${i.name} (${parts}) x${i.qty} — ${formatPrice(i.price * i.qty)}`
      }
      return `• ${i.name}${i.material ? ` [${i.material}]` : ''}${i.colorLabel ? ` (${i.colorLabel})` : ''} x${i.qty} — ${formatPrice(i.price * i.qty)}`
    }).join('\n')
    const body = encodeURIComponent(
      `Hola, me interesa este pedido:\n\n${lines}\n\nSubtotal: ${formatPrice(total)}\nEnvío: ${formatPrice(shipping)}\nTotal estimado: ${formatPrice(grandTotal)}\n\nMi dirección es: \n`
    )
    try { trackEventGA4('buy_with_email', { value: grandTotal, currency: 'EUR', items: cart.map(i => ({ item_id: i.id, item_name: i.name, quantity: i.qty })) }) } catch (_) {}
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
  }

  // Detectar retorno de PayPal por hash y mostrar aviso. Limpiar la URL después.
  useEffect(() => {
    const handleHash = () => {
      // Normalize hash: ignore anything after '?' (UTM or other params)
      const rawHash = (window.location.hash || '').toLowerCase()
      const h = rawHash.split('?')[0]
      if (h.startsWith('#gracias')) {
        setCheckoutStatus('success')
        history.replaceState(null, '', import.meta.env.BASE_URL)
        return
      }
      if (h.startsWith('#cancelado')) {
        setCheckoutStatus('cancel')
        history.replaceState(null, '', import.meta.env.BASE_URL)
        return
      }
      // Router simple: producto y colecciones
      if (h.startsWith('#p/')) {
        const slug = h.replace('#p/', '').trim()
        setCurrentProductSlug(slug || null)
        setCurrentCollectionId(null)
        return
      }
      setCurrentProductSlug(null)
      if (h === '#taller') { setCurrentCollectionId('taller'); return }
      if (h === '#magic') { setCurrentCollectionId('magic'); return }
      setCurrentCollectionId(null)
      setCollectionsOpen(false)
    }
    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  // Al entrar en una colección, forzar scroll al inicio
  useEffect(() => {
    if (currentCollectionId) {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [currentCollectionId])

  // Cerrar dropdown al clicar fuera
  useEffect(() => {
    function onDocMouseDown(e) {
      if (collectionsMenuRef.current && !collectionsMenuRef.current.contains(e.target)) {
        setCollectionsOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <a href="#" aria-label="Inicio">
            <img src={`${import.meta.env.BASE_URL}NicoPrints.svg`} alt="NicoPrints" className="h-8 w-auto" />
          </a>
          <nav className="ml-4 hidden md:flex items-center gap-4">
            <a href="#" className="text-sm text-gray-700 hover:text-gray-900">Inicio</a>
            <div className="relative" ref={collectionsMenuRef}>
              <button
                type="button"
                onClick={() => setCollectionsOpen(v => !v)}
                aria-haspopup="menu"
                aria-expanded={collectionsOpen}
                className="text-sm text-gray-700 hover:text-gray-900 inline-flex items-center gap-1"
              >
                Colecciones <span aria-hidden>▾</span>
              </button>
              {collectionsOpen && (
                <div className="absolute left-0 top-full mt-1 z-40">
                  <div className="min-w-[160px] rounded-md border bg-white shadow-md py-1">
                    <a href="#taller" onClick={() => setCollectionsOpen(false)} className="block px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">Taller y organización</a>
                    <a href="#magic" onClick={() => setCollectionsOpen(false)} className="block px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">Magic: The Gathering</a>
                  </div>
                </div>
              )}
            </div>
          </nav>
          {/* Botón menú móvil */}
          <div className="ml-auto flex items-center gap-3">
            {/* WhatsApp button next to cart (desktop only) */}
            <a
              href={`https://wa.me/${encodeURIComponent((WHATSAPP_PHONE || '').replace(/[^+\d]/g, '').replace(/^\+/, ''))}?text=${encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE || '')}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => { try { trackEventGA4('contact_whatsapp_click', { location: 'header_right' }) } catch (_) {} }}
              className="hidden md:inline-flex items-center gap-2 text-sm text-green-600 hover:text-green-700 pr-2"
            >
              <img src={`${import.meta.env.BASE_URL}whatsapp.svg`} alt="WhatsApp" className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2 md:hidden">
                  <Menu className="w-4 h-4" />
                  <span className="sm:inline">Menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader>
                  <SheetTitle>Navegación</SheetTitle>
                </SheetHeader>
                <div className="mt-4 grid gap-2">
                  <a href="#" className="block text-sm text-gray-700 hover:underline" onClick={() => setMobileMenuOpen(false)}>Inicio</a>
                  <div>
                    <div className="text-xs uppercase text-gray-500 mb-1">Colecciones</div>
                    <a href="#taller" className="block text-sm text-gray-700 hover:underline" onClick={() => setMobileMenuOpen(false)}>Taller y organización</a>
                    <a href="#magic" className="block text-sm text-gray-700 hover:underline" onClick={() => setMobileMenuOpen(false)}>Magic: The Gathering</a>
                  </div>
                  <a
                    href={`https://wa.me/${encodeURIComponent((WHATSAPP_PHONE || '').replace(/[^+\d]/g, '').replace(/^\+/, ''))}?text=${encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE || '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-green-600 hover:underline"
                    onClick={() => {
                      try { trackEventGA4('contact_whatsapp_click', { location: 'mobile_menu' }) } catch (_) {}
                      setMobileMenuOpen(false)
                    }}
                  >
                    <img src={`${import.meta.env.BASE_URL}whatsapp.svg`} alt="WhatsApp" className="w-4 h-4" /> WhatsApp
                  </a>
                </div>
              </SheetContent>
            </Sheet>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden sm:inline">Carrito</span>
                  <Badge variant="secondary" className="ml-1">{cart.reduce((a, b) => a + b.qty, 0)}</Badge>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Tu carrito</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                  <AnimatePresence>
                    {cart.length === 0 ? (
                      <p className="text-sm text-gray-500">Aún no hay productos.</p>
                    ) : (
                      cart.map(item => (
                        <motion.div key={item.lineKey} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                          <div className="flex items-center gap-3 border rounded-2xl p-3 bg-white shadow-sm">
                            <img src={item.img} alt="" className="w-16 h-16 object-cover rounded-xl" />
                            <div className="flex-1">
                              <div className="font-medium">{item.name}</div>
                              {item.colorLabel && (
                                <div className="text-xs text-gray-500">Color: {item.colorLabel}</div>
                              )}
                              {Array.isArray(item.selections) && item.selections.length > 0 && (
                                <div className="mt-1 space-y-0.5">
                                  {item.selections.map(sel => {
                                    const colorObj = COLORS.find(c => c.value === sel.colorValue)
                                    return (
                                      <div key={sel.partId} className="text-xs text-gray-500 flex items-center gap-1.5">
                                        <span className="text-gray-600">{sel.partLabel}:</span>
                                        {colorObj ? (
                                          <span className="inline-block h-3 w-3 rounded-full border border-gray-300" style={{ backgroundColor: colorObj.hex }}></span>
                                        ) : null}
                                        <span>{sel.colorLabel || sel.colorValue || '—'}</span>
                                        {sel.material ? <span className="text-gray-400">[{sel.material}]</span> : null}
                                      </div>
                                    )
                                  })}
                                </div>
                              )}
                              <div className="text-sm text-gray-500">{formatPrice(item.price)} / ud</div>
                              <div className="flex items-center gap-2 mt-1">
                                <Input type="number" min={1} value={item.qty} onChange={(e) => updateQty(item.lineKey, parseInt(e.target.value || "1"))} className="w-20" />
                                <Button size="icon" className="bg-white text-gray-900 hover:bg-gray-100" onClick={() => removeFromCart(item.lineKey)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span className="font-medium">{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span>Envío</span>
                      <span className="font-medium">{formatPrice(shipping)}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-2 border-t pt-2">
                      <span className="font-medium">Total</span>
                      <span className="font-semibold">{formatPrice(grandTotal)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">* Envío fijo de {formatPrice(SHIPPING_FEE_EUR)} en España peninsular. <i>Envios solo dentro de España.</i></p>
                    <div className="grid grid-cols-1 gap-2 mt-4">
                      <Button className="gap-2" onClick={checkoutPayPal}>
                        <PayPalIcon className="w-4 h-4" /> Pagar con PayPal
                      </Button>
                      <Button className="gap-2 bg-white text-gray-900 hover:bg-gray-100" onClick={checkoutEmail}>
                        <Mail className="w-4 h-4" /> Reservar por email
                      </Button>
                      <Button className="bg-white text-gray-900 hover:bg-gray-100" onClick={clearCart}>Vaciar carrito</Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {checkoutStatus !== 'none' && (
        <div className="max-w-6xl mx-auto px-4 mt-4">
          {checkoutStatus === 'success' ? (
            <div className="rounded-lg border border-green-200 bg-green-50 text-green-800 p-3 text-sm">
              ¡Gracias por tu pedido! El pago se ha completado correctamente.
            </div>
          ) : (
            <div className="rounded-lg border border-amber-200 bg-amber-50 text-amber-800 p-3 text-sm">
              El pago fue cancelado. Si fue un error, inténtalo de nuevo o contáctame.
            </div>
          )}
        </div>
      )}

      {currentCollectionId || currentProductSlug ? null : (
        <section className="max-w-6xl mx-auto px-4 pt-8">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">Tus ideas, y más cosas, impresas en 3D</h2>
              <p className="mt-3 text-gray-600 md:text-lg leading-relaxed">Aficionado a la impresión 3D. Aquí encontrarás piezas prácticas que nacen del día a día: organizadores, soportes y pequeños accesorios pensados para durar y mejorar tus espacios.</p>
              <p className="mt-2 text-gray-600">Trabajo bajo pedido en PLA y PETG, con distintos colores y acabados. Si no ves lo que buscas, <a href={`${import.meta.env.BASE_URL}encargos.html`} className="underline">pide un encargo a medida</a> y lo diseñamos para que encaje justo donde lo necesitas.</p>
              <ul className="mt-4 grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-gray-900"></span> PLA y PETG en varios colores</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-gray-900"></span> Tamaño máximo 18×18×18 cm</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-gray-900"></span> Encargos a medida: pide presupuesto</li>
              </ul>
              <div className="mt-5 flex gap-2">
                <a href="#colecciones"><Button>Ver colecciones</Button></a>
                <a href={`${import.meta.env.BASE_URL}encargos.html`}><Button variant="outline">Contacto</Button></a>
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden shadow bg-white">
              <img src={`${import.meta.env.BASE_URL}hero-print.svg`} alt="Ilustración de impresión 3D" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>
      )}

      {currentProductSlug ? (
        <ProductDetail slug={currentProductSlug} onAdd={addToCart} onBack={() => history.back()} />
      ) : currentCollectionId === 'taller' ? (
        <Taller onAdd={addToCart} />
      ) : currentCollectionId === 'magic' ? (
        <Magic onAdd={addToCart} />
      ) : (
        <section id="colecciones" className="max-w-6xl mx-auto px-4 py-10">
          <h3 className="text-2xl font-semibold mb-4">Colecciones</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="rounded-2xl overflow-hidden bg-green-700">
              <CardContent className="p-0">
                <div className="aspect-video overflow-hidden">
                  <img src={`${import.meta.env.BASE_URL}taller_a_medida.jpg`} alt="Taller y organización" className="w-full h-full object-cover" />
                </div>
                <div className="p-4 bg-green-700 text-white">
                  <h4 className="font-medium leading-tight">Taller y organización</h4>
                  <p className="text-sm mt-1 line-clamp-3 text-white/90">Soportes para baterías y accesorios para ordenar tu taller.</p>
                  <div className="mt-3">
                    <a href="#taller">
                      <Button className="bg-white text-gray-900 hover:bg-white/90">Ver colección</Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-2xl overflow-hidden bg-orange-600">
              <CardContent className="p-0">
                <div className="aspect-video overflow-hidden">
                  <img src={`${import.meta.env.BASE_URL}deck_examples.jpg`} alt="Magic: The Gathering" className="w-full h-full object-cover" />
                </div>
                <div className="p-4 bg-orange-600 text-white">
                  <h4 className="font-medium leading-tight">Magic: The Gathering</h4>
                  <p className="text-sm mt-1 line-clamp-3 text-white/90">Accesorios impresos en 3D para cartas y partidas.</p>
                  <div className="mt-3">
                    <a href="#magic">
                      <Button className="bg-white text-gray-900 hover:bg-white/90">Ver colección</Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-4 pt-6 pb-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#4C4B4C] via-[#737A78] to-[#B0B5B3] text-white">
          <div className="px-6 py-8 md:px-10 md:py-10 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Package className="w-5 h-5" /> Encargos a medida
              </div>
              <h3 className="text-2xl md:text-3xl font-semibold mt-1">¿No encuentras lo que buscas?</h3>
              <p className="mt-2 text-gray-300 md:text-base">Diseñamos una pieza a medida en PLA/PETG que encaje justo donde la necesitas.</p>
              <div className="mt-4 flex flex-col gap-2">
                <a href={`${import.meta.env.BASE_URL}encargos.html`} className="w-full">
                  <Button className="w-full bg-white text-gray-900 hover:bg-gray-100">Solicitar presupuesto</Button>
                </a>
              </div>
            </div>
            <div className="hidden md:block">
              <img src={`${import.meta.env.BASE_URL}hero-print.svg`} alt="Ilustración de impresión 3D" className="w-56 h-36 object-contain opacity-80 rounded-2xl" />
            </div>
          </div>
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-white/10 blur-2xl"></div>
        </div>
      </section>

      {/* Sección de formulario movida a página independiente: encargos.html */}

      <footer className="border-t bg-white/60">
        <div className="text-center text-xs text-gray-600 pb-2 mt-4">
          <a className="underline" href="privacidad.html">Política de privacidad</a>
          <span className="mx-2">·</span>
          <a className="underline" href="aviso-legal.html">Aviso legal</a>
        </div>
        <div className="text-center text-xs text-gray-500 pb-6">© {new Date().getFullYear()} NicoPrints – Hecho con React + GitHub Pages</div>
      </footer>
    </div>
  )
}