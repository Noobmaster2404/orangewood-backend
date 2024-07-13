const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const generatePdf=require('./pdfGenerator.js');
const generateWord = require('./wordGenerator');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
//The following is required otherwise you get 403 payload too large error while uploading images
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost:27017/proposalGenerator')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));
//use this instead of static paths
// app.use(
// 	cors({
// 		origin: [process.env.FRONTEND_URL],
// 		withCredentials: true,
// 	})
// );
// app.use(express.json());

// setting routes 
// app.use("/api/user", require("./routes/userRoute"));
// app.use("/api/content", require("./routes/contentRoute"));
// app.get("/health", (req, res) => {
// 	res.sendStatus(200);
// });

// app.use(express.static(path.join(__dirname, "./reflections-frontend/dist")));
// app.get("*", (req, res) => {
// 	res.sendFile(
// 		path.join(__dirname, "./reflections-frontend/dist/index.html"),
// 		(err) => {
// 			res.status(500).send(err);
// 		}
// 	);
// });

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
 });
 
app.post('/submit-form', async (req, res) => {
    const formData = req.body;
    const format = req.body.format || 'pdf'; // 'pdf' or 'docx'
    if (format === 'pdf') {
        const pdfPath = await generatePdf(formData);
        res.setHeader('Content-Type', 'application/pdf');
        res.download(pdfPath, 'Proposal.pdf', (err) => {
            if (err) {
                console.error('Error sending PDF:', err);
                res.status(500).json({ error: 'Internal server error' });
            } else {
                fs.unlinkSync(pdfPath);
            }
        });
    } else if (format === 'docx') {
        const docPath = await generateWord(formData);
            console.log(docPath);
            console.log("out");
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            res.download(docPath, 'Proposal.docx', (err) => {
                if (err) {
                    console.error('Error sending DOCX:', err);
                    res.status(500).json({ error: 'Internal server error' });
                } else {
                    fs.unlinkSync(docPath);
                }
            });
    } else {
        res.status(400).json({ error: 'Invalid format' });
    }
});



app.get('/search-parts', async (req, res) => {
    const searchTerm = req.query.searchTerm || '';
    try {
        const parts = await mongoose.connection.db.collection('parts').find({
            name: { $regex: searchTerm, $options: 'i' }
        }).toArray();
        res.json(parts);
    } catch (error) {
        console.error('Error searching for parts:', error);
        res.status(500).send('Error searching for parts');
    }
});

 
 const port = process.env.PORT || 3000;
 app.listen(port, () => {
     console.log(`Server listening on port ${port}`);
 });
// const express = require('express');
// const app = express();
// const fs = require('fs');
// const generateHelloWorldDocx = require('./helloWorld');

// app.get('/download-hello-world', async (req, res) => {
//     try {
//         const buffer = generateHelloWorldDocx();
//         res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
//         res.setHeader('Content-Disposition', 'attachment; filename=HelloWorld.docx');
//         res.send(buffer);
//     } catch (error) {
//         console.error('Error generating Hello World DOCX:', error);
//         res.status(500).send('Error generating Hello World DOCX');
//     }
// });

// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//     console.log(`Server listening on port ${port}`);
// });

