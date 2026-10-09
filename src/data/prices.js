export const vehicles = [
  { id: 'moto', short: 'Moto', label: 'Moto', note: '' },
  { id: 'sedan', short: 'Sedán', label: 'Sedán / auto pequeño', note: '' },
  { id: 'suv-m', short: 'SUV mediano', label: 'SUV mediano / camioneta', note: '' },
  {
    id: 'suv-g',
    short: 'SUV grande',
    label: 'SUV grande / camioneta',
    note: '3 líneas de asientos',
  },
  { id: 'suv-xl', short: 'XL SUV', label: 'XL SUV / camioneta', note: '' },
]

export const washes = [
  {
    id: 'express',
    name: 'Express',
    prices: [100, 130, 160, 170, 190],
    summary: 'Lavado exterior, rines, plásticos básicos y secado a mano.',
    description:
      'Lavado exterior, rines, plásticos básicos y secado a mano con toallas de microfibra.',
    includes: ['Lavado exterior', 'Rines', 'Plásticos básicos', 'Secado con microfibra'],
  },
  {
    id: 'completo',
    name: 'Completo',
    prices: [null, 190, 220, 250, 320],
    summary: 'Exterior, interiores y abrillantado de llantas.',
    description:
      'Lavado exterior, descontaminar y desgrasar rines y salpicadera, secado a mano con toallas de microfibra, aspirar, limpieza de consola y paneles de puerta, cristales y plásticos interiores y exteriores, abrillantado de llantas.',
    includes: [
      'Lavado exterior',
      'Rines y salpicadera',
      'Secado con microfibra',
      'Aspirado',
      'Consola y paneles',
      'Cristales y plásticos',
      'Abrillantado de llantas',
    ],
  },
  {
    id: 'deluxe',
    name: 'Deluxe',
    prices: [null, 340, 370, 400, 450],
    summary: 'Todo lo del Completo, más cera líquida.',
    description:
      'Lavado exterior, cera líquida, descontaminar y desgrasar rines y salpicadera, secado a mano con toallas de microfibra, aspirar, limpieza de consola, paneles, cristales y plásticos interiores y exteriores, abrillantado de llantas.',
    includes: ['Todo lo del Completo', 'Cera líquida'],
  },
  {
    id: 'uber',
    name: 'Uber Special',
    special: true,
    prices: [null, 120, 160, 170, 200],
    summary: 'Precio especial con comprobante vigente.',
    description: 'Válido únicamente presentando comprobante vigente de la plataforma.',
    includes: ['Con comprobante vigente'],
  },
  {
    id: 'happy-hour',
    name: 'Happy Hour Express',
    special: true,
    prices: [null, 100, 100, 120, 150],
    summary: 'Express a precio reducido, de 2 a 5.',
    description: 'El lavado Express a precio reducido. Aplicable solo en el horario de 2 a 5.',
    includes: ['Solo de 2 a 5'],
  },
]

export const highlights = [
  {
    title: 'Express desde $100',
    text: 'Lavado exterior, rines y secado a mano',
  },
  {
    title: 'Happy Hour de 2 a 5',
    text: 'Express para sedán y SUV mediano a $100',
  },
  {
    title: 'Uber Special',
    text: 'Precio especial con tu comprobante vigente',
  },
]
