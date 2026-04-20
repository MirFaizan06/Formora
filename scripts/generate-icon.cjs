'use strict'
/**
 * Generates build/icon.png and build/icon.ico for Formora.
 * Pure Node.js — no external dependencies.
 * Run: node scripts/generate-icon.cjs
 */
const fs = require('fs')
const path = require('path')
const zlib = require('zlib')

const BUILD_DIR = path.join(__dirname, '..', 'build')
if (!fs.existsSync(BUILD_DIR)) fs.mkdirSync(BUILD_DIR, { recursive: true })

// ── CRC32 ────────────────────────────────────────────────────────────────────
const CRC_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[i] = c
  }
  return t
})()

function crc32(buf) {
  let crc = 0xffffffff
  for (const b of buf) crc = CRC_TABLE[(crc ^ b) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

// ── PNG writer ────────────────────────────────────────────────────────────────
function pngChunk(type, data) {
  const t = Buffer.from(type, 'ascii')
  const lenBuf = Buffer.alloc(4)
  lenBuf.writeUInt32BE(data.length)
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([t, data])))
  return Buffer.concat([lenBuf, t, data, crcBuf])
}

function createPNG(width, height, drawFn) {
  // drawFn(x, y) → [r, g, b, a]
  const scanlineLen = 1 + width * 4
  const raw = Buffer.alloc(scanlineLen * height)

  for (let y = 0; y < height; y++) {
    const base = y * scanlineLen
    raw[base] = 0 // filter: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = drawFn(x, y)
      const off = base + 1 + x * 4
      raw[off] = r; raw[off + 1] = g; raw[off + 2] = b; raw[off + 3] = a
    }
  }

  const compressed = zlib.deflateSync(raw, { level: 9 })

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8   // bit depth
  ihdr[9] = 6   // RGBA
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), // PNG sig
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', compressed),
    pngChunk('IEND', Buffer.alloc(0)),
  ])
}

// ── ICO wrapper (embeds PNG) ──────────────────────────────────────────────────
function createICO(pngBufs) {
  // pngBufs = [{ size, data }]
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2) // type = ICO
  header.writeUInt16LE(pngBufs.length, 4)

  const entries = []
  const dataBlocks = []
  let offset = 6 + pngBufs.length * 16

  for (const { size, data } of pngBufs) {
    const entry = Buffer.alloc(16)
    entry[0] = size === 256 ? 0 : size  // 0 means 256 in ICO
    entry[1] = size === 256 ? 0 : size
    entry[2] = 0; entry[3] = 0
    entry.writeUInt16LE(1, 4)   // planes
    entry.writeUInt16LE(32, 6)  // bit count
    entry.writeUInt32LE(data.length, 8)
    entry.writeUInt32LE(offset, 12)
    entries.push(entry)
    dataBlocks.push(data)
    offset += data.length
  }

  return Buffer.concat([header, ...entries, ...dataBlocks])
}

// ── Design ───────────────────────────────────────────────────────────────────
function drawIcon(x, y, size) {
  const cx = size / 2
  const cy = size / 2

  // Background: rounded rect with gradient purple
  const dx = x - cx
  const dy = y - cy
  const radius = size * 0.156 // corner radius

  function inRoundedRect(px, py, w, h, r) {
    const lx = Math.abs(px - w / 2)
    const ly = Math.abs(py - h / 2)
    if (lx > w / 2 || ly > h / 2) return false
    if (lx <= w / 2 - r || ly <= h / 2 - r) return true
    return (lx - (w / 2 - r)) ** 2 + (ly - (h / 2 - r)) ** 2 <= r * r
  }

  const inBg = inRoundedRect(x, y, size, size, radius)
  if (!inBg) return [0, 0, 0, 0]

  // Gradient: top-left purple → bottom-right deeper purple
  const t = (x + y) / (size * 2)
  const bgR = Math.round(124 - t * 30)
  const bgG = Math.round(106 - t * 30)
  const bgB = Math.round(247 - t * 20)

  // Document rectangle (white card)
  const docX = size * 0.21875  // 56/256
  const docY = size * 0.171875 // 44/256
  const docW = size * 0.46875  // 120/256
  const docH = size * 0.59375  // 152/256
  const docR = size * 0.039

  const inDoc = inRoundedRect(x - docX - docW / 2, y - docY - docH / 2, docW, docH, docR)
  if (inDoc) {
    // Fold corner
    const foldX = docX + docW
    const foldSize = size * 0.141 // 36/256
    if (x > foldX - foldSize && y < docY + foldSize) {
      const slope = (foldSize - (x - (foldX - foldSize)))
      if (y - docY < slope) {
        return [180, 160, 255, 220]
      }
    }

    // Horizontal lines inside the document
    const relY = (y - docY) / docH
    const relX = (x - docX) / docW

    if (relX > 0.1 && relX < 0.9) {
      // Title line (accent)
      if (relY > 0.3 && relY < 0.37) return [124, 106, 247, 200]
      // Field lines
      if ((relY > 0.42 && relY < 0.465) ||
          (relY > 0.51 && relY < 0.55) ||
          (relY > 0.6 && relY < 0.64) ||
          (relY > 0.69 && relY < 0.73)) {
        return [210, 200, 255, 180]
      }
    }

    return [255, 255, 255, 240]
  }

  // Green accent circle (bottom-right)
  const gcx = size * 0.766
  const gcy = size * 0.766
  const gr = size * 0.14
  const gDist = Math.sqrt((x - gcx) ** 2 + (y - gcy) ** 2)
  if (gDist <= gr) {
    // "F" letter inside
    const lx = x - gcx
    const ly = y - gcy
    const fw = gr * 0.18
    const fh = gr * 0.9

    // Vertical bar of F
    if (lx > -gr * 0.28 && lx < -gr * 0.28 + fw * 2 && ly > -fh / 2 && ly < fh / 2) {
      return [255, 255, 255, 255]
    }
    // Top bar of F
    if (lx > -gr * 0.28 && lx < gr * 0.3 && ly > -fh / 2 && ly < -fh / 2 + fw * 2) {
      return [255, 255, 255, 255]
    }
    // Middle bar of F
    if (lx > -gr * 0.28 && lx < gr * 0.2 && ly > -fw * 0.5 && ly < fw * 1.5) {
      return [255, 255, 255, 255]
    }
    return [86, 197, 150, 255] // #56c596
  }

  return [bgR, bgG, bgB, 255]
}

// ── Generate ─────────────────────────────────────────────────────────────────
const sizes = [256, 128, 64, 48, 32, 16]
const pngBufs = sizes.map(size => {
  const data = createPNG(size, size, (x, y) => drawIcon(x, y, size))
  process.stdout.write(`  ${size}x${size} `)
  return { size, data }
})
console.log('')

// Write main PNG (256x256)
const pngPath = path.join(BUILD_DIR, 'icon.png')
fs.writeFileSync(pngPath, pngBufs[0].data)
console.log('✓ Written:', pngPath)

// Write ICO (all sizes)
const icoData = createICO(pngBufs)
const icoPath = path.join(BUILD_DIR, 'icon.ico')
fs.writeFileSync(icoPath, icoData)
console.log('✓ Written:', icoPath, `(${(icoData.length / 1024).toFixed(1)} KB)`)
console.log('\n✅ Icon generation complete.')
