import { Jimp } from 'jimp';

/**
 * Dessine un caractère simple 8x8 pixels
 */
const chars = {
  'P': [[0,1,1,1,1,0,0,0],[0,1,0,0,0,1,0,0],[0,1,1,1,1,0,0,0],[0,1,0,0,0,0,0,0],[0,1,0,0,0,0,0,0],[0,1,0,0,0,0,0,0],[0,1,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]],
  'r': [[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,1,0,1,1,0,0],[0,0,1,1,0,0,1,0],[0,0,1,0,0,0,0,0],[0,0,1,0,0,0,0,0],[0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,0]],
  'i': [[0,0,0,0,0,0,0,0],[0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,1,0,0,0,0,0],[0,0,1,0,0,0,0,0],[0,0,1,0,0,0,0,0],[0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,0]],
  'x': [[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,1,0,0,0,1,0,0],[0,0,1,0,1,0,0,0],[0,0,0,1,0,0,0,0],[0,0,1,0,1,0,0,0],[0,1,0,0,0,1,0,0],[0,0,0,0,0,0,0,0]],
  ':': [[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]],
  ' ': [[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]],
  '1': [[0,0,0,1,0,0,0,0],[0,0,1,1,0,0,0,0],[0,0,0,1,0,0,0,0],[0,0,0,1,0,0,0,0],[0,0,0,1,0,0,0,0],[0,0,0,1,0,0,0,0],[0,0,1,1,1,0,0,0],[0,0,0,0,0,0,0,0]],
  '0': [[0,0,1,1,1,0,0,0],[0,1,0,0,0,1,0,0],[0,1,0,0,0,1,0,0],[0,1,0,0,0,1,0,0],[0,1,0,0,0,1,0,0],[0,1,0,0,0,1,0,0],[0,0,1,1,1,0,0,0],[0,0,0,0,0,0,0,0]],
  '€': [[0,0,1,1,1,1,0,0],[0,1,0,0,0,0,1,0],[1,1,1,1,0,0,0,0],[0,1,0,0,0,0,0,0],[1,1,1,1,0,0,0,0],[0,1,0,0,0,0,1,0],[0,0,1,1,1,1,0,0],[0,0,0,0,0,0,0,0]],
  'T': [[0,1,1,1,1,1,0,0],[0,0,0,1,0,0,0,0],[0,0,0,1,0,0,0,0],[0,0,0,1,0,0,0,0],[0,0,0,1,0,0,0,0],[0,0,0,1,0,0,0,0],[0,0,0,1,0,0,0,0],[0,0,0,0,0,0,0,0]],
  'C': [[0,0,1,1,1,0,0,0],[0,1,0,0,0,1,0,0],[0,1,0,0,0,0,0,0],[0,1,0,0,0,0,0,0],[0,1,0,0,0,0,0,0],[0,1,0,0,0,1,0,0],[0,0,1,1,1,0,0,0],[0,0,0,0,0,0,0,0]],
};

/**
 * Crée une image de texte simple avec le symbole €
 */
async function createTextWithEuro(text, scale = 2, filename = 'text-with-euro.png') {
  const charWidth = 8;
  const charHeight = 8;
  
  // Calculer la largeur totale
  const width = text.length * charWidth * scale;
  const height = charHeight * scale;
  
  // Créer l'image (blanc)
  const img = new Jimp({ width, height, color: 0xFFFFFFFF });
  const black = 0x000000FF;
  
  // Dessiner chaque caractère
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const charData = chars[char] || chars[' '];
    
    const startX = i * charWidth * scale;
    
    for (let y = 0; y < charHeight; y++) {
      for (let x = 0; x < charWidth; x++) {
        if (charData[y][x] === 1) {
          // Dessiner le pixel avec le facteur d'échelle
          for (let sy = 0; sy < scale; sy++) {
            for (let sx = 0; sx < scale; sx++) {
              img.setPixelColor(black, startX + x * scale + sx, y * scale + sy);
            }
          }
        }
      }
    }
  }
  
  await img.write(filename);
  console.log(`Image créée: ${filename} (${width}x${height}px)`);
  return filename;
}

// Créer les exemples
async function createExamples() {
  await createTextWithEuro('Prix: 10 € TTC', 2, 'prix-euro.png');
  await createTextWithEuro('Total: 10 €', 2, 'total-euro.png');
}

createExamples().catch(console.error);
