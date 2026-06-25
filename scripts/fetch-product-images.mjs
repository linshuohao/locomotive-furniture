#!/usr/bin/env node
/**
 * Downloads curated product hero/lifestyle images into public/images/products/.
 * Sources: Wikimedia Commons (iconic pieces) + Unsplash (category-matched lifestyle).
 *
 * Usage: node scripts/fetch-product-images.mjs
 */

import { execSync } from 'node:child_process'
import { createWriteStream } from 'node:fs'
import { mkdir, unlink } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { pipeline } from 'node:stream/promises'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '../public/images/products')
const UA = 'AtelierFurnitureDemo/1.0 (educational demo; local asset script)'

/** @type {{ file: string; url: string; note: string }[]} */
const MANIFEST = [
  // 1 — Eames Lounge Chair & Ottoman (Vitra)
  {
    file: '1-1.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Eames_Lounge_Chair_-_side.jpg/1920px-Eames_Lounge_Chair_-_side.jpg',
    note: 'Wikimedia: Eames lounge chair & ottoman (hero)',
  },
  {
    file: '1-2.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Jens_Semjan_auf_einem_historischen_Eames_Lounge_Chair_.jpg',
    note: 'Wikimedia: Eames lounge lifestyle',
  },
  // 2 — LC2 / LC3 sofa (Cassina)
  {
    file: '2-1.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Fauteuil_Grand_Confort%2C_petit_mod%C3%A8le%2C_LC2.jpg/1920px-Fauteuil_Grand_Confort%2C_petit_mod%C3%A8le%2C_LC2.jpg',
    note: 'Wikimedia: LC2 Grand Confort (hero)',
  },
  {
    file: '2-2.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Lounge_Library_with_Modern_Classic_Furniture.jpg/1920px-Lounge_Library_with_Modern_Classic_Furniture.jpg',
    note: 'Wikimedia: LC seating lifestyle',
  },
  // 3 — Arco Floor Lamp (Flos)
  {
    file: '3-1.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/%27_11_-_ITALY_-_Arco_Lamp_-_Lampada_Arco_di_Achille_Castiglioni_e_Pier_Giacomo_-_1962_-_Flos_-_Triennale_Design_Museum_-_Milan.jpg/1920px-%27_11_-_ITALY_-_Arco_Lamp_-_Lampada_Arco_di_Achille_Castiglioni_e_Pier_Giacomo_-_1962_-_Flos_-_Triennale_Design_Museum_-_Milan.jpg',
    note: 'Wikimedia: Arco lamp (Triennale)',
  },
  {
    file: '3-2.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Blocco_marmo_CARRARA_lampada_ARCO_di_FLOS.jpg',
    note: 'Wikimedia: Arco Carrara marble base',
  },
  // 4 — Tufty-Time sofa (B&B Italia) — tufted hero + B&B display crop (post-process)
  {
    file: '4-1.jpg',
    url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1600&q=80',
    note: 'Unsplash: grey tufted three-seat sofa',
  },
  {
    file: '4-2.jpg',
    url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=80',
    note: 'Unsplash: velvet sofa alternate angle',
  },
  // 5 — Symbiosis sideboard (Poliform)
  {
    file: '5-1.jpg',
    url: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=1600&q=80',
    note: 'Unsplash: modern sideboard lifestyle',
  },
  {
    file: '5-2.jpg',
    url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1600&q=80',
    note: 'Unsplash: dining room with sideboard',
  },
  // 6 — Noguchi Coffee Table (Herman Miller)
  {
    file: '6-1.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Noguchi_Coffee_Table_%282599969608%29.jpg/1920px-Noguchi_Coffee_Table_%282599969608%29.jpg',
    note: 'Wikimedia: Noguchi coffee table',
  },
  {
    file: '6-2.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/27/Noguchi_Table_%285905550025%29.jpg',
    note: 'Wikimedia: Noguchi table alternate angle',
  },
  // 7 — USM Haller Storage
  {
    file: '7-1.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/6/67/USM_Haller_Workstation.jpg',
    note: 'Wikimedia: USM Haller workstation',
  },
  {
    file: '7-2.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/USM_Haller.jpg',
    note: 'Wikimedia: USM Haller unit',
  },
  // 8 — Alys Platform Bed (Maxalto)
  {
    file: '8-1.jpg',
    url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1600&q=80',
    note: 'Unsplash: luxury platform bed',
  },
  {
    file: '8-2.jpg',
    url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600&q=80',
    note: 'Unsplash: platform bed with panel headboard',
  },
  // 9 — PH 5 Pendant (Louis Poulsen)
  {
    file: '9-1.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Louis_Poulsen_PH5_Poul_Hennigsen.jpg/1920px-Louis_Poulsen_PH5_Poul_Hennigsen.jpg',
    note: 'Wikimedia: PH 5 pendant',
  },
  {
    file: '9-2.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/PH_lamp_from_below.jpg/1920px-PH_lamp_from_below.jpg',
    note: 'Wikimedia: PH lamp from below',
  },
  // 10 — Home Desk (Vitra / George Nelson)
  {
    file: '10-1.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/George_nelson_%26_ass._per_miller_furniture_co.%2C_scrivania_modello_4658%2C_zeeland_MI_1946%2C_con_lampada_anywhere_di_greta_von_nessen_per_nessen_studio_inc.%2C_NY_1951.jpg/1920px-thumbnail.jpg',
    note: 'Wikimedia: George Nelson Home Desk',
  },
  {
    file: '10-2.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Person_writing_in_notebook_while_using_laptop_at_a_modern_workspace.jpg/1920px-Person_writing_in_notebook_while_using_laptop_at_a_modern_workspace.jpg',
    note: 'Wikimedia: desk lifestyle',
  },
]

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function download(url, dest, attempt = 1) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA },
    redirect: 'follow',
  })
  if (res.status === 429 && attempt < 6) {
    await sleep(2500 * attempt)
    return download(url, dest, attempt + 1)
  }
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`)
  }
  await pipeline(res.body, createWriteStream(dest))
}

function cropHalf(path, side) {
  const width = Number(
    execSync(`sips -g pixelWidth "${path}"`, { encoding: 'utf8' })
      .trim()
      .split('\n')
      .pop()
      ?.split(/\s+/)
      .pop(),
  )
  const height = Number(
    execSync(`sips -g pixelHeight "${path}"`, { encoding: 'utf8' })
      .trim()
      .split('\n')
      .pop()
      ?.split(/\s+/)
      .pop(),
  )
  const half = Math.floor(width / 2)
  const offsetX = side === 'right' ? half : 0
  execSync(
    `sips --cropToHeightWidth ${height} ${half} --cropOffset 0 ${offsetX} "${path}"`,
    { stdio: 'inherit' },
  )
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  for (const item of MANIFEST) {
    const dest = join(OUT_DIR, item.file)
    const tmp = item.crop ? `${dest}.tmp.jpg` : dest

    process.stdout.write(`↓ ${item.file} … `)
    await download(item.url, tmp)

    if (item.crop) {
      cropHalf(tmp, item.crop)
      await unlink(dest).catch(() => {})
      execSync(`mv "${tmp}" "${dest}"`)
    }

    const size = execSync(`wc -c < "${dest}"`, { encoding: 'utf8' }).trim()
    console.log(`ok (${size} B) — ${item.note}`)
    await sleep(1200)
  }

  console.log(`\nDone. ${MANIFEST.length} images in ${OUT_DIR}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
