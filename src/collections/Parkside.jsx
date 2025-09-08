import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CONTACT_EMAIL } from '@/config'
import ProductCard from '@/components/ProductCard'
import { products as allProducts } from '@/data/products'

export default function Parkside({ onAdd }) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="relative rounded-3xl overflow-hidden">
        {/* Imagen de taller con hombre (placeholder Unsplash). Sustituir por propia si se desea. */}
        <img
          src={`${import.meta.env.BASE_URL}banner_parkside.png`}
          alt="Taller de herramientas"
          className="w-full h-56 sm:h-72 md:h-80 object-cover"
        />
        {/* Degradado hacia verde Parkside (0 → sólido) */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent to-[#0b7a3b]"></div>
        {/* Zona verde sólida con logo */}
        <div className="absolute inset-y-0 right-0 w-1/3 min-w-[220px] hidden sm:flex items-center justify-center">
          <div className="w-full h-full bg-[#0b7a3b] flex items-center justify-center">
            <div className="p-4">
              {/* Sustituir la ruta si añades el logo en public/parkside-logo.svg */}
              <img
                src={`${import.meta.env.BASE_URL}parkside-logo.svg`}
                alt="Logo Parkside"
                className="h-20 w-auto mx-auto"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </div>
          </div>
        </div>
        {/* Título superpuesto opcional en el lado izquierdo */}
        <div className="absolute inset-0 flex items-end">
          <div className="p-4 sm:p-6 md:p-8 max-w-xl">
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow">Colección accesorios Parkside</h1>
            <p className="text-white/90 mt-1 md:mt-2 drop-shadow">Accesorios compatibles con herramientas Parkside, diseñados para tu espacio de trabajo. Soluciones robustas y prácticas, impresas en 3D, para ordenar tus herramientas.</p>
          </div>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {allProducts.filter(p => p.collectionId === 'parkside').map((p) => (
          <ProductCard key={p.slug} product={p} onAdd={onAdd} contactEmail={CONTACT_EMAIL} />
        ))}
        <Card className="rounded-2xl overflow-hidden">
          <CardContent className="p-0 bg-[#0b7a3b] h-full flex flex-col min-h-[24rem] sm:min-h-[26rem]">
            {/* Foto superior (crece/encoge para ocupar el espacio disponible) */}
            <div className="relative overflow-hidden bg-gray-100 flex-1 min-h-[10rem]">
              <img
                src={`${import.meta.env.BASE_URL}parkside_a_medida.png`}
                alt="Soportes a medida Parkside"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="h-12 sm:h-14 overflow-hidden bg-[#0b7a3b] flex items-center justify-center">
              <div className="text-white text-sm sm:text-base font-semibold px-4 text-center">Soportes a medida</div>
            </div>
            <div className="p-4 text-white text-center">
              <h4 className="font-medium leading-tight">¿Necesitas un soporte personalizado?</h4>
              <p className="text-sm text-white/90 mt-2">Diseño e imprimo bajo pedido soportes para baterías Parkside u otras marcas. Cuéntame tu idea y lo adapto a tu espacio y herramientas.</p>
              <div className="mt-3 flex flex-col sm:flex-row gap-2 items-center justify-center">
                <a href={`${import.meta.env.BASE_URL}encargos.html`}>
                  <Button className="bg-white text-gray-900 hover:bg-white/90">Solicitar a medida</Button>
                </a>
                <a href={`mailto:${CONTACT_EMAIL}`}>
                  <Button className="bg-white text-gray-900 hover:bg-white/90 w-full sm:w-auto">Escribir email</Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}


