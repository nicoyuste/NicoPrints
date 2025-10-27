import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CONTACT_EMAIL } from '@/config'
import ProductCard from '@/components/ProductCard'
import { products as allProducts } from '@/data/products'

export default function Magic({ onAdd }) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="relative rounded-3xl overflow-hidden">
        <img
          src={`${import.meta.env.BASE_URL}magic-banner.jpg`}
          alt="Magic: The Gathering"
          className="w-full h-56 sm:h-72 md:h-80 object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent to-[#D6632C]"></div>
        <div className="absolute inset-y-0 right-0 w-1/3 min-w-[220px] hidden sm:flex items-center justify-center">
          <div className="w-full h-full bg-[#D6632C] flex items-center justify-center">
            <div className="p-4">
              <img
                src={`${import.meta.env.BASE_URL}magic-logo.png`}
                alt="Logo MTG"
                className="h-28 md:h-32 w-auto mx-auto"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </div>
          </div>
        </div>
        <div className="absolute inset-0 flex items-end">
          <div className="p-4 sm:p-6 md:p-8 max-w-xl">
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow">Colección Magic: The Gathering</h1>
            <p className="text-white/90 mt-1 md:mt-2 drop-shadow">Accesorios impresos en 3D para tus cartas: cajas para mazos, contadores y más, pensados para mesa y transporte.</p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {allProducts.filter(p => p.collectionId === 'magic').map((p) => (
          <ProductCard key={p.slug} product={p} onAdd={onAdd} contactEmail={CONTACT_EMAIL} />
        ))}
        <Card className="rounded-2xl overflow-hidden">
          <CardContent className="p-0 bg-primary h-full flex flex-col min-h-[24rem] sm:min-h-[26rem]">
            <div className="relative overflow-hidden bg-gray-100 flex-1 min-h-[10rem]">
              <img
                src={`${import.meta.env.BASE_URL}deck_examples.jpg`}
                alt="Deck boxes a medida"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="h-12 sm:h-14 overflow-hidden bg-primary flex items-center justify-center">
              <div className="text-primary-foreground text-sm sm:text-base font-semibold px-4 text-center">Accesorios a medida</div>
            </div>
            <div className="p-4 text-primary-foreground text-center">
              <h4 className="font-medium leading-tight">¿Buscas algo específico para tu mazo?</h4>
              <p className="text-sm text-primary-foreground/90 mt-2">Diseño e imprimo por encargo deck boxes con el logo y el texto que mas te guste.</p>
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




