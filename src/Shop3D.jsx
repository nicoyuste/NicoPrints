import { useEffect, useState } from 'react'
import { ShoppingCart, Trash2, Package, Mail } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// shadcn/ui
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import PRODUCTS from '@/products'

const PAYPAL_LINK = 'https://www.paypal.com/ncp/payment/XXXXXXXX'
const CONTACT_EMAIL = 'info@nicoyuste.es'

function PayPalIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M7 3h7a5 5 0 0 1 0 10h-4l-1.2 8H5L7 3Z" />
      <path d="M12 7h2a2 2 0 1 1 0 4h-3l1-4Z" opacity=".7" />
    </svg>
  )
}


function formatPrice(num, currency = 'EUR') {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency }).format(num)
}
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try { const item = localStorage.getItem(key); return item ? JSON.parse(item) : initialValue } catch { return initialValue }
  })
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)) } catch {} }, [key, value])
  return [value, setValue]
}

export default function Shop3D() {
  const [cart, setCart] = useLocalStorage('cart3d', [])
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  function addToCart(prod) {
    setCart(prev => {
      const idx = prev.findIndex(i => i.id === prod.id)
      if (idx >= 0) { const copy = [...prev]; copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 }; return copy }
      return [...prev, { id: prod.id, name: prod.name, price: prod.price, currency: prod.currency, img: prod.img, qty: 1 }]
    })
  }
  function removeFromCart(id) { setCart(prev => prev.filter(i => i.id !== id)) }
  function updateQty(id, qty) { setCart(prev => prev.map(i => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i))) }
  function clearCart() { setCart([]) }

  function checkoutPayPal() { window.location.href = PAYPAL_LINK }
  function checkoutEmail() {
    const subject = encodeURIComponent('Pedido Tienda 3D')
    const body = encodeURIComponent(`Hola, me interesa este pedido:\n\n${cart.map(i => `• ${i.name} x${i.qty} — ${formatPrice(i.price * i.qty)}`).join('\n')}\n\nTotal estimado: ${formatPrice(total)}\n\nMi dirección es: \n`)
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Package className="w-6 h-6" />
          <h1 className="text-xl font-semibold">NicoPrints</h1>
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
                    <p className="text-xs text-gray-500 mt-2">* Envío calculado manualmente tras el pedido (correo electrónico). PLA/PETG impresos bajo pedido.</p>
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

      <section className="max-w-6xl mx-auto px-4 pt-8">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">Piezas impresas en 3D que uso a diario</h2>
            <p className="mt-3 text-gray-600">Modelos probados en casa, impresos en PLA y PETG (Bambu Lab A1 Mini). Bajo pedido, personalizables en color y tamaño.</p>
            <div className="mt-4 flex gap-2">
              <a href="#catalogo"><Button>Ver catálogo</Button></a>
              <a href={`mailto:${CONTACT_EMAIL}`}><Button variant="outline">Contacto</Button></a>
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden shadow">
            <img src="https://images.unsplash.com/photo-1608566042977-8eb7f1b1b0d8?q=80&w=1600&auto=format&fit=crop" alt="3D printing" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <section id="catalogo" className="max-w-6xl mx-auto px-4 py-10">
        <h3 className="text-2xl font-semibold mb-4">Catálogo</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((p) => (
            <Card key={p.id} className="rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-video overflow-hidden">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-medium leading-tight">{p.name}</h4>
                      <p className="text-sm text-gray-500">{p.material} · {p.color} · {p.category}</p>
                    </div>
                    <Badge>{formatPrice(p.price, p.currency)}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{p.description}</p>
                  <div className="mt-4 flex gap-2">
                    <Button className="flex-1" onClick={() => addToCart(p)}>Añadir al carrito</Button>
                    <a className="flex-1" href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Consulta: ' + p.name)}`}>
                      <Button variant="outline" className="w-full">Consulta</Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t bg-white/60">
        <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-gray-600 grid md:grid-cols-3 gap-4">
          <div>
            <div className="font-semibold">Información</div>
            <p>Producción bajo pedido. Tiempo típico 1–3 días. PLA y PETG (Bambu Lab A1 Mini).</p>
          </div>
          <div>
            <div className="font-semibold">Envíos</div>
            <p>Entrega local o envío nacional. Coste según peso y destino.</p>
          </div>
          <div>
            <div className="font-semibold">Contacto</div>
            <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </div>
        </div>
        <div className="text-center text-xs text-gray-600 pb-2">
          <a className="underline" href="privacidad.html">Política de privacidad</a>
          <span className="mx-2">·</span>
          <a className="underline" href="aviso-legal.html">Aviso legal</a>
        </div>
        <div className="text-center text-xs text-gray-500 pb-6">© {new Date().getFullYear()} NicoPrints – Hecho con React + GitHub Pages</div>
      </footer>
    </div>
  )
}