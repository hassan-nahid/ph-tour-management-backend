"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePdf = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const pdfkit_1 = __importDefault(require("pdfkit"));
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const generatePdf = (invoiceData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default({ size: "A4", margin: 50 });
            const buffers = [];
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
    }
    catch (error) {
        throw new AppError_1.default(401, `PDF creation error: ${error.message}`);
    }
});
exports.generatePdf = generatePdf;
