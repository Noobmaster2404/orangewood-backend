const fs = require('fs');
const PDFDocument = require('pdfkit');
const { borderMargin, drawBorder, addHeader, addFooter, setupPageTemplate } = require('./public/PageTemplate');

function generatePdf(formData){
    return new Promise((resolve, reject) => {
        const drawTable = (doc, tableData, startX, startY, colWidths, rowHeight, cellPadding) => {
            doc.font('Helvetica').fontSize(13);
            for (let i = 0; i < tableData.length; i++) {
                startY += rowHeight;
                for (let j = 0; j < tableData[i].length; j++) {
                    doc.rect(startX + colWidths.slice(0, j).reduce((a, b) => a + b, 0), startY, colWidths[j], rowHeight).stroke();
                    if (j === 0) { // Check if it's the first column (row names)
                        doc.font('Helvetica-Bold');
                    }
                    doc.text(tableData[i][j], startX + colWidths.slice(0, j).reduce((a, b) => a + b, 0) + cellPadding, startY + cellPadding, { width: colWidths[j] - cellPadding * 2 });
                    if (j === 0) { // Reset font to regular after drawing the cell
                        doc.font('Helvetica');
                    }
                }
            }
        };

        const margin = 50;
        const doc = new PDFDocument({
            size: 'A4',
            margins: {
            top: margin,
            bottom: margin,
            left: margin,
            right: margin
            }
        });
        

        // Pipe the PDF document to a writable stream
        const stream = fs.createWriteStream('public/Proposal.pdf');
        doc.pipe(stream);

        // Define page dimensions
        const pageWidth = doc.page.width;
        const pageHeight = doc.page.height;

        // first page
        setupPageTemplate(doc, pageWidth, pageHeight, margin);

        // Listen for the pageAdded event and set up the page template
        doc.on('pageAdded', () => setupPageTemplate(doc, pageWidth, pageHeight, margin));
        const today = new Date();
        const dateStr = `${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}`;
        const tableData = [
            ['DATE', dateStr],
            ['CLIENT REF. ID', formData.clientRefId],
            ['QUOTATION NO.', formData.quotationNumber],
            ['CLIENT NAME', formData.clientName],
            ['ADDRESS', formData.clientAddress],
            ['PROJECT', formData.project],
            ['SUBJECT', formData.subject],
            ['KIND ATTENTION', formData.poc]
        ];

        //table settings
        const cellPadding = 10;
        const firstColWidth = 150; // Width for the first column
        const secondColWidth = 350; // Width for the second column
        const rowHeight = 30;
        const startX = margin;
        let startY = margin * 1.5; // Adjust startY to leave space for the header

        // Column widths array
        const colWidths = [firstColWidth, secondColWidth];

        // Draw table rows and columns
        drawTable(doc, tableData, startX, startY, colWidths, rowHeight, cellPadding);

        // Add additional text below the table
        doc.moveDown(5);
        doc.fontSize(11);
        doc.text(`Ref- As per our discussion dated ${formData.discussionDate}.`,startX);
        doc.moveDown(2).text('Thank you for considering Orangewood Labs as your automation partner. We look forward to the opportunity to contribute to your organization\'s success. We are pleased to submit our offer for the subjected project.',startX);
        doc.moveDown(2).text('This offer encapsulates the following:',startX);
        doc.list(['Company Introduction', 'Robot Specifications & Features', 'Concept Overview', 'Bill of Material (Our scope of Supply & Works)', 'Commercial Offer', 'Commercial Terms & Conditions'], { bulletRadius: 2, indent: 20 });
        doc.moveDown(2).text('Hope our quote is in line with your requirement. In case of any clarifications kindly feel free to revert to us.');
        doc.moveDown(2).font('Helvetica-Bold').text('Yours Faithfully,', startX);
        doc.text('For Orangewood Research & Advancement Pvt Limited');
        doc.text('Maneesh Garg');
        doc.font('Helvetica');

        doc.end();
        stream.on('finish', function () {
            console.log('PDF generated successfully.');
            resolve('public/Proposal.pdf');
        });
    });
}
module.exports = generatePdf;

