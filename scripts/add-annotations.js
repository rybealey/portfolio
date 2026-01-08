const { createCanvas, loadImage } = require('canvas');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Function to create a wobbly/hand-drawn circle path
function createWobblyCircle(centerX, centerY, radius, wobbleAmount = 5) {
  const points = [];
  const segments = 80;
  
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const wobble = (Math.random() - 0.5) * wobbleAmount;
    const currentRadius = radius + wobble;
    
    const x = centerX + Math.cos(angle) * currentRadius;
    const y = centerY + Math.sin(angle) * currentRadius;
    points.push({ x, y });
  }
  
  return points;
}

// Function to draw a wobbly circle
function drawWobblyCircle(ctx, centerX, centerY, radius, wobbleAmount = 5) {
  const points = createWobblyCircle(centerX, centerY, radius, wobbleAmount);
  
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  
  ctx.closePath();
  ctx.stroke();
}

async function addAnnotations() {
  const inputPath = path.join(__dirname, '..', 'public', 'portfolio-image.webp');
  const tempPath = path.join(__dirname, '..', 'public', 'temp-annotate.png');
  const outputPath = path.join(__dirname, '..', 'public', 'portfolio-image.webp');
  
  try {
    // Convert WebP to PNG for canvas processing
    await sharp(inputPath)
      .png()
      .toFile(tempPath);
    
    // Load the PNG image
    const image = await loadImage(tempPath);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    
    // Draw the original image
    ctx.drawImage(image, 0, 0);
    
    // Based on the image description, the man in green shirt is in the middle-back
    // Position: approximately center-left area of the image (middle back from selfie perspective)
    // Making the circle larger and more centered on the person
    const centerX = image.width * 0.40;  // Center-left area
    const centerY = image.height * 0.48; // Middle area
    const radius = Math.min(image.width, image.height) * 0.12; // Circle size relative to image
    
    // Draw hand-drawn circle in bright red (like a marker) - MUCH THICKER
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 10; // Even thicker for visibility
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Draw multiple overlapping circles to make it look more hand-drawn and visible
    drawWobblyCircle(ctx, centerX, centerY, radius, 6);
    drawWobblyCircle(ctx, centerX, centerY, radius, 5);
    drawWobblyCircle(ctx, centerX, centerY, radius, 4);
    drawWobblyCircle(ctx, centerX, centerY, radius, 3);
    
    // Add handwritten-style text "That's me!" - MUCH LARGER
    const fontSize = Math.max(70, Math.min(image.width, image.height) / 18);
    const text = "That's me!";
    
    // Position text to the right of the circle
    const textX = centerX + radius + 40;
    const textY = centerY - radius / 2;
    
    // Draw text with shadow for visibility, then red fill
    ctx.save();
    ctx.translate(textX, textY);
    ctx.rotate(-0.08); // Slight tilt
    
    ctx.font = `bold ${fontSize}px "Marker Felt", "Comic Sans MS", "Arial", sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    
    // Add shadow for visibility
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    // Red fill
    ctx.fillStyle = '#FF0000';
    ctx.fillText(text, 0, 0);
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    ctx.restore();
    
    // Save as PNG first
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(tempPath, buffer);
    
    // Convert back to WebP
    await sharp(tempPath)
      .webp({ quality: 90 })
      .toFile(outputPath);
    
    // Clean up temp file
    fs.unlinkSync(tempPath);
    
    console.log('✓ Annotations added successfully!');
    console.log(`  Image dimensions: ${image.width} x ${image.height}`);
    console.log(`  Circle center: (${centerX.toFixed(0)}, ${centerY.toFixed(0)})`);
    console.log(`  Circle radius: ${radius.toFixed(0)}`);
    console.log(`  Text position: (${textX.toFixed(0)}, ${textY.toFixed(0)})`);
    console.log(`  Font size: ${fontSize.toFixed(0)}px`);
  } catch (error) {
    // Clean up temp file on error
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    throw error;
  }
}

addAnnotations().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

