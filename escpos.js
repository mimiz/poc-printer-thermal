import { Printer, Image } from "@node-escpos/core";
// install escpos-usb adapter module manually
import USB from "@node-escpos/usb-adapter";
// Select the adapter based on your printer type
import { join } from "path";
const PRINTER_VENDOR_ID = parseInt("0483", 16); // Replace with your USB device's vendor ID
const PRINTER_PRODUCT_ID = parseInt("5840", 16); // Replace with your USB device's product ID
const paperWidth = 32; // default paper width for 58MM printer
const device = new USB(PRINTER_VENDOR_ID, PRINTER_PRODUCT_ID);

device.open(async function (err) {
  if (err) {
    // handle error
    return;
  }

  // encoding is optional
  const options = {
   // encoding: "GB18030" /* default */,
    encoding: "CP857" /* default */,
    width: paperWidth, // default 32
  };
  let printer = new Printer(device, options);

  // Path to png image
  const filePath = join(process.cwd(), "logo2.png");
  const image = await Image.load(filePath, "image/png");

  printer = await printer.image(
    image,
    "d8" // changing with image
  );

  printer
    .font("a")
    .align("ct")
    .style("b")
    .size(2, 2)
    .text("CHEZ POMM")
    .align("ct")
    .style("normal")
    .size(1, 1.5)
    .style("i")
    .font("a")
    .text("www.chezpomm.com")
    .newLine(1)
    .drawLine("*")
    .text("MERCI BEAUCOUP")
    .drawLine("*")
    .encode("utf8")
    // .table(["One", "Two", "Three"])
    .tableCustom([
      { text: "Pad Thaï Crevettes", align: "LEFT", width: 0.5 },
      { text: "1", align: "CENTER", width: 0.1 },
      { text: "12", align: "CENTER", width: 0.1 },
      { text: "12", align: "RIGHT", width: 0.3 },
    ])
    .tableCustom([
      //
      { text: "Pad Thai Poulet", align: "LEFT", width: 0.5 },
      { text: "2", align: "CENTER", width: 0.1 },
      { text: "11", align: "CENTER", width: 0.1 },
      { text: "22", align: "RIGHT", width: 0.3 },
    ]);

  // inject qrimage to printer
  printer = await printer.qrimage();
  //   // inject image to printer

  //   printer = await printer.image(
  //     image,
  //     "d8" // changing with image
  //   )

  //   printer = await printer.image(
  //     image,
  //     "s24" // changing with image
  //   )
  //   printer = await printer.image(
  //     image,
  //     "d24" // changing with image
  //   )

  printer.cut().close();
});
