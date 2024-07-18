const fs = require('fs');
const { Paragraph, TextRun, Header, Footer, ImageRun, ExternalHyperlink } = require('docx');

const linkedinImage = 'public/images/linkedin.png';
const twitterImage = 'public/images/twitter.png';
const instagramImage = 'public/images/instagram.png';
const logoImage = 'public/images/logo2.png';

const addHeader = () => {
    return new Header({
        children: [
            new Paragraph({
                children: [
                    new ImageRun({
                        data: fs.readFileSync(logoImage),
                        transformation: {
                            width: 150,
                            height: 40,
                        },
                    }),
                ],
            }),
        ],
    });
};

const addFooter = () => {
    return new Footer({
        children: [
            new Paragraph({
                children: [
                    new TextRun('Orangewood Research & Advancement private Limited, A48, Block-A, Sector-67, Noida-201301'),
                ],
            }),
            new Paragraph({
                children: [
                    new ExternalHyperlink({
                        children: [
                            new TextRun({
                                text: 'www.orangewood.co',
                                style: 'Hyperlink',
                            }),
                        ],
                        link: 'https://www.orangewood.co',
                    }),
                    new TextRun('\t'),
                    new ExternalHyperlink({
                        children: [
                            new TextRun({
                                text: 'hellorobot@orangewood.co',
                                style: 'Hyperlink',
                            }),
                        ],
                        link: 'mailto:hellorobot@orangewood.co',
                    }),
                    new TextRun('\t'),
                    new ImageRun({
                        data: fs.readFileSync(linkedinImage),
                        transformation: {
                            width: 20,
                            height: 20,
                        },
                    }),
                    new ExternalHyperlink({
                        children: [
                            new TextRun({
                                text: 'LinkedIn',
                                style: 'Hyperlink',
                            }),
                        ],
                        link: 'https://www.linkedin.com/company/orangewood-labs/mycompany/',
                    }),
                    new TextRun('\t'),
                    new ImageRun({
                        data: fs.readFileSync(twitterImage),
                        transformation: {
                            width: 15,
                            height: 15,
                        },
                    }),
                    new ExternalHyperlink({
                        children: [
                            new TextRun({
                                text: 'Twitter',
                                style: 'Hyperlink',
                            }),
                        ],
                        link: 'https://twitter.com/OrangewoodLabs',
                    }),
                    new TextRun('\t'),
                    new ImageRun({
                        data: fs.readFileSync(instagramImage),
                        transformation: {
                            width: 13,
                            height: 13,
                        },
                    }),
                    new ExternalHyperlink({
                        children: [
                            new TextRun({
                                text: 'Instagram',
                                style: 'Hyperlink',
                            }),
                        ],
                        link: 'https://www.instagram.com/orangewoodlabs/',
                    }),
                ],
            }),
        ],
    });
};

module.exports = {
    addHeader,
    addFooter
};
