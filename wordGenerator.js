const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, WidthType } = require('docx');

function generateWord(formData) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new Document({
                creator: formData.creator || "Maneesh Garg",
                title: formData.title || "Proposal",
                description: formData.description || "Description",
            });

            // Helper function to add table to the document
            const createTable = (tableData, columnWidths, fontSize) => {
                const rows = tableData.map(rowData => {
                    return new TableRow({
                        children: rowData.map((cellData, index) => {
                            return new TableCell({
                                children: [new Paragraph({
                                    children: [new TextRun({ text: cellData, size: fontSize * 2 })]
                                })],
                                width: { size: columnWidths[index], type: WidthType.DXA },
                            });
                        })
                    });
                });
                return new Table({
                    rows: rows,
                    width: { size: 100, type: WidthType.PERCENTAGE },
                });
            };

            // Document title and headers
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
            const columnWidths = [2500, 7500]; // Adjust column widths as needed

            // Main table
            doc.addSection({
                children: [
                    createTable(tableData, columnWidths, 24), // Table with larger font size
                    new Paragraph({
                        text: `Ref- As per our discussion dated ${formData.section1.discussionDate}.`,
                        spacing: { after: 200 }
                    }),
                    new Paragraph({
                        text: 'Thank you for considering Orangewood Labs as your automation partner. We look forward to the opportunity to contribute to your organization\'s success. We are pleased to submit our offer for the subjected project.',
                        spacing: { after: 200 }
                    }),
                    new Paragraph({
                        text: 'This offer encapsulates the following:',
                        spacing: { after: 200 }
                    }),
                    new Paragraph({
                        text: 'Hope our quote is in line with your requirement. In case of any clarifications kindly feel free to revert to us.',
                        spacing: { after: 200 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Yours Faithfully,', bold: true }),
                            new TextRun({ text: 'For Orangewood Research & Advancement Pvt Limited' }),
                            new TextRun({ text: 'Maneesh Garg' })
                        ],
                        spacing: { after: 200 }
                    }),
                    // Add other sections similarly...
                ]
            });

            const filePath = 'public/Proposal.docx';
            Packer.toBuffer(doc).then(buffer => {
                fs.writeFileSync(filePath, buffer);
                console.log('Word document generated successfully.');
                resolve(filePath);
            }).catch(err => {
                console.error('Error generating Word document:', err);
                reject(err);
            });
        } catch (error) {
            console.error('Error generating Word document:', error);
            reject(error);
        }
    });
}

module.exports = generateWord;
