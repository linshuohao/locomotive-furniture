import type { z } from 'zod'
import type { ProductSchema } from '@/data/schemas'

export type ProductCatalogEntry = z.input<typeof ProductSchema>

const productImage = (productId: string, index: 1 | 2 = 1) =>
  `/images/products/${productId}-${index}.jpg`

export const productCatalog: ProductCatalogEntry[] = [
  {
    id: '1',
    slug: 'nordic-lounge-chair',
    name: 'Nordic Lounge Chair',
    tagline: 'Sculptural comfort for modern living',
    description:
      'Handcrafted ash frame with premium wool upholstery. A statement piece that balances Nordic minimalism with ergonomic support.',
    category: 'Seating',
    price: 1290,
    currency: 'USD',
    images: [productImage('1', 1), productImage('1', 2)],
    variants: [
      {
        id: '1a',
        name: 'Natural / Wool Grey',
        color: '#C4B8A8',
        material: 'Ash + Wool',
        priceModifier: 0,
      },
      {
        id: '1b',
        name: 'Walnut / Wool Charcoal',
        color: '#3D2B1F',
        material: 'Walnut + Wool',
        priceModifier: 150,
      },
    ],
    dimensions: 'W 78 × D 82 × H 72 cm',
    featured: true,
  },
  {
    id: '2',
    slug: 'horizon-dining-table',
    name: 'Horizon Dining Table',
    tagline: 'Gather around crafted oak',
    description:
      'Solid European oak dining table with tapered legs and a satin finish. Seats six comfortably with room to breathe.',
    category: 'Tables',
    price: 2490,
    currency: 'USD',
    images: [productImage('2', 1), productImage('2', 2)],
    variants: [
      { id: '2a', name: 'Natural Oak', color: '#D4A574', material: 'Oak', priceModifier: 0 },
      { id: '2b', name: 'Smoked Oak', color: '#5C4033', material: 'Oak', priceModifier: 200 },
    ],
    dimensions: 'W 200 × D 95 × H 75 cm',
    featured: true,
  },
  {
    id: '3',
    slug: 'arc-floor-lamp',
    name: 'Arc Floor Lamp',
    tagline: 'Sculpted light, soft glow',
    description:
      'Brushed brass arc lamp with linen shade. Adjustable height arm casts warm ambient light across your space.',
    category: 'Lighting',
    price: 680,
    currency: 'USD',
    images: [productImage('3', 1), productImage('3', 2)],
    variants: [
      {
        id: '3a',
        name: 'Brass / Linen',
        color: '#B8860B',
        material: 'Brass + Linen',
        priceModifier: 0,
      },
    ],
    dimensions: 'H 180 × Reach 120 cm',
    featured: true,
  },
  {
    id: '4',
    slug: 'cloud-modular-sofa',
    name: 'Cloud Modular Sofa',
    tagline: 'Effortless modular luxury',
    description:
      'Three-piece modular sofa with deep seats and removable covers. Configure for any room layout.',
    category: 'Seating',
    price: 3890,
    currency: 'USD',
    images: [productImage('4', 1), productImage('4', 2)],
    variants: [
      { id: '4a', name: 'Ivory Bouclé', color: '#F5F0E8', material: 'Bouclé', priceModifier: 0 },
      { id: '4b', name: 'Slate Velvet', color: '#4A5568', material: 'Velvet', priceModifier: 300 },
    ],
    dimensions: 'W 280 × D 95 × H 68 cm',
    featured: true,
  },
  {
    id: '5',
    slug: 'pillar-sideboard',
    name: 'Pillar Sideboard',
    tagline: 'Storage as sculpture',
    description:
      'Walnut sideboard with soft-close drawers and open shelving. Minimal hardware, maximum presence.',
    category: 'Storage',
    price: 1890,
    currency: 'USD',
    images: [productImage('5', 1), productImage('5', 2)],
    variants: [
      { id: '5a', name: 'Walnut', color: '#3D2B1F', material: 'Walnut', priceModifier: 0 },
    ],
    dimensions: 'W 160 × D 45 × H 75 cm',
    featured: false,
  },
  {
    id: '6',
    slug: 'zen-coffee-table',
    name: 'Zen Coffee Table',
    tagline: 'Low profile, high impact',
    description:
      'Low-profile coffee table in travertine and brushed steel. A calm anchor for your living room.',
    category: 'Tables',
    price: 980,
    currency: 'USD',
    images: [productImage('6', 1), productImage('6', 2)],
    variants: [
      {
        id: '6a',
        name: 'Travertine / Steel',
        color: '#E8E0D5',
        material: 'Travertine',
        priceModifier: 0,
      },
    ],
    dimensions: 'W 120 × D 60 × H 35 cm',
    featured: false,
  },
  {
    id: '7',
    slug: 'frame-wall-shelf',
    name: 'Frame Wall Shelf',
    tagline: 'Display with intention',
    description:
      'Floating wall shelf system in powder-coated steel. Modular units stack vertically or horizontally.',
    category: 'Storage',
    price: 420,
    currency: 'USD',
    images: [productImage('7', 1), productImage('7', 2)],
    variants: [
      { id: '7a', name: 'Matte Black', color: '#1A1A1A', material: 'Steel', priceModifier: 0 },
      { id: '7b', name: 'Warm White', color: '#F5F0E8', material: 'Steel', priceModifier: 0 },
    ],
    dimensions: 'W 80 × D 25 × H 25 cm (each)',
    featured: false,
  },
  {
    id: '8',
    slug: 'haven-bed-frame',
    name: 'Haven Bed Frame',
    tagline: 'Rest in refined simplicity',
    description:
      'Platform bed frame in solid oak with integrated headboard. No box spring required.',
    category: 'Bedroom',
    price: 2190,
    currency: 'USD',
    images: [productImage('8', 1), productImage('8', 2)],
    variants: [
      {
        id: '8a',
        name: 'Queen / Natural Oak',
        color: '#D4A574',
        material: 'Oak',
        priceModifier: 0,
      },
      {
        id: '8b',
        name: 'King / Natural Oak',
        color: '#D4A574',
        material: 'Oak',
        priceModifier: 400,
      },
    ],
    dimensions: 'Queen: W 160 × L 210 cm',
    featured: false,
  },
  {
    id: '9',
    slug: 'orbit-pendant-light',
    name: 'Orbit Pendant Light',
    tagline: 'Suspended elegance',
    description:
      'Hand-blown glass orb pendant with dimmable LED. Available in cluster configurations.',
    category: 'Lighting',
    price: 540,
    currency: 'USD',
    images: [productImage('9', 1), productImage('9', 2)],
    variants: [
      {
        id: '9a',
        name: 'Clear Glass',
        color: '#E8F4F8',
        material: 'Glass + Brass',
        priceModifier: 0,
      },
      {
        id: '9b',
        name: 'Smoked Glass',
        color: '#4A5568',
        material: 'Glass + Brass',
        priceModifier: 80,
      },
    ],
    dimensions: 'Ø 30 × H 35 cm',
    featured: false,
  },
  {
    id: '10',
    slug: 'studio-desk',
    name: 'Studio Desk',
    tagline: 'Work beautifully',
    description:
      'Writing desk with cable management and drawer storage. Ash veneer top, steel legs.',
    category: 'Office',
    price: 1450,
    currency: 'USD',
    images: [productImage('10', 1), productImage('10', 2)],
    variants: [
      {
        id: '10a',
        name: 'Ash / White Legs',
        color: '#E8E0D5',
        material: 'Ash + Steel',
        priceModifier: 0,
      },
      {
        id: '10b',
        name: 'Ash / Black Legs',
        color: '#E8E0D5',
        material: 'Ash + Steel',
        priceModifier: 0,
      },
    ],
    dimensions: 'W 140 × D 65 × H 75 cm',
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
