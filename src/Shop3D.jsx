import { useEffect, useState } from 'react'
import { ShoppingCart, Trash2, Package, Mail } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// shadcn/ui
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import PRODUCTS from '@/products'
import ProductCard from '@/components/ProductCard'
import PayPalIcon from '@/components/icons/PayPalIcon'
import CustomOrderForm from '@/components/CustomOrderForm'
import { CONTACT_EMAIL, PAYPAL_BUSINESS_EMAIL, SHIPPING_FEE_EUR } from '@/config'
import useLocalStorage from '@/lib/useLocalStorage'
import { formatPrice } from '@/lib/format'
import { Badge } from '@/components/ui/badge'


export default function Shop3D() {
  const [cart, setCart] = useLocalStorage('cart3d', [])
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const shipping = cart.length > 0 ? SHIPPING_FEE_EUR : 0
  const grandTotal = total + shipping
  const [checkoutStatus, setCheckoutStatus] = useState('none') // 'none' | 'success' | 'cancel'

  function addToCart(prod, colorObj, material) {
    setCart(prev => {
      const colorValue = colorObj?.value || null
      const colorLabel = colorObj?.label || null
      const materialValue = material || null
      const idx = prev.findIndex(i => i.id === prod.id && (i.colorValue || null) === colorValue && (i.material || null) === materialValue)
      if (idx >= 0) { const copy = [...prev]; copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 }; return copy }
      const primaryImg = (prod.images && prod.images.length > 0) ? prod.images[0] : prod.img
      return [...prev, { id: prod.id, name: prod.name, price: prod.price, currency: prod.currency, img: primaryImg, qty: 1, colorValue, colorLabel, material: materialValue }]
    })
  }
  function removeFromCart(id) { setCart(prev => prev.filter(i => i.id !== id)) }
  function updateQty(id, qty) { setCart(prev => prev.map(i => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i))) }
  function clearCart() { setCart([]) }

  function checkoutPayPal() {
    const itemsCount = cart.reduce((a, b) => a + b.qty, 0)
    const lines = cart.map(i => `#${i.id}${i.material ? ` [${i.material}]` : ''}${i.colorLabel ? ` (${i.colorLabel})` : ''} x${i.qty}`).join(' | ')
    const itemName = encodeURIComponent(`Pedido NicoPrints: ${lines}`)
    const amount = (Math.round(grandTotal * 100) / 100).toFixed(2) // 2 decimales con punto
    const currency = 'EUR'
    const business = encodeURIComponent(PAYPAL_BUSINESS_EMAIL)
    const baseUrl = window.location.origin + import.meta.env.BASE_URL
    const returnUrl = encodeURIComponent(baseUrl + '#gracias')
    const cancelUrl = encodeURIComponent(baseUrl + '#cancelado')

    const url = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${business}&item_name=${itemName}&amount=${amount}&currency_code=${currency}&no_note=1&no_shipping=0&return=${returnUrl}&cancel_return=${cancelUrl}`
    window.location.href = url
  }

  
  function checkoutEmail() {
    const subject = encodeURIComponent('Pedido Tienda 3D')
    const lines = cart.map(i => `• ${i.name}${i.material ? ` [${i.material}]` : ''}${i.colorLabel ? ` (${i.colorLabel})` : ''} x${i.qty} — ${formatPrice(i.price * i.qty)}`).join('\n')
    const body = encodeURIComponent(
      `Hola, me interesa este pedido:\n\n${lines}\n\nSubtotal: ${formatPrice(total)}\nEnvío: ${formatPrice(shipping)}\nTotal estimado: ${formatPrice(grandTotal)}\n\nMi dirección es: \n`
    )
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
  }

  // Detectar retorno de PayPal por hash y mostrar aviso. Limpiar la URL después.
  useEffect(() => {
    const h = (window.location.hash || '').toLowerCase()
    if (h.startsWith('#gracias')) {
      setCheckoutStatus('success')
      history.replaceState(null, '', import.meta.env.BASE_URL)
    } else if (h.startsWith('#cancelado')) {
      setCheckoutStatus('cancel')
      history.replaceState(null, '', import.meta.env.BASE_URL)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <img src={`${import.meta.env.BASE_URL}NicoPrints.svg`} alt="NicoPrints" className="h-8 w-auto" />
          <div className="ml-auto flex items-center gap-2">
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
                        <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                          <div className="flex items-center gap-3 border rounded-2xl p-3 bg-white shadow-sm">
                            <img src={item.img} alt="" className="w-16 h-16 object-cover rounded-xl" />
                            <div className="flex-1">
                              <div className="font-medium">{item.name}</div>
                              {item.colorLabel && (
                                <div className="text-xs text-gray-500">Color: {item.colorLabel}</div>
                              )}
                              <div className="text-sm text-gray-500">{formatPrice(item.price)} / ud</div>
                              <div className="flex items-center gap-2 mt-1">
                                <Input type="number" min={1} value={item.qty} onChange={(e) => updateQty(item.id, parseInt(e.target.value || "1"))} className="w-20" />
                                <Button size="icon" variant="ghost" onClick={() => removeFromCart(item.id)}>
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
                    <p className="text-xs text-gray-500 mt-2">* Envío fijo de {formatPrice(SHIPPING_FEE_EUR)} en España peninsular.<i>Envios solo dentro de España.</i></p>
                    <div className="grid grid-cols-1 gap-2 mt-4">
                      <Button className="gap-2" onClick={checkoutPayPal}>
                        <PayPalIcon className="w-4 h-4" /> Pagar con PayPal
                      </Button>
                      <Button variant="ghost" className="gap-2" onClick={checkoutEmail}>
                        <Mail className="w-4 h-4" /> Reservar por email
                      </Button>
                      <Button variant="secondary" onClick={clearCart}>Vaciar carrito</Button>
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
              <a href="#catalogo"><Button>Ver catálogo</Button></a>
              <a href={`${import.meta.env.BASE_URL}encargos.html`}><Button variant="outline">Contacto</Button></a>
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden shadow bg-white">
            <img src={`${import.meta.env.BASE_URL}hero-print.svg`} alt="Ilustración de impresión 3D" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>


      <section id="catalogo" className="max-w-6xl mx-auto px-4 py-10">
        <h3 className="text-2xl font-semibold mb-4">Catálogo</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={addToCart} contactEmail={CONTACT_EMAIL} />
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pt-6 pb-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-white">
          <div className="px-6 py-8 md:px-10 md:py-10 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Package className="w-5 h-5" /> Encargos a medida
              </div>
              <h3 className="text-2xl md:text-3xl font-semibold mt-1">¿No encuentras lo que buscas?</h3>
              <p className="mt-2 text-gray-300 md:text-base">Diseñamos una pieza a medida en PLA/PETG que encaje justo donde la necesitas.</p>
              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <a href={`${import.meta.env.BASE_URL}encargos.html`}>
                  <Button className="bg-white text-gray-900 hover:bg-gray-100">Solicitar presupuesto</Button>
                </a>
                <a href={`${import.meta.env.BASE_URL}materiales.html`} className="inline-flex items-center justify-center gap-2 rounded-md border border-white/30 px-4 py-2 text-sm hover:bg-white/10">Ver materiales</a>
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