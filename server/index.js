// const express = require('express');
// const connectDB = require('./config/db');

// const app = express();

// // Connect to database
// connectDB();

// app.use(express.json());

// // Define Routes
// app.use('/', require('./routes/index')); // GET - redirect short url to original url
// app.use('/api/urls', require('./routes/urls')); // GET ALL or POST

// const PORT = 5000;

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const app = express();

app.get("/api", (req, res) => {
    res.json({"users": ["userOne", "userTwo", "userThree", "userFour"] })
})

app.listen(5000, () => {console.log("server started on port 5000")})