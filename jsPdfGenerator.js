const { jsPDF } = require('jspdf');
require('jspdf-autotable');
const fs = require('fs');
const path = require('path');

function splitTextToSize(text, maxWidth, doc) {
    return doc.splitTextToSize(text, maxWidth);
}

function generatePdf(formData) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new jsPDF();
            const today = new Date();
            const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
            const tableData = [
                ['DATE', dateStr],
                ['CLIENT REF. ID', formData['client-ref-id']],
                ['QUOTATION NO.', formData['quotation-number']],
                ['CLIENT NAME', formData['client-name']],
                ['ADDRESS', formData['client-address']],
                ['PROJECT', formData['project']],
                ['SUBJECT', formData['subject']],
                ['KIND ATTENTION', formData['poc']]
            ];

            doc.autoTable({
                body: tableData,
                styles: { fontSize: 11, cellPadding: 5, lineColor: [0, 0, 0], lineWidth: 0.2 },
                columnStyles: {
                    0: { cellWidth: 60 },
                    1: { cellWidth: 'auto' }
                },
                didParseCell: function (data) {
                    data.cell.styles.fillColor = false;
                    data.cell.styles.textColor = [0, 0, 0];
                    if (data.column.index === 0) {
                        data.cell.styles.fontStyle = 'bold';
                    }
                }
            });

            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;
            const margin = 10;
            const maxWidth = pageWidth - 2 * margin;
            const bottomMargin = 20;  // bottom margin to avoid overlapping footer
            const lineHeight = 5;  // height for each line of text

            const text1 = 'Ref- As per our discussion dated 19 Oct 2023';
            const text2 = 'Thank you for considering Orangewood Labs as your automation partner. We look forward to the opportunity to contribute to your organization\'s success. We are pleased to submit our offer for the subjected project.';
            const text3 = 'This offer encapsulates the following:';
            const text4 = 'Hope our quote is in line with your requirement. In case of any clarifications kindly feel free to revert to us.';
            const text5 = 'Yours Faithfully,';
            const text6 = 'For Orangewood Research & Advancement Pvt Limited';
            const text7 = 'Maneesh Garg';

            const lines1 = splitTextToSize(text1, maxWidth, doc);
            const lines2 = splitTextToSize(text2, maxWidth, doc);
            const lines3 = splitTextToSize(text3, maxWidth, doc);
            const lines4 = splitTextToSize(text4, maxWidth, doc);
            const lines5 = splitTextToSize(text5, maxWidth, doc);
            const lines6 = splitTextToSize(text6, maxWidth, doc);
            const lines7 = splitTextToSize(text7, maxWidth, doc);

            doc.setFontSize(10);
            let y = doc.autoTable.previous.finalY + 10;

            y = addTextLinesWithPageBreak(doc, lines1, margin, y, lineHeight, pageHeight, bottomMargin);
            y = addTextLinesWithPageBreak(doc, lines2, margin, y + 10, lineHeight, pageHeight, bottomMargin);
            y = addTextLinesWithPageBreak(doc, lines3, margin, y + 10, lineHeight, pageHeight, bottomMargin);

            const bulletPoints = [
                '\u2022 Company Introduction',
                '\u2022 Robot Specifications & Features',
                '\u2022 Concept Overview',
                '\u2022 Bill of Material (Our scope of Supply & Works)',
                '\u2022 Commercial Offer',
                '\u2022 Commercial Terms & Conditions'
            ];

            bulletPoints.forEach((point, index) => {
                y = addTextLinesWithPageBreak(doc, [point], margin + 10, y + (index === 0 ? 10 : 5), lineHeight, pageHeight, bottomMargin);
            });
            doc.setTextColor(0, 102, 204);
            doc.textWithLink('www.orangewood.co', margin, y + 10, { url: 'https://www.orangewood.co' });
            doc.setTextColor(0, 0, 0);

            y = addTextLinesWithPageBreak(doc, lines4, margin, y + 10, lineHeight, pageHeight, bottomMargin);
            y = addTextLinesWithPageBreak(doc, lines5, margin, y + 10, lineHeight, pageHeight, bottomMargin);
            y = addTextLinesWithPageBreak(doc, lines6, margin, y + 10, lineHeight, pageHeight, bottomMargin);
            y = addTextLinesWithPageBreak(doc, lines7, margin, y + 10, lineHeight, pageHeight, bottomMargin);

            doc.setFont('helvetica', 'bold');
            

            // Generate a path for the PDF
            const pdfPath = path.join(__dirname, 'Proposal.pdf');

            // Save the PDF and resolve the path
            doc.save(pdfPath, { returnPromise: true }).then(() => {
                resolve(pdfPath);
                console.log('PDF Generated successfully');
            }).catch((err) => {
                reject(err);
            });
        } catch (err) {
            reject(err);
        }
    });
}

function addTextLinesWithPageBreak(doc, lines, x, y, lineHeight, pageHeight, bottomMargin) {
    lines.forEach(line => {
        if (y + lineHeight > pageHeight - bottomMargin) {
            doc.addPage();
            y = 10; // reset y to top margin
        }
        doc.text(line, x, y);
        y += lineHeight;
    });
    return y;
}

module.exports = generatePdf;
