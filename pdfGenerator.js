const fs = require('fs');
const PDFDocument = require('pdfkit');
const { borderMargin, drawBorder, addHeader, addFooter, setupPageTemplate } = require('./public/PageTemplate');

function generatePdf(formData) {
    return new Promise((resolve, reject) => {
        const drawTable = (doc, tableData, startX, startY, colWidths, cellPadding) => {
            doc.font('Helvetica').fontSize(13);
            for (let i = 0; i < tableData.length; i++) {
                // Calculate the maximum height required for the current row
                let maxRowHeight = 0;
                for (let j = 0; j < tableData[i].length; j++) {
                    const textHeight = doc.heightOfString(tableData[i][j], {
                        width: colWidths[j] - cellPadding * 2,
                        align: 'left'
                    });
                    maxRowHeight = Math.max(maxRowHeight, textHeight + cellPadding * 2);
                }

                // Check if adding this row will exceed the page height
                if (startY + maxRowHeight > doc.page.height - 2*doc.page.margins.bottom) {
                    doc.addPage();
                    setupPageTemplate(doc, doc.page.width, doc.page.height, doc.page.margins.top);
                    doc.fontSize(13);
                    startY = 1.5*doc.page.margins.top;
                }

                // Draw the cells for the current row
                for (let j = 0; j < tableData[i].length; j++) {
                    doc.rect(startX + colWidths.slice(0, j).reduce((a, b) => a + b, 0), startY, colWidths[j], maxRowHeight).stroke();
                    if (j === 0) { // Check if it's the first column (row names)
                        doc.font('Helvetica-Bold');
                    }
                    doc.text(tableData[i][j], startX + colWidths.slice(0, j).reduce((a, b) => a + b, 0) + cellPadding, startY + cellPadding, { width: colWidths[j] - cellPadding * 2 });
                    if (j === 0) { // Reset font to regular after drawing the cell
                        doc.font('Helvetica');
                    }
                }

                // Move to the next row's Y position
                startY += maxRowHeight;
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
        const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
        const tableData = [
            ['DATE', dateStr],
            ['CLIENT REF. ID', formData.section1.clientRefId],
            ['QUOTATION NO.', formData.section1.quotationNumber],
            ['CLIENT NAME', formData.section1.clientName],
            ['ADDRESS', formData.section1.clientAddress],
            ['PROJECT', formData.section1.project],
            ['SUBJECT', formData.section1.subject],
            ['KIND ATTENTION', formData.section1.poc]
        ];

        // Table settings
        const cellPadding = 10;
        const firstColWidth = 150; // Width for the first column
        const secondColWidth = 350; // Width for the second column
        const startX = margin;
        let startY = margin * 1.5; // Adjust startY to leave space for the header

        // Column widths array
        const colWidths = [firstColWidth, secondColWidth];

        // Draw table rows and columns
        drawTable(doc, tableData, startX, startY, colWidths, cellPadding);

        // Add additional text below the table
        doc.moveDown(5);
        doc.fontSize(11);
        doc.text(`Ref- As per our discussion dated ${formData.section1.discussionDate}.`, startX);
        doc.moveDown(2).text('Thank you for considering Orangewood Labs as your automation partner. We look forward to the opportunity to contribute to your organization\'s success. We are pleased to submit our offer for the subjected project.', startX);
        doc.moveDown(2).text('This offer encapsulates the following:', startX);
        doc.list(['Company Introduction', 'Robot Specifications & Features', 'Concept Overview', 'Bill of Material (Our scope of Supply & Works)', 'Commercial Offer', 'Commercial Terms & Conditions'], { bulletRadius: 2, indent: 20 });
        doc.moveDown(2).text('Hope our quote is in line with your requirement. In case of any clarifications kindly feel free to revert to us.');
        doc.moveDown(2).font('Helvetica-Bold').text('Yours Faithfully,', startX);
        doc.text('For Orangewood Research & Advancement Pvt Limited');
        doc.text('Maneesh Garg');
        doc.font('Helvetica');

        // Company Introduction
        doc.addPage();
        setupPageTemplate(doc, pageWidth, pageHeight, margin);
        doc.font('Helvetica-Bold').fontSize(15).fillColor('#3E029F').text('1.  COMPANY INTRODUCTION', startX + 15, startY + 30);
        doc.moveDown(1);
        doc.fontSize(12).fillColor('black').text('About Us', startX + 45);
        doc.moveDown(1);
        doc.font('Helvetica').text('Orangewood Labs is an innovative startup specializing in the design, development, and manufacturing of advanced 6-axis industrial robots. Our team consists of experienced engineers and industry professionals committed to providing customized automation solutions for diverse industries.', startX + 45);

        // Robot Specs
        doc.addPage();
        setupPageTemplate(doc, pageWidth, pageHeight, margin);
        doc.font('Helvetica-Bold').fontSize(15).fillColor('#3E029F').text('2.  ROBOT SPECIFICATIONS AND FEATURES', startX + 15, startY + 30);
        doc.moveDown(1);
        doc.fontSize(12).fillColor('black').text('Technical Specifications:', startX + 45);
        doc.moveDown(1);

        // Create a table for technical specifications
        const techSpecsTableData = [];

        // Iterate over items in section2 and add non-empty values to the table data
        for (const key in formData.section2) {
            if (formData.section2.hasOwnProperty(key)) {
                const value = formData.section2[key];
                if (value[0].trim() !== '') { // Check if value is not empty or contains only whitespace
                    techSpecsTableData.push([value[1], value[0]]);
                }
            }
        }

        // Draw the technical specifications table if there are entries
        if (techSpecsTableData.length > 0) {
            const techSpecsColWidths = [250, 250];
            const techSpecsStartY = doc.y;
            drawTable(doc, techSpecsTableData, startX, techSpecsStartY, techSpecsColWidths, cellPadding);
        }

        //Concept Overview
        doc.addPage();
        setupPageTemplate(doc, pageWidth, pageHeight, margin);
        doc.font('Helvetica-Bold').fontSize(15).fillColor('#3E029F').text('3.  CLIENT REQUIREMENT AND CONCEPT OVERVIEW', startX + 15, startY + 30);
        doc.moveDown(1).fontSize(12).fillColor('black');

        const clientRequirements = [];

        for (const key in formData.section3) {
            if (formData.section3.hasOwnProperty(key)) {
                const value = formData.section3[key];
                clientRequirements.push([value[1], value[0]]);
            }
        }
        for (const key in formData.additionalQuestions) {
            if (formData.additionalQuestions.hasOwnProperty(key)) {
                const value = formData.additionalQuestions[key];
                clientRequirements.push([value[1], value[0]]);
            }
        }
        const clientRequirementsColWidths = [250, 250];
        const clientRequirementsY = doc.y;
        drawTable(doc, clientRequirements, startX, clientRequirementsY, clientRequirementsColWidths, cellPadding);
        doc.moveDown(1);
        
        // adding image
        const addImageToPDF = (imageDataUrl, description) => {
            if (imageDataUrl) {
                const imageBuffer = Buffer.from(imageDataUrl.split(',')[1], 'base64');
                const imageHeight = 200;

                if (doc.y + imageHeight > doc.page.height - 2*margin) {
                    doc.addPage();
                    setupPageTemplate(doc, pageWidth, pageHeight, margin);
                }
                doc.moveDown(2);
                // doc.text(description, { align: 'center' });
                doc.image(imageBuffer, 25, doc.y, { height: imageHeight });
            }
        };
        addImageToPDF(formData.imageDataUrl);

        //Proposed Solution
        doc.addPage();
        setupPageTemplate(doc, pageWidth, pageHeight, margin);
        doc.font('Helvetica-Bold').fontSize(15).fillColor('#3E029F').text('4.  PROPOSED SOLUTION', startX + 15, startY + 30);
        doc.moveDown(1).fontSize(12).fillColor('black');
        addImageToPDF(formData.imageDataUrlSolution);

        doc.end();
        stream.on('finish', function () {
            console.log('PDF generated successfully.');
            resolve('public/Proposal.pdf');
        });
    });
}

module.exports = generatePdf;
