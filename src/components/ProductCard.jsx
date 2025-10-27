import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/format'
import { COLORS } from '@/colors'

export default function ProductCard({ product, onAdd, contactEmail }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const materials = Array.isArray(product.material) ? product.material : [product.material]
  const descRef = useRef(null)
  const imageObjs = Array.isArray(product.images)
    ? product.images.map(img => (typeof img === 'string' ? { src: img, colorValue: null } : img))
    : []

  const mainImage = imageObjs[Math.min(selectedIndex, imageObjs.length - 1)]?.src
  const availableColors = COLORS.filter(c => materials.includes(c.material))
  const canPickColor = product?.allowColorSelection !== false

  return (
    <Card className="rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        <div className="aspect-video overflow-hidden bg-secondary">
          <a href={`#p/${product.slug || product.id}`} className="block w-full h-full" aria-label="Ver detalles">
            {mainImage ? (
              <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Sin imagen</div>
            )}
          </a>
        </div>
        {imageObjs.length > 1 && (
          <div className="px-4 pt-3 flex gap-2 overflow-x-auto no-scrollbar">
            {imageObjs.map((img, idx) => (
              <button
                key={img.src + idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`flex-none h-12 w-16 rounded-md overflow-hidden p-0 bg-secondary border ${idx === selectedIndex ? 'border-foreground' : 'border-transparent'}`}
                aria-label={`Vista ${idx + 1}`}
              >
                <img src={img.src} alt="" className="block h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-medium leading-tight">{product.name}</h4>
              <p className="text-sm text-muted-foreground">{materials.join('/')}</p>
            </div>
            <Badge>{formatPrice(product.price, product.currency)}</Badge>
          </div>
          <p ref={descRef} className="text-sm text-muted-foreground mt-2 line-clamp-3">{product.description}</p>
          {canPickColor && availableColors.length > 0 && (
            <div className="mt-3">
              <label className="block text-xs text-muted-foreground mb-1">Colores disponibles</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {availableColors.slice(0, 12).map(c => (
                  <span key={c.value} className="inline-block h-3.5 w-3.5 rounded-full border border-border" title={c.label} aria-label={c.label} style={{ backgroundColor: c.hex }}></span>
                ))}
              </div>
            </div>
          )}
          <div className="mt-4">
            <a href={`#p/${product.slug || product.id}`}>
              <Button variant="outline" className="w-full">Ver detalles</Button>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


