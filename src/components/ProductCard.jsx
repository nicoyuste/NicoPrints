import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/format'
import { COLORS } from '@/colors'

export default function ProductCard({ product, onAdd, contactEmail }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const materials = Array.isArray(product.material) ? product.material : [product.material]
  const [selectedMaterial, setSelectedMaterial] = useState(materials[0] || '')
  const filteredColors = COLORS.filter(c => c.material === selectedMaterial)
  const [selectedColor, setSelectedColor] = useState(filteredColors[0]?.value || '')
  const [isDescExpanded, setIsDescExpanded] = useState(false)
  const [showDescToggle, setShowDescToggle] = useState(false)
  const descRef = useRef(null)
  const imageObjs = (product.images && product.images.length > 0)
    ? product.images.map(img => (typeof img === 'string' ? { src: img, colorValue: null } : img))
    : [{ src: product.img, colorValue: null }]

  // Si existe una imagen para el color seleccionado, sincroniza el índice
  useEffect(() => {
    const idx = imageObjs.findIndex(i => i.colorValue === selectedColor)
    if (idx >= 0) setSelectedIndex(idx)
  }, [selectedColor])

  // Si cambia el material seleccionado, asegura que el color seleccionado pertenece a ese material
  useEffect(() => {
    const first = filteredColors[0]?.value || ''
    setSelectedColor(prev => (filteredColors.some(c => c.value === prev) ? prev : first))
  }, [selectedMaterial])

  // Mostrar el toggle solo si el texto está truncado (overflow con clamp)
  useEffect(() => {
    if (isDescExpanded) { setShowDescToggle(true); return }
    const el = descRef.current
    if (!el) return
    // Timeout para garantizar layout después de render
    const id = requestAnimationFrame(() => {
      const overflowing = el.scrollHeight > el.clientHeight + 1
      setShowDescToggle(overflowing)
    })
    return () => cancelAnimationFrame(id)
  }, [product.description, isDescExpanded])

  const colorMatch = imageObjs.find(i => i.colorValue === selectedColor)
  const mainImage = (colorMatch?.src) || imageObjs[Math.min(selectedIndex, imageObjs.length - 1)]?.src

  return (
    <Card className="rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        <div className="aspect-video overflow-hidden bg-gray-100 rounded-2xl">
          <button type="button" className="w-full h-full focus:outline-none focus-visible:outline-none cursor-zoom-in" onClick={() => setIsOpen(true)} aria-label="Abrir galería">
            <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
          </button>
        </div>
        {imageObjs.length > 1 && (
          <div className="px-4 pt-3 flex gap-2 overflow-x-auto">
            {imageObjs.map((img, idx) => (
              <button
                key={img.src + idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`h-12 w-16 rounded-md overflow-hidden border ${idx === selectedIndex ? 'ring-2 ring-gray-900 border-gray-900' : 'border-gray-200'}`}
                aria-label={`Vista ${idx + 1}`}
              >
                <img src={img.src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-medium leading-tight">{product.name}</h4>
              <p className="text-sm text-gray-500">{selectedMaterial || materials.join('/')} · {product.category}</p>
            </div>
            <Badge>{formatPrice(product.price, product.currency)}</Badge>
          </div>
          {materials.length > 1 && (
            <div className="mt-3">
              <label className="block text-xs text-gray-600 mb-1">Material</label>
              <div className="flex flex-wrap gap-2 items-center">
                {materials.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSelectedMaterial(m)}
                    className={`h-7 px-2 rounded-full border text-xs ${selectedMaterial === m ? 'ring-2 ring-gray-900 border-gray-900' : 'border-gray-300'}`}
                    aria-label={m}
                    title={m}
                  >
                    {m}
                  </button>
                ))}
                <a href={`${import.meta.env.BASE_URL}materiales.html`} className="text-xs underline text-gray-600 ml-2" target="_blank" rel="noreferrer">¿Diferencias?</a>
              </div>
            </div>
          )}
          {/* Removed selected color subtitle to avoid duplication with selector */}
          <p ref={descRef} className={`text-sm text-gray-600 mt-2${isDescExpanded ? '' : ' line-clamp-3'}`}>{product.description}</p>
          {showDescToggle && (
            <button
              type="button"
              className="text-xs underline text-gray-600 mt-1"
              onClick={() => setIsDescExpanded(v => !v)}
              aria-expanded={isDescExpanded}
            >
              {isDescExpanded ? 'Ver menos' : 'Ver más'}
            </button>
          )}
          <div className="mt-3">
            <label className="block text-xs text-gray-600 mb-1">Color</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {filteredColors.length > 0 ? filteredColors.map(c => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setSelectedColor(c.value)}
                  className={`h-7 px-2 rounded-full border text-xs flex items-center gap-2 ${selectedColor === c.value ? 'ring-2 ring-gray-900 border-gray-900' : 'border-gray-300'}`}
                  aria-label={c.label}
                  title={c.label}
                >
                  <span className="inline-block h-3.5 w-3.5 rounded-full" style={{ backgroundColor: c.hex }}></span>
                  {c.label}
                </button>
              )) : (
                <span className="text-xs text-gray-500">Sin colores disponibles para {selectedMaterial}</span>
              )}
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button className="flex-1" onClick={() => {
              const colorObj = COLORS.find(c => c.value === selectedColor) || null
              onAdd(product, colorObj, selectedMaterial)
            }}>Añadir al carrito</Button>
            <a className="flex-1" href={`mailto:${contactEmail}?subject=${encodeURIComponent('Consulta: ' + product.name)}`}>
              <Button variant="outline" className="w-full">Consulta</Button>
            </a>
          </div>
        </div>
      </CardContent>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setIsOpen(false)}>
          <div className="relative max-w-4xl w-full px-4" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
              <img src={mainImage} alt={product.name} className="w-full h-full object-contain" />
              <button
                type="button"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full px-3 py-2 text-sm"
                onClick={() => setSelectedIndex((selectedIndex - 1 + images.length) % images.length)}
                aria-label="Anterior"
              >
                ‹
              </button>
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full px-3 py-2 text-sm"
                onClick={() => setSelectedIndex((selectedIndex + 1) % images.length)}
                aria-label="Siguiente"
              >
                ›
              </button>
              <button
                type="button"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full px-3 py-1 text-sm"
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>
            {imageObjs.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {imageObjs.map((img, idx) => (
                  <button
                    key={'modal-' + img.src + idx}
                    type="button"
                    onClick={() => setSelectedIndex(idx)}
                    className={`h-14 w-20 rounded-md overflow-hidden border ${idx === selectedIndex ? 'ring-2 ring-white border-white' : 'border-white/40'}`}
                    aria-label={`Vista ${idx + 1}`}
                  >
                    <img src={img.src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}


