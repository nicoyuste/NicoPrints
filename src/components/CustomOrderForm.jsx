import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CONTACT_EMAIL } from '@/config'

export default function CustomOrderForm() {
  return (
    <form className="grid gap-3" onSubmit={(e) => { e.preventDefault();
      const form = e.currentTarget;
      const name = form.elements.namedItem('name').value.trim();
      const email = form.elements.namedItem('email').value.trim();
      const link = form.elements.namedItem('link').value.trim();
      const details = form.elements.namedItem('details').value.trim();
      if (name.length < 2) { alert('Por favor, indica un nombre válido.'); return }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('Introduce un email válido.'); return }
      if (details.length < 20) { alert('Cuéntame un poco más de detalles (mínimo 20 caracteres).'); return }
      const subject = encodeURIComponent('Encargo a medida - NicoPrints');
      const linkLine = link ? `\nEnlace de referencia: ${link}` : '';
      const body = encodeURIComponent(`Nombre: ${name}\nEmail: ${email}${linkLine}\n\nDetalles del encargo:\n${details}`);
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    }}>
      <div className="grid sm:grid-cols-2 gap-3">
        <Input required name="name" placeholder="Tu nombre" />
        <Input required type="email" name="email" placeholder="Tu email" />
      </div>
      <Input type="url" name="link" placeholder="Enlace de referencia (Printables, Thingiverse, etc.)" />
      <textarea required name="details" rows="5" placeholder="Describe tu pieza: medidas, material (PLA/PETG), color, referencias..." className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900"></textarea>
      <div className="flex gap-2">
        <Button type="submit">Enviar solicitud</Button>
        <a href={`mailto:${CONTACT_EMAIL}`}><Button variant="outline">Escribir email</Button></a>
      </div>
    </form>
  )
}


