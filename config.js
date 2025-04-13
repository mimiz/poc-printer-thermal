import path from "path";
export const config = {
  PRINTER_VENDOR_ID: parseInt("0483", 16), // Replace with your USB device's vendor ID
  PRINTER_PRODUCT_ID: parseInt("5840", 16), // Replace with your USB device's product ID
  LOGO_PATH: path.join(process.cwd(), "logo2.png"),
  PAPER_WIDTH: 32, // default paper width for 58MM printer
  QR_CODE_URL: "https://g.page/r/CZ0OiOZiSak4EBI/review",
};
