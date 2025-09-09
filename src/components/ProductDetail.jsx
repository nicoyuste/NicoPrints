import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { productBySlug } from '@/data/products'
import ProductCard from '@/components/ProductCard'
import { formatPrice } from '@/lib/format'
import { COLORS } from '@/colors'

export default function ProductDetail({ slug, onAdd, onBack }) {
  const product = productBySlug.get(slug)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const materials = useMemo(() => (Array.isArray(product?.material) ? product.material : [product?.material].filter(Boolean)), [product])
  const [selectedMaterial, setSelectedMaterial] = useState(materials[0] || '')
  const filteredColors = COLORS.filter(c => c.material === selectedMaterial)
  const [selectedColor, setSelectedColor] = useState(filteredColors[0]?.value || '')
  const imageObjs = Array.isArray(product?.images)
    ? product.images.map(img => (typeof img === 'string' ? { src: img, colorValue: null } : img))
    : []
  const mainImage = imageObjs[Math.min(selectedIndex, Math.max(0, imageObjs.length - 1))]?.src
  const otherImageObjs = (product?.otherImages && Array.isArray(product.otherImages))
    ? product.otherImages.map(img => (typeof img === 'string' ? { src: img } : img))
    : []
  const descRef = useRef(null)
  const [isDescExpanded, setIsDescExpanded] = useState(false)
  const [showDescToggle, setShowDescToggle] = useState(false)
  const currentColorObj = COLORS.find(c => c.value === selectedColor) || null
  const referencedProducts = useMemo(() => {
    if (!product || !Array.isArray(product.crossReferences)) return []
    return product.crossReferences
      .map(sl => productBySlug.get(sl))
      .filter(p => p && p.slug !== product.slug)
  }, [product])

  useEffect(() => {
    if (!product) return
    const first = filteredColors[0]?.value || ''
    setSelectedColor(prev => (filteredColors.some(c => c.value === prev) ? prev : first))
  }, [selectedMaterial])

  // Ya no sincronizamos la imagen con el color seleccionado

  useEffect(() => {
    if (isDescExpanded) { setShowDescToggle(true); return }
    const el = descRef.current
    if (!el) return
    const id = requestAnimationFrame(() => {
      const overflowing = el.scrollHeight > el.clientHeight + 1
      setShowDescToggle(overflowing)
    })
    return () => cancelAnimationFrame(id)
  }, [product?.description, isDescExpanded])

  if (!product) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-sm text-gray-600">Producto no encontrado.</p>
        <div className="mt-4">
          <Button variant="outline" onClick={onBack}>Volver</Button>
        </div>
      </section>
    )
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-10 pb-12 overflow-x-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div>
          <div className="aspect-video overflow-hidden bg-gray-100 rounded-2xl">
            {mainImage ? (
              <img src={mainImage} alt={product.name} className="w-full h-full object-contain" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">Sin imagen</div>
            )}
          </div>
          {imageObjs.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {imageObjs.map((img, idx) => (
                <button
                  key={img.src + idx}
                  type="button"
                  onClick={() => setSelectedIndex(idx)}
                  className={`h-16 w-24 rounded-md overflow-hidden p-0 bg-transparent border ${idx === selectedIndex ? 'border-gray-900' : 'border-transparent'}`}
                  aria-label={`Vista ${idx + 1}`}
                >
                  <img src={img.src} alt="" className="block h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-start justify-between gap-2">
            <h1 className="text-2xl md:text-3xl font-bold leading-tight break-words">{product.name}</h1>
          </div>

          <div className="mt-2">
            <Badge className="bg-gray-900 text-white text-base px-3 py-1.5 rounded-md">{formatPrice(product.price, product.currency)}</Badge>
          </div>

          <div className="mt-3">
            <p ref={descRef} className={`text-sm text-gray-700 break-words${isDescExpanded ? '' : ' line-clamp-5'}`}>{product.description}</p>
            {showDescToggle && (
              <button type="button" className="text-xs underline text-gray-600 mt-1" onClick={() => setIsDescExpanded(v => !v)}>
                {isDescExpanded ? 'Ver menos' : 'Leer más'}
              </button>
            )}
          </div>

          {materials.length > 1 && (
            <div className="mt-4">
              <div className="text-xs text-gray-600 mb-1">Material</div>
              <div className="flex flex-wrap gap-2 items-center">
                {materials.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSelectedMaterial(m)}
                    className={`h-8 px-3 rounded-full border text-xs ${selectedMaterial === m ? 'ring-2 ring-gray-900 border-gray-900' : 'border-gray-300'}`}
                  >
                    {m}
                  </button>
                ))}
                <a href={`${import.meta.env.BASE_URL}materiales.html`} className="text-xs underline text-gray-600 ml-2" target="_blank" rel="noreferrer">¿Diferencias?</a>
              </div>
            </div>
          )}

          <div className="mt-4">
            <div className="text-xs text-gray-600 mb-1">Color</div>
            <div className="flex flex-wrap gap-2">
              {filteredColors.length > 0 ? filteredColors.map(c => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setSelectedColor(c.value)}
                  className={`h-8 px-3 rounded-full border text-xs flex items-center gap-2 ${selectedColor === c.value ? 'ring-2 ring-gray-900 border-gray-900' : 'border-gray-300'}`}
                  aria-label={c.label}
                  title={c.label}
                >
                  <span className="inline-block h-4 w-4 rounded-full" style={{ backgroundColor: c.hex }}></span>
                  {c.label}
                </button>
              )) : (
                <span className="text-xs text-gray-500">Sin colores disponibles para {selectedMaterial}</span>
              )}
            </div>
          </div>

          {/* Botón de añadir se mueve a la barra inferior fija */}
        </div>
      </div>

      {product.longDescription && (
        <div className="mt-10">
          <h3 className="font-semibold">Descripción</h3>
          <p className="text-sm text-gray-700 mt-2 whitespace-pre-line break-words">{product.longDescription || product.longDescripcion}</p>
        </div>
      )}

      {referencedProducts.length > 0 && (
        <div className="mt-10">
          <h3 className="font-semibold">También te puede interesar</h3>
          <div className="mt-3 -mx-4 px-4 overflow-x-auto">
            <div className="flex gap-4">
              {referencedProducts.map((p) => (
                <div key={p.slug} className="w-72 flex-shrink-0">
                  <ProductCard product={p} onAdd={onAdd} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {otherImageObjs.length > 0 && (
        <div className="mt-10">
          <h3 className="font-semibold">Personalizaciones para clientes</h3>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {otherImageObjs.map((img, idx) => (
              <div key={(img.src || 'other') + idx} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img src={img.src} alt="Personalización de cliente" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Barra inferior fija con CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium truncate">{selectedMaterial || ''}</div>
            {currentColorObj && (
              <div className="text-xs text-gray-600 truncate">{currentColorObj.label}</div>
            )}
          </div>
          <div className="hidden sm:block">
            <Badge className="bg-gray-900 text-white text-base px-3 py-1.5 rounded-md">{formatPrice(product.price, product.currency)}</Badge>
          </div>
          <Button className="min-w-[200px]" onClick={() => {
            onAdd(product, currentColorObj, selectedMaterial)
          }}>Añadir al carrito</Button>
        </div>
      </div>
    </section>
  )
}


