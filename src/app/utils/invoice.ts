/* eslint-disable @typescript-eslint/no-explicit-any */
import PDFDocument from "pdfkit";
import AppError from "../errorHelpers/AppError";

export interface IInvoiceData {
  transactionId: string;
  bookingDate: Date;
  userName: string;
  tourTitle: string;
  guestCount: number;
  totalAmount: number;
}

export const generatePdf = async (
  invoiceData: IInvoiceData
): Promise<Buffer> => {
  try {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const buffers: Uint8Array[] = [];

      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err) => reject(err));

      // ==== Header ====
      doc
        .fillColor("#333")
        .fontSize(26)
        .text("Tour Booking Invoice", { align: "center" });
      doc.moveDown(1);

      // ==== Line separator ====
      doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, doc.y)
        .lineTo(550, doc.y)
        .stroke();
      doc.moveDown(1);

      // ==== Customer + Booking Info ====
      doc.fontSize(12).fillColor("#000");

      doc.text(`Transaction ID:`, 50, doc.y).font("Helvetica-Bold").text(`${invoiceData.transactionId}`, 150, doc.y - 15);
      doc.font("Helvetica").text(`Booking Date:`, 50, doc.y + 10).font("Helvetica-Bold").text(`${invoiceData.bookingDate.toDateString()}`, 150, doc.y - 15);

      doc.font("Helvetica").text(`Customer:`, 50, doc.y + 10).font("Helvetica-Bold").text(`${invoiceData.userName}`, 150, doc.y - 15);

      doc.moveDown(2);

      // ==== Booking Details ====
      doc
        .fontSize(14)
        .fillColor("#444444")
        .text("Booking Details", { underline: true });

      doc.moveDown(0.5);

      doc.fontSize(12).fillColor("#000");
      doc.text(`Tour Title:`, 50, doc.y).font("Helvetica-Bold").text(`${invoiceData.tourTitle}`, 150, doc.y - 15);
      doc.font("Helvetica").text(`Guest Count:`, 50, doc.y + 10).font("Helvetica-Bold").text(`${invoiceData.guestCount}`, 150, doc.y - 15);
      doc.font("Helvetica").text(`Total Amount:`, 50, doc.y + 10).font("Helvetica-Bold").text(`${invoiceData.totalAmount.toFixed(2)} BDT`, 150, doc.y - 15);

      doc.moveDown(2);

      // ==== Footer ====
      doc
        .fontSize(12)
        .fillColor("#666666")
        .text("Thank you for booking with us!", { align: "center" });

      doc.end();
    });
  } catch (error: any) {
    throw new AppError(401, `PDF creation error: ${error.message}`);
  }
};
