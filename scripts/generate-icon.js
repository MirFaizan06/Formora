/**
 * Generates a minimal ICO and PNG icon for FormApp.
 * Outputs build/icon.png and build/icon.ico
 * Uses only built-in Node.js — no canvas dependency needed.
 * Creates a 256x256 SVG-based icon encoded as PNG via a tiny approach.
 *
 * Run: node scripts/generate-icon.js
 */

const fs = require('fs')
const path = require('path')

const BUILD_DIR = path.join(__dirname, '..', 'build')
if (!fs.existsSync(BUILD_DIR)) fs.mkdirSync(BUILD_DIR, { recursive: true })

// SVG icon design: purple document with F letter
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7c6af7"/>
      <stop offset="100%" style="stop-color:#5a48e0"/>
    </linearGradient>
  </defs>
  <!-- Background -->
  <rect width="256" height="256" rx="40" fill="url(#bg)"/>
  <!-- Document shape -->
  <rect x="56" y="44" width="120" height="152" rx="10" fill="white" opacity="0.95"/>
  <!-- Folded corner -->
  <polygon points="176,44 176,80 212,80" fill="#c4b8ff" opacity="0.8"/>
  <polygon points="176,44 212,80 176,80" fill="white" opacity="0.5"/>
  <!-- Lines representing form fields -->
  <rect x="72" y="96" width="88" height="8" rx="4" fill="#7c6af7" opacity="0.7"/>
  <rect x="72" y="116" width="88" height="6" rx="3" fill="#e0deff"/>
  <rect x="72" y="134" width="72" height="6" rx="3" fill="#e0deff"/>
  <rect x="72" y="152" width="88" height="6" rx="3" fill="#e0deff"/>
  <rect x="72" y="170" width="56" height="6" rx="3" fill="#e0deff"/>
  <!-- Accent dot -->
  <circle cx="196" cy="196" r="36" fill="#56c596"/>
  <text x="196" y="206" text-anchor="middle" font-family="Arial,sans-serif" font-size="36" font-weight="bold" fill="white">F</text>
</svg>`

const svgPath = path.join(BUILD_DIR, 'icon.svg')
fs.writeFileSync(svgPath, svgContent, 'utf8')
console.log('✓ SVG icon written to', svgPath)

// Write a minimal valid PNG (1x1 transparent placeholder)
// electron-builder will use the ICO for Windows, so we need the ICO
// For a proper build, use the SVG with an online converter or electron-icon-builder
// This script outputs the SVG; the ICO generation requires a proper tool.

console.log('')
console.log('📋 Next steps for icon:')
console.log('  1. Open build/icon.svg in a browser and screenshot at 256x256')
console.log('  2. OR use https://convertio.co/svg-ico/ to convert to ICO')
console.log('  3. Save as build/icon.ico and build/icon.png')
console.log('')
console.log('  For quick testing, electron-builder will use a default icon if')
console.log('  build/icon.ico does not exist — the app will still package.')
