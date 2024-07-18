const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, BorderStyle } = require('docx');
const { addHeader, addFooter } = require('./public/wordPageTemplate');

function generateWord(formData) {
    return new Promise((resolve, reject) => {
        const doc = new Document({
            sections: [
                {
                    properties: {
                        page: {
                            margin: {
                                top: 600 * 72 / 96,    // 600px converted to points? Looks sketchy
                                right: 600 * 72 / 96,  
                                bottom: 600 * 72 / 96, 
                                left: 600 * 72 / 96,   
                            },
                            borders: {
                                pageBorderBottom: {
                                    style: BorderStyle.SINGLE,
                                    size: 1 * 8,
                                    color: '000000',
                                },
                                pageBorderLeft: {
                                    style: BorderStyle.SINGLE,
                                    size: 1 * 8,
                                    color: '000000',
                                },
                                pageBorderRight: {
                                    style: BorderStyle.SINGLE,
                                    size: 1 * 8,
                                    color: '000000',
                                },
                                pageBorderTop: {
                                    style: BorderStyle.SINGLE,
                                    size: 1 * 8, 
                                    color: '000000',
                                },
                            },
                        },
                    },
                    headers: {
                        default: addHeader(),
                    },
                    footers: {
                        default: addFooter(),
                    },
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun("Ref- As per our discussion dated "),
                                new TextRun({
                                    text: formData.section1.discussionDate,
                                    bold: true
                                }),
                                new TextRun(".")
                            ]
                        }),
                        new Paragraph("Thank you for considering Orangewood Labs as your automation partner. We look forward to the opportunity to contribute to your organization's success. We are pleased to submit our offer for the subjected project."),
                        new Paragraph("This offer encapsulates the following:"),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Company Introduction: ",
                                    bold: true
                                }),
                                new TextRun("Orangewood Labs is an innovative startup specializing in the design, development, and manufacturing of advanced 6-axis industrial robots. Our team consists of experienced engineers and industry professionals committed to providing customized automation solutions for diverse industries.")
                            ]
                        }),
                        //Other sections
                    ],
                },
            ],
        });

        const filePath = 'public/Proposal.docx';

        // Saving the doc temporarily and then erasing it from the directory
        Packer.toBuffer(doc).then(buffer => {
            fs.writeFileSync(filePath, buffer);
            console.log('Word document generated successfully.');
            resolve(filePath);
        }).catch(err => {
            console.error('Error generating Word document:', err);
            reject(err);
        });
    });
}

module.exports = generateWord;
