#!/bin/bash

# Script to convert an image to WebP format
# Usage: ./convert-to-webp.sh <input-image-path>

INPUT_IMAGE="$1"
OUTPUT_IMAGE="../public/portfolio-image.webp"

if [ -z "$INPUT_IMAGE" ]; then
    echo "Usage: ./convert-to-webp.sh <input-image-path>"
    echo "Example: ./convert-to-webp.sh ~/Downloads/my-image.jpg"
    exit 1
fi

if [ ! -f "$INPUT_IMAGE" ]; then
    echo "Error: Input file not found: $INPUT_IMAGE"
    exit 1
fi

# Check if sharp is available (Node.js solution)
if command -v node &> /dev/null; then
    # Try using sharp via Node.js
    node -e "
    const sharp = require('sharp');
    sharp('$INPUT_IMAGE')
      .webp({ quality: 85 })
      .toFile('$OUTPUT_IMAGE')
      .then(() => console.log('✓ Converted to $OUTPUT_IMAGE'))
      .catch(err => {
        console.error('Error:', err.message);
        console.error('Please install sharp: npm install sharp');
        process.exit(1);
      });
    " 2>/dev/null
    if [ $? -eq 0 ]; then
        exit 0
    fi
fi

# If Node.js/sharp not available, try cwebp
if command -v cwebp &> /dev/null; then
    cwebp -q 85 "$INPUT_IMAGE" -o "$OUTPUT_IMAGE"
    if [ $? -eq 0 ]; then
        echo "✓ Converted to $OUTPUT_IMAGE"
        exit 0
    fi
fi

echo "Error: No conversion tool available."
echo "Please install one of the following:"
echo "  - sharp (Node.js): npm install sharp"
echo "  - webp tools: brew install webp"
exit 1

