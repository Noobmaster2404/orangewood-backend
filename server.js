const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const generatePdf=require('./pdfGenerator.js');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
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
 
 app.post('/submit-form', (req, res) => {
    const formData = req.body;
    generatePdf(formData).then(pdfPath => {
        res.setHeader('Content-Type', 'application/pdf');
        res.download(pdfPath, 'Proposal.pdf', function(err){
            if (err) {
                console.log(err);
            } else {
                fs.unlinkSync(pdfPath); // delete the file after sending it to the client
            }
        });
    });
});

app.get('/search-parts', async (req, res) => {
    const searchTerm = req.query.searchTerm || '';
    try {
        const parts = await mongoose.connection.db.collection('parts').find({
            name: { $regex: searchTerm, $options: 'i' } // Case-insensitive search
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
