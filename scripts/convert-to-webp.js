const fs = require('fs');
const path = require('path');

// Simple script to convert image to webp using Node.js
// This script requires sharp to be installed: npm install sharp

const sharp = require('sharp');

async function convertToWebP(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .webp({ quality: 85 })
      .toFile(outputPath);
    console.log(`✓ Successfully converted ${inputPath} to ${outputPath}`);
  } catch (error) {
    console.error('Error converting image:', error.message);
    process.exit(1);
  }
}

// Get input and output paths from command line arguments
const inputPath = process.argv[2];
const outputPath = process.argv[3] || path.join(__dirname, '..', 'public', 'portfolio-image.webp');

if (!inputPath) {
  console.error('Usage: node convert-to-webp.js <input-image-path> [output-path]');
  console.error('Example: node convert-to-webp.js ~/Downloads/my-image.jpg');
  process.exit(1);
}

if (!fs.existsSync(inputPath)) {
  console.error(`Error: Input file not found: ${inputPath}`);
  process.exit(1);
}

convertToWebP(inputPath, outputPath);

