import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/format'

export default function ProductCard({ product, onAdd, contactEmail }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const images = product.images && product.images.length > 0 ? product.images : [product.img]
  const mainImage = images[Math.min(selectedIndex, images.length - 1)]

  return (
    <Card className="rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        <div className="aspect-video overflow-hidden bg-gray-100 rounded-2xl">
          <button type="button" className="w-full h-full focus:outline-none focus-visible:outline-none cursor-zoom-in" onClick={() => setIsOpen(true)} aria-label="Abrir galería">
            <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
          </button>
        </div>
        {images.length > 1 && (
          <div className="px-4 pt-3 flex gap-2 overflow-x-auto">
            {images.map((src, idx) => (
              <button
                key={src + idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`h-12 w-16 rounded-md overflow-hidden border ${idx === selectedIndex ? 'ring-2 ring-gray-900 border-gray-900' : 'border-gray-200'}`}
                aria-label={`Vista ${idx + 1}`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-medium leading-tight">{product.name}</h4>
              <p className="text-sm text-gray-500">{product.material} · {product.color} · {product.category}</p>
            </div>
            <Badge>{formatPrice(product.price, product.currency)}</Badge>
          </div>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description}</p>
          <div className="mt-4 flex gap-2">
            <Button className="flex-1" onClick={() => onAdd(product)}>Añadir al carrito</Button>
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
            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {images.map((src, idx) => (
                  <button
                    key={'modal-' + src + idx}
                    type="button"
                    onClick={() => setSelectedIndex(idx)}
                    className={`h-14 w-20 rounded-md overflow-hidden border ${idx === selectedIndex ? 'ring-2 ring-white border-white' : 'border-white/40'}`}
                    aria-label={`Vista ${idx + 1}`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
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


