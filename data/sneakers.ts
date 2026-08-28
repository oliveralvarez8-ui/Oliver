// Base de datos "mock" (de mentira) del catálogo de sneakers.
// En la vida real esto vendría de una API que analiza la foto con IA.
// Aquí simulamos ese análisis eligiendo una entrada al azar de esta lista,
// para poder probar todo el flujo de la app sin depender de servicios externos.
//
// Las imágenes son placeholders generados por placehold.co (no son fotos reales
// de producto, para evitar problemas de derechos de imagen en la demo).

import { SneakerInfo } from '../types/sneaker';

const img = (texto: string, color: string) =>
  `https://placehold.co/600x600/${color}/ffffff/png?text=${encodeURIComponent(texto)}`;

export const SNEAKER_CATALOG: SneakerInfo[] = [
  {
    id: 'aj1-chicago',
    marca: 'Jordan',
    modelo: 'Air Jordan 1 High',
    colorway: 'Chicago',
    anioLanzamiento: 1985,
    precioOriginal: 65,
    precioEstimadoActual: 1600,
    imagen: img('AJ1 Chicago', 'c8102e'),
  },
  {
    id: 'aj1-bred',
    marca: 'Jordan',
    modelo: 'Air Jordan 1 High',
    colorway: 'Bred',
    anioLanzamiento: 1985,
    precioOriginal: 65,
    precioEstimadoActual: 950,
    imagen: img('AJ1 Bred', '1a1a1a'),
  },
  {
    id: 'aj4-bred',
    marca: 'Jordan',
    modelo: 'Air Jordan 4',
    colorway: 'Bred',
    anioLanzamiento: 1989,
    precioOriginal: 65,
    precioEstimadoActual: 420,
    imagen: img('AJ4 Bred', '2b2b2b'),
  },
  {
    id: 'aj4-white-cement',
    marca: 'Jordan',
    modelo: 'Air Jordan 4',
    colorway: 'White Cement',
    anioLanzamiento: 1989,
    precioOriginal: 65,
    precioEstimadoActual: 380,
    imagen: img('AJ4 White Cement', 'e8e4d8'),
  },
  {
    id: 'aj11-concord',
    marca: 'Jordan',
    modelo: 'Air Jordan 11',
    colorway: 'Concord',
    anioLanzamiento: 1995,
    precioOriginal: 125,
    precioEstimadoActual: 300,
    imagen: img('AJ11 Concord', '111133'),
  },
  {
    id: 'yeezy-350-zebra',
    marca: 'Adidas',
    modelo: 'Yeezy Boost 350 V2',
    colorway: 'Zebra',
    anioLanzamiento: 2017,
    precioOriginal: 220,
    precioEstimadoActual: 260,
    imagen: img('Yeezy 350 Zebra', 'd9d9d9'),
  },
  {
    id: 'yeezy-350-cream',
    marca: 'Adidas',
    modelo: 'Yeezy Boost 350 V2',
    colorway: 'Cream White',
    anioLanzamiento: 2017,
    precioOriginal: 220,
    precioEstimadoActual: 240,
    imagen: img('Yeezy 350 Cream', 'e6dcc8'),
  },
  {
    id: 'adidas-samba-og',
    marca: 'Adidas',
    modelo: 'Samba OG',
    colorway: 'Cloud White/Core Black',
    anioLanzamiento: 1972,
    precioOriginal: 90,
    precioEstimadoActual: 100,
    imagen: img('Samba OG', 'f2f2f2'),
  },
  {
    id: 'balenciaga-triple-s',
    marca: 'Balenciaga',
    modelo: 'Triple S',
    colorway: 'White/Black/Red',
    anioLanzamiento: 2017,
    precioOriginal: 850,
    precioEstimadoActual: 700,
    imagen: img('Triple S', '3a3a3a'),
  },
  {
    id: 'balenciaga-track',
    marca: 'Balenciaga',
    modelo: 'Track',
    colorway: 'Black/Grey/Yellow',
    anioLanzamiento: 2018,
    precioOriginal: 895,
    precioEstimadoActual: 620,
    imagen: img('Balenciaga Track', '4a4a2a'),
  },
  {
    id: 'nb-550-white-green',
    marca: 'New Balance',
    modelo: '550',
    colorway: 'White/Green',
    anioLanzamiento: 1989,
    precioOriginal: 80,
    precioEstimadoActual: 120,
    imagen: img('NB 550', '2f4f3f'),
  },
  {
    id: 'nb-2002r-protection-pack',
    marca: 'New Balance',
    modelo: '2002R',
    colorway: 'Protection Pack Rain Cloud',
    anioLanzamiento: 2021,
    precioOriginal: 150,
    precioEstimadoActual: 230,
    imagen: img('NB 2002R', '8a8a8a'),
  },
  {
    id: 'nike-dunk-low-panda',
    marca: 'Nike',
    modelo: 'Dunk Low',
    colorway: 'Panda (Black/White)',
    anioLanzamiento: 2021,
    precioOriginal: 110,
    precioEstimadoActual: 130,
    imagen: img('Dunk Low Panda', '1c1c1c'),
  },
  {
    id: 'nike-air-force-1-white',
    marca: 'Nike',
    modelo: 'Air Force 1 Low',
    colorway: "Triple White",
    anioLanzamiento: 1982,
    precioOriginal: 90,
    precioEstimadoActual: 100,
    imagen: img('Air Force 1', 'ffffff'),
  },
  {
    id: 'nike-air-max-1-og',
    marca: 'Nike',
    modelo: 'Air Max 1',
    colorway: 'OG Red',
    anioLanzamiento: 1987,
    precioOriginal: 65,
    precioEstimadoActual: 180,
    imagen: img('Air Max 1', 'b31942'),
  },
  {
    id: 'nike-sb-dunk-low-travis',
    marca: 'Nike',
    modelo: 'SB Dunk Low',
    colorway: 'Travis Scott Cactus Jack',
    anioLanzamiento: 2020,
    precioOriginal: 150,
    precioEstimadoActual: 2200,
    imagen: img('SB Dunk Travis', '5a3a1a'),
  },
  {
    id: 'converse-chuck-70',
    marca: 'Converse',
    modelo: 'Chuck 70 High',
    colorway: 'Black',
    anioLanzamiento: 1970,
    precioOriginal: 85,
    precioEstimadoActual: 90,
    imagen: img('Chuck 70', '000000'),
  },
  {
    id: 'vans-old-skool',
    marca: 'Vans',
    modelo: 'Old Skool',
    colorway: 'Black/White',
    anioLanzamiento: 1977,
    precioOriginal: 65,
    precioEstimadoActual: 70,
    imagen: img('Old Skool', '000000'),
  },
];

// Modo demo (fase 1): elige una entrada al azar del catálogo, sin llamar a
// ninguna API. Ya no lo usa la pantalla de Escáner (que ahora llama al
// backend real), pero se deja aquí por si quieres volver a un modo sin conexión.
export function identificarSneaker(): SneakerInfo {
  const index = Math.floor(Math.random() * SNEAKER_CATALOG.length);
  return SNEAKER_CATALOG[index];
}

// La API de Claude solo nos da marca/modelo/colorway (no inventa año ni precios).
// Para no mostrar datos vacíos en pantalla, buscamos si esa marca+modelo ya
// existe en nuestro catálogo local y, si coincide, reutilizamos su año/precio
// como referencia orientativa. Si no hay coincidencia, devuelve undefined y la
// pantalla debe mostrar esos campos como "N/D" en vez de inventar un valor.
export function buscarEnCatalogoPorNombre(
  marca: string,
  modelo: string
): SneakerInfo | undefined {
  const marcaNorm = marca.trim().toLowerCase();
  const modeloNorm = modelo.trim().toLowerCase();
  if (!marcaNorm || !modeloNorm) return undefined;

  return SNEAKER_CATALOG.find(
    (s) =>
      s.marca.toLowerCase() === marcaNorm &&
      (s.modelo.toLowerCase() === modeloNorm ||
        s.modelo.toLowerCase().includes(modeloNorm) ||
        modeloNorm.includes(s.modelo.toLowerCase()))
  );
}
