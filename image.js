import usb from 'usb';
import {Jimp} from 'jimp';
const PRINTER_VENDOR_ID = parseInt('0483', 16); // Replace with your USB device's vendor ID
const PRINTER_PRODUCT_ID = parseInt('5840', 16); // Replace with your USB device's product ID
const paperWidth = 32; // default paper width for 58MM printer

function getImageData(path, cb) {
    console.log('demo');
  Jimp.read(path, (err, img) => {
    if( err ){
        console.log(err);
        return ;
    } 
    console.log(path);
    const widthInBytes = Math.ceil(img.getWidth() / 8);
    const data = new Array(img.getHeight());
    for (let y = 0; y < img.getHeight(); y++) {
      const row = new Array(widthInBytes);
      for (let b = 0; b < widthInBytes; b++) {
        let byte = 0;
        let mask = 128;
        for (let x = b*8; x < (b+1)*8; x++) {
          const color = Jimp.intToRGBA(img.getPixelColor(x, y));
          if (color.a < 65) byte = byte ^ mask; // empty dot (1)
          mask = mask >> 1;
        }
        row[b] = byte;
      }
      data[y] = row;
    }
    cb(data);
  });
}

function print(buffer) {
  // you can get all available devices with usb.getDeviceList()
  let device = usb.findByIds(PRINTER_VENDOR_ID, PRINTER_PRODUCT_ID);
  device.open();
  device.interfaces[0].claim();
  const outEndpoint = device.interfaces[0].endpoints.find(e => e.direction === 'out');
  outEndpoint.transferType = 2;
  outEndpoint.transfer(buffer, (err) => {
    if(err){
        console.log(err);
        return ;
    }
    device.close();
  });
}

// getImageData('./logo.png', (data) => {
//   console.log("data image");
// //   const widthInBytes = data[0].length;
// //   const heightInDots = data.length;

//   const buffer = Buffer.concat([
//     Buffer.from('SIZE 48 mm,25 mm\r\n'),
//     Buffer.from('CLS\r\n'),
//     // Buffer.from(`BITMAP 10,20,${widthInBytes},${heightInDots},0,`),
//     // Buffer.from(data.flat()),
//     Buffer.from('BARCODE 10,100,"128",50,1,0,2,2,"altospos.com"\r\n'),
//     Buffer.from('PRINT 1\r\n'),
//     Buffer.from('END\r\n'),
//   ]);
  
//   print(buffer);
// });

(function(){
    const buffer = Buffer.concat([
        Buffer.from('SIZE 48 mm,25 mm\r\n'),
        Buffer.from('CLS\r\n'),
        // Buffer.from(`BITMAP 10,20,${widthInBytes},${heightInDots},0,`),
        // Buffer.from(data.flat()),
        Buffer.from('BARCODE 10,100,"128",50,1,0,2,2,"altospos.com"\r\n'),
        Buffer.from('PRINT 1\r\n'),
        Buffer.from('END\r\n'),
      ]);
      
      print(buffer);
}())