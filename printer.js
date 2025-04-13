import { Printer, Image } from "@node-escpos/core";
// install escpos-usb adapter module manually
import USB from "@node-escpos/usb-adapter";
import fs from "fs";
export class TicketPrinter {
  defaultTextOptions = {
    font: "a",
    align: "lt",
    style: "normal",
    size: [1, 1],
  };
  constructor(vendorID, productID, paperWidth = 32) {
    this.vendorID = vendorID;
    this.productID = productID;
    this.paperWidth = paperWidth;
    this.device = new USB(vendorID, productID);
  }
  async open() {
    return new Promise((resolve, reject) => {
      this.device.open((err) => {
        if (err) {
          reject(err);
        } else {
          const options = {
            // encoding: "GB18030" /* default */,
            encoding: "utf8" /* default */,
            width: this.paperWidth, // default 32
          };
          this.printer = new Printer(this.device, options);
          this.printer.setCharset(1);
          resolve(this);
        }
      });
    });
  }

  async close() {
    this.printer.cut().close();
  }

  async printImage(imagePath) {
    if (!fs.existsSync(imagePath)) {
      throw new Error("Image file does not exist");
    }
    const image = await Image.load(imagePath, "image/png");
    this.printer = await this.printer.image(
      image,
      "d8" // changing with image
    );
    return this;
  }

  printText(text, options) {
    this.setTextStyle(options);
    this.printer.text(text);
    return this;
  }
  setTextStyle(options) {
    const textOptions = { ...this.defaultTextOptions, ...options };
    this.printer
      .font(textOptions.font)
      .align(textOptions.align)
      .style(textOptions.style)
      .size(textOptions.size[0], textOptions.size[1]);
    return this;
  }
  drawLine(char, options) {
    this.setTextStyle(options);
    this.printer.drawLine(char);
    return this;
  }

  emptyLine(count) {
    this.printer.newLine(count);
    return this;
  }

  async printQR(url) {
    this.printer = await this.printer.qrimage(url);
    return this;
  }

  printItemsHeader() {
    this.printer.tableCustom([
      { text: `Article`, align: "LEFT", width: 0.5 },
      { text: `Qte`, align: "RIGHT", width: 0.15 },
      { text: `Px`, align: "RIGHT", width: 0.15 },

      { text: `total`, align: "RIGHT", width: 0.18 },
    ]);
    return this;
  }
  printItemsLine(item) {
    this.printer.tableCustom([
      { text: `${item.name}`, align: "LEFT", width: 0.49 },
      { text: `${item.qty}`, align: "RIGHT", width: 0.1 },
      { text: `${item.price} €`, align: "RIGHT", width: 0.2 },

      { text: `${item.price * item.qty} €`, align: "RIGHT", width: 0.2 },
    ]);
    return this;
  }

  printItemsTotal(total) {
    this.printer.tableCustom([
      { text: `Total`, align: "LEFT", width: 0.5 },

      { text: `${total} €`, align: "RIGHT", width: 0.5 },
    ]);
    return this;
  }
}
