const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ImageRun } = require('docx');
const { promisify } = require('util');
const writeFileAsync = promisify(fs.writeFile);

function generateWord(formData) {
    return new Promise(async (resolve, reject) => {
        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: [],
                },
            ],
        });

        const addTable = (doc, tableData, colWidths) => {
            const rows = tableData.map(row => {
                const cells = row.map((cell, index) => new TableCell({
                    children: [new Paragraph(cell)],
                    width: { size: colWidths[index], type: WidthType.DXA },
                }));
                return new TableRow({ children: cells });
            });

            const table = new Table({
                rows: rows,
                width: {
                    size: 100,
                    type: WidthType.PERCENTAGE,
                },
            });

            doc.addSection({
                children: [table],
            });
        };

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

        const colWidths = [150, 350];
        addTable(doc, tableData, colWidths);

        doc.addSection({
            children: [
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `Ref- As per our discussion dated ${formData.section1.discussionDate}.`,
                            break: 2,
                        }),
                    ],
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: 'Thank you for considering Orangewood Labs as your automation partner. We look forward to the opportunity to contribute to your organization\'s success. We are pleased to submit our offer for the subjected project.',
                            break: 2,
                        }),
                        new TextRun({
                            text: 'This offer encapsulates the following:',
                            break: 2,
                        }),
                    ],
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: 'Hope our quote is in line with your requirement. In case of any clarifications kindly feel free to revert to us.',
                            break: 2,
                        }),
                    ],
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: 'Yours Faithfully,',
                            bold: true,
                            break: 2,
                        }),
                        new TextRun({
                            text: 'For Orangewood Research & Advancement Pvt Limited',
                            bold: true,
                            break: 1,
                        }),
                        new TextRun({
                            text: 'Maneesh Garg',
                            break: 1,
                        }),
                    ],
                }),
            ],
        });

        const techSpecsTableData = [];
        for (const key in formData.section2) {
            if (formData.section2.hasOwnProperty(key)) {
                const value = formData.section2[key];
                if (value[0].trim() !== '') {
                    techSpecsTableData.push([value[1], value[0]]);
                }
            }
        }

        if (techSpecsTableData.length > 0) {
            const techSpecsColWidths = [250, 250];
            addTable(doc, techSpecsTableData, techSpecsColWidths);
        }

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
        addTable(doc, clientRequirements, clientRequirementsColWidths);

        if (formData.imageDataUrl) {
            const imageBuffer = Buffer.from(formData.imageDataUrl.split(',')[1], 'base64');
            const image = new ImageRun({
                data: imageBuffer,
                transformation: {
                    width: 600,
                    height: 200,
                },
            });

            doc.addSection({
                children: [new Paragraph(image)],
            });
        }

        if (formData.imageDataUrlSolution) {
            const imageBuffer = Buffer.from(formData.imageDataUrlSolution.split(',')[1], 'base64');
            const image = new ImageRun({
                data: imageBuffer,
                transformation: {
                    width: 600,
                    height: 200,
                },
            });

            doc.addSection({
                children: [new Paragraph(image)],
            });
        }

        const bomTableHeaders = ['Description', 'Quantity', 'Unit Price', 'Total Price'];
        const bomTableData = [bomTableHeaders];
        Object.keys(formData.selectedParts).forEach((key) => {
            const unitPrice = formData.selectedParts[key][0];
            const qty = formData.selectedParts[key][1];
            const totalPrice = qty * unitPrice;
            bomTableData.push([key, qty, unitPrice, totalPrice]);
        });
        for (var i = 0; i < formData.additionalCosts.length; i++) {
            var item = formData.additionalCosts[i];
            bomTableData.push([item.description, '', '', item.amount]);
        }

        const totalBOMPrice = bomTableData.slice(1).reduce((total, row) => {
            const totalPrice = parseFloat(row[3]) || 0;
            return total + totalPrice;
        }, 0);

        const bomTableColWidths = [200, 100, 100, 100];
        addTable(doc, bomTableData, bomTableColWidths);

        doc.addSection({
            children: [
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `Grand Total: $${totalBOMPrice.toFixed(2)}`,
                            break: 2,
                        }),
                    ],
                }),
            ],
        });

        const addTnCSection = (title, tncTableData) => {
            const section = new docx.Section({
                properties: {},
                children: [
                    new docx.Paragraph({
                        children: [
                            new docx.TextRun({
                                text: title,
                                bold: true,
                                font: 'Helvetica',
                                color: '3E029F',
                                size: 15,
                            }),
                        ],
                    }),
                ],
            });
        
            const tableRows = tncTableData.map((rowData, index) => {
                return new docx.TableRow({
                    children: rowData.map(cellData => {
                        return new docx.TableCell({
                            children: [new docx.Paragraph(cellData)],
                            width: { size: 150, type: docx.WidthType.DXA },
                        });
                    }),
                    cantSplit: true, // Prevent table rows from being split across pages
                });
            });
        
            const table = new docx.Table({
                rows: tableRows,
            });
        
            section.addChildElement(table);
            doc.addSection(section);
        };
        
        // Prepare T&C table data
        const tncTableHeaders = ['Sr. No', 'Description', 'Details'];
        const tncTableData = [
            tncTableHeaders,
            ['1', 'Taxes', 'A)GST on Supply– @18%\nB)GST on Services- @18%'],
            ['2', formData.tnc.paymentTerms[1], formData.tnc.paymentTerms[0]],
            ['3', formData.tnc.deliveryTime[1], formData.tnc.deliveryTime[0]],
            ['4', 'Packing', '@1%of invoice value.'],
            ['5', 'Freight', 'Extra at actual'],
            ['6', 'Transit Insurance', 'Client Scope'],
            ['7', 'Validity', '30 days'],
            ['8', 'Support Services', 'A) All the support services like fork lift, loading unloading equipment, handling aids shall be provided by you at site free of cost („FOC‟). B) Safety Equipment like Helmet, shoes, Ear Plugs, Gloves etc. shall be provided by client as per client’s standard'],
            ['9', 'Civil Work', 'Any civil work required at site shall be in client scope and to be provided by client FOC.'],
            ['10', 'Electrical Supply', 'Client shall provide an uninterrupted power supply of single phase 220VAC,10A, for robot and controller at robot panel’s installation end with proper isolation FOC. Please make sure there should not be any fluctuation in the power supply. The damage to robot or controller caused by this above-mentioned reason will void the manufacturer warranty of the robot and controller. It is advisable that you should connect a 2KVA on-line UPS for the system if the line supply is noisy. The UPS is not in scope of supply.'],
            ['11', 'Pressure Supply', 'Client shall ensure the availability of required compressed dry air'],
            ['12', 'Environment Temperature', 'Refer user manual for intended usage of orangewood products.'],
            ['13', 'Logistics for I&C', 'For all the Installation & Commissioning work at client site, the to & fro travel (air and surface) from Noida ex works to site, lodging, boarding & other related logistic expenses shall be in client scope and is to be provided FOC.'],
            ['14', 'Warranty', 'Orangewood warranty policy will be applicable. The warranty shall be limited to replacement/repair of defective parts due to manufacturing defects. The faulty parts shall be returned to us by you. Warranty is valid till 12 months from the date of shipment.'],
            ['15', 'Liability', 'In no event or circumstances shall we be liable for any direct, indirect, or consequential damages arising out of the purchase and/or use of this system by you.'],
        ];
        
        // Add Terms and Conditions section to the document
        addTnCSection('7. Terms and Conditions', tncTableData);
        return doc;
    }
)};