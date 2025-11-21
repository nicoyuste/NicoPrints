import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { productBySlug } from '@/data/products'
import ProductCard from '@/components/ProductCard'
import { formatPrice } from '@/lib/format'
import { COLORS } from '@/colors'

export default function ProductDetail({ slug, onAdd, onBack }) {
  const product = productBySlug.get(slug)
  const canPickColor = product?.allowColorSelection !== false
  const [selectedIndex, setSelectedIndex] = useState(0)
  const materials = useMemo(() => (Array.isArray(product?.material) ? product.material : [product?.material].filter(Boolean)), [product])
  const parts = Array.isArray(product?.parts) ? product.parts : []
  const [selectedMaterial, setSelectedMaterial] = useState(materials[0] || '')
  const filteredColors = COLORS.filter(c => c.material === selectedMaterial)
  const [selectedColor, setSelectedColor] = useState(filteredColors[0]?.value || '')
  const [selectedByPart, setSelectedByPart] = useState({})
  const traits = Array.isArray(product?.traits) ? product.traits : []
  const [selectedTraits, setSelectedTraits] = useState({})
  const [errorMsg, setErrorMsg] = useState('')
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

  // Inicializar selección de traits cuando cambia el producto
  useEffect(() => {
    if (!product || traits.length === 0) { setSelectedTraits({}); return }
    const init = {}
    for (const trait of traits) {
      const first = Array.isArray(trait.options) && trait.options.length > 0 ? trait.options[0] : null
      init[trait.id] = first ? String(first.value) : ''
    }
    setSelectedTraits(init)
  }, [product])

  const computedPrice = useMemo(() => {
    if (!product) return 0
    let base = product.price || 0
    if (traits.length > 0) {
      const baseTrait = traits.find(t => t.mode === 'base')
      if (baseTrait) {
        const val = selectedTraits[baseTrait.id]
        const opt = (baseTrait.options || []).find(o => String(o.value) === String(val))
        if (opt && typeof opt.price === 'number') base = opt.price
      }
      for (const t of traits) {
        if (t.mode !== 'addon') continue
        const val = selectedTraits[t.id]
        const opt = (t.options || []).find(o => String(o.value) === String(val))
        if (opt && typeof opt.price === 'number') base += opt.price
      }
    }
    return base
  }, [product, traits, selectedTraits])

  // Al abrir un producto o cambiar de slug, forzar scroll al inicio
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [slug])

  useEffect(() => {
    if (!product) return
    const first = filteredColors[0]?.value || ''
    setSelectedColor(prev => (filteredColors.some(c => c.value === prev) ? prev : first))
  }, [selectedMaterial])

  // Inicializar selección por partes cuando cambia el producto
  useEffect(() => {
    if (!product || parts.length === 0) { setSelectedByPart({}); return }
    const init = {}
    for (const part of parts) {
      const allowedMaterials = Array.isArray(part.materials) && part.materials.length > 0 ? part.materials : materials
      const material = allowedMaterials[0] || ''
      // No seleccionar color por defecto
      init[part.id] = { material, colorValue: '' }
    }
    setSelectedByPart(init)
  }, [product])

  function setPartMaterial(partId, material) {
    setSelectedByPart(prev => {
      const keepColor = prev[partId]?.colorValue && COLORS.some(c => c.material === material && c.value === prev[partId].colorValue)
      return { ...prev, [partId]: { material, colorValue: keepColor ? prev[partId].colorValue : '' } }
    })
    setErrorMsg('')
  }

  function setPartColor(partId, colorValue) {
    setSelectedByPart(prev => ({ ...prev, [partId]: { material: prev[partId]?.material || materials[0] || '', colorValue } }))
    setErrorMsg('')
  }

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

  const allPartsSelected = parts.length === 0 || parts.every(p => Boolean(selectedByPart[p.id]?.colorValue))

  return (
    <section className="max-w-6xl mx-auto px-4 py-10 overflow-x-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div>
          <div className="aspect-video overflow-hidden bg-gray-100 rounded-2xl">
            {mainImage ? (
              <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">Sin imagen</div>
            )}
          </div>
          {imageObjs.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
              {imageObjs.map((img, idx) => (
                <button
                  key={img.src + idx}
                  type="button"
                  onClick={() => setSelectedIndex(idx)}
                  className={`flex-none h-16 w-24 rounded-md overflow-hidden p-0 bg-gray-100 border ${idx === selectedIndex ? 'border-gray-900' : 'border-transparent'}`}
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
            <Badge className="bg-gray-900 text-white text-base px-3 py-1.5 rounded-md">{formatPrice(computedPrice, product.currency)}</Badge>
          </div>

          <div className="mt-3">
            <p ref={descRef} className={`text-sm text-gray-700 break-words${isDescExpanded ? '' : ' line-clamp-5'}`}>{product.description}</p>
            {showDescToggle && (
              <button type="button" className="text-xs underline text-gray-600 mt-1" onClick={() => setIsDescExpanded(v => !v)}>
                {isDescExpanded ? 'Ver menos' : 'Leer más'}
              </button>
            )}
          </div>

          {/* Traits (opciones que modifican precio) */}
          {traits.length > 0 && (
            <div className="mt-4 space-y-3">
              {traits.map(trait => (
                <div key={trait.id}>
                  <div className="text-xs text-gray-600 mb-1">{trait.label}</div>
                  <div className="flex flex-wrap gap-2">
                    {(trait.options || []).map(opt => (
                      <button
                        key={String(opt.value)}
                        type="button"
                        onClick={() => setSelectedTraits(prev => ({ ...prev, [trait.id]: String(opt.value) }))}
                        className={`h-8 px-3 rounded-full border text-xs bg-white text-gray-900 ${String(selectedTraits[trait.id]) === String(opt.value) ? 'ring-2 ring-gray-900 border-gray-900' : 'border-gray-300'}`}
                        aria-label={opt.label}
                        title={opt.label}
                      >
                        {opt.label}{typeof opt.price === 'number' ? (
                          trait.mode === 'base'
                            ? ` — ${formatPrice(opt.price, product.currency)}`
                            : ` — +${formatPrice(opt.price, product.currency)}`
                        ) : null}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Picker global (productos simples) */}
          {parts.length === 0 && materials.length > 1 && (
            <div className="mt-4">
              <div className="text-xs text-gray-600 mb-1">Material</div>
              <div className="flex flex-wrap gap-2 items-center">
                {materials.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSelectedMaterial(m)}
                    className={`h-8 px-3 rounded-full border text-xs bg-white text-gray-900 ${selectedMaterial === m ? 'ring-2 ring-gray-900 border-gray-900' : 'border-gray-300'}`}
                  >
                    {m}
                  </button>
                ))}
                <a href={`${import.meta.env.BASE_URL}materiales.html`} className="text-xs underline text-gray-600 ml-2" target="_blank" rel="noreferrer">¿Diferencias?</a>
              </div>
            </div>
          )}

          {parts.length === 0 ? (
            canPickColor ? (
              <div className="mt-4">
                <div className="text-xs text-gray-600 mb-1">Color</div>
                <div className="flex flex-wrap gap-2">
                  {filteredColors.length > 0 ? filteredColors.map(c => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setSelectedColor(c.value)}
                      className={`h-8 px-3 rounded-full border text-xs flex items-center gap-2 bg-white text-gray-900 ${selectedColor === c.value ? 'ring-2 ring-gray-900 border-gray-900' : 'border-gray-300'}`}
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
            ) : null
          ) : (
            <div className="mt-4 space-y-3">
              {parts.map((part, idx) => {
                const allowedMaterials = Array.isArray(part.materials) && part.materials.length > 0 ? part.materials : materials
                const sel = selectedByPart[part.id] || { material: allowedMaterials[0] || '', colorValue: '' }
                const colorsForPart = COLORS.filter(c => c.material === sel.material)
                const colorObj = COLORS.find(c => c.value === sel.colorValue) || null
                return (
                  <details key={part.id} className="border rounded-xl bg-white overflow-hidden">
                    <summary className="cursor-pointer select-none list-none flex items-center justify-between gap-3 px-3 py-2">
                      <span className="text-sm font-medium">{part.label}</span>
                      <span className="flex items-center gap-2 text-xs text-gray-700">
                        {sel.material ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-gray-300 bg-white text-gray-900">{sel.material}</span>
                        ) : null}
                        {colorObj ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-gray-300 bg-white text-gray-900">
                            <span className="inline-block h-3.5 w-3.5 rounded-full border" style={{ backgroundColor: colorObj.hex }}></span>
                            {colorObj.label}
                          </span>
                        ) : (
                          <span className="text-gray-500">Sin color</span>
                        )}
                        <span aria-hidden className="ml- text-lg md:text-xl leading-none">▾</span>
                      </span>
                    </summary>
                    <div className="px-3 pb-3">
                      {allowedMaterials.length > 1 && (
                        <div className="mb-2">
                          <div className="text-xs text-gray-600 mb-1">Material</div>
                          <div className="flex flex-wrap gap-2 items-center">
                            {allowedMaterials.map(m => (
                              <button
                                key={m}
                                type="button"
                                onClick={() => setPartMaterial(part.id, m)}
                                className={`h-8 px-3 rounded-full border text-xs bg-white text-gray-900 ${sel.material === m ? 'ring-2 ring-gray-900 border-gray-900' : 'border-gray-300'}`}
                              >
                                {m}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Color</div>
                        <div className="flex flex-wrap gap-2">
                          {colorsForPart.length > 0 ? colorsForPart.map(c => (
                            <button
                              key={c.value}
                              type="button"
                              onClick={() => setPartColor(part.id, c.value)}
                              className={`h-8 px-3 rounded-full border text-xs flex items-center gap-2 bg-white text-gray-900 ${sel.colorValue === c.value ? 'ring-2 ring-gray-900 border-gray-900' : 'border-gray-300'}`}
                              aria-label={c.label}
                              title={c.label}
                            >
                              <span className="inline-block h-4 w-4 rounded-full" style={{ backgroundColor: c.hex }}></span>
                              {c.label}
                            </button>
                          )) : (
                            <span className="text-xs text-gray-500">Sin colores disponibles para {sel.material}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </details>
                )
              })}
            </div>
          )}

          {/* CTA secundario: añadir al carrito bajo los colores */}
          <div className="mt-5">
            <Button className="w-full sm:w-auto" onClick={() => {
              if (parts.length > 0) {
                if (!allPartsSelected) {
                  setErrorMsg('Selecciona un color para todas las partes antes de continuar.')
                  return
                }
                const selectionsParts = parts.map(p => {
                  const s = selectedByPart[p.id] || { material: '', colorValue: '' }
                  const colorObj = COLORS.find(c => c.value === s.colorValue) || null
                  return { partId: p.id, partLabel: p.label, material: s.material || '', colorValue: s.colorValue || '', colorLabel: colorObj?.label || null }
                })
                const traitSelections = traits.map(t => {
                  const val = String(selectedTraits[t.id] || '')
                  const opt = (t.options || []).find(o => String(o.value) === val) || null
                  return { partId: `trait_${t.id}`, partLabel: t.label, material: '', colorValue: val, colorLabel: opt?.label || val }
                })
                const combined = [...selectionsParts, ...traitSelections]
                const productForCart = { ...product, price: computedPrice }
                onAdd(productForCart, combined)
              } else {
                const traitSelections = traits.map(t => {
                  const val = String(selectedTraits[t.id] || '')
                  const opt = (t.options || []).find(o => String(o.value) === val) || null
                  return { partId: `trait_${t.id}`, partLabel: t.label, material: '', colorValue: val, colorLabel: opt?.label || val }
                })
                if (traits.length > 0) {
                  const productForCart = { ...product, price: computedPrice }
                  onAdd(productForCart, traitSelections)
                } else {
                  const colorArg = canPickColor ? currentColorObj : null
                  onAdd(product, colorArg, selectedMaterial)
                }
              }
            }}>Añadir al carrito</Button>
            {errorMsg && (
              <div className="mt-2 text-xs text-red-600">{errorMsg}</div>
            )}
          </div>

          {/* CTA principal está bajo los colores */}
        </div>
      </div>

      {product.longDescription && (
        <div className="mt-10">
          <h3 className="font-semibold">Descripción</h3>
          <div
            className="text-sm text-gray-700 mt-2 break-words"
            dangerouslySetInnerHTML={{ __html: (product.longDescription || product.longDescripcion || '').replace(/\n/g, '<br/>') }}
          />
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
              <div className="w-2 flex-shrink-0"></div>
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

      
    </section>
  )
}


