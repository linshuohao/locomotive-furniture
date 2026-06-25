import type { z } from 'zod'
import type { ProductSchema } from '@/data/schemas'
import { staticImages } from '@/lib/assets/paths'

export type ProductCatalogEntry = z.input<typeof ProductSchema>

const productImage = (productId: string, index: 1 | 2 = 1) =>
  staticImages.product(Number(productId), index)

export const productCatalog: ProductCatalogEntry[] = [
  {
    id: '1',
    slug: 'eames-lounge-chair',
    name: 'Eames Lounge Chair & Ottoman',
    tagline: 'Charles & Ray Eames — an icon of modern comfort',
    description:
      'Designed in 1956 and produced by Vitra, the Eames Lounge Chair pairs molded plywood shells with supple leather upholstery and a die-cast aluminum base. The matching ottoman completes a lounge system prized in executive offices and living rooms worldwide.',
    category: 'Seating',
    price: 9295,
    currency: 'USD',
    images: [productImage('1', 1), productImage('1', 2)],
    variants: [
      {
        id: '1a',
        name: 'Palisander / Black Leather',
        color: '#3D2B1F',
        material: 'Palisander plywood + leather',
        priceModifier: 0,
      },
      {
        id: '1b',
        name: 'Walnut / MCL Leather',
        color: '#5C4033',
        material: 'Walnut plywood + MCL leather',
        priceModifier: 450,
      },
    ],
    dimensions: 'Chair W 83 × D 85–109 × H 99 cm · Ottoman W 66 × D 56 × H 41 cm',
    featured: true,
  },
  {
    id: '2',
    slug: 'lc2-three-seat-sofa',
    name: 'LC2 Three-Seat Sofa',
    tagline: 'Le Corbusier — tubular steel and architectural cushions',
    description:
      'Cassina’s LC2 sofa distills the 1928 chrome tubular frame and thick rectangular cushions conceived by Le Corbusier, Pierre Jeanneret, and Charlotte Perriand. A benchmark of International Style seating with exceptional structural clarity.',
    category: 'Seating',
    price: 15890,
    currency: 'USD',
    images: [productImage('2', 1), productImage('2', 2)],
    variants: [
      {
        id: '2a',
        name: 'Chrome / Black Leather',
        color: '#1A1A1A',
        material: 'Steel + full-grain leather',
        priceModifier: 0,
      },
      {
        id: '2b',
        name: 'Chrome / Ecru Leather',
        color: '#E8E0D5',
        material: 'Steel + full-grain leather',
        priceModifier: 0,
      },
    ],
    dimensions: 'W 180 × D 72 × H 70 cm',
    featured: true,
  },
  {
    id: '3',
    slug: 'arco-floor-lamp',
    name: 'Arco Floor Lamp',
    tagline: 'Achille & Pier Giacomo Castiglioni for Flos',
    description:
      'The Arco lamp (1962) balances a polished stainless-steel arc on a Carrara marble base, delivering overhead light without ceiling fixation. Its adjustable stainless reflector has illuminated dining tables and lounges in design history for over six decades.',
    category: 'Lighting',
    price: 3675,
    currency: 'USD',
    images: [productImage('3', 1), productImage('3', 2)],
    variants: [
      {
        id: '3a',
        name: 'Stainless Steel / Marble Base',
        color: '#C0C0C0',
        material: 'Steel + Carrara marble',
        priceModifier: 0,
      },
    ],
    dimensions: 'H 213–240 × Reach 200 cm · Base Ø 22 cm',
    featured: true,
  },
  {
    id: '4',
    slug: 'tufty-time-sofa',
    name: 'Tufty-Time 15 Sofa',
    tagline: 'Patricia Urquiola for B&B Italia',
    description:
      'Tufty-Time reinterprets classic capitonné quilting in a modular sofa system with generous seat depth and removable covers. Configurable elements and rounded geometry make it a contemporary staple in luxury residences and boutique hotels.',
    category: 'Seating',
    price: 12450,
    currency: 'USD',
    images: [productImage('4', 1), productImage('4', 2)],
    variants: [
      {
        id: '4a',
        name: 'Ivory Bouclé',
        color: '#F5F0E8',
        material: 'Bouclé fabric',
        priceModifier: 0,
      },
      {
        id: '4b',
        name: 'Graphite Velvet',
        color: '#4A5568',
        material: 'Velvet',
        priceModifier: 680,
      },
    ],
    dimensions: 'W 285 × D 102 × H 68 cm (15 modules)',
    featured: true,
  },
  {
    id: '5',
    slug: 'symbiosis-sideboard',
    name: 'Symbiosis Sideboard',
    tagline: 'Poliform — architectural storage',
    description:
      'Poliform’s Symbiosis sideboard combines flush doors, open compartments, and refined wood veneers in a monolithic silhouette. Soft-close hardware and integrated LED options suit dining rooms where storage must read as sculpture.',
    category: 'Storage',
    price: 8200,
    currency: 'USD',
    images: [productImage('5', 1), productImage('5', 2)],
    variants: [
      {
        id: '5a',
        name: 'Oak / Graphite Glass',
        color: '#D4A574',
        material: 'Oak veneer + glass',
        priceModifier: 0,
      },
    ],
    dimensions: 'W 220 × D 50 × H 75 cm',
    featured: false,
  },
  {
    id: '6',
    slug: 'noguchi-coffee-table',
    name: 'Noguchi Coffee Table',
    tagline: 'Isamu Noguchi for Herman Miller',
    description:
      'Isamu Noguchi’s 1948 table joins a freeform glass top to an interlocking solid wood base inspired by Japanese bracket construction. A museum piece turned everyday object—sculptural, balanced, and endlessly copied yet never equaled.',
    category: 'Tables',
    price: 2195,
    currency: 'USD',
    images: [productImage('6', 1), productImage('6', 2)],
    variants: [
      {
        id: '6a',
        name: 'Walnut / Glass',
        color: '#5C4033',
        material: 'Walnut + tempered glass',
        priceModifier: 0,
      },
    ],
    dimensions: 'W 128 × D 93 × H 40 cm',
    featured: false,
  },
  {
    id: '7',
    slug: 'usm-haller-storage',
    name: 'USM Haller Storage',
    tagline: 'Swiss modular precision since 1965',
    description:
      'USM Haller’s ball-joint system in powder-coated steel panels and chrome-plated brass connectors adapts from low credenzas to full-height libraries. Specify door, drawer, and flap modules in classic USM colours for a system that outlasts trends.',
    category: 'Storage',
    price: 1890,
    currency: 'USD',
    images: [productImage('7', 1), productImage('7', 2)],
    variants: [
      {
        id: '7a',
        name: 'Pure White / Chrome',
        color: '#F5F5F5',
        material: 'Steel + chrome',
        priceModifier: 0,
      },
      {
        id: '7b',
        name: 'Anthracite / Chrome',
        color: '#2F2F2F',
        material: 'Steel + chrome',
        priceModifier: 0,
      },
    ],
    dimensions: 'W 150 × D 35 × H 74 cm (3 × 3 modules)',
    featured: false,
  },
  {
    id: '8',
    slug: 'alys-platform-bed',
    name: 'Alys Platform Bed',
    tagline: 'Maxalto — quiet luxury for the bedroom',
    description:
      'Maxalto’s Alys platform bed frames an upholstered headboard in stitched leather with a low solid-wood platform that needs no box spring. Under-bed storage options and integrated lighting keep the silhouette serene and hotel-ready.',
    category: 'Bedroom',
    price: 6750,
    currency: 'USD',
    images: [productImage('8', 1), productImage('8', 2)],
    variants: [
      {
        id: '8a',
        name: 'Queen / Dove Leather',
        color: '#C4B8A8',
        material: 'Oak + leather',
        priceModifier: 0,
      },
      {
        id: '8b',
        name: 'King / Dove Leather',
        color: '#C4B8A8',
        material: 'Oak + leather',
        priceModifier: 520,
      },
    ],
    dimensions: 'Queen: W 160 × L 210 cm',
    featured: false,
  },
  {
    id: '9',
    slug: 'ph5-pendant',
    name: 'PH 5 Pendant',
    tagline: 'Poul Henningsen for Louis Poulsen',
    description:
      'The PH 5 pendant (1958) layers multiple shades to deliver glare-free, diffuse light from a single bulb. Its coloured crown and spun aluminum reflectors have made it a dining-room classic from Copenhagen to Tokyo.',
    category: 'Lighting',
    price: 1475,
    currency: 'USD',
    images: [productImage('9', 1), productImage('9', 2)],
    variants: [
      {
        id: '9a',
        name: 'Classic White',
        color: '#F5F5F5',
        material: 'Spun aluminum',
        priceModifier: 0,
        inStock: false,
      },
      {
        id: '9b',
        name: 'Hues of Orange',
        color: '#E07A3A',
        material: 'Spun aluminum',
        priceModifier: 0,
      },
    ],
    dimensions: 'Ø 50 × H 26.7 cm',
    featured: false,
  },
  {
    id: '10',
    slug: 'vitra-home-desk',
    name: 'Home Desk',
    tagline: 'Vitra — writing desk with cable discipline',
    description:
      'Vitra’s Home Desk pairs a generous oak veneer top with a lacquered steel substructure, integrated cable tray, and drawer module. Designed for compact urban studies where a single surface must serve video calls, sketching, and archival storage.',
    category: 'Office',
    price: 2890,
    currency: 'USD',
    images: [productImage('10', 1), productImage('10', 2)],
    variants: [
      {
        id: '10a',
        name: 'Oak / Light Grey',
        color: '#E8E0D5',
        material: 'Oak veneer + steel',
        priceModifier: 0,
      },
      {
        id: '10b',
        name: 'Oak / Graphite',
        color: '#E8E0D5',
        material: 'Oak veneer + steel',
        priceModifier: 0,
      },
    ],
    dimensions: 'W 142 × D 65 × H 74 cm',
    featured: false,
  },
]

export const categoryKeys: Record<string, string> = {
  Seating: 'seating',
  Tables: 'tables',
  Lighting: 'lighting',
  Storage: 'storage',
  Bedroom: 'bedroom',
  Office: 'office',
}
