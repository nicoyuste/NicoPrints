import { Button } from '@/components/ui/button'
import { CONTACT_EMAIL } from '@/config'
import ProductCard from '@/components/ProductCard'

const products = [
  {
    id: 'parkside-two-batt-wall-mount',
    name: 'Soporte pared 2 baterías Parkside',
    price: 7,
    currency: 'EUR',
    img: `${import.meta.env.BASE_URL}products/parkside_two_batteries_wall_mount.jpeg`,
    images: [
      { src: `${import.meta.env.BASE_URL}products/parkside_two_batteries_wall_mount.jpeg`, colorValue: 'PRU-PETG-Grey' },
    ],
    category: 'Taller',
    material: ['PETG'],
    description: 'Soporte para pared que sujeta dos baterías de herramientas Parkside con ajuste firme. Impreso en PETG para mayor resistencia y durabilidad. 100% compatible con baterías Parkside.',
  },
]

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
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow">Colección Parkside</h1>
            <p className="text-white/90 mt-1 md:mt-2 drop-shadow">Accesorios y soportes compatibles con herramientas Parkside, diseñados para optimizar tu espacio de trabajo. Soluciones robustas y prácticas, impresas en 3D, para ordenar, proteger y tener siempre a mano tus herramientas.</p>
          </div>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={onAdd} contactEmail={CONTACT_EMAIL} />
        ))}
      </div>
    </section>
  )
}


