// Catálogo centralizado de productos

export const products = [
  {
    slug: 'parkside-two-batt-wall-mount',
    collectionId: 'parkside',
    name: 'Soporte pared 2 baterías Parkside',
    price: 7,
    currency: 'EUR',
    img: `${import.meta.env.BASE_URL}products/parkside-two-batt-wall-mount_main.png`,
    images: [
      { src: `${import.meta.env.BASE_URL}products/parkside-two-batt-wall-mount_main.png`, colorValue: 'PRU-PETG-Grey' },
      { src: `${import.meta.env.BASE_URL}products/parkside-two-batt-wall-mount_1.png`, colorValue: 'PRU-PETG-Grey' },
      { src: `${import.meta.env.BASE_URL}products/parkside-two-batt-wall-mount_2.png`, colorValue: 'PRU-PETG-Grey' },
      { src: `${import.meta.env.BASE_URL}products/parkside-two-batt-wall-mount_3.png`, colorValue: 'PRU-PETG-Grey' },
      { src: `${import.meta.env.BASE_URL}products/parkside-two-batt-wall-mount_4.png`, colorValue: 'PRU-PETG-Grey' },
    ],
    category: 'Taller',
    material: ['PETG'],
    description: 'Soporte para pared que sujeta dos baterías de herramientas Parkside con ajuste firme. Impreso en PETG para mayor resistencia y durabilidad. Compatible con baterías Parkside de 20V (línea más reciente).',
    longDescription: 'Soporte robusto para organizar dos baterías Parkside de 20V en la pared. El diseño garantiza un ajuste firme y seguro, evitando caídas accidentales. Incluye agujeros avellanados para tornillería estándar y tolerancias pensadas para impresión en PETG. Ideal para talleres domésticos y para aprovechar mejor el espacio en paneles y estanterías.',
  },
  {
    slug: 'mtg-deck-box-simple',
    collectionId: 'magic',
    name: 'Deck box MTG (sencillo)',
    price: 12,
    currency: 'EUR',
    img: `${import.meta.env.BASE_URL}products/placeholder_mtg_deckbox_main.png`,
    images: [
      { src: `${import.meta.env.BASE_URL}products/placeholder_mtg_deckbox_main.png`, colorValue: 'B_PLA_Ma_Black' },
      { src: `${import.meta.env.BASE_URL}products/placeholder_mtg_deckbox_1.png`, colorValue: 'B_PLA_Ba_Red' },
      { src: `${import.meta.env.BASE_URL}products/placeholder_mtg_deckbox_2.png`, colorValue: 'B_PLA_Ba_Blue' },
    ],
    category: 'Magic: The Gathering',
    material: ['PLA', 'PLA Mate'],
    description: 'Caja para mazo de cartas Magic: The Gathering con tapa a presión y logo MTG en relieve. Capacidad aproximada para 100 cartas con fundas estándar. Borde interior suave para proteger las fundas.',
    longDescription: 'Caja para mazo de 100 cartas con diseño minimalista. La tapa a presión mantiene el contenido seguro durante el transporte. Impreso en PLA o PLA Mate según preferencia estética, con opciones de color. Posibilidad de personalizar logo/texto en encargos a medida.',
  },
]

export const productBySlug = new Map(products.map(p => [p.slug, p]))


