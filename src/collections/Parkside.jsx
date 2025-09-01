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
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold">Parkside (Lidl)</h3>
          <p className="text-gray-600 mt-1 max-w-3xl">Accesorios y soportes compatibles con herramientas Parkside. Piezas prácticas y resistentes para el taller.</p>
        </div>
        <a href="#"><Button variant="outline">Volver</Button></a>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={onAdd} contactEmail={CONTACT_EMAIL} />
        ))}
      </div>
    </section>
  )
}


