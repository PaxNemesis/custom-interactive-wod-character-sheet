import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';

async function addGridOverlay() {
  // Load your existing PDF
  const existingPdfBytes = fs.readFileSync('./wod-character-sheet.pdf');
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // Get the first page (adjust if necessary)
  const page = pdfDoc.getPages()[0];
  const { width, height } = page.getSize();

  // Embed a standard font for drawing coordinate labels
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Set the grid step size
  const step = 20;

  // Draw vertical grid lines and x-axis coordinate labels at the top
  for (let x = 0; x <= width; x += step) {
    // Draw a vertical line from bottom to top
    page.drawLine({
      start: { x: x, y: 0 },
      end: { x: x, y: height },
      color: rgb(0.75, 0.75, 0.75), // light gray
      thickness: 0.5,
    });
    // Draw the x coordinate label near the top of the page
    page.drawText(`${x}`, {
      x: x + 2,           // slight offset to the right of the line
      y: height - 10,     // 10 units from the top
      size: 8,
      font,
      color: rgb(0, 0, 0),
    });
  }

  // Draw horizontal grid lines and y-axis coordinate labels on the left
  for (let y = 0; y <= height; y += step) {
    // Draw a horizontal line from left to right
    page.drawLine({
      start: { x: 0, y: y },
      end: { x: width, y: y },
      color: rgb(0.75, 0.75, 0.75),
      thickness: 0.5,
    });
    // Draw the y coordinate label near the left edge of the page
    page.drawText(`${y}`, {
      x: 2,             // 2 units from the left edge
      y: y + 2,         // slight offset upward
      size: 8,
      font,
      color: rgb(0, 0, 0),
    });
  }

  // Save the modified PDF with grid overlay
  const modifiedPdfBytes = await pdfDoc.save();
  fs.writeFileSync('./Wip_Sheet_With_Grid.pdf', modifiedPdfBytes);
  console.log('PDF with grid overlay saved as Wip_Sheet_With_Grid.pdf');
}

addGridOverlay().catch(err => {
  console.error('Error adding grid overlay:', err);
});
