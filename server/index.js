const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect to database
connectDB();

app.use(express.json());

// Define Routes
app.use('/', require('./routes/index')); // GET - redirect short url to original url
app.use('/api/url', require('./routes/url')); // GET ALL or POST

const PORT = 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
