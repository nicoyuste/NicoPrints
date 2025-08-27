const PRODUCTS = [
  {
    id: 'recogecables-universal',
    name: 'Recogecables universal',
    price: 3,
    currency: 'EUR',
    img: `${import.meta.env.BASE_URL}products/recogecables-universal_principal.jpg`,
    images: [
      `${import.meta.env.BASE_URL}products/recogecables-universal_principal.jpg`,
      { src: `${import.meta.env.BASE_URL}products/recogecables-universal-amarillo.jpg`, colorValue: 'B_PLA_Ba_Yell' },
      { src: `${import.meta.env.BASE_URL}products/recogecables-universal-verde.jpg`, colorValue: 'B_PLA_Ba_Green' },
    ],
    category: 'Organización',
    material: ['PLA', 'PLA Mate'],
    description: 'Recogecables para ordenar cables de teléfono, USB o USB‑C, etc... Mantienen los cables recogidos y evitan enredos; ideales para escritorio, mesita o transporte.',
  },
  {
    id: 'estante-cajon-secreto-skadis',
    name: 'Estante con cajón secreto para SKÅDIS (IKEA)',
    price: 4.25,
    currency: 'EUR',
    img: `${import.meta.env.BASE_URL}products/estante-cajon-secreto-skadis_4.jpg`,
    images: [
      { src: `${import.meta.env.BASE_URL}products/estante-cajon-secreto-skadis_0.jpg`, colorValue: 'B_PLA_Ma_White' },
      { src: `${import.meta.env.BASE_URL}products/estante-cajon-secreto-skadis_1.jpg`, colorValue: 'B_PLA_Ma_White' },
      { src: `${import.meta.env.BASE_URL}products/estante-cajon-secreto-skadis_2.jpg`, colorValue: 'B_PLA_Ma_White' },
      { src: `${import.meta.env.BASE_URL}products/estante-cajon-secreto-skadis_3.jpg`, colorValue: 'B_PLA_Ma_White' },
      { src: `${import.meta.env.BASE_URL}products/estante-cajon-secreto-skadis_4.jpg`, colorValue: 'B_PLA_Ma_White' },
    ],
    category: 'Organización',
    material: ['PLA', 'PLA Mate'],
    description: 'Pequeño estante con cajón oculto compatible con paneles SKÅDIS de IKEA. Ideal para guardar objetos pequeños fuera de la vista y mantener tu tablero ordenado. Se cuelga en segundos y queda firme; perfecto para el escritorio o el taller.',
  },
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
  }
]

export default PRODUCTS