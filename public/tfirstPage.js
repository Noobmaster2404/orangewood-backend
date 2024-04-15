const jsPDF = require('jspdf').jsPDF;
require('jspdf-autotable');

function generateFirstPage(formData) {
    const doc = new jsPDF();

    // Get today's date
    const today = new Date();
    const dateStr = `${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}`;
    const tableData = [
        ['DATE', dateStr],
        ['CLIENT REF. ID', formData.clientRefId],
        ['QUOTATION NO.', formData.quotationNumber],
        ['CLIENT NAME', formData.clientName],
        ['ADDRESS', formData.clientAddress],
        ['PROJECT', formData.orderCategory],
        ['SUBJECT', formData.benefit],
        ['KIND ATTENTION', formData.poc]
    ];

    doc.autoTable({
        body: tableData,
        styles: { fontSize: 13, cellPadding: 5, lineColor: [0, 0, 0], lineWidth: 0.2 },
        columnStyles: {
            0: { cellWidth: 60 },
            1: { cellWidth: 'auto' }
        },
        didParseCell: function(data) {
            data.cell.styles.fillColor = false;
            data.cell.styles.textColor = [0, 0, 0];
            if (data.column.index === 0) {
                data.cell.styles.fontStyle = 'bold';
            }
        }
    });  
    
    doc.setFontSize(11);
    doc.text('Ref- As per our discussion dated 19 Oct 2023', 10, doc.autoTable.previous.finalY + 10);
    doc.text('Thank you for considering Orangewood Labs as your automation partner. We look forward to the opportunity to contribute to your organization\'s success. We are pleased to submit our offer for the subjected project.', 10, doc.autoTable.previous.finalY + 20);
    doc.text('This offer encapsulates the following:', 10, doc.autoTable.previous.finalY + 30);
    doc.text('Company Introduction', 20, doc.autoTable.previous.finalY + 40);
    doc.text('Robot Specifications & Features', 20, doc.autoTable.previous.finalY + 50);
    doc.text('Concept Overview', 20, doc.autoTable.previous.finalY + 60);
    doc.text('Bill of Material (Our scope of Supply & Works)', 20, doc.autoTable.previous.finalY + 70);
    doc.text('Commercial Offer', 20, doc.autoTable.previous.finalY + 80);
    doc.text('Commercial Terms & Conditions', 20, doc.autoTable.previous.finalY + 90);
    doc.text('Hope our quote is in line with your requirement. In case of any clarifications kindly feel free to revert to us.', 10, doc.autoTable.previous.finalY + 100);
    doc.setFont('helvetica', 'bold');
    doc.text('Yours Faithfully,', 10, doc.autoTable.previous.finalY + 110);
    doc.text('For Orangewood Research & Advancement Pvt Limited', 10, doc.autoTable.previous.finalY + 120);
    doc.text('Maneesh Garg', 10, doc.autoTable.previous.finalY + 130);
    doc.setFont('helvetica', 'bold');

    doc.save('FirstPage.pdf');
    console.log('PDF generated successfully.');
}

module.exports = generateFirstPage;