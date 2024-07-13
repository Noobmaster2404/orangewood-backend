const fs = require('fs');
const { Document, Footer, Header, Packer, PageNumber, NumberFormat, PageOrientation, Paragraph, TextRun } = require('docx');

function generateWord(formData) {
    return new Promise((resolve,reject)=>{
        const doc = new Document({
            sections: [
                {
                    children: [new Paragraph("Hello World")],
                },
                {
                    properties: {
                        page: {
                            pageNumbers: {
                                start: 1,
                                formatType: NumberFormat.DECIMAL,
                            },
                        },
                    },
                    headers: {
                        default: new Header({
                            children: [new Paragraph("First Default Header on another page")],
                        }),
                    },
                    footers: {
                        default: new Footer({
                            children: [new Paragraph("Footer on another page")],
                        }),
                    },
        
                    children: [new Paragraph("hello")],
                },
                {
                    properties: {
                        page: {
                            size: {
                                orientation: PageOrientation.LANDSCAPE,
                            },
                            pageNumbers: {
                                start: 1,
                                formatType: NumberFormat.DECIMAL,
                            },
                        },
                    },
                    headers: {
                        default: new Header({
                            children: [new Paragraph("Second Default Header on another page")],
                        }),
                    },
                    footers: {
                        default: new Footer({
                            children: [new Paragraph("Footer on another page")],
                        }),
                    },
                    children: [new Paragraph("hello in landscape")],
                },
                {
                    properties: {
                        page: {
                            size: {
                                orientation: PageOrientation.PORTRAIT,
                            },
                        },
                    },
                    headers: {
                        default: new Header({
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            children: ["Page number: ", PageNumber.CURRENT],
                                        }),
                                    ],
                                }),
                            ],
                        }),
                    },
        
                    children: [new Paragraph("Page number in the header must be 2, because it continues from the previous section.")],
                },
                {
                    properties: {
                        page: {
                            size: {
                                orientation: PageOrientation.PORTRAIT,
                            },
                            pageNumbers: {
                                formatType: NumberFormat.UPPER_ROMAN,
                            },
                        },
                    },
                    headers: {
                        default: new Header({
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            children: ["Page number: ", PageNumber.CURRENT],
                                        }),
                                    ],
                                }),
                            ],
                        }),
                    },
                    children: [
                        new Paragraph(
                            "Page number in the header must be III, because it continues from the previous section, but is defined as upper roman.",
                        ),
                    ],
                },
                {
                    properties: {
                        page: {
                            size: {
                                orientation: PageOrientation.PORTRAIT,
                            },
                            pageNumbers: {
                                start: 25,
                                formatType: NumberFormat.DECIMAL,
                            },
                        },
                    },
                    headers: {
                        default: new Header({
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            children: ["Page number: ", PageNumber.CURRENT],
                                        }),
                                    ],
                                }),
                            ],
                        }),
                    },
                    children: [
                        new Paragraph(
                            "Page number in the header must be 25, because it is defined to start at 25 and to be decimal in this section.",
                        ),
                    ],
                },
            ],
        });

        const filePath='public/Proposal.docx';
        Packer.toBuffer(doc).then(buffer => {
            fs.writeFileSync(filePath, buffer);
            console.log('Word document generated successfully.');
            resolve(filePath);
        }).catch(err => {
            console.error('Error generating Word document:', err);
            reject(err);
        });
    })
    
}
module.exports = generateWord;

