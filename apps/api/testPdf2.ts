import PDFDocument from 'pdfkit';
import fs from 'fs';

try {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream('test2.pdf'));

    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('Order ID', 50, doc.y, { continued: true, width: 100 });
    doc.text('Date', 150, doc.y, { continued: true, width: 150 });
    doc.text('Customer', 300, doc.y, { continued: true, width: 150 });
    doc.text('Amount', 450, doc.y);

  doc.end();
  console.log('PDF generated successfully');
} catch (e) {
  console.error('Error generating PDF:', e);
}
