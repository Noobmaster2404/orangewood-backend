const express = require('express');
const bodyParser = require('body-parser');
const generateFirstPage = require('./firstPage.js');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

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
     generateFirstPage(formData);
     res.send('Form submitted successfully');
 });
 
 const port = process.env.PORT || 3000;
 app.listen(port, () => {
     console.log(`Server listening on port ${port}`);
 });
