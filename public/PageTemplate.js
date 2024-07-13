const PDFDocument = require('pdfkit');
const borderMargin = 20;

const drawBorder = (doc, pageWidth, pageHeight) => {
    doc.rect(borderMargin, borderMargin, pageWidth - 2*borderMargin, pageHeight - 2*borderMargin).stroke();
};

//why does this not work on ./images/linkedin.png
const linkedinImage = 'public/images/linkedin.png';
const twitterImage = 'public/images/twitter.png';
const instagramImage = 'public/images/instagram.png';
const logoImage = 'public/images/logo2.png';

const addHeader = (doc, startX, startY) => {
    doc.image(logoImage, startX, startY, { width: 150 });
};

const addFooter = (doc, startX, startY, pageWidth) => {
    // Draw horizontal rule
    doc.moveTo(borderMargin, startY +5) // set the start point
       .lineTo(pageWidth + 4*borderMargin, startY +5) // set the end point
       .stroke();

    doc.font('Helvetica').fontSize(10).text('Orangewood Research & Advancement private Limited, A48, Block-A, Sector-67, Noida-201301', startX, startY+15, { align: 'center' });

    //hyperlinks
    doc.fillColor('blue').text('www.orangewood.co',startX+30, startY+35)
        .link(startX+30, startY+35, 90, 10, 'https://www.orangewood.co/');
   doc.text('hellorobot@orangewood.co', startX+190, startY+35)
        .link(startX+190, startY+35, 120, 10, 'mailto:hellorobot@orangewood.co');
    doc.fillColor('black');
    
    //image location should match link location as link location shows clickable area
    doc.image(linkedinImage, startX+360, startY+30, { width: 20 })
        .link(startX+360, startY+30, 20, 20, 'https://www.linkedin.com/company/orangewood-labs/mycompany/');
    doc.image(twitterImage, startX+400, startY+35, { width: 15 })
        .link(startX+400, startY+35, 15, 15, 'https://twitter.com/OrangewoodLabs');
    doc.image(instagramImage, startX+440, startY+35, { width: 13 })
        .link(startX+440, startY+35, 13, 13, 'https://www.instagram.com/orangewoodlabs/');
};

const setupPageTemplate = (doc, pageWidth, pageHeight, margin) => {
    drawBorder(doc, pageWidth, pageHeight);
    addHeader(doc, margin, 0.5*margin);
    addFooter(doc, margin, pageHeight - 2*margin , pageWidth - margin * 2);
};

module.exports = {
    borderMargin,
    drawBorder,
    addHeader,
    addFooter,
    setupPageTemplate
};
