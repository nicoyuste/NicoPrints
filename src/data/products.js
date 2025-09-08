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
    slug: 'mtg-deck-box-100-cartas',
    collectionId: 'magic',
    name: 'Deck box MTG 100 cartas',
    price: 12,
    currency: 'EUR',
    img: `${import.meta.env.BASE_URL}products/deck_box_100_green_yellow.jpg`,
    images: [
      { src: `${import.meta.env.BASE_URL}products/deck_box_100_green_yellow.jpg`, colorValue: 'B_PLA_Ba_Green' },
      { src: `${import.meta.env.BASE_URL}products/deck_box_100_green_yellow_2.jpg`, colorValue: 'B_PLA_Ba_Green' },
      { src: `${import.meta.env.BASE_URL}products/deck_box_100_green_yellow_3.jpg`, colorValue: 'B_PLA_Ba_Yellow' },
      { src: `${import.meta.env.BASE_URL}products/deck_box_100_white_black.jpg`, colorValue: 'B_PLA_Ma_White' },
      { src: `${import.meta.env.BASE_URL}products/deck_box_100_black_yellow.jpg`, colorValue: 'B_PLA_Ba_Black' },
      { src: `${import.meta.env.BASE_URL}products/deck_box_100_red_blue.jpg`, colorValue: 'B_PLA_Ba_Red' },
    ],
    otherImages: [
      { src: `${import.meta.env.BASE_URL}products/deck_box_100_other_blue_green.jpg`},
      { src: `${import.meta.env.BASE_URL}products/deck_box_100_other_red_black.jpg`},
      { src: `${import.meta.env.BASE_URL}products/deck_box_100_other_red_white.jpg`},
    ],
    category: 'Magic: The Gathering',
    material: ['PLA', 'PLA Mate'],
    description: 'Deck box para 100 cartas (ideal Commander). Cierre con imanes para mayor seguridad. Protege las cartas con o sin funda gracias al ajuste preciso y al cuerpo rígido. Logo superior personalizable.',
    longDescription: 'Caja para mazos de hasta 100 cartas, compatible con fundas estándar. El cierre imantado ayuda a que no se abra durante el transporte. El ajuste interior mantiene las cartas firmes sin holguras y la rigidez de la impresión ofrece protección fiable. El logotipo de la tapa puede personalizarse (texto o imagen); si quieres un diseño distinto al de las fotos, ponte en contacto. Impreso en PLA o PLA Mate con varias opciones de color.',
  },
]

export const productBySlug = new Map(products.map(p => [p.slug, p]))


