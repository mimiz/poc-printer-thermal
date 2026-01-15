import { Printer, Image } from "@node-escpos/core";
// install escpos-usb adapter module manually
import USB from "@node-escpos/usb-adapter";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const PRINTER_VENDOR_ID = parseInt("0483", 16); // Replace with your USB device's vendor ID
const PRINTER_PRODUCT_ID = parseInt("5840", 16); // Replace with your USB device's product ID
const paperWidth = 32; // default paper width for 58MM printer

const device = new USB(PRINTER_VENDOR_ID, PRINTER_PRODUCT_ID);

device.open(async function (err) {
  if (err) {
    console.error("Erreur d'ouverture:", err);
    return;
  }
  
  const options = {
    encoding: "cp437",
    width: paperWidth,
  };
  
  let printer = new Printer(device, options);
  
  try {
    // Charger les images de texte avec symbole euro
    const prixImage = await Image.load(path.join(__dirname, 'prix-euro.png'));
    const totalImage = await Image.load(path.join(__dirname, 'total-euro.png'));
    
    // Imprimer les lignes complètes comme images
    printer.align("lt");
    
    await printer.image(prixImage, 's8');
    printer.feed(1);
    
    await printer.image(totalImage, 's8');
    printer.feed(1);
    
    // Ligne sans euro (texte normal)
    printer.text("Autres infos sans symbole");
    
    printer
      .feed(2)
      .cut()
      .close();
      
  } catch (imgErr) {
    console.error("Erreur image:", imgErr);
    // Fallback si les images n'existent pas
    printer
      .text("Prix: 10 EUR TTC")
      .feed(1)
      .text("Total: 25 EUR HT")
      .feed(2)
      .cut()
      .close();
  }
});