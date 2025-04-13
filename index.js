import { TicketPrinter } from "./printer.js";
import { config } from "./config.js";
import { format } from "date-fns";
async function printFooter(printer) {
  printer.drawLine("-");
  printer.printText("MERCI BEAUCOUP", { align: "ct" });
  await printer.printQR(config.QR_CODE_URL);
  printer.printText("Laissez-nous un avis sur Google", { align: "ct" });
}

async function printHeader(printer) {
  await printer.printImage(config.LOGO_PATH);
  printer.printText("www.chezpomm.com", {
    font: "a",
    align: "ct",
    style: "normal",
    size: [2, 1],
  });
  printer.printText("07 43 30 44 83", { align: "ct" });
  printer.printText(format(new Date(), "dd-MM-yyyy HH:mm"), { align: "ct" });
}

async function printItems(printer, items) {
  printer.drawLine("-");
  printer.printItemsHeader();
  let total = 0;
  for (const item of items) {
    total += item.price * item.qty;
    printer.printItemsLine(item);
  }
  printer.drawLine("-");
  printer.printItemsTotal(total);
}

async function printTicket(items) {
  const printer = new TicketPrinter(
    config.PRINTER_VENDOR_ID,
    config.PRINTER_PRODUCT_ID
  );
  await printer.open();
  await printHeader(printer);
  await printItems(printer, items);
  await printFooter(printer);
  await printer.close();
}
(async function () {
  const items = [
    { name: "Pad Thai Crevettes", qty: 1, price: 12 },
    { name: "Pad Thai Poulet", qty: 2, price: 11 },
    { name: "Poulet noix de Cajou", qty: 2, price: 11 },
  ];
  printTicket(items)
    .then(() => {
      console.log("Ticket printed successfully");
    })
    .catch((error) => {
      console.error("Error printing ticket:", error);
    });
  // const printer = new TicketPrinter(
  //   config.PRINTER_VENDOR_ID,
  //   config.PRINTER_PRODUCT_ID
  // );
  // await printer.open();
  // printer.printer.setCharset(1);
  // printer.printer.text("Rémi €", "utf8");
  // await printer.close();
})();
